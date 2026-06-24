/* ============================================
   ANA SAYFA: Hakkında · Tarihçe · Kurallar
   ============================================ */

async function loadPage1(tab = pageTabs[1]) {
    pageTabs[1] = tab;
    showLoading('Sayfa yükleniyor...');

    const tabs = [
        { id: 'about', label: 'Hakkında' },
        { id: 'history', label: 'Tarihçe' },
        { id: 'rules', label: 'Kurallar' }
    ];

    try {
        let body = '';

        if (tab === 'about') {
            body = renderAbout();
        } else if (tab === 'history') {
            body = `
                <div style="padding:2rem;text-align:center;color:var(--text-muted);">
                    <i class="fas fa-clock" style="font-size:3rem;color:var(--f1-red);margin-bottom:1rem;display:block;"></i>
                    <h3>Tarihçe bölümü yakında eklenecek...</h3>
                    <p>Formula 1'in köklü tarihini burada keşfedin.</p>
                </div>
            `;
        } else if (tab === 'rules') {
            body = `
                <div style="padding:2rem;text-align:center;color:var(--text-muted);">
                    <i class="fas fa-book" style="font-size:3rem;color:var(--f1-red);margin-bottom:1rem;display:block;"></i>
                    <h3>Kurallar bölümü yakında eklenecek...</h3>
                    <p>F1'in teknik ve sportif kurallarını burada bulabilirsiniz.</p>
                </div>
            `;
        }

        DOM.mainContent.innerHTML = `
            <div class="page-header">
                <h1><i class="fas fa-home"></i> Ana Sayfa</h1>
                <span class="api-source">F1Land</span>
            </div>
            <div class="page-tabs">${renderPageTabs(tabs, tab)}</div>
            <div class="content-card">
                <h2><i class="fas fa-info-circle"></i> ${tabs.find(t => t.id === tab).label}</h2>
                ${body}
            </div>`;
        bindPageTabs(1, tabs, loadPage1);
        setStatus('Ana sayfa yüklendi', 'success');
    } catch (e) {
        showError(e.message);
    }
}

/* ============================================
   HAKKINDA BÖLÜMÜ RENDER
   ============================================ */
function renderAbout() {
    // Görsellerin bulunduğu dizin - img/ klasörü
    const imgBase = 'img/';

    return `
        <div class="about-grid">
            <!-- 1. Kart: Metin sol, görsel sağ -->
            <div class="about-card about-card-left">
                <div class="about-text">
                    <span class="about-number">01</span>
                    <h3>Formula 1 Nedir?</h3>
                    <p>Formula 1 (F1), sadece dünyanın en hızlı arabalarının yarıştığı bir organizasyon değil; insan odaklı ekstrem performansın, sınırları zorlayan mühendisliğin ve saniyelerin binde birinin hesaplandığı devasa bir strateji savaşıdır. "Formula" kelimesi, tüm takımların ve arabaların uymak zorunda olduğu kurallar bütününü (formülü) temsil eder.</p>
                </div>
                <div class="about-image">
                    <img src="${imgBase}1.jpg" alt="Formula 1 sponsorları" />
                </div>
            </div>

            <!-- 2. Kart: Görsel sol, metin sağ -->
            <div class="about-card about-card-right">
                <div class="about-image">
                    <img src="${imgBase}2.webp" alt="F1 aracı detay" />
                </div>
                <div class="about-text">
                    <span class="about-number">02</span>
                    <h3>Pilotların Fiziksel Sınırları</h3>
                    <p><strong>G Kuvveti:</strong> Virajlarda ve ani frenlemelerde pilotların vücuduna 5G'ye kadar (kendi ağırlıklarının 5 katı) merkezkaç kuvveti biner. Pilotlar sırf kafalarını dik tutabilmek için özel boyun kası antrenmanları yaparlar.</p>
                    <p><strong>Ekstrem Şartlar:</strong> Kokpit içi sıcaklığın 50°C'yi bulduğu bir yarışta pilotlar, yaklaşık 1.5 saat boyunca kesintisiz odaklanmak zorundadır. Tek bir yarışta terleme yoluyla yaklaşık 3 ila 4 kilo kaybederler.</p>
                </div>
            </div>

            <!-- 3. Kart: Metin sol, görsel sağ -->
            <div class="about-card about-card-left">
                <div class="about-text">
                    <span class="about-number">03</span>
                    <h3>Mühendislik ve Aerodinamik Harikası</h3>
                    <p>F1 araçları aslında aerodinamik olarak "ters dönmüş uçak" mantığıyla tasarlanır. Havacılıkta kanatlar uçağı kaldırmak için kullanılırken, F1'de aracı yere yapıştırmak (Downforce - Yere Basma Kuvveti) için kullanılır. Bir F1 aracı, saatte 150 km hıza ulaştığında ürettiği yere basma kuvveti sayesinde teorik olarak bir tünelin tavanında baş aşağı sürülebilir. Yarış pistte dönse de arkasında fabrikalarda çalışan binlerce mühendis ve dahi stratejist yer alır.</p>
                </div>
                <div class="about-image">
                    <img src="${imgBase}3.webp" alt="Rüzgar tüneli testi" />
                </div>
            </div>
        </div>
    `;
}