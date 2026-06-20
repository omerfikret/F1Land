import requests
import json
import os
import re
import threading

MODEL = "qwen2.5:3b"

DIALOG_MEMORY_FILE = "dialog_memory.json"
PROFILE_MEMORY_FILE = "profile_memory.json"
MAX_DIALOG = 10

# ── Kural tabanlı profil çıkarıcı (LLM çağrısı YOK) ─────────────────────────

PATTERNS = [
    (r"\b(\d{1,2})\s*yaşınd", "yaş"),
    (r"yaşım\s*(\d{1,2})", "yaş"),
    (r"(\d{1,2})\s*yaşım var", "yaş"),
    (r"(istanbul|ankara|izmir|bursa|antalya|adana|konya|kayseri|trabzon|samsun|eskişehir|gaziantep|diyarbakır|mersin)\w*",  "şehir"),
    (r"(bilgisayar mühendis\w*|yazılım\w*|elektrik\w*|makine\w*|inşaat\w*|tıp\w*|hukuk\w*|iktisat\w*|işletme\w*|psikoloji\w*|fizik\w*|matematik\w*)", "bölüm"),
    (r"(müzik|oyun|kitap|film|spor|futbol|basketbol|yüzme|koşu|resim|fotoğraf|seyahat|programlama|anime)\w*\s*(?:dinle|oyna|oku|izle|yap|sev|ilgilen)\w*", "hobi"),
    (r"(?:adım|ismim|benim adım)\s+(\w+)", "ad"),
]

def extract_profile_regex(user_msg: str, profile: dict) -> dict:
    msg = user_msg.lower()
    updated = False
    for pattern, key in PATTERNS:
        m = re.search(pattern, msg, re.IGNORECASE)
        if m:
            value = m.group(1) if m.lastindex else m.group(0)
            value = value.strip().capitalize()
            if profile.get(key) != value:
                profile[key] = value
                updated = True
                print(f"[Profil güncellendi] {key}: {value}")
    if updated:
        save_json(PROFILE_MEMORY_FILE, profile)
    return profile

# ── Hafıza yardımcıları ───────────────────────────────────────────────────────

def load_json(path, default):
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return default

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def save_dialog_async(pairs):
    """Diyalog kaydetmeyi arka planda yap, ana döngüyü bloklama."""
    t = threading.Thread(target=save_json, args=(DIALOG_MEMORY_FILE, pairs[-MAX_DIALOG:]), daemon=True)
    t.start()

# ── Sistem promptu ────────────────────────────────────────────────────────────

def build_system(profile: dict, dialog_pairs: list) -> str:
    profile_text = ""
    if profile:
        items = "\n".join(f"- {k}: {v}" for k, v in profile.items())
        profile_text = f"\nÖmer hakkında bilinen kişisel bilgiler:\n{items}\n"

    dialog_text = ""
    if dialog_pairs:
        lines = []
        for pair in dialog_pairs[-5:]:   # Sadece son 5 çift prompt'a girer
            lines.append(f"Ömer: {pair['user']}")
            lines.append(f"Sacramento: {pair['assistant']}")
        dialog_text = "\nSon konuşmalar:\n" + "\n".join(lines) + "\n"

    return (
        "Sen Sacramento adlı, zeki ve cana yakın bir yapay zeka asistanısın.\n\n"
        "Kurallar:\n"
        "1. Adın Sacramento.\n"
        "2. Kullanıcı her zaman Ömer'dir.\n"
        "3. Samimi, doğal Türkçe kullan; 'sen' diye hitap et.\n"
        "4. Kısa ve net cevap ver.\n"
        "5. Yemek soruları için esprili şekilde yapay zeka olduğunu hatırlat.\n"
        "6. Ömer hakkında bilgileri doğal yansıt, liste gibi tekrar etme.\n"
        + profile_text + dialog_text
    )

# ── Ana döngü ─────────────────────────────────────────────────────────────────

dialog_pairs = load_json(DIALOG_MEMORY_FILE, [])
profile      = load_json(PROFILE_MEMORY_FILE, {})
history      = []

print("Sacramento hazır. Çıkmak için: q\n")
if profile:
    print(f"[Profil yüklendi] {profile}\n")

while True:
    user = input("Sen > ").strip()
    if not user or user.lower() in {"q", "quit", "exit"}:
        print("Görüşürüz!")
        break

    # Profili hemen (LLM'siz) güncelle
    profile = extract_profile_regex(user, profile)

    history.append({"role": "user", "content": user})
    system_prompt = build_system(profile, dialog_pairs)

    try:
        r = requests.post(
            "http://localhost:11434/api/chat",
            json={
                "model": MODEL,
                "stream": True,          # Streaming: ilk token hemen gelir
                "options": {
                    "num_predict": 256,   # Max token sınırı → kısa cevap → hız
                    "temperature": 0.7,
                },
                "messages": [{"role": "system", "content": system_prompt}] + history,
            },
            stream=True,
            timeout=60,
        )

        print("Bot > ", end="", flush=True)
        reply_parts = []
        for line in r.iter_lines():
            if not line:
                continue
            try:
                chunk = json.loads(line)
                token = chunk.get("message", {}).get("content", "")
                if token:
                    print(token, end="", flush=True)
                    reply_parts.append(token)
                if chunk.get("done"):
                    break
            except Exception:
                continue
        print("\n")

        reply = "".join(reply_parts).strip()
        history.append({"role": "assistant", "content": reply})

        # Diyalog kaydetmeyi arka planda yap
        dialog_pairs.append({"user": user, "assistant": reply})
        save_dialog_async(dialog_pairs)

    except Exception as e:
        print(f"\nHata: {e}\n")