/* ============================================
   TARİHÇE SAYFASI
   ============================================ */

async function loadHistory() {
    showLoading('Tarihçe sayfası yükleniyor...');
    try {
        const html = renderHistory();
        DOM.mainContent.innerHTML = `
            <div class="page-header">
                <h1><i class="fas fa-history"></i> Tarihçe</h1>
            </div>
            <div class="content-card">
                ${html}
            </div>`;
        setStatus('Tarihçe sayfası yüklendi', 'success');
    } catch (e) {
        showError(e.message);
    }
}

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

window.loadHistory = loadHistory;