/* ============================================
   API YAPILANDIRMASI
   ============================================ */
const API = {
    // Genel
    seasons: 'https://api.jolpi.ca/ergast/f1/seasons',
    circuits: 'https://api.jolpi.ca/ergast/f1/circuits',
    status: 'https://api.jolpi.ca/ergast/f1/status',
    
    // Sezon bazlı
    races: y => `https://api.jolpi.ca/ergast/f1/${y}/races`,
    drivers: y => `https://api.jolpi.ca/ergast/f1/${y}/drivers`,
    constructors: y => `https://api.jolpi.ca/ergast/f1/${y}/constructors`,
    
    // Sonuçlar
    results: y => `https://api.jolpi.ca/ergast/f1/${y}/results`,
    raceResults: (y, r) => `https://api.jolpi.ca/ergast/f1/${y}/${r}/results`,
    
    // Sprint
    sprint: y => `https://api.jolpi.ca/ergast/f1/${y}/sprint`,
    raceSprint: (y, r) => `https://api.jolpi.ca/ergast/f1/${y}/${r}/sprint`,
    
    // Qualifying
    qualifying: y => `https://api.jolpi.ca/ergast/f1/${y}/qualifying`,
    raceQualifying: (y, r) => `https://api.jolpi.ca/ergast/f1/${y}/${r}/qualifying`,
    
    // Detay
    pitstops: (y, r) => `https://api.jolpi.ca/ergast/f1/${y}/${r}/pitstops`,
    laps: (y, r) => `https://api.jolpi.ca/ergast/f1/${y}/${r}/laps`,
    
    // Sıralamalar - DÜZELTİLDİ
    driverStandings: y => `https://api.jolpi.ca/ergast/f1/${y}/driverstandings`,
    constructorStandings: y => `https://api.jolpi.ca/ergast/f1/${y}/constructorstandings`
};

/* ============================================
   API FONKSİYONLARI
   ============================================ */
async function apiFetch(url) {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`API hatası (${res.status})`);
    return res.json();
}

async function fetchAllPages(url, extractItems) {
    const all = [];
    let offset = 0;
    const limit = 30;
    
    while (true) {
        const sep = url.includes('?') ? '&' : '?';
        const data = await apiFetch(`${url}${sep}limit=${limit}&offset=${offset}`);
        const items = extractItems(data) || [];
        all.push(...items);
        
        const total = parseInt(data?.MRData?.total || '0', 10);
        offset += limit;
        if (offset >= total || !items.length) break;
    }
    return all;
}

async function fetchRaceTable(url) {
    const map = new Map();
    let offset = 0;
    const limit = 30;
    
    while (true) {
        const data = await apiFetch(`${url}?limit=${limit}&offset=${offset}`);
        const races = data?.MRData?.RaceTable?.Races || [];
        
        for (const race of races) {
            const key = race.round;
            if (!map.has(key)) {
                map.set(key, { ...race });
            } else {
                const ex = map.get(key);
                ['Results', 'QualifyingResults', 'SprintResults', 'PitStops', 'Laps'].forEach(k => {
                    if (race[k]?.length) ex[k] = race[k];
                });
            }
        }
        
        const total = parseInt(data?.MRData?.total || '0', 10);
        offset += limit;
        if (offset >= total || !races.length) break;
    }
    return [...map.values()].sort((a, b) => a.round - b.round);
}