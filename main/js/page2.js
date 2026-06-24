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
                <!-- api-source kaldırıldı -->
            </div>
            <div class="page-tabs">${renderPageTabs(tabs, tab)}</div>
            <div class="content-card">
                <h2><i class="fas fa-list"></i> ${tabs.find(t => t.id === tab).label}</h2>
                ${body}
            </div>`;
        bindPageTabs(2, tabs, loadPage2);
        setStatus(`${selectedYear} yarış verileri yüklendi`, 'success');
    } catch (e) {
        showError(e.message);
    }
}

// ---------- ALT FONKSİYONLAR ----------
async function renderStandings() {
    try {
        const [drivers, constructors] = await Promise.all([
            fetchStandings(selectedYear, 'driver'),
            fetchStandings(selectedYear, 'constructor')
        ]);
        let html = '';
        if (drivers && drivers.length) {
            html += `
                <h3 style="color:#e60000;margin-bottom:.8rem;">
                    <i class="fas fa-user"></i> Sürücü Sıralaması
                </h3>
                <ul>${drivers.map(d => `
                    <li>
                        <span class="pos" style="width:28px;">${d.position || '-'}</span>
                        <strong>${d.Driver?.givenName || ''} ${d.Driver?.familyName || ''}</strong>
                        <span style="color:#888;">${d.Constructors?.[0]?.name || ''}</span>
                        <span style="margin-left:auto;color:#e60000;font-weight:600;">${d.points || 0} puan</span>
                        <span style="color:#888;">🏆 ${d.wins || 0}</span>
                    </li>
                `).join('')}</ul>`;
        }
        if (constructors && constructors.length) {
            html += `
                <h3 style="color:#e60000;margin:1.5rem 0 .8rem;">
                    <i class="fas fa-flag"></i> Takım Sıralaması
                </h3>
                <ul>${constructors.map(c => `
                    <li>
                        <span class="pos" style="width:28px;">${c.position || '-'}</span>
                        <strong>${c.Constructor?.name || ''}</strong>
                        <span style="margin-left:auto;color:#e60000;font-weight:600;">${c.points || 0} puan</span>
                        <span style="color:#888;">🏆 ${c.wins || 0}</span>
                    </li>
                `).join('')}</ul>`;
        }
        if (!html) html = '<p style="color:#888;">Henüz sıralama verisi yok.</p>';
        return html;
    } catch (error) {
        console.error('renderStandings Error:', error);
        return `<p style="color:#ff6b6b;">Hata: ${error.message}</p>`;
    }
}

async function renderRaceCalendar() {
    try {
        const races = await fetchRaces(selectedYear);
        if (!races.length) return '<p>Yarış takvimi yok.</p>';
        let html = `<div id="raceList">`;
        races.forEach(r => {
            html += `<div class="race-item" data-round="${r.round}">
                <span><i class="fas fa-flag"></i> <strong>${r.round}. — ${r.raceName}</strong></span>
                <span>${r.circuitName}</span>
                <span>${formatDate(r.date)}</span>
            </div>`;
        });
        html += `</div><div id="raceDetailContainer"></div>`;
        setTimeout(() => {
            document.querySelectorAll('.race-item').forEach(el => {
                el.addEventListener('click', () => showRaceDetail(selectedYear, el.dataset.round));
            });
        }, 0);
        return html;
    } catch (error) {
        return `<p>Hata: ${error.message}</p>`;
    }
}