/* ============================================
   UYGULAMA BAŞLATICI
   ============================================ */
(async function init() {
    try {
        setStatus('API bağlanıyor...', 'loading');
        await loadSeasons();
        loadPage(1);
    } catch (e) {
        showError(e.message);
        setStatus('Bağlantı hatası', 'error');
    }
})();