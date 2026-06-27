/* ============================================
   ANA SAYFA: Hakkında · Tarihçe · Kurallar
   ============================================ */

async function loadPage1(tab = pageTabs[1]) {
    // Güvenlik: Geçerli tab değerlerini kontrol et
    const validTabs = ['about', 'history', 'rules'];
    if (!tab || !validTabs.includes(tab)) {
        tab = 'about';
        pageTabs[1] = tab;
    }
    
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
            body = renderHistory();
        } else if (tab === 'rules') {
            body = `
                <div style="padding:2rem;text-align:center;color:var(--text-muted);">
                    <i class="fas fa-book" style="font-size:3rem;color:var(--f1-red);margin-bottom:1rem;display:block;"></i>
                    <h3>Kurallar bölümü yakında eklenecek...</h3>
                    <p>F1'in teknik ve sportif kurallarını burada bulabilirsiniz.</p>
                </div>
            `;
        }

        // Güvenli label okuma
        const activeTabLabel = tabs.find(t => t.id === tab)?.label || 'Hakkında';

        DOM.mainContent.innerHTML = `
            <div class="page-header">
                <h1><i class="fas fa-home"></i> Ana Sayfa</h1>
                <span class="api-source">F1Land</span>
            </div>
            <div class="page-tabs">${renderPageTabs(tabs, tab)}</div>
            <div class="content-card">
                <h2><i class="fas fa-info-circle"></i> ${activeTabLabel}</h2>
                ${body}
            </div>`;
        bindPageTabs(1, tabs, loadPage1);
        setStatus('Ana sayfa yüklendi', 'success');
    } catch (e) {
        showError(e.message);
    }
}

/* ============================================
   HAKKINDA BÖLÜMÜ (DÜZELTİLDİ)
   ============================================ */
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

            <!-- 2. Kart: ★ DÜZELTİLDİ ★ 
                 Artık önce YAZI, sonra FOTOĞRAF geliyor.
                 CSS'deki row-reverse bunu ters çevirecek ve fotoğraf solda, yazı sağda olacak. -->
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

/* ============================================
   TARİHÇE BÖLÜMÜ (5 DÖNEM - ZATEN DOĞRU)
   ============================================ */
function renderHistory() {
    const imgBase = './img/';
    const periods = [
        {
            id: '01',
            title: '1950’ler: İlk Yıllar ve Kurulma Dönemi',
            text: `Formula 1 Dünya Şampiyonası, resmi olarak 13 Mayıs 1950'de İngiltere’deki Silverstone Pisti'nde başladı. İlk yarışı ve sezonu Alfa Romeo pilotu Giuseppe Farina kazandı. Dönemin en baskın ismi ise farklı takımlarla 5 dünya şampiyonluğu elde eden Arjantinli pilot Juan Manuel Fangio oldu. Bu yıllarda güvenlik önlemleri yok denecek kadar azdı, pilotlar standart kumaş tulumlar ve basit başlıklarla yarışıyordu.`,
            img: '1950.jpg',
            align: 'left'
        },
        {
            id: '02',
            title: '1960’lar - 1970’ler: Tasarım Değişiklikleri ve Kanatlar',
            text: `1960'larda araç tasarımlarında büyük bir devrim yapıldı ve motorlar arabanın ön kısmından arkasına taşındı. Lotus, McLaren ve Williams gibi İngiliz takımları bu dönemde ön plana çıkmaya başladı. 1970'lerde ise araçların üzerine, rüzgarı yönlendirip yol tutuşunu artıracak kanatlar (aerodinamik yapılar) eklendi. Niki Lauda ve James Hunt arasındaki rekabet sporu daha geniş kitlelere ulaştırdı. Bu dönemde yaşanan kazalar, pistlerde kalıcı güvenlik önlemlerinin ve yangına dayanıklı tulumların zorunlu hale getirilmesini sağladı.`,
            img: '1970.jpg',
            align: 'right'
        },
        {
            id: '03',
            title: '1980’ler - 1990’lar: Yüksek Güç ve Güvenlik Devrimi',
            text: `1980'lerde motor güçleri 1000 beygirin üzerine çıktı ve araçları kontrol etmek çok daha zorlaştı. F1 tarihinin en çok konuşulan rekabeti bu dönemde Ayrton Senna ve Alain Prost arasında yaşandı. 1994 yılında Ayrton Senna'nın geçirdiği trajik kaza, spor dünyasında bir dönüm noktası oldu. Bu kazanın ardından pilot güvenliği ana odak noktası haline geldi; pist tasarımları ve araç yapıları tamamen sürücüyü koruyacak şekilde yeniden şekillendirildi. 90'ların sonunda ise Michael Schumacher'in yükselişi başladı.`,
            img: '1990.jpg',
            align: 'left'
        },
        {
            id: '04',
            title: '2000’ler: Elektronik Çağ ve Ferrari Dominasyonu',
            text: `Yeni milenyumla birlikte spor tamamen bilgisayar destekli sistemlerle tanıştı. 2000'lerin ilk yarısına Michael Schumacher ve Ferrari ortaklığı damga vurdu ve üst üste 5 şampiyonluk geldi. Sonrasında Fernando Alonso'nun şampiyonlukları ve Sebastian Vettel'in Red Bull takımıyla üst üste kazandığı 4 dünya şampiyonluğu dönemi yaşandı. Bu yıllarda araç verileri (telemetri) anlık olarak mühendisler tarafından bilgisayarlardan izlenmeye başlandı.`,
            img: '2008.webp',
            align: 'right'
        },
        {
            id: '05',
            title: '2014 - Günümüz: Hibrit Motorlar ve Dijital Dönem',
            text: `2014 yılında Formula 1, daha çevreci ve verimli olan "V6 Turbo Hibrit" motorlara geçiş yaptı. Bu yeni döneme Lewis Hamilton ve Mercedes takımı uzun yıllar ambargo koydu. Hamilton, Schumacher'in 7 şampiyonluk rekoruna ortak oldu. Günümüzde ise Max Verstappen ve Red Bull üstünlüğü sürüyor. Spor artık sıkı bütçe sınırları (Cost Cap), sürdürülebilir yakıt projeleri ve dijital medya platformlarının etkisiyle çok daha küresel ve planlı bir endüstri olarak yoluna devam ediyor.`,
            img: '2016.webp',
            align: 'left'
        }
    ];

    let html = `<div class="info-grid">`;
    periods.forEach(p => {
        const cardClass = p.align === 'left' ? 'info-card-left' : 'info-card-right';
        html += `
            <div class="info-card ${cardClass}">
                <div class="info-text">
                    <span class="info-number">${p.id}</span>
                    <h3>${p.title}</h3>
                    <p>${p.text}</p>
                </div>
                <div class="info-image">
                    <img src="${imgBase}${p.img}" alt="${p.title}" />
                </div>
            </div>
        `;
    });
    html += `</div>`;
    return html;
}