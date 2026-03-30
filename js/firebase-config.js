// ==========================================
// 🔥 CONFIGURACIÓN GLOBAL DE FIREBASE
// ==========================================
// Este archivo centraliza la configuración de Firebase
// para que no tengas que repetirla en cada página

const firebaseConfig = {
    apiKey: "AIzaSyBNxrvFcQSfd1Z4VarqrzrPXftaBxwKZ9o",
    authDomain: "piratewyki.firebaseapp.com",
    projectId: "piratewyki",
    storageBucket: "piratewyki.firebasestorage.app",
    messagingSenderId: "501878813096",
    appId: "1:501878813096:web:177f9460b3976f2ffb6d9d",
    measurementId: "G-6J1C57D842"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Referencias globales (todas las páginas usan auth y db desde aquí)
window.auth = firebase.auth();
window.db = firebase.firestore();

// Funciones útiles compartidas
function showAlert(alertId, message) {
    const alert = document.getElementById(alertId);
    if (alert) {
        alert.textContent = message;
        alert.style.display = 'block';
        setTimeout(() => {
            alert.style.display = 'none';
        }, 5000);
    }
}

function setLoading(buttonId, isLoading, originalText, loadingText) {
    const button = document.getElementById(buttonId);
    if (button) {
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = `<span class="loading-spinner"></span>${loadingText}`;
        } else {
            button.disabled = false;
            button.innerHTML = originalText;
        }
    }
}

console.log('✅ Firebase configurado correctamente');