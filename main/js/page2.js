/* ============================================
   SAYFA 2: standings · races (takvim)
   ============================================ */

async function loadPage2(tab = pageTabs[2]) {
    pageTabs[2] = tab;
    showLoading(`${selectedYear} yarış verileri yükleniyor...`);

    const tabs = [
        { id: 'standings', label: 'Puan Durumu' },
        { id: 'races', label: 'Yarış Takvimi' }
    ];

    try {
        let body = '';
        if (tab === 'standings') {
            body = await renderStandings();
        } else if (tab === 'races') {
            body = await renderRaceCalendar();
        }

        DOM.mainContent.innerHTML = `
            <div class="page-header">
                <h1><i class="fas fa-flag-checkered"></i> ${selectedYear} Sezonu - Yarış</h1>
            </div>
            <div class="page-tabs">${renderPageTabs(tabs, tab)}</div>
            <div class="content-card" style="background:transparent;backdrop-filter:none;border:none;padding:0;">
                <h2 style="display:none;">${tabs.find(t => t.id === tab).label}</h2>
                ${body}
            </div>`;
        bindPageTabs(2, tabs, loadPage2);
        setStatus(`${selectedYear} yarış verileri yüklendi`, 'success');
    } catch (e) {
        showError(e.message);
    }
}

// ========== TAKIM RENKLERİ ==========
const teamColors = {
    'Red Bull': '#1e41ff',
    'Ferrari': '#dc0000',
    'Mercedes': '#00d2be',
    'McLaren': '#ff8700',
    'Aston Martin': '#006f62',
    'Alpine': '#0090ff',
    'Williams': '#00a0de',
    'Haas': '#b6b6b6',
    'AlphaTauri': '#2b4562',
    'Racing Bulls': '#2b4562',
    'Sauber': '#900000',
    'Alfa Romeo': '#900000',
    'default': '#888888'
};

function getTeamColor(teamName) {
    if (!teamName) return teamColors.default;
    const name = teamName.trim();
    for (const [key, color] of Object.entries(teamColors)) {
        if (name.includes(key) || key.includes(name)) {
            return color;
        }
    }
    return teamColors.default;
}

// ========== SÜRÜCÜ SIRALAMASI (Podyum + Liste) ==========
async function renderStandings() {
    try {
        const [drivers, constructors] = await Promise.all([
            fetchStandings(selectedYear, 'driver'),
            fetchStandings(selectedYear, 'constructor')
        ]);

        let html = '';

        // ----- SÜRÜCÜLER -----
        if (drivers && drivers.length > 0) {
            html += `<div class="standings-box">`;
            html += `<h2 class="standings-title">SÜRÜCÜ SIRALAMASI</h2>`;

            const top3 = drivers.slice(0, 3);
            const rest = drivers.slice(3);

            if (top3.length === 3) {
                const podiumOrder = [top3[1], top3[0], top3[2]];
                html += `<div class="podium-grid">`;
                podiumOrder.forEach((driver, idx) => {
                    const pos = idx === 0 ? 2 : (idx === 1 ? 1 : 3);
                    const teamName = driver.Constructors?.[0]?.name || '';
                    const color = getTeamColor(teamName);
                    const fullName = `${driver.Driver?.givenName || ''} ${driver.Driver?.familyName || ''}`.trim() || 'Bilinmiyor';
                    const points = driver.points || 0;
                    const wins = driver.wins || 0;

                    html += `
                        <div class="driver-card-podium" style="border-color: ${color};">
                            <div class="driver-card-pos">${String(pos).padStart(2, '0')}</div>
                            <div class="driver-card-name">${fullName}</div>
                            <div class="driver-card-team" style="color: ${color};">${teamName}</div>
                            <div class="driver-card-points">${points}</div>
                            <div class="driver-card-label">POINTS</div>
                            <div class="driver-card-wins">🏆 ${wins}</div>
                        </div>
                    `;
                });
                html += `</div>`;
            }

            if (rest.length > 0) {
                html += `<div class="driver-list">`;
                rest.forEach(driver => {
                    const teamName = driver.Constructors?.[0]?.name || '';
                    const color = getTeamColor(teamName);
                    const fullName = `${driver.Driver?.givenName || ''} ${driver.Driver?.familyName || ''}`.trim() || 'Bilinmiyor';
                    const points = driver.points || 0;
                    const wins = driver.wins || 0;
                    const pos = driver.position || '-';

                    html += `
                        <div class="driver-card-list" style="border-left-color: ${color};">
                            <span class="driver-list-pos">${String(pos).padStart(2, '0')}</span>
                            <span class="driver-list-name">${fullName}</span>
                            <span class="driver-list-team" style="color: ${color};">${teamName}</span>
                            <span class="driver-list-points">${points}</span>
                            <span class="driver-list-label">puan</span>
                            <span class="driver-list-wins">🏆 ${wins}</span>
                        </div>
                    `;
                });
                html += `</div>`;
            }

            html += `</div>`;
        }

        // ----- TAKIMLAR -----
        if (constructors && constructors.length > 0) {
            html += `<div class="standings-box">`;
            html += `<h2 class="standings-title">TAKIM SIRALAMASI</h2>`;

            const top3 = constructors.slice(0, 3);
            const rest = constructors.slice(3);

            if (top3.length === 3) {
                const podiumOrder = [top3[1], top3[0], top3[2]];
                html += `<div class="podium-grid">`;
                podiumOrder.forEach((team, idx) => {
                    const pos = idx === 0 ? 2 : (idx === 1 ? 1 : 3);
                    const teamName = team.Constructor?.name || '';
                    const color = getTeamColor(teamName);
                    const points = team.points || 0;
                    const wins = team.wins || 0;

                    html += `
                        <div class="driver-card-podium" style="border-color: ${color};">
                            <div class="driver-card-pos">${String(pos).padStart(2, '0')}</div>
                            <div class="driver-card-name" style="font-size:0.9rem;">${teamName}</div>
                            <div class="driver-card-team" style="color: ${color};font-size:0.7rem;">Takım</div>
                            <div class="driver-card-points">${points}</div>
                            <div class="driver-card-label">POINTS</div>
                            <div class="driver-card-wins">🏆 ${wins}</div>
                        </div>
                    `;
                });
                html += `</div>`;
            }

            if (rest.length > 0) {
                html += `<div class="driver-list">`;
                rest.forEach(team => {
                    const teamName = team.Constructor?.name || '';
                    const color = getTeamColor(teamName);
                    const points = team.points || 0;
                    const wins = team.wins || 0;
                    const pos = team.position || '-';

                    html += `
                        <div class="driver-card-list" style="border-left-color: ${color};">
                            <span class="driver-list-pos">${String(pos).padStart(2, '0')}</span>
                            <span class="driver-list-name">${teamName}</span>
                            <span class="driver-list-team" style="color: ${color};">Takım</span>
                            <span class="driver-list-points">${points}</span>
                            <span class="driver-list-label">puan</span>
                            <span class="driver-list-wins">🏆 ${wins}</span>
                        </div>
                    `;
                });
                html += `</div>`;
            }

            html += `</div>`;
        }

        if (!html) html = '<p style="color:#888;">Henüz sıralama verisi yok.</p>';
        return html;
    } catch (error) {
        console.error('renderStandings Error:', error);
        return `<p style="color:#ff6b6b;">Hata: ${error.message}</p>`;
    }
}

