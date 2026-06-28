/* ============================================
   ANA SAYFA: Yarış Takvimi + Puan Durumu (Alt Alta)
   ============================================ */

// --- Takım Renkleri ---
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

// --- Ana Sayfa (Takvim ilk, sonra sıralamalar) ---
async function loadPage1() {
    showLoading(`${selectedYear} sezonu yükleniyor...`);

    try {
        const calendarHTML = await renderRaceCalendar();   // ÖNCE TAKVİM
        const standingsHTML = await renderStandings();     // SONRA SIRALAMALAR

        DOM.mainContent.innerHTML = `
            <div class="page-header">
                <h1><i class="fas fa-flag-checkered"></i> ${selectedYear} Sezonu</h1>
            </div>
            <div style="background:transparent;backdrop-filter:none;border:none;padding:0;">
                ${calendarHTML}
                ${standingsHTML}
            </div>`;

        setStatus(`${selectedYear} verileri yüklendi`, 'success');
    } catch (e) {
        showError(e.message);
    }
}

// --- SÜRÜCÜ & TAKIM SIRALAMASI (değişiklik yok) ---
async function renderStandings() {
    try {
        const [drivers, constructors] = await Promise.all([
            fetchStandings(selectedYear, 'driver'),
            fetchStandings(selectedYear, 'constructor')
        ]);

        let html = '';

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

// --- YARIŞ TAKVİMİ (siyah kartlar, tıklanabilir) ---
async function renderRaceCalendar() {
    try {
        const races = await fetchRaces(selectedYear);
        if (!races || races.length === 0) {
            return '<p style="color:#888;">Bu sezon için yarış takvimi bulunamadı.</p>';
        }

        let resultsData = [];
        try {
            resultsData = await fetchResults(selectedYear);
        } catch (e) {
            console.warn('Sonuçlar yüklenemedi:', e);
        }

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
            <div class="standings-box">
                <h2 class="standings-title">YARIŞ TAKVİMİ</h2>
                <div class="race-grid-new">
        `;

        races.forEach((r, index) => {
            const round = String(r.round || index + 1);
            const date = r.date ? new Date(r.date) : null;
            const dateStr = date ? date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) : 'TBA';
            const winner = winnersMap[round] || '';

            html += `
                <div class="race-card-new" data-round="${round}">
                    <div class="race-card-row">
                        <span class="race-card-number">${String(round).padStart(2, '0')}</span>
                        <span class="race-card-name">${r.raceName}</span>
                        <span class="race-card-date">${dateStr}</span>
                    </div>
                    <div class="race-card-row">
                        <span class="race-card-circuit">${r.circuitName}</span>
                        <span class="race-card-winner">${winner ? `🏆 ${winner}` : ''}</span>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
                <div style="text-align:right;margin-top:1.5rem;padding-right:0.5rem;">
                    <span style="color:#888;font-size:0.75rem;letter-spacing:0.05em;">TAM TAKVİM →</span>
                </div>
            </div>
        `;
        html += `<div id="raceDetailContainer"></div>`;

        // Tıklama eventleri
        setTimeout(() => {
            document.querySelectorAll('.race-card-new').forEach(el => {
                el.addEventListener('click', function() {
                    const round = this.dataset.round;
                    if (round) {
                        showRaceDetail(selectedYear, round);
                    }
                });
            });
        }, 50);

        return html;
    } catch (error) {
        console.error('renderRaceCalendar Error:', error);
        return `<p style="color:#ff6b6b;">Takvim yüklenirken hata: ${error.message}</p>`;
    }
}

window.loadPage1 = loadPage1;