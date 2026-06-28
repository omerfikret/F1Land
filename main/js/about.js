/* ============================================
   HAKKINDA SAYFASI
   ============================================ */

async function loadAbout() {
    showLoading('Hakkında sayfası yükleniyor...');
    try {
        const html = renderAbout();
        DOM.mainContent.innerHTML = `
            <div class="page-header">
                <h1><i class="fas fa-info-circle"></i> Hakkında</h1>
            </div>
            <div class="content-card">
                ${html}
            </div>`;
        setStatus('Hakkında sayfası yüklendi', 'success');
    } catch (e) {
        showError(e.message);
    }
}

function renderAbout() {
    const imgBase = './img/';
    return `
        <div class="info-grid">
            <!-- 1. Kart: Sol başlangıçlı (yazı solda, foto sağda) -->
            <div class="info-card info-card-left">
                <div class="info-text">
                    <span class="info-number">01</span>
                    <h3>Formula 1 Nedir?</h3>
                    <p>Formula 1 (F1), sadece dünyanın en hızlı arabalarının yarıştığı bir organizasyon değil; insan odaklı ekstrem performansın, sınırları zorlayan mühendisliğin ve saniyelerin binde birinin hesaplandığı devasa bir strateji savaşıdır. "Formula" kelimesi, tüm takımların ve arabaların uymak zorunda olduğu kurallar bütününü (formülü) temsil eder.</p>
                </div>
                <div class="info-image">
                    <img src="${imgBase}1.jpg" alt="Formula 1 sponsorları" />
                </div>
            </div>

            <!-- 2. Kart: Sağ başlangıçlı (foto solda, yazı sağda) -->
            <div class="info-card info-card-right">
                <div class="info-text">
                    <span class="info-number">02</span>
                    <h3>Pilotların Fiziksel Sınırları</h3>
                    <p><strong>G Kuvveti:</strong> Virajlarda ve ani frenlemelerde pilotların vücuduna 5G'ye kadar (kendi ağırlıklarının 5 katı) merkezkaç kuvveti biner. Pilotlar sırf kafalarını dik tutabilmek için özel boyun kası antrenmanları yaparlar.</p>
                    <p><strong>Ekstrem Şartlar:</strong> Kokpit içi sıcaklığın 50°C'yi bulduğu bir yarışta pilotlar, yaklaşık 1.5 saat boyunca kesintisiz odaklanmak zorundadır. Tek bir yarışta terleme yoluyla yaklaşık 3 ila 4 kilo kaybederler.</p>
                </div>
                <div class="info-image">
                    <img src="${imgBase}2.webp" alt="F1 aracı detay" />
                </div>
            </div>

            <!-- 3. Kart: Sol başlangıçlı (yazı solda, foto sağda) -->
            <div class="info-card info-card-left">
                <div class="info-text">
                    <span class="info-number">03</span>
                    <h3>Mühendislik ve Aerodinamik Harikası</h3>
                    <p>F1 araçları aslında aerodinamik olarak "ters dönmüş uçak" mantığıyla tasarlanır. Havacılıkta kanatlar uçağı kaldırmak için kullanılırken, F1'de aracı yere yapıştırmak (Downforce - Yere Basma Kuvveti) için kullanılır. Bir F1 aracı, saatte 150 km hıza ulaştığında ürettiği yere basma kuvveti sayesinde teorik olarak bir tünelin tavanında baş aşağı sürülebilir. Yarış pistte dönse de arkasında fabrikalarda çalışan binlerce mühendis ve dahi stratejist yer alır.</p>
                </div>
                <div class="info-image">
                    <img src="${imgBase}3.webp" alt="Rüzgar tüneli testi" />
                </div>
            </div>
        </div>
    `;
}

window.loadAbout = loadAbout;