// ========== YARIŞ TAKVİMİ ==========
async function renderRaceCalendar() {
    try {
        const races = await fetchRaces(selectedYear);
        if (!races.length) return '<p>Yarış takvimi yok.</p>';

        let resultsData = [];
        try {
            resultsData = await fetchResults(selectedYear);
        } catch (e) {
            console.warn('Sonuçlar yüklenemedi:', e);
        }

        // Kazananları doğru şekilde eşleştir (position = 1)
        const winnersMap = {};
        if (resultsData && resultsData.length) {
            resultsData.forEach(race => {
                const round = String(race.round);
                const results = race.Results || [];
                const winner = results.find(r => String(r.position) === "1");
                if (winner) {
                    const givenName = winner.Driver?.givenName || '';
                    const familyName = winner.Driver?.familyName || '';
                    const fullName = `${givenName} ${familyName}`.trim();
                    if (fullName) {
                        winnersMap[round] = fullName;
                    }
                }
            });
        }

        let html = `
            <div style="margin-bottom:2rem;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:0.5rem;">
                    <h2 style="font-size:1rem;font-weight:700;color:#f0f0f0;letter-spacing:0.05em;margin:0.8rem 0 0 0.5rem;">
                        YARIŞ TAKVİMİ
                    </h2>
                    <span style="font-size:0.7rem;color:#888;font-weight:500;margin-right:0.5rem;">${races.length} YARIŞ · 5 KITA</span>
                </div>
                <div class="race-grid">
        `;

        races.forEach((r, index) => {
            const round = String(r.round || index + 1);
            const shortName = r.raceName.replace(/ Grand Prix$/i, '').substring(0, 3).toUpperCase();
            const date = r.date ? new Date(r.date) : null;
            const dateStr = date ? date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) : 'TBA';
            const winner = winnersMap[round] || '';

            html += `
                <div class="race-card" data-round="${round}">
                    <div class="race-card-header">
                        <span class="race-card-round">${shortName}</span>
                        <span class="race-card-date">${dateStr}</span>
                    </div>
                    <div class="race-card-name">${r.raceName}</div>
                    <div class="race-card-circuit">${r.circuitName}</div>
                    <div class="race-card-winner">
                        ${winner ? `🏆 ${winner}` : ''}
                    </div>
                </div>
            `;
        });

        html += `
                </div>
                <div style="text-align:right;margin-top:1rem;padding-right:0.5rem;">
                    <span style="color:#888;font-size:0.75rem;letter-spacing:0.05em;">TAM TAKVİM →</span>
                </div>
            </div>
        `;
        html += `<div id="raceDetailContainer"></div>`;

        setTimeout(() => {
            document.querySelectorAll('.race-card').forEach(el => {
                el.addEventListener('click', function() {
                    const round = this.dataset.round;
                    showRaceDetail(selectedYear, round);
                });
            });
        }, 0);

        return html;
    } catch (error) {
        console.error('renderRaceCalendar Error:', error);
        return `<p>Hata: ${error.message}</p>`;
    }
}