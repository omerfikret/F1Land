/* ============================================
   SAYFA 1: season · circuit · status
   ============================================ */
async function loadPage1(tab = pageTabs[1]) {
    pageTabs[1] = tab;
    showLoading('Genel veriler yükleniyor...');

    const tabs = [
        { id: 'seasons', label: 'Sezonlar' },
        { id: 'circuits', label: 'Pistler' },
        { id: 'status', label: 'Durum Kodları' }
    ];

    const endpoints = { 
        seasons: API.seasons, 
        circuits: API.circuits, 
        status: API.status 
    };
    
    const titles = { 
        seasons: 'F1 Sezonları', 
        circuits: 'F1 Pistler', 
        status: 'Yarış Durum Kodları' 
    };

    try {
        let body = '';
        
        if (tab === 'seasons') {
            const seasons = await fetchAllPages(API.seasons, d => d.MRData.SeasonTable.Seasons);
            seasons.sort((a, b) => b.season - a.season);
            
            body = `
                <ul>${seasons.map(s => `
                    <li>
                        <i class="fas fa-calendar"></i>
                        <strong>${s.season}</strong>
                        <span style="margin-left:auto;color:#888;">${s.url ? 'Wikipedia' : ''}</span>
                    </li>
                `).join('')}</ul>
                <div class="grid-2">
                    <div class="card-mini">
                        <h3>Toplam Sezon</h3>
                        <p>${seasons.length}</p>
                    </div>
                    <div class="card-mini">
                        <h3>İlk Sezon</h3>
                        <p>${seasons[seasons.length - 1]?.season || '-'}</p>
                    </div>
                </div>`;
                
        } else if (tab === 'circuits') {
            const circuits = await fetchAllPages(API.circuits, d => d.MRData.CircuitTable.Circuits);
            circuits.sort((a, b) => a.circuitName.localeCompare(b.circuitName));
            
            body = `
                <ul>${circuits.map(c => {
                    const loc = c.Location || {};
                    return `<li>
                        <i class="fas fa-road"></i>
                        <strong>${c.circuitName}</strong>
                        <span style="color:#888;">${loc.locality}, ${loc.country}</span>
                        <span class="badge">${c.circuitId}</span>
                    </li>`;
                }).join('')}</ul>
                <div class="grid-2">
                    <div class="card-mini">
                        <h3>Toplam Pist</h3>
                        <p>${circuits.length}</p>
                    </div>
                </div>`;
                
        } else {
            const statuses = await fetchAllPages(API.status, d => d.MRData.StatusTable.Status);
            statuses.sort((a, b) => b.count - a.count);
            
            body = tableWrap(`
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Durum</th>
                        <th>Toplam</th>
                    </tr>
                </thead>
                <tbody>${statuses.map(s => `
                    <tr>
                        <td class="pos">${s.statusId}</td>
                        <td>${s.status}</td>
                        <td>${formatNumber(s.count)}</td>
                    </tr>
                `).join('')}</tbody>
            `);
        }

        DOM.mainContent.innerHTML = `
            <div class="page-header">
                <h1><i class="fas fa-database"></i> Sayfa 1 — Genel Bilgiler</h1>
                <span class="api-source">${endpoints[tab]}</span>
            </div>
            <div class="page-tabs">${renderPageTabs(tabs, tab)}</div>
            <div class="content-card">
                <h2><i class="fas fa-list"></i> ${titles[tab]}</h2>
                ${body}
            </div>`;

        bindPageTabs(1, tabs, loadPage1);
        setStatus('Sayfa 1 yüklendi', 'success');
        
    } catch (e) {
        showError(e.message);
    }
}