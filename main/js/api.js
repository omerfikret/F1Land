/* ============================================
   API - JOLPICA (1980 ve sonrası)
   ============================================ */

const API = {
    base: 'https://api.jolpi.ca/ergast/f1',
    
    seasons: () => `${API.base}/seasons`,
    circuits: () => `${API.base}/circuits`,
    status: () => `${API.base}/status`,
    
    races: (year) => `${API.base}/${year}/races`,
    drivers: (year) => `${API.base}/${year}/drivers`,
    constructors: (year) => `${API.base}/${year}/constructors`,
    results: (year) => `${API.base}/${year}/results`,
    qualifying: (year) => `${API.base}/${year}/qualifying`,
    sprint: (year) => `${API.base}/${year}/sprint`,
    driverStandings: (year) => `${API.base}/${year}/driverstandings`,
    constructorStandings: (year) => `${API.base}/${year}/constructorstandings`,
    
    raceResults: (year, round) => `${API.base}/${year}/${round}/results`,
    raceQualifying: (year, round) => `${API.base}/${year}/${round}/qualifying`,
    raceSprint: (year, round) => `${API.base}/${year}/${round}/sprint`,
    pitstops: (year, round) => `${API.base}/${year}/${round}/pitstops`,
    laps: (year, round) => `${API.base}/${year}/${round}/laps`,
};

async function apiFetch(url) {
    try {
        console.log('📡 API isteği:', url);
        const res = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    } catch (error) {
        console.error('❌ API Fetch Error:', error);
        throw error;
    }
}

async function fetchAllPages(url, extractItems) {
    const all = [];
    let offset = 0;
    const limit = 30;
    try {
        while (true) {
            const sep = url.includes('?') ? '&' : '?';
            const data = await apiFetch(`${url}${sep}limit=${limit}&offset=${offset}`);
            const items = extractItems ? extractItems(data) : [];
            all.push(...items);
            const total = parseInt(data?.MRData?.total || '0', 10);
            offset += limit;
            if (offset >= total || !items.length) break;
        }
        return all;
    } catch (error) {
        console.error('fetchAllPages Error:', error);
        throw error;
    }
}

// ========== SEZONLAR (TÜMÜ, 1980+) ==========
async function fetchSeasons() {
    try {
        const seasons = await fetchAllPages(
            API.seasons(),
            d => d.MRData.SeasonTable.Seasons
        );
        const years = seasons
            .map(s => parseInt(s.season))
            .filter(y => !isNaN(y) && y >= 1980)
            .sort((a, b) => b - a);
        console.log('📅 1980+ sezonlar:', years);
        return years.length ? years : [2024, 2023, 2022];
    } catch (error) {
        console.error('fetchSeasons Error:', error);
        return [2024, 2023, 2022];
    }
}

// ========== YARIŞLAR ==========
async function fetchRaces(year) {
    try {
        const races = await fetchAllPages(API.races(year), d => d.MRData.RaceTable.Races);
        return races.map((r, i) => ({
            round: parseInt(r.round) || i + 1,
            raceName: r.raceName || `Grand Prix ${r.round}`,
            circuitName: r.Circuit?.circuitName || 'Bilinmiyor',
            country: r.Circuit?.Location?.country || 'Bilinmiyor',
            date: r.date || null,
            meetingKey: r.round,
            hasSprint: r.Sprint || false,
            Circuit: {
                circuitName: r.Circuit?.circuitName || 'Bilinmiyor',
                Location: {
                    country: r.Circuit?.Location?.country || 'Bilinmiyor',
                    locality: r.Circuit?.Location?.locality || 'Bilinmiyor'
                }
            }
        }));
    } catch (error) {
        console.error('fetchRaces Error:', error);
        return [];
    }
}

// ========== SÜRÜCÜLER ==========
async function fetchDrivers(year) {
    try {
        const drivers = await fetchAllPages(API.drivers(year), d => d.MRData.DriverTable.Drivers);
        return drivers.map(d => ({
            full_name: `${d.givenName || ''} ${d.familyName || ''}`.trim() || d.driverId || 'Bilinmiyor',
            driver_number: d.permanentNumber || '-',
            country_code: d.nationality || '',
            team_name: '',
            driverId: d.driverId
        }));
    } catch (error) {
        console.error('fetchDrivers Error:', error);
        return [];
    }
}

