/* ============================================
   YARIŞ DETAY SAYFASI (Sekmeli: Sıralama, Sprint, Yarış)
   ============================================ */

async function loadRaceDetailPage(year, round) {
    showLoading(`${year} Round ${round} detayları yükleniyor...`);
    try {
        const data = await fetchRaceDetails(year, round);
        if (!data) {
            showError('Yarış detayı alınamadı.');
            return;
        }

        const { race, results, qualifying, sprint } = data;

        // Ana sayfa içeriğini tamamen değiştir
        DOM.mainContent.innerHTML = `
            <div class="page-header">
                <h1><i class="fas fa-flag-checkered"></i> ${race.raceName || `Round ${round}`}</h1>
                <button class="sync-btn" onclick="loadPage(1)" style="background:transparent; border:1px solid var(--border-subtle); color:var(--text-secondary); padding:0.4rem 1.2rem;">
                    <i class="fas fa-arrow-left"></i> Takvime Dön
                </button>
            </div>
            <div class="standings-box" style="padding-bottom:1rem;">
                <div class="detail-tabs" id="detailTabs">
                    <button class="detail-tab active" data-tab="qualifying">Sıralama</button>
                    ${sprint && sprint.length ? `<button class="detail-tab" data-tab="sprint">Sprint</button>` : ''}
                    <button class="detail-tab" data-tab="race">Yarış</button>
                </div>
                <div id="detailContent">
                    <!-- İçerik buraya gelecek -->
                </div>
            </div>
        `;

        // Sekme tıklama olaylarını bağla
        document.querySelectorAll('#detailTabs .detail-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('#detailTabs .detail-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const tabName = this.dataset.tab;
                renderDetailTab(tabName, { race, results, qualifying, sprint });
            });
        });

        // İlk sekmeyi göster (qualifying)
        renderDetailTab('qualifying', { race, results, qualifying, sprint });

        setStatus('Detay yüklendi', 'success');
    } catch (e) {
        showError(`Detay hatası: ${e.message}`);
    }
}

function renderDetailTab(tabName, data) {
    const container = document.getElementById('detailContent');
    if (!container) return;

    const { race, results, qualifying, sprint } = data;

    if (tabName === 'qualifying') {
        if (!qualifying || qualifying.length === 0) {
            container.innerHTML = `<p style="color:#888;">Sıralama verisi yok.</p>`;
            return;
        }
        const sorted = [...qualifying].sort((a,b) => (parseInt(a.position)||999) - (parseInt(b.position)||999));
        container.innerHTML = `
            <h4 style="color:#888;margin-bottom:0.5rem;">Sıralama Turları</h4>
            ${tableWrap(`
                <thead>
                    <tr><th>Poz</th><th>Sürücü</th><th>Takım</th><th>Q1</th><th>Q2</th><th>Q3</th></tr>
                </thead>
                <tbody>
                    ${sorted.map(q => `
                        <tr>
                            <td class="pos">${q.position || '-'}</td>
                            <td>${q.Driver?.givenName || ''} ${q.Driver?.familyName || ''}</td>
                            <td>${q.Constructor?.name || '-'}</td>
                            <td>${q.Q1 || '-'}</td>
                            <td>${q.Q2 || '-'}</td>
                            <td>${q.Q3 || '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `)}
        `;
    } else if (tabName === 'sprint') {
        if (!sprint || sprint.length === 0) {
            container.innerHTML = `<p style="color:#888;">Sprint verisi yok.</p>`;
            return;
        }
        const sorted = [...sprint].sort((a,b) => (parseInt(a.position)||999) - (parseInt(b.position)||999));
        container.innerHTML = `
            <h4 style="color:#888;margin-bottom:0.5rem;">Sprint Sonuçları</h4>
            ${tableWrap(`
                <thead>
                    <tr><th>Poz</th><th>Sürücü</th><th>Takım</th><th>Tur</th><th>Puan</th></tr>
                </thead>
                <tbody>
                    ${sorted.map(s => `
                        <tr>
                            <td class="pos">${s.position || '-'}</td>
                            <td>${s.Driver?.givenName || ''} ${s.Driver?.familyName || ''}</td>
                            <td>${s.Constructor?.name || '-'}</td>
                            <td>${s.laps || '-'}</td>
                            <td>${s.points || 0}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `)}
        `;
    } else if (tabName === 'race') {
        if (!results || results.length === 0) {
            container.innerHTML = `<p style="color:#888;">Yarış sonucu verisi yok.</p>`;
            return;
        }
        const sorted = [...results].sort((a,b) => (parseInt(a.position)||999) - (parseInt(b.position)||999));
        container.innerHTML = `
            <h4 style="color:#888;margin-bottom:0.5rem;">Yarış Sonuçları</h4>
            ${tableWrap(`
                <thead>
                    <tr><th>Poz</th><th>Sürücü</th><th>Takım</th><th>Tur</th><th>Puan</th><th>Durum</th></tr>
                </thead>
                <tbody>
                    ${sorted.map(r => `
                        <tr>
                            <td class="pos">${r.position || '-'}</td>
                            <td>${r.Driver?.givenName || ''} ${r.Driver?.familyName || ''}</td>
                            <td>${r.Constructor?.name || '-'}</td>
                            <td>${r.laps || '-'}</td>
                            <td>${r.points || 0}</td>
                            <td>${r.status || '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `)}
        `;
    }
}

// Global'e ekle (page1.js'den çağırmak için)
window.loadRaceDetailPage = loadRaceDetailPage;