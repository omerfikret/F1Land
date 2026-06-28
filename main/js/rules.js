/* ============================================
   KURALLAR SAYFASI
   ============================================ */

async function loadRules() {
    showLoading('Kurallar sayfası yükleniyor...');
    try {
        const html = renderRules();
        DOM.mainContent.innerHTML = `
            <div class="page-header">
                <h1><i class="fas fa-gavel"></i> Kurallar</h1>
            </div>
            <div class="content-card">
                ${html}
            </div>`;
        setStatus('Kurallar sayfası yüklendi', 'success');
    } catch (e) {
        showError(e.message);
    }
}

function renderRules() {
    return `
        <div style="padding:2rem;text-align:center;color:var(--text-muted);">
            <i class="fas fa-book" style="font-size:3rem;color:var(--f1-red);margin-bottom:1rem;display:block;"></i>
            <h3>Kurallar bölümü yakında eklenecek...</h3>
            <p>F1'in teknik ve sportif kurallarını burada bulabilirsiniz.</p>
            <p style="margin-top:0.5rem;font-size:0.85rem;">Yarış hafta sonu formatı, puan sistemi, güvenlik araçları, DRS, lastik kuralları ve daha fazlası.</p>
        </div>
    `;
}

window.loadRules = loadRules;