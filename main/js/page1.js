/* ============================================
   ANA SAYFA: seasons · drivers · constructors
   ============================================ */

async function loadPage1(tab = pageTabs[1]) {
    pageTabs[1] = tab;
    showLoading('Genel veriler yükleniyor...');

    const tabs = [
        { id: 'seasons', label: 'Sezonlar' },
        { id: 'drivers', label: 'Sürücüler' },
        { id: 'constructors', label: 'Takımlar' }
    ];

    try {
        let body = '';
        const year = window.selectedYear || 2024;

        if (tab === 'seasons') {
            const years = await fetchSeasons();
            body = `
                <ul>${years.map(y => `
                    <li>
                        <i class="fas fa-calendar"></i>
                        <strong>${y}</strong>
                        <span style="margin-left:auto;color:#888;">${y} Sezonu</span>
                    </li>
                `).join('')}</ul>
                <div class="grid-2">
                    <div class="card-mini">
                        <h3>Toplam Sezon</h3>
                        <p>${years.length}</p>
                    </div>
                    <div class="card-mini">
                        <h3>Son Sezon</h3>
                        <p>${years[0] || '-'}</p>
                    </div>
                </div>`;
        } else if (tab === 'drivers') {
            const drivers = await fetchDrivers(year);
            drivers.sort((a, b) => (a.driver_number || 999) - (b.driver_number || 999));
            body = `
                <ul>${drivers.slice(0, 50).map(d => `
                    <li>
                        <i class="fas fa-user"></i>
                        <strong>${d.full_name || 'Bilinmiyor'}</strong>
                        <span class="badge">#${d.driver_number || '-'}</span>
                        <span style="color:#888;">${d.country_code || ''}</span>
                    </li>
                `).join('')}</ul>
                <div class="grid-2">
                    <div class="card-mini">
                        <h3>Toplam Sürücü</h3>
                        <p>${drivers.length}</p>
                    </div>
                </div>`;
        } else { // constructors
            const teams = await fetchConstructors(year);
            teams.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            body = `
                <ul>${teams.slice(0, 50).map(t => `
                    <li>
                        <i class="fas fa-flag"></i>
                        <strong>${t.name || 'Bilinmiyor'}</strong>
                        <span style="color:#888;">${t.nationality || ''}</span>
                    </li>
                `).join('')}</ul>
                <div class="grid-2">
                    <div class="card-mini">
                        <h3>Toplam Takım</h3>
                        <p>${teams.length}</p>
                    </div>
                </div>`;
        }

        DOM.mainContent.innerHTML = `
            <div class="page-header">
                <h1><i class="fas fa-home"></i> Ana Sayfa</h1>
                <!-- api-source kaldırıldı -->
            </div>
            <div class="page-tabs">${renderPageTabs(tabs, tab)}</div>
            <div class="content-card">
                <h2><i class="fas fa-list"></i> ${tabs.find(t => t.id === tab).label}</h2>
                ${body}
            </div>`;
        bindPageTabs(1, tabs, loadPage1);
        setStatus('Ana sayfa yüklendi', 'success');
    } catch (e) {
        showError(e.message);
    }
}