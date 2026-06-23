/* ============================================
   SAYFA 3: standings · results · qualifying · sprint
   ============================================ */
async function loadPage3(tab = pageTabs[3]) {
    pageTabs[3] = tab;
    showLoading(`${selectedYear} sonuç verileri yükleniyor...`);

    const tabs = [
        { id: 'standings', label: 'Puan Durumu' },
        { id: 'results', label: 'Yarış Sonuçları' },
        { id: 'qualifying', label: 'Qualifying' },
        { id: 'sprint', label: 'Sprint' }
    ];
    
    const endpoints = {
        standings: `${API.driverStandings(selectedYear)} + ${API.constructorStandings(selectedYear)}`,
        results: API.results(selectedYear),
        qualifying: API.qualifying(selectedYear),
        sprint: API.sprint(selectedYear)
    };

    try {
        let body = '';

        if (tab === 'standings') {
            body = await renderStandings();
            
        } else if (tab === 'results') {
            body = await renderResults();
            
        } else if (tab === 'qualifying') {
            body = await renderQualifying();
            
        } else {
            body = await renderSprint();
        }

        DOM.mainContent.innerHTML = `
            <div class="page-header">
                <h1><i class="fas fa-chart-line"></i> Sayfa 3 — Yarış & Sonuçlar</h1>
                <span class="api-source">${endpoints[tab]}</span>
            </div>
            <div class="page-tabs">${renderPageTabs(tabs, tab)}</div>
            <div class="content-card">
                <h2><i class="fas fa-trophy"></i> ${tabs.find(t => t.id === tab).label}</h2>
                ${body}
            </div>`;

        bindPageTabs(3, tabs, loadPage3);

        // Results tab'ında race item click event
        if (tab === 'results') {
            document.querySelectorAll('.race-item').forEach(el => {
                el.addEventListener('click', () => showRaceDetail(selectedYear, el.dataset.round));
            });
        }

        setStatus(`${selectedYear} sonuç verileri yüklendi`, 'success');
        
    } catch (e) {
        showError(e.message);
    }
}

/* ============================================
   ALT RENDER FONKSİYONLARI
   ============================================ */
async function renderStandings() {
    const [driverData, constructorData] = await Promise.all([
        apiFetch(API.driverStandings(selectedYear)),
        apiFetch(API.constructorStandings(selectedYear))
    ]);
    
    const drivers = driverData?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
    const teams = constructorData?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];

    return `
        <h2 style="color:#e60000;margin-bottom:.8rem;">
            <i class="fas fa-user"></i> Sürücü Sıralaması
        </h2>
        <ul>${drivers.map(d => {
            const team = d.Constructors?.[0]?.name || '-';
            return `<li>
                <span class="pos" style="width:28px;">${d.position}</span>
                <strong>${driverName(d.Driver)}</strong>
                <span style="color:#888;">${team}</span>
                <span style="margin-left:auto;color:#e60000;font-weight:600;">${d.points} puan</span>
                <span style="color:#888;">🏆 ${d.wins}</span>
            </li>`;
        }).join('')}</ul>
        
        <h2 style="color:#e60000;margin:1.5rem 0 .8rem;">
            <i class="fas fa-flag"></i> Takım Sıralaması
        </h2>
        <ul>${teams.map(c => `
            <li>
                <span class="pos" style="width:28px;">${c.position}</span>
                <strong>${c.Constructor?.name}</strong>
                <span style="margin-left:auto;color:#e60000;font-weight:600;">${c.points} puan</span>
                <span style="color:#888;">🏆 ${c.wins}</span>
            </li>
        `).join('')}</ul>`;
}

async function renderResults() {
    const races = await fetchRaceTable(API.results(selectedYear));
    
    if (!races.length) {
        return '<p style="color:#888;">Henüz yarış sonucu yok.</p>';
    }
    
    return `
        <div id="raceList">${races.map(r => {
            const winner = r.Results?.[0];
            return `<div class="race-item" data-round="${r.round}">
                <span>
                    <i class="fas fa-flag"></i> 
                    <strong>R${r.round} — ${r.raceName}</strong>
                </span>
                <span class="winner">🏆 ${winner ? driverName(winner.Driver) : '-'}</span>
                <span style="color:#666;font-size:.85rem;">${formatDate(r.date)}</span>
            </div>`;
        }).join('')}</div>
        <div id="raceDetailContainer"></div>`;
}

async function renderQualifying() {
    const races = await fetchRaceTable(API.qualifying(selectedYear));
    
    if (!races.length) {
        return '<p style="color:#888;">Qualifying verisi yok.</p>';
    }
    
    return races.map(r => {
        const top = r.QualifyingResults?.[0];
        return `<div class="content-card" style="padding:1rem 1.2rem;margin-bottom:.8rem;border-left-width:4px;">
            <strong>R${r.round} — ${r.raceName}</strong>
            <span style="margin-left:12px;color:#ff4d4d;">
                Pole: ${top ? driverName(top.Driver) : '-'} (${top?.Q3 || top?.Q2 || '-'})
            </span>
        </div>`;
    }).join('');
}

async function renderSprint() {
    const races = await fetchRaceTable(API.sprint(selectedYear));
    
    if (!races.length) {
        return '<p style="color:#888;">Sprint verisi yok.</p>';
    }
    
    return races.map(r => {
        const winner = r.SprintResults?.[0];
        return `<div class="content-card" style="padding:1rem 1.2rem;margin-bottom:.8rem;border-left-width:4px;">
            <strong>R${r.round} — ${r.raceName}</strong>
            <span style="margin-left:12px;color:#ff4d4d;">
                Sprint: ${winner ? driverName(winner.Driver) : '-'}
            </span>
        </div>`;
    }).join('');
}