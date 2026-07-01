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

// --- PİST GÖRSELİ EŞLEŞTİRMESİ (circuitId → dosya adı) ---
const imageMap = {
    'silverstone': 'silverstone.avif',
    'monza': 'monza.avif',
    'spa': 'spa.avif',
    'monaco': 'monaco.avif',
    'hungaroring': 'budapest.avif',
    'catalunya': 'catalunya.avif',
    'red_bull_ring': 'red_bull_ring.avif',
    'interlagos': 'interlagos.avif',
    'yas_marina': 'singapore.avif',
    'suzuka': 'suzuka.avif',
    'albert_park': 'australia.avif',
    'bahrain': 'bahrain.avif',
    'baku': 'baku.avif',
    'imola': 'imola.avif',
    'miami': 'miami.avif',
    'portimao': 'portimao.avif',
    'zandvoort': 'zandvoort.avif',
    'marina_bay': 'singapore.avif',
    'cota': 'usa.avif',
    'rodriguez': 'mexico.avif',
    'las_vegas': 'las_vegas.avif',
    'jeddah': 'jeddah.avif',
    'losail': 'losail.avif',
};

function getCircuitImage(circuitId, raceName) {
    // 1. circuitId'ye bak
    if (imageMap[circuitId]) {
        return imageMap[circuitId];
    }
    // 2. raceName'den tahmin et (büyük/küçük harf duyarsız)
    const name = raceName.toLowerCase();
    if (name.includes('british') || name.includes('silverstone')) return 'silverstone.avif';
    if (name.includes('italian') || name.includes('monza')) return 'monza.avif';
    if (name.includes('belgian') || name.includes('spa')) return 'spa.avif';
    if (name.includes('monaco')) return 'monaco.avif';
    if (name.includes('hungarian') || name.includes('hungaroring')) return 'budapest.avif';
    if (name.includes('spain') || name.includes('catalunya')) return 'catalunya.avif';
    if (name.includes('austria') || name.includes('red bull')) return 'red_bull_ring.avif';
    if (name.includes('brazil') || name.includes('interlagos')) return 'interlagos.avif';
    if (name.includes('abu dhabi') || name.includes('yas marina')) return 'singapore.avif';
    if (name.includes('japan') || name.includes('suzuka')) return 'suzuka.avif';
    if (name.includes('australia') || name.includes('albert park')) return 'australia.avif';
    if (name.includes('bahrain')) return 'bahrain.avif';
    if (name.includes('azerbaijan') || name.includes('baku')) return 'baku.avif';
    if (name.includes('emilia') || name.includes('imola')) return 'imola.avif';
    if (name.includes('miami')) return 'miami.avif';
    if (name.includes('portugal') || name.includes('portimao')) return 'portimao.avif';
    if (name.includes('dutch') || name.includes('zandvoort')) return 'zandvoort.avif';
    if (name.includes('singapore') || name.includes('marina bay')) return 'singapore.avif';
    if (name.includes('united') || name.includes('states') || name.includes('americas')) return 'usa.avif';
    if (name.includes('mexico') || name.includes('rodriguez')) return 'mexico.avif';
    if (name.includes('vegas') || name.includes('las vegas')) return 'las_vegas.avif';
    if (name.includes('saudi') || name.includes('jeddah')) return 'jeddah.avif';
    if (name.includes('qatar') || name.includes('losail')) return 'losail.avif';
    // Varsayılan
    return 'default.avif';
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

        // Geri sayımları başlat
        setTimeout(startCountdowns, 100);

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

            if (top3.length === 3) {
                html += `<div class="podium-grid">`;
                const podiumOrder = [top3[1], top3[0], top3[2]];
                podiumOrder.forEach((driver) => {
                    const teamName = driver.Constructors?.[0]?.name || '';
                    const color = getTeamColor(teamName);
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

            if (top3.length === 3) {
                html += `<div class="podium-grid">`;
                const podiumOrder = [top3[1], top3[0], top3[2]];
                podiumOrder.forEach((team) => {
                    const teamName = team.Constructor?.name || '';
                    const color = getTeamColor(teamName);
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

        // Kazananları al
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

        // Sıradaki yarışı bul
        let nextRace = null;
        let nextRaceRound = null;
        for (const r of races) {
            if (r.date) {
                const raceDate = new Date(r.date);
                raceDate.setHours(0, 0, 0, 0);
                if (raceDate >= today) {
                    nextRace = r;
                    nextRaceRound = String(r.round);
                    break;
                }
            }
        }

        // --- NEXT YARIŞ KARTI (varsa) ---
        let nextRaceHTML = '';
        if (nextRace) {
            const raceName = nextRace.raceName || 'Grand Prix';
            const country = nextRace.Circuit?.Location?.country || '';
            const circuitName = nextRace.Circuit?.circuitName || '';
            const circuitId = nextRace.Circuit?.circuitId || '';
            const date = nextRace.date ? new Date(nextRace.date) : null;

            // Görsel dosyasını bul
            const imageFile = getCircuitImage(circuitId, raceName);
            const imagePath = `img/circuits/${imageFile}`;

            // Geri sayım
            const countdownHTML = date ? `<div class="next-race-countdown" data-race-date="${date.toISOString()}">
                <span class="countdown-days">--</span>g
                <span class="countdown-hours">--</span>h
                <span class="countdown-minutes">--</span>m
                <span class="countdown-seconds">--</span>s
            </div>` : '';

            nextRaceHTML = `
                <div class="next-race-card">
                    <div class="next-race-image">
                        <img src="${imagePath}" alt="${raceName}" onerror="this.parentElement.innerHTML='<div style=\\'padding:2rem;color:#666;font-size:0.9rem;\\'><i class=\\'fas fa-image\\'></i> Görsel yok</div>'" />
                    </div>
                    <div class="next-race-info">
                        <div class="next-race-badge">NEXT RACE</div>
                        <div class="next-race-name">${raceName.toUpperCase()}</div>
                        <div class="next-race-circuit">${circuitName} • ${country}</div>
                        <div class="next-race-date">
                            <i class="fas fa-calendar-alt"></i> ${date ? date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'TBA'}
                        </div>
                        ${countdownHTML}
                    </div>
                </div>
            `;
        }

        // --- TAKVİM TABLOSU (race-row listesi) ---
        let calendarHTML = `
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

            const isFuture = date ? date >= today : false;
            const isNext = (round === nextRaceRound);

            let statusContent = '';
            if (winner && !isFuture) {
                statusContent = `<i class="fas fa-trophy"></i> ${winner}`;
            } else if (isFuture && isNext) {
                statusContent = `<span class="next-badge">NEXT</span>`;
            } else if (isFuture && !isNext) {
                statusContent = `<span class="upcoming-text">Upcoming</span>`;
            }

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

            calendarHTML += `
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
                        ${statusContent}
                    </div>
                </div>
            `;
        });

        calendarHTML += `
                </div>
            </div>
            <div id="raceDetailContainer"></div>
        `;

        // NEXT kartı + takvim tablosu
        const finalHTML = nextRaceHTML + calendarHTML;

        // Tıklama olaylarını bağla
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

        return finalHTML;
    } catch (error) {
        console.error('renderRaceCalendar Error:', error);
        return `<p style="color:#ff6b6b;">Takvim yüklenirken hata: ${error.message}</p>`;
    }
}

// --- GERİ SAYIM FONKSİYONU ---
function startCountdowns() {
    document.querySelectorAll('.next-race-countdown').forEach(el => {
        const targetDate = new Date(el.dataset.raceDate);
        if (isNaN(targetDate)) return;

        function update() {
            const now = new Date();
            const diff = targetDate - now;

            if (diff <= 0) {
                el.innerHTML = '<span class="countdown-finished">🏁 RACE DAY!</span>';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const pad = n => String(n).padStart(2, '0');

            el.innerHTML = `
                <span class="countdown-days">${pad(days)}</span>g
                <span class="countdown-hours">${pad(hours)}</span>h
                <span class="countdown-minutes">${pad(minutes)}</span>m
                <span class="countdown-seconds">${pad(seconds)}</span>s
            `;
        }

        update();
        setInterval(update, 1000);
    });
}

// Global'e ekle
window.loadPage1 = loadPage1;
window.startCountdowns = startCountdowns;
window.getCircuitImage = getCircuitImage;