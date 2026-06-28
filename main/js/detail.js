/* ============================================
   YARIŞ DETAYI - pole, sprint, sonuçlar
   ============================================ */

async function showRaceDetail(year, round) {
    const container = document.getElementById('raceDetailContainer');
    if (!container) return;
    container.innerHTML = `<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Yarış detayı yükleniyor...</div>`;

    try {
        const data = await fetchRaceDetails(year, round);
        if (!data) {
            container.innerHTML = `<p style="color:#888;">Bu yarış için veri bulunamadı.</p>`;
            return;
        }

        const { race, results, qualifying, sprint, pitstops } = data;

        // Pole sürücüsü
        let poleText = '-';
        if (qualifying && qualifying.length > 0) {
            const pole = qualifying[0];
            poleText = `${pole.Driver?.givenName || ''} ${pole.Driver?.familyName || ''} (${pole.Constructor?.name || ''})`;
        }

        // Sprint kazananı
        let sprintText = '';
        if (sprint && sprint.length > 0) {
            const winner = sprint[0];
            sprintText = `${winner.Driver?.givenName || ''} ${winner.Driver?.familyName || ''} (${winner.Constructor?.name || ''})`;
        }

        // Sonuçları sırala
        const sortedResults = [...results].sort((a, b) => (parseInt(a.position) || 999) - (parseInt(b.position) || 999));

        container.innerHTML = `
            <div class="race-detail">
                <h3 style="color:#e60000;margin-bottom:1rem;">
                    <i class="fas fa-flag-checkered"></i> ${race.raceName || 'Yarış'} — Detay
                </h3>
                <div style="display:flex; gap:2rem; flex-wrap:wrap; margin-bottom:1rem;">
                    <div><strong>🏁 Pole:</strong> ${poleText}</div>
                    <div><strong>⚡ Sprint Kazananı:</strong> ${sprintText}</div>
                </div>

                ${sortedResults.length ? `
                    <h4 style="color:#888;margin-bottom:.5rem;">🏁 Sonuçlar</h4>
                    ${tableWrap(`
                        <thead>
                            <tr>
                                <th>Poz</th><th>Sürücü</th>
                                <th>Takım</th><th>Tur</th><th>Puan</th>
                            </tr>
                        </thead>
                        <tbody>${sortedResults.slice(0, 20).map(r => `
                            <tr>
                                <td class="pos">${r.position || '-'}</td>
                                <td>${r.Driver?.givenName || ''} ${r.Driver?.familyName || ''}</td>
                                <td>${r.Constructor?.name || '-'}</td>
                                <td>${r.laps || '-'}</td>
                                <td>${r.points || 0}</td>
                            </tr>
                        `).join('')}</tbody>
                    `)}
                ` : '<p style="color:#888;">Sonuç verisi yok.</p>'}

                ${pitstops.length ? `
                    <h4 style="color:#888;margin:1.5rem 0 .5rem;">⛽ Pit Stop</h4>
                    ${tableWrap(`
                        <thead>
                            <tr><th>Sürücü</th><th>Stop</th><th>Tur</th><th>Süre</th></tr>
                        </thead>
                        <tbody>${pitstops.slice(0, 20).map(p => `
                            <tr>
                                <td>${p.driverId || '-'}</td>
                                <td>${p.stop || '-'}</td>
                                <td>${p.lap || '-'}</td>
                                <td>${p.duration || '-'}s</td>
                            </tr>
                        `).join('')}</tbody>
                    `)}
                ` : ''}
            </div>`;

        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (e) {
        container.innerHTML = `<p style="color:#cc0000;">Detay hatası: ${e.message}</p>`;
    }
}