// ========== TAKIMLAR ==========
async function fetchConstructors(year) {
    try {
        const constructors = await fetchAllPages(API.constructors(year), d => d.MRData.ConstructorTable.Constructors);
        return constructors.map(c => ({
            name: c.name || c.constructorId || 'Bilinmiyor',
            nationality: c.nationality || '',
            constructorId: c.constructorId
        }));
    } catch (error) {
        console.error('fetchConstructors Error:', error);
        return [];
    }
}

// ========== SONUÇLAR (tüm yarışların sonuçları) ==========
async function fetchResults(year) {
    try {
        const races = await fetchAllPages(API.results(year), d => d.MRData.RaceTable.Races);
        return races;
    } catch (error) {
        console.error('fetchResults Error:', error);
        return [];
    }
}

// ========== SIRALAMALAR ==========
async function fetchStandings(year, type = 'driver') {
    try {
        const url = type === 'driver' ? API.driverStandings(year) : API.constructorStandings(year);
        const data = await apiFetch(url);
        const list = data?.MRData?.StandingsTable?.StandingsLists?.[0];
        return type === 'driver' ? list?.DriverStandings || [] : list?.ConstructorStandings || [];
    } catch (error) {
        console.error('fetchStandings Error:', error);
        return [];
    }
}

// ========== QUALIFYING ==========
async function fetchQualifying(year) {
    try {
        const qualifying = await fetchAllPages(API.qualifying(year), d => d.MRData.RaceTable.Races);
        return qualifying;
    } catch (error) {
        console.error('fetchQualifying Error:', error);
        return [];
    }
}

// ========== SPRINT ==========
async function fetchSprint(year) {
    try {
        const sprint = await fetchAllPages(API.sprint(year), d => d.MRData.RaceTable.Races);
        return sprint;
    } catch (error) {
        console.error('fetchSprint Error:', error);
        return [];
    }
}

// ========== YARIŞ DETAYI ==========
async function fetchRaceDetails(year, round) {
    try {
        const [results, qualifying, sprint, pitstops, laps] = await Promise.all([
            apiFetch(API.raceResults(year, round)).catch(() => null),
            apiFetch(API.raceQualifying(year, round)).catch(() => null),
            apiFetch(API.raceSprint(year, round)).catch(() => null),
            apiFetch(API.pitstops(year, round)).catch(() => null),
            apiFetch(API.laps(year, round)).catch(() => null)
        ]);
        const race = results?.MRData?.RaceTable?.Races?.[0] 
            || qualifying?.MRData?.RaceTable?.Races?.[0] 
            || { raceName: `Round ${round}` };
        return {
            race,
            results: race.Results || [],
            qualifying: qualifying?.MRData?.RaceTable?.Races?.[0]?.QualifyingResults || [],
            sprint: sprint?.MRData?.RaceTable?.Races?.[0]?.SprintResults || [],
            pitstops: pitstops?.MRData?.RaceTable?.Races?.[0]?.PitStops || [],
            laps: laps?.MRData?.RaceTable?.Races?.[0]?.Laps || []
        };
    } catch (error) {
        console.error('fetchRaceDetails Error:', error);
        return null;
    }
}

// ========== PİSTLER ==========
async function fetchCircuits() {
    try {
        const circuits = await fetchAllPages(API.circuits(), d => d.MRData.CircuitTable.Circuits);
        return circuits.map(c => ({
            circuitName: c.circuitName || 'Bilinmiyor',
            country: c.Location?.country || 'Bilinmiyor',
            locality: c.Location?.locality || 'Bilinmiyor'
        }));
    } catch (error) {
        console.error('fetchCircuits Error:', error);
        return [];
    }
}

// ========== DURUM KODLARI ==========
async function fetchStatus() {
    try {
        const statuses = await fetchAllPages(API.status(), d => d.MRData.StatusTable.Status);
        return statuses;
    } catch (error) {
        console.error('fetchStatus Error:', error);
        return [];
    }
}

// ========== GLOBAL ==========
window.API = API;
window.apiFetch = apiFetch;
window.fetchAllPages = fetchAllPages;
window.fetchSeasons = fetchSeasons;
window.fetchRaces = fetchRaces;
window.fetchDrivers = fetchDrivers;
window.fetchConstructors = fetchConstructors;
window.fetchResults = fetchResults;
window.fetchStandings = fetchStandings;
window.fetchQualifying = fetchQualifying;
window.fetchSprint = fetchSprint;
window.fetchRaceDetails = fetchRaceDetails;
window.fetchCircuits = fetchCircuits;
window.fetchStatus = fetchStatus;

console.log('✅ api.js (Jolpica) yüklendi!');