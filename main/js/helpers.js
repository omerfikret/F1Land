/* ============================================
   GLOBAL DEĞİŞKENLER
   ============================================ */
let selectedYear = new Date().getFullYear();
let availableSeasons = [];

/* ============================================
   DOM REFERANSLARI
   ============================================ */
const DOM = {
    mainContent: document.getElementById('mainContent'),
    yearSelect: document.getElementById('yearSelect'),
    syncBtn: document.getElementById('syncBtn'),
    syncStatus: document.getElementById('syncStatus')
};

/* ============================================
   DURUM MESAJLARI
   ============================================ */
function setStatus(msg, type) {
    DOM.syncStatus.textContent = msg;
    DOM.syncStatus.className = 'show ' + (type || 'info');
}

function showError(msg) {
    DOM.mainContent.innerHTML = `<div class="error-box"><strong>Hata:</strong> ${msg}</div>`;
}

function showLoading(msg = 'Veriler yükleniyor...') {
    DOM.mainContent.innerHTML = `<div class="loading"><i class="fas fa-spinner fa-pulse"></i> ${msg}</div>`;
}

/* ============================================
   FORMAT FONKSİYONLARI
   ============================================ */
function driverName(d) {
    return d ? `${d.givenName} ${d.familyName}` : '-';
}

function formatDate(s) {
    if (!s) return '-';
    try {
        return new Date(s + 'T12:00:00').toLocaleDateString('tr-TR', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    } catch {
        return s;
    }
}

function formatNumber(n) {
    return n?.toLocaleString('tr-TR') || '0';
}

/* ============================================
   TABLO OLUŞTURUCU
   ============================================ */
function tableWrap(html) {
    return `<div class="data-table-wrap"><table class="data-table">${html}</table></div>`;
}

function renderPageTabs(tabs, active) {
    return tabs.map(t => 
        `<button class="page-tab${t.id === active ? ' active' : ''}" data-tab="${t.id}">
            ${t.label}
        </button>`
    ).join('');
}

/* ============================================
   TAB BAĞLAMA
   ============================================ */
function bindPageTabs(pageNum, tabs, onSelect) {
    DOM.mainContent.querySelectorAll('.page-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            pageTabs[pageNum] = tab.dataset.tab;
            onSelect(tab.dataset.tab);
        });
    });
}