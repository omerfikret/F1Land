/* ============================================
   HELPERS
   ============================================ */

const DOM = {
    mainContent: document.getElementById('mainContent'),
    yearSelect: document.getElementById('yearSelect'),
    syncBtn: document.getElementById('syncBtn'),
    syncStatus: document.getElementById('syncStatus')
};

function setStatus(msg, type) {
    if (DOM.syncStatus) {
        DOM.syncStatus.textContent = msg;
        DOM.syncStatus.className = 'show ' + (type || 'info');
    }
}

function showError(msg) {
    if (DOM.mainContent) {
        DOM.mainContent.innerHTML = `<div class="error-box"><strong>Hata:</strong> ${msg}</div>`;
    }
}

function showLoading(msg = 'Veriler yükleniyor...') {
    if (DOM.mainContent) {
        DOM.mainContent.innerHTML = `<div class="loading"><i class="fas fa-spinner fa-pulse"></i> ${msg}</div>`;
    }
}

function formatDate(s) {
    if (!s) return '-';
    try {
        return new Date(s).toLocaleDateString('tr-TR', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    } catch { return s; }
}

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

function bindPageTabs(pageNum, tabs, onSelect) {
    document.querySelectorAll('.page-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            if (typeof pageTabs !== 'undefined') {
                pageTabs[pageNum] = tab.dataset.tab;
                onSelect(tab.dataset.tab);
            }
        });
    });
}

window.DOM = DOM;
window.setStatus = setStatus;
window.showError = showError;
window.showLoading = showLoading;
window.formatDate = formatDate;
window.tableWrap = tableWrap;
window.renderPageTabs = renderPageTabs;
window.bindPageTabs = bindPageTabs;