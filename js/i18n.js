const translations = {
    es: {
        'nav.home': 'Inicio',
        'nav.ships': 'Naves',
        'nav.components': 'Componentes',
        'nav.enemies': 'Enemigos',
        'nav.systems': 'Sistemas',
        'nav.missions': 'Misiones',
        'nav.misc': 'Misc Info',
        'nav.calculator': 'Calculadora',
        'nav.forum': 'Foro',
        'nav.news': 'Noticias',
        'nav.compare': 'Comparar',
        'auth.login': 'Iniciar sesión',
        'auth.register': 'Registrarse',
        'auth.logout': 'Cerrar sesión',
        'profile.myprofile': 'Mi Perfil',
        'profile.collection': 'Mi Colección',
        'profile.favorites': 'Favoritos',
        'profile.settings': 'Configuración',
        'profile.admin': 'Panel Admin'
    },
    en: {
        'nav.home': 'Home',
        'nav.ships': 'Ships',
        'nav.components': 'Components',
        'nav.enemies': 'Enemies',
        'nav.systems': 'Systems',
        'nav.missions': 'Missions',
        'nav.misc': 'Misc Info',
        'nav.calculator': 'Calculator',
        'nav.forum': 'Forum',
        'nav.news': 'News',
        'nav.compare': 'Compare',
        'auth.login': 'Log in',
        'auth.register': 'Sign up',
        'auth.logout': 'Log out',
        'profile.myprofile': 'My Profile',
        'profile.collection': 'My Collection',
        'profile.favorites': 'Favorites',
        'profile.settings': 'Settings',
        'profile.admin': 'Admin Panel'
    }
};

let currentLang = localStorage.getItem('appLang') || 'es';

window.setLanguage = function(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('appLang', lang);
    applyTranslations();
    updateLangToggleUI();
};

window.toggleLanguage = function() {
    const newLang = currentLang === 'es' ? 'en' : 'es';
    window.setLanguage(newLang);
};

function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            // Keep icons if they exist
            const icon = el.querySelector('i');
            if (icon) {
                el.innerHTML = '';
                el.appendChild(icon);
                el.appendChild(document.createTextNode(' ' + translations[currentLang][key]));
            } else {
                el.textContent = translations[currentLang][key];
            }
        }
    });

    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[currentLang] && translations[currentLang][key]) {
             el.placeholder = translations[currentLang][key];
        }
    });
}

function updateLangToggleUI() {
    const toggleBtn = document.getElementById('langToggleText');
    if (toggleBtn) {
        toggleBtn.textContent = currentLang.toUpperCase();
    }
}

// Initialise format once DOM is loaded contextually
window.addEventListener('DOMContentLoaded', () => {
    // Delay slightly to wait for DOM injections from header-auth
    setTimeout(() => {
        applyTranslations();
        updateLangToggleUI();
    }, 100);
});
