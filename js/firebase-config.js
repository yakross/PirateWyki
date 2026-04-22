// ==========================================
// 🔥 CONFIGURACIÓN GLOBAL DE FIREBASE
// ==========================================

const firebaseConfig = {
    apiKey:            "AIzaSyBNxrvFcQSfd1Z4VarqrzrPXftaBxwKZ9o",
    authDomain:        "piratewyki.firebaseapp.com",
    projectId:         "piratewyki",
    storageBucket:     "piratewyki.firebasestorage.app",
    messagingSenderId: "501878813096",
    appId:             "1:501878813096:web:177f9460b3976f2ffb6d9d",
    measurementId:     "G-6J1C57D842"
};

firebase.initializeApp(firebaseConfig);

window.auth = firebase.auth();
window.db   = firebase.firestore();

// ── Persistencia de sesión (mantiene al usuario logueado al cerrar el navegador) ──
window.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(() => {});

// ── Utilidades compartidas ──────────────────────────────────
function showAlert(alertId, message) {
    const el = document.getElementById(alertId);
    if (!el) return;
    el.textContent = message;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 5000);
}

function setLoading(buttonId, isLoading, originalText, loadingText) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    btn.disabled = isLoading;
    btn.innerHTML = isLoading
        ? `<span class="loading-spinner"></span>${loadingText}`
        : originalText;
}

// ── Formatear fecha relativa ────────────────────────────────
function gwTimeAgo(date) {
    if (!date) return '';
    const d    = date.toDate ? date.toDate() : new Date(date);
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 60)    return 'hace unos segundos';
    if (diff < 3600)  return 'hace ' + Math.floor(diff / 60) + ' min';
    if (diff < 86400) return 'hace ' + Math.floor(diff / 3600) + ' h';
    if (diff < 604800) return 'hace ' + Math.floor(diff / 86400) + ' días';
    return d.toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });
}
window.gwTimeAgo = gwTimeAgo;

console.log('✅ Firebase configurado — proyecto: piratewyki');