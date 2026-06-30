/* ============================================
   ANA SAYFA: Yarış Takvimi + Puan Durumu (Alt Alta)
   ============================================ */

// --- Takım Renkleri (güncel) ---
const teamColors = {
    'Ferrari': '#F11F11',
    'Red Bull Racing': '#001A30',
    'Red Bull': '#001A30',
    'Mercedes-AMG': '#27F4D2',
    'Mercedes': '#27F4D2',
    'McLaren': '#FF8700',
    'Aston Martin': '#229971',
    'Alpine': '#FF85B8',
    'VCARB': '#6692FF',
    'Racing Bulls': '#6692FF',
    'Sauber': '#52E252',
    'Stake': '#52E252',
    'Haas': '#E6002B',
    'Williams': '#00A3E0',
    'default': '#444444'
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
        const calendarHTML = await renderRaceCalendar();
        const standingsHTML = await renderStandings();

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

// --- SÜRÜCÜ & TAKIM SIRALAMASI ---
async function renderStandings() {
    try {
        const [drivers, constructors] = await Promise.all([
            fetchStandings(selectedYear, 'driver'),
            fetchStandings(selectedYear, 'constructor')
        ]);

        let html = '';

        // ---- SÜRÜCÜ SIRALAMASI ----
if (drivers && drivers.length > 0) {
    html += `<div class="standings-box">`;
    html += `<h2 class="standings-title">SÜRÜCÜ SIRALAMASI</h2>`;

    const top3 = drivers.slice(0, 3);
    const rest = drivers.slice(3);

    // TOP 3 – kart (2-1-3 sıralaması)
    // TOP 3 – kart (2-1-3)
if (top3.length === 3) {
    html += `<div class="podium-grid">`;
    const podiumOrder = [top3[1], top3[0], top3[2]];
    podiumOrder.forEach((driver) => {
        const teamName = driver.Constructors?.[0]?.name || '';
        const color = getTeamColor(teamName); // <-- takım rengi
        const fullName = `${driver.Driver?.givenName || ''} ${driver.Driver?.familyName || ''}`.trim() || 'Bilinmiyor';
        const points = driver.points || 0;
        const countryCode = driver.Driver?.nationality ? driver.Driver.nationality.substring(0, 3).toUpperCase() : '???';

        html += `
            <div class="driver-card-podium" style="border-top-color: ${color};">
                <div class="driver-card-podium-inner">
                    <div class="driver-card-name">${fullName.toUpperCase()}</div>
                    <div class="driver-card-team">${teamName}</div>
                    <div class="driver-card-points">${points}</div>
                    <div class="driver-card-points-label">POINTS</div>
                    <div class="driver-card-country">${countryCode}</div>
                    <div class="driver-card-bottom-line" style="background: ${color};"></div>
                </div>
            </div>
        `;
    });
    html += `</div>`;
}

    // 4. ve sonrası – liste (renkli çizgi ile)
    if (rest.length > 0) {
        html += `<div class="driver-list">`;
        rest.forEach(driver => {
            const teamName = driver.Constructors?.[0]?.name || '';
            const color = getTeamColor(teamName);
            const fullName = `${driver.Driver?.givenName || ''} ${driver.Driver?.familyName || ''}`.trim() || 'Bilinmiyor';
            const points = driver.points || 0;
            const pos = driver.position || '-';

            html += `
                <div class="driver-card-list" style="border-left-color: ${color};">
                    <span class="driver-list-pos">${String(pos).padStart(2, '0')}</span>
                    <span class="driver-list-name">${fullName}</span>
                    <span class="driver-list-team" style="color: ${color};">${teamName}</span>
                    <span class="driver-list-points">${points}</span>
                    <span class="driver-list-label">puan</span>
                </div>
            `;
        });
        html += `</div>`;
    }

    html += `</div>`;
}

        // ---- TAKIM SIRALAMASI ----
if (constructors && constructors.length > 0) {
    html += `<div class="standings-box">`;
    html += `<h2 class="standings-title">TAKIM SIRALAMASI</h2>`;

    const top3 = constructors.slice(0, 3);
    const rest = constructors.slice(3);

    // TOP 3 – kart (2-1-3 sıralaması)
    // TOP 3 – kart (2-1-3)
if (top3.length === 3) {
    html += `<div class="podium-grid">`;
    const podiumOrder = [top3[1], top3[0], top3[2]];
    podiumOrder.forEach((team) => {
        const teamName = team.Constructor?.name || '';
        const color = getTeamColor(teamName); // <-- takım rengi
        const points = team.points || 0;
        const countryCode = team.Constructor?.nationality ? team.Constructor.nationality.substring(0, 3).toUpperCase() : '???';

        html += `
            <div class="driver-card-podium" style="border-top-color: ${color};">
                <div class="driver-card-podium-inner">
                    <div class="driver-card-name">${teamName.toUpperCase()}</div>
                    <div class="driver-card-team" style="font-size:0.7rem; color:#888;">TAKIM</div>
                    <div class="driver-card-points">${points}</div>
                    <div class="driver-card-points-label">POINTS</div>
                    <div class="driver-card-country">${countryCode}</div>
                    <div class="driver-card-bottom-line" style="background: ${color};"></div>
                </div>
            </div>
        `;
    });
    html += `</div>`;
}

    // 4. ve sonrası – liste (renkli çizgi ile)
    if (rest.length > 0) {
        html += `<div class="driver-list">`;
        rest.forEach(team => {
            const teamName = team.Constructor?.name || '';
            const color = getTeamColor(teamName);
            const points = team.points || 0;
            const pos = team.position || '-';

            html += `
                <div class="driver-card-list" style="border-left-color: ${color};">
                    <span class="driver-list-pos">${String(pos).padStart(2, '0')}</span>
                    <span class="driver-list-name">${teamName}</span>
                    <span class="driver-list-team" style="color: ${color};">Takım</span>
                    <span class="driver-list-points">${points}</span>
                    <span class="driver-list-label">puan</span>
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

// --- YARIŞ TAKVİMİ (tablo formatı) ---
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
                    const familyName = winner.Driver?.familyName || '';
                    if (familyName) {
                        winnersMap[round] = familyName.toUpperCase();
                    }
                }
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let nextRaceRound = null;
        for (const r of races) {
            if (r.date) {
                const raceDate = new Date(r.date);
                raceDate.setHours(0, 0, 0, 0);
                if (raceDate >= today) {
                    nextRaceRound = String(r.round);
                    break;
                }
            }
        }

        let html = `
            <div class="standings-box">
                <h2 class="standings-title">YARIŞ TAKVİMİ</h2>
                <div class="race-table">
        `;

        races.forEach((r, index) => {
            const round = String(r.round || index + 1);
            const roundFormatted = `R${String(round).padStart(2, '0')}`;
            const date = r.date ? new Date(r.date) : null;
            const dateStr = date ? date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : 'TBA';
            const winner = winnersMap[round] || '';
            const isNext = (round === nextRaceRound);

            let countryCode = '???';
            if (r.Circuit?.Location?.country) {
                const raw = r.Circuit.Location.country;
                const map = {
                    'United Kingdom': 'GBR',
                    'United States': 'USA',
                    'United Arab Emirates': 'UAE',
                };
                countryCode = map[raw] || raw.substring(0, 3).toUpperCase();
            }

            html += `
                <div class="race-row ${isNext ? 'race-row-next' : ''}" data-round="${round}">
                    <div class="race-col round">${roundFormatted}</div>
                    <div class="race-col code">
                        <span class="country-code">${countryCode}</span>
                    </div>
                    <div class="race-col name">
                        <div class="race-name">${r.raceName.toUpperCase()}</div>
                        <div class="race-location">${r.circuitName}</div>
                    </div>
                    <div class="race-col date">
                        <i class="fas fa-calendar-alt"></i> ${dateStr}
                    </div>
                    <div class="race-col status">
                        ${winner ? `<i class="fas fa-trophy"></i> ${winner}` : ''}
                        ${isNext ? '<span class="next-badge">NEXT</span>' : ''}
                    </div>
                </div>
            `;
        });

        html += `
                </div>
                <div class="full-calendar-btn">
                    <span></span>
                </div>
            </div>
            <div id="raceDetailContainer"></div>
        `;

        setTimeout(() => {
            document.querySelectorAll('.race-row').forEach(el => {
                el.addEventListener('click', function() {
                    const round = this.dataset.round;
                    if (round) {
                        loadRaceDetailPage(selectedYear, round);
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