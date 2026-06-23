/* ============================================
   SAYFA 2: race · driver · constructor
   ============================================ */
async function loadPage2(tab = pageTabs[2]) {
    pageTabs[2] = tab;
    showLoading(`${selectedYear} sezon verileri yükleniyor...`);

    const tabs = [
        { id: 'races', label: 'Yarış Takvimi' },
        { id: 'drivers', label: 'Pilotlar' },
        { id: 'constructors', label: 'Takımlar' }
    ];
    
    const endpoints = { 
        races: API.races(selectedYear), 
        drivers: API.drivers(selectedYear), 
        constructors: API.constructors(selectedYear) 
    };
    
    const titles = { 
        races: `${selectedYear} Yarış Takvimi`, 
        drivers: `${selectedYear} Pilotları`, 
        constructors: `${selectedYear} Takımları` 
    };

    try {
        let body = '';
        
        if (tab === 'races') {
            const races = await fetchAllPages(API.races(selectedYear), d => d.MRData.RaceTable.Races);
            
            body = `
                <ul>${races.map(r => {
                    const c = r.Circuit || {}, loc = c.Location || {};
                    const sprint = r.Sprint ? '<span class="badge">Sprint</span>' : '';
                    return `<li>
                        <i class="fas fa-flag-checkered"></i>
                        <strong>R${r.round} — ${r.raceName}</strong>
                        <span style="color:#888;">${c.circuitName} · ${loc.country}</span>
                        <span style="margin-left:auto;">${formatDate(r.date)}</span>
                        ${sprint}
                    </li>`;
                }).join('')}</ul>
                <div class="grid-2">
                    <div class="card-mini">
                        <h3>Toplam Yarış</h3>
                        <p>${races.length} GP</p>
                    </div>
                    <div class="card-mini">
                        <h3>Sprint Hafta Sonları</h3>
                        <p>${races.filter(r => r.Sprint).length}</p>
                    </div>
                </div>`;
                
        } else if (tab === 'drivers') {
            const drivers = await fetchAllPages(API.drivers(selectedYear), d => d.MRData.DriverTable.Drivers);
            drivers.sort((a, b) => (parseInt(a.permanentNumber) || 999) - (parseInt(b.permanentNumber) || 999));
            
            body = `
                <ul>${drivers.map(d => `
                    <li>
                        <i class="fas fa-user"></i>
                        <strong>${driverName(d)}</strong>
                        <span class="badge">#${d.permanentNumber || '-'}</span>
                        <span style="color:#aaa;">${d.code || ''}</span>
                        <span style="margin-left:auto;color:#888;">
                            ${d.nationality} · ${formatDate(d.dateOfBirth)}
                        </span>
                    </li>
                `).join('')}</ul>
                <div class="grid-2">
                    <div class="card-mini">
                        <h3>Toplam Pilot</h3>
                        <p>${drivers.length}</p>
                    </div>
                </div>`;
                
        } else {
            const teams = await fetchAllPages(API.constructors(selectedYear), d => d.MRData.ConstructorTable.Constructors);
            teams.sort((a, b) => a.name.localeCompare(b.name));
            
            body = `
                <ul>${teams.map(t => `
                    <li>
                        <i class="fas fa-flag"></i>
                        <strong>${t.name}</strong>
                        <span style="color:#888;margin-left:8px;">${t.nationality}</span>
                        <span class="badge">${t.constructorId}</span>
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
                <h1><i class="fas fa-users"></i> Sayfa 2 — Sezon Kadrosu</h1>
                <span class="api-source">${endpoints[tab]}</span>
            </div>
            <div class="page-tabs">${renderPageTabs(tabs, tab)}</div>
            <div class="content-card">
                <h2><i class="fas fa-list"></i> ${titles[tab]}</h2>
                ${body}
            </div>`;

        bindPageTabs(2, tabs, loadPage2);
        setStatus(`${selectedYear} sezon kadrosu yüklendi`, 'success');
        
    } catch (e) {
        showError(e.message);
    }
}