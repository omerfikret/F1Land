/* ============================================
   NAVİGASYON STATE
   ============================================ */
let activePage = 1;
let pageTabs = { 1: 'seasons', 2: 'races', 3: 'standings' };

/* ============================================
   SAYFA YÜKLEME
   ============================================ */
function loadPage(num) {
    activePage = num;
    
    // Nav item aktifleştirme
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.page === String(num));
    });
    
    // Sayfa yükleme
    if (num === 1) loadPage1();
    else if (num === 2) loadPage2();
    else loadPage3();
}

/* ============================================
   SEZON YÜKLEME
   ============================================ */
async function loadSeasons() {
    try {
        const seasons = await fetchAllPages(API.seasons, d => d.MRData.SeasonTable.Seasons);
        availableSeasons = seasons.map(s => parseInt(s.season, 10)).sort((a, b) => b - a);
        
        if (!availableSeasons.includes(selectedYear)) {
            selectedYear = availableSeasons[0] || new Date().getFullYear();
        }
        
        DOM.yearSelect.innerHTML = availableSeasons.map(y =>
            `<option value="${y}"${y === selectedYear ? ' selected' : ''}>${y}</option>`
        ).join('');
    } catch (e) {
        console.error('Sezonlar yüklenemedi:', e);
    }
}

/* ============================================
   NAVİGASYON EVENTLERİ
   ============================================ */
document.querySelectorAll('#navMenu .nav-item').forEach(item => {
    item.addEventListener('click', () => loadPage(parseInt(item.dataset.page, 10)));
});

DOM.yearSelect.addEventListener('change', () => {
    selectedYear = parseInt(DOM.yearSelect.value, 10);
    if (activePage === 2) loadPage2();
    else if (activePage === 3) loadPage3();
});

DOM.syncBtn.addEventListener('click', () => {
    DOM.syncBtn.disabled = true;
    loadPage(activePage);
    setTimeout(() => { DOM.syncBtn.disabled = false; }, 400);
});