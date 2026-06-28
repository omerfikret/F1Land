/* ============================================
   NAVİGASYON (Üst menü, 4 sayfa)
   ============================================ */

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
    document.querySelectorAll('.topbar-item').forEach(el => {
        const page = parseInt(el.dataset.page, 10);
        el.classList.toggle('active', page === num);
    });
    if (num === 1) loadPage1();
    else if (num === 2) loadAbout();
    else if (num === 3) loadHistory();
    else if (num === 4) loadRules();
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM yüklendi, eventler bağlanıyor...');

    document.querySelectorAll('#navMenu .topbar-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = parseInt(this.dataset.page, 10);
            loadPage(page);
        });
    });

    DOM.yearSelect.addEventListener('change', function() {
        selectedYear = parseInt(this.value, 10);
        console.log('📅 Yıl değişti:', selectedYear);
        if (activePage === 1) loadPage1();
    });

    DOM.syncBtn.addEventListener('click', function() {
        this.disabled = true;
        loadPage(activePage);
        setTimeout(() => { this.disabled = false; }, 400);
    });
});

window.loadSeasons = loadSeasons;
window.loadPage = loadPage;
window.selectedYear = selectedYear;
window.availableSeasons = availableSeasons;
console.log('✅ navigation.js yüklendi!');