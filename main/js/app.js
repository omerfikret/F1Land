document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 App başlatılıyor...');
    try {
        setStatus('Veriler yükleniyor...', 'loading');
        if (typeof window.loadSeasons === 'function') {
            await window.loadSeasons();
        } else if (typeof loadSeasons === 'function') {
            await loadSeasons();
        } else {
            throw new Error('loadSeasons fonksiyonu bulunamadı!');
        }
        if (typeof window.loadPage === 'function') {
            window.loadPage(1);
        } else if (typeof loadPage === 'function') {
            loadPage(1);
        } else {
            throw new Error('loadPage fonksiyonu bulunamadı!');
        }
        console.log('✅ Uygulama başarıyla başlatıldı.');
        setStatus('Hazır', 'success');
    } catch (e) {
        console.error('❌ Init Error:', e);
        showError(`Uygulama başlatılamadı: ${e.message}`);
        setStatus('Bağlantı hatası', 'error');
    }
});
window.addEventListener('error', function(e) {
    console.error('⚠️ Global hata:', e.message);
});