/* ============================================
   YARIŞ DETAYI
   ============================================ */
async function showRaceDetail(year, round) {
    const container = document.getElementById('raceDetailContainer');
    if (!container) return;
    
    container.innerHTML = `<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Yarış detayı yükleniyor...</div>`;

    try {
        const [resultsData, qualData, sprintData, pitData, lapData] = await Promise.all([
            apiFetch(API.raceResults(year, round)).catch(() => null),
            apiFetch(API.raceQualifying(year, round)).catch(() => null),
            apiFetch(API.raceSprint(year, round)).catch(() => null),
            apiFetch(API.pitstops(year, round)).catch(() => null),
            apiFetch(API.laps(year, round)).catch(() => null)
        ]);

        const race = resultsData?.MRData?.RaceTable?.Races?.[0] ||
            qualData?.MRData?.RaceTable?.Races?.[0] ||
            { raceName: `Round ${round}` };

        const results = race.Results || resultsData?.MRData?.RaceTable?.Races?.[0]?.Results || [];
        const qualifying = qualData?.MRData?.RaceTable?.Races?.[0]?.QualifyingResults || [];
        const sprint = sprintData?.MRData?.RaceTable?.Races?.[0]?.SprintResults || [];
        const pitstops = pitData?.MRData?.RaceTable?.Races?.[0]?.PitStops || [];
        const laps = lapData?.MRData?.RaceTable?.Races?.[0]?.Laps || [];

        const tabs = [
            { id: 'results', label: 'Sonuç', show: results.length },
            { id: 'qualifying', label: 'Qualifying', show: qualifying.length },
            { id: 'sprint', label: 'Sprint', show: sprint.length },
            { id: 'pitstops', label: 'Pit Stop', show: pitstops.length },
            { id: 'laps', label: 'Turlar', show: laps.length }
        ].filter(t => t.show);

        const firstTab = tabs[0]?.id || 'results';
        
        container.innerHTML = `
            <div class="race-detail">
                <h3 style="color:#e60000;margin-bottom:1rem;">
                    <i class="fas fa-flag-checkered"></i> ${race.raceName} — Detay
                </h3>
                <p style="color:#666;font-size:.8rem;margin-bottom:1rem;">
                    ${API.pitstops(year, round)} · ${API.laps(year, round)}
                </p>
                <div class="detail-tabs">${tabs.map(t => `
                    <button class="detail-tab${t.id === firstTab ? ' active' : ''}" data-tab="${t.id}">
                        ${t.label}
                    </button>
                `).join('')}</div>
                <div id="detailTabContent">${renderDetailTab(firstTab, { results, qualifying, sprint, pitstops, laps })}</div>
            </div>`;

        // Tab click eventleri
        const content = document.getElementById('detailTabContent');
        container.querySelectorAll('.detail-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.detail-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                content.innerHTML = renderDetailTab(btn.dataset.tab, { results, qualifying, sprint, pitstops, laps });
            });
        });
        
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (e) {
        container.innerHTML = `<p style="color:#cc0000;">Detay hatası: ${e.message}</p>`;
    }
}

/* ============================================
   DETAY TAB RENDER
   ============================================ */
function renderDetailTab(id, data) {
    const { results, qualifying, sprint, pitstops, laps } = data;
    
    if (id === 'results') {
        return tableWrap(`
            <thead>
                <tr>
                    <th>Poz</th><th>Sürücü</th><th>Takım</th>
                    <th>Grid</th><th>Tur</th><th>Durum</th><th>Puan</th>
                </tr>
            </thead>
            <tbody>${results.map(r => `
                <tr>
                    <td class="pos">${r.position}</td>
                    <td>${driverName(r.Driver)}</td>
                    <td>${r.Constructor?.name || '-'}</td>
                    <td>${r.grid}</td>
                    <td>${r.laps}</td>
                    <td>${r.status || r.Time?.time || '-'}</td>
                    <td>${r.points}</td>
                </tr>
            `).join('')}</tbody>
        `);
    }
    
    if (id === 'qualifying') {
        return tableWrap(`
            <thead>
                <tr><th>Poz</th><th>Sürücü</th><th>Q1</th><th>Q2</th><th>Q3</th></tr>
            </thead>
            <tbody>${qualifying.map(q => `
                <tr>
                    <td class="pos">${q.position}</td>
                    <td>${driverName(q.Driver)}</td>
                    <td>${q.Q1 || '-'}</td>
                    <td>${q.Q2 || '-'}</td>
                    <td>${q.Q3 || '-'}</td>
                </tr>
            `).join('')}</tbody>
        `);
    }
    
    if (id === 'sprint') {
        return tableWrap(`
            <thead>
                <tr><th>Poz</th><th>Sürücü</th><th>Takım</th><th>Puan</th></tr>
            </thead>
            <tbody>${sprint.map(s => `
                <tr>
                    <td class="pos">${s.position}</td>
                    <td>${driverName(s.Driver)}</td>
                    <td>${s.Constructor?.name || '-'}</td>
                    <td>${s.points}</td>
                </tr>
            `).join('')}</tbody>
        `);
    }
    
    if (id === 'pitstops') {
        return tableWrap(`
            <thead>
                <tr><th>Sürücü</th><th>Stop</th><th>Tur</th><th>Saat</th><th>Süre</th></tr>
            </thead>
            <tbody>${pitstops.map(p => `
                <tr>
                    <td>${p.driverId}</td>
                    <td>${p.stop}</td>
                    <td>${p.lap}</td>
                    <td>${p.time}</td>
                    <td>${p.duration}s</td>
                </tr>
            `).join('')}</tbody>
        `);
    }
    
    if (id === 'laps') {
        return laps.map(lap => {
            const rows = (lap.Timings || []).slice(0, 5).map(t =>
                `<tr><td class="pos">${t.position}</td><td>${t.driverId}</td><td>${t.time}</td></tr>`
            ).join('');
            return `<h4 style="color:#e60000;margin:1rem 0 .5rem;">Tur ${lap.number}</h4>
                ${tableWrap(`<thead><tr><th>Poz</th><th>Sürücü</th><th>Zaman</th></tr></thead><tbody>${rows}</tbody>`)}`;
        }).join('');
    }
    
    return '<p style="color:#888;">Veri yok.</p>';
}