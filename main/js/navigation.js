/* ============================================
   NAVİGASYON
   ============================================ */

const pageTabs = { 1: 'seasons', 2: 'standings' }; // 3. sayfa yok
let activePage = 1;
let selectedYear = new Date().getFullYear();
let availableSeasons = [];

async function loadSeasons() {
    try {
        console.log('🔄 loadSeasons çalıştı...');
        const years = await fetchSeasons();
        availableSeasons = years;
        if (!availableSeasons.includes(selectedYear)) {
            selectedYear = availableSeasons[0] || 2024;
        }
        DOM.yearSelect.innerHTML = availableSeasons.map(y =>
            `<option value="${y}"${y === selectedYear ? ' selected' : ''}>${y}</option>`
        ).join('');
        console.log('✅ Sezonlar yüklendi:', availableSeasons);
        return availableSeasons;
    } catch (error) {
        console.error('❌ loadSeasons Error:', error);
        availableSeasons = [2024, 2023, 2022];
        selectedYear = 2024;
        DOM.yearSelect.innerHTML = availableSeasons.map(y =>
            `<option value="${y}"${y === selectedYear ? ' selected' : ''}>${y}</option>`
        ).join('');
        throw error;
    }
}

function loadPage(num) {
    console.log('📄 Sayfa yükleniyor:', num);
    activePage = num;
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.page === String(num));
    });
    if (num === 1) loadPage1();
    else if (num === 2) loadPage2();
    // 3. sayfa yok
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM yüklendi, eventler bağlanıyor...');
    document.querySelectorAll('#navMenu .nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = parseInt(this.dataset.page, 10);
            loadPage(page);
        });
    });
    DOM.yearSelect.addEventListener('change', function() {
        selectedYear = parseInt(this.value, 10);
        console.log('📅 Yıl değişti:', selectedYear);
        if (activePage === 2) loadPage2();
        else if (activePage === 1) loadPage1();
    });
    DOM.syncBtn.addEventListener('click', function() {
        this.disabled = true;
        loadPage(activePage);
        setTimeout(() => { this.disabled = false; }, 400);
    });
});

window.pageTabs = pageTabs;
window.loadSeasons = loadSeasons;
window.loadPage = loadPage;
window.selectedYear = selectedYear;
window.availableSeasons = availableSeasons;
console.log('✅ navigation.js yüklendi!');