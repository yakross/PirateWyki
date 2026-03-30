/**
 * Tema (claro/oscuro) y sesión para el header compartido.
 * Requiere: themeIcon, authButtons, userProfile, userName, userFleet, userRoleBadge, adminMenuItem
 * y que window.auth y window.db estén definidos (firebase-config.js).
 */
function loadTheme() {
    var saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    var icon = document.getElementById('themeIcon');
    if (icon) icon.className = saved === 'light' ? 'fas fa-sun theme-icon' : 'fas fa-moon theme-icon';
}

function toggleTheme() {
    var html = document.documentElement;
    var current = html.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    var icon = document.getElementById('themeIcon');
    if (icon) icon.className = next === 'light' ? 'fas fa-sun theme-icon' : 'fas fa-moon theme-icon';
}

function checkSession() {
    if (!window.auth || !window.db) return;
    var authButtons = document.getElementById('authButtons');
    var userProfile = document.getElementById('userProfile');
    if (!authButtons || !userProfile) return;
    authButtons.style.display = 'none';
    userProfile.style.display = 'none';
    window.auth.onAuthStateChanged(function(user) {
        if (user) {
            authButtons.style.display = 'none';
            userProfile.style.display = 'block';
            var nameEl = document.getElementById('userName');
            var fleetEl = document.getElementById('userFleet');
            var badgeEl = document.getElementById('userRoleBadge');
            var adminEl = document.getElementById('adminMenuItem');
            if (nameEl) nameEl.textContent = user.email || 'Usuario';
            if (fleetEl) fleetEl.textContent = 'Sin Flota';
            if (badgeEl) badgeEl.style.display = 'none';
            if (adminEl) adminEl.style.display = 'none';
            var avatarEl = document.querySelector('.user-avatar');
            if (avatarEl) {
                if (user.photoURL) { avatarEl.innerHTML = '<img src="' + user.photoURL.replace(/"/g, '&quot;') + '" alt="">'; avatarEl.classList.add('has-img'); }
                else { avatarEl.innerHTML = '<i class="fas fa-user"></i>'; avatarEl.classList.remove('has-img'); }
            }
            window.db.collection('users').doc(user.uid).get().then(function(doc) {
                if (doc.exists) {
                    var d = doc.data();
                    if (nameEl) nameEl.textContent = d.username || user.email;
                    if (fleetEl) fleetEl.textContent = d.fleet || 'Sin Flota';
                    if (d.role === 'admin') {
                        if (badgeEl) badgeEl.style.display = 'inline-block';
                        if (adminEl) adminEl.style.display = 'block';
                    }
                    if (avatarEl && d.avatar) {
                        avatarEl.innerHTML = '<img src="' + d.avatar.replace(/"/g, '&quot;') + '" alt="">';
                        avatarEl.classList.add('has-img');
                    }
                }
            });
        } else {
            /* Pequeño retraso para que Firebase persista la sesión antes de mostrar "Iniciar sesión" */
            setTimeout(function() {
                if (!window.auth || !window.auth.currentUser) {
                    authButtons.style.display = 'flex';
                    userProfile.style.display = 'none';
                }
            }, 200);
        }
    });
}

function logout() {
    if (!window.auth) return;
    window.auth.signOut().then(function() { location.reload(); });
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('themeIcon')) loadTheme();
    if (document.getElementById('authButtons')) checkSession();

    // Dynamically load notifications.js
    var headerScript = document.querySelector('script[src*="header-auth.js"]');
    if (headerScript) {
        var basePath = headerScript.getAttribute('src').replace('js/header-auth.js', '').replace('header-auth.js', '');
        var notifScript = document.createElement('script');
        notifScript.src = basePath + 'js/notifications.js';
        document.body.appendChild(notifScript);

        var i18nScript = document.createElement('script');
        i18nScript.src = basePath + 'js/i18n.js';
        document.body.appendChild(i18nScript);

        // Inject language toggle next to themeToggle
        var themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle && !document.getElementById('langToggle')) {
            var langBtn = document.createElement('div');
            langBtn.id = 'langToggle';
            langBtn.className = 'theme-toggle';
            langBtn.style.marginLeft = '8px';
            langBtn.style.cursor = 'pointer';
            langBtn.onclick = function() {
                if (typeof window.toggleLanguage === 'function') window.toggleLanguage();
            };
            langBtn.innerHTML = '<span id="langToggleText" style="font-weight: bold; font-size: 13px;">ES</span>';
            themeToggle.parentNode.insertBefore(langBtn, themeToggle.nextSibling);
        }

        // Inject global search
        var userSection = document.querySelector('.user-section');
        if (userSection && !document.getElementById('globalNavSearch')) {
            var form = document.createElement('form');
            form.id = 'globalNavSearch';
            form.action = basePath + 'pages/search.html';
            form.method = 'get';
            form.style.display = 'flex';
            form.style.alignItems = 'center';
            form.style.marginRight = '8px';
            
            var input = document.createElement('input');
            input.type = 'search';
            input.name = 'q';
            input.placeholder = 'Buscar...';
            input.style.cssText = 'padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 13px; width: 140px; outline: none; transition: all 0.2s;';
            input.onfocus = function() { this.style.borderColor = 'var(--accent)'; this.style.width = '180px'; };
            input.onblur = function() { this.style.borderColor = 'var(--border-color)'; this.style.width = '140px'; };
            
            var btn = document.createElement('button');
            btn.type = 'submit';
            btn.innerHTML = '<i class="fas fa-search"></i>';
            btn.style.cssText = 'background: transparent; border: none; color: var(--text-secondary); cursor: pointer; margin-left: -28px;';
            
            form.appendChild(input);
            form.appendChild(btn);
            userSection.insertBefore(form, userSection.firstChild);
        }
    }
});
