/**
 * GalaxWiki — header-auth.js v2
 * Tema, sesión, perfil animado, botones compactos, buscador, i18n.
 */

// ── Tema ──────────────────────────────────────────────────────
function loadTheme() {
    var saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    var icon = document.getElementById('themeIcon');
    if (icon) icon.className = saved === 'light' ? 'fas fa-sun theme-icon' : 'fas fa-moon theme-icon';
}
function toggleTheme() {
    var html    = document.documentElement;
    var current = html.getAttribute('data-theme');
    var next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    var icon = document.getElementById('themeIcon');
    if (icon) icon.className = next === 'light' ? 'fas fa-sun theme-icon' : 'fas fa-moon theme-icon';
}

// ── CSS del header mejorado ───────────────────────────────────
(function injectHeaderStyles() {
    if (document.getElementById('gw-header-styles')) return;
    var style = document.createElement('style');
    style.id = 'gw-header-styles';
    style.textContent = `
    /* ── Botones de auth compactos ─────────────────────────── */
    #authButtons {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .gw-auth-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 7px 14px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        white-space: nowrap;
    }
    .gw-btn-login {
        background: transparent;
        color: var(--text-secondary);
        border: 1px solid var(--border-color);
    }
    .gw-btn-login:hover {
        border-color: var(--accent);
        color: var(--accent);
        background: rgba(0,212,255,0.08);
    }
    .gw-btn-register {
        background: linear-gradient(135deg, #00d4ff, #a855f7);
        color: #fff;
        box-shadow: 0 2px 10px rgba(0,212,255,0.35);
    }
    .gw-btn-register:hover {
        opacity: 0.9;
        transform: translateY(-1px);
        box-shadow: 0 4px 16px rgba(0,212,255,0.45);
    }

    /* ── Contenedor del perfil ─────────────────────────────── */
    #userProfile .user-profile {
        position: relative;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 5px 12px 5px 5px;
        border-radius: 40px;
        border: 1px solid rgba(0,212,255,0.3);
        cursor: pointer;
        transition: all 0.25s ease;
        overflow: hidden;
    }
    #userProfile .user-profile::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg,
            rgba(0,212,255,0.06) 0%,
            rgba(118,75,162,0.04) 50%,
            rgba(0,212,255,0.06) 100%);
        background-size: 200% 100%;
        animation: gwHeaderShimmer 4s linear infinite;
        pointer-events: none;
    }
    @keyframes gwHeaderShimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
    #userProfile .user-profile:hover {
        border-color: rgba(0,212,255,0.6);
        box-shadow: 0 0 0 3px rgba(0,212,255,0.1);
    }

    /* ── Avatar con marco ──────────────────────────────────── */
    .gw-avatar-wrap {
        position: relative;
        width: 36px;
        height: 36px;
        flex-shrink: 0;
    }
    .gw-avatar-inner {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, rgba(0,212,255,0.4), rgba(118,75,162,0.4));
        font-size: 15px;
        color: white;
    }
    .gw-avatar-inner img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .gw-avatar-frame {
        position: absolute;
        inset: -4px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 2;
        object-fit: cover;
        width: calc(100% + 8px);
        height: calc(100% + 8px);
    }
    /* Marco animado (GIF) fallback */
    .gw-avatar-frame-anim {
        animation: gwFrameSpin 8s linear infinite;
    }
    @keyframes gwFrameSpin {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    /* ── Info de usuario (nombre + flota) ──────────────────── */
    .gw-user-info {
        display: flex;
        flex-direction: column;
        line-height: 1.2;
        position: relative;
        z-index: 1;
    }
    .gw-user-name {
        font-size: 13px;
        font-weight: 700;
        color: var(--text-primary);
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .gw-user-fleet {
        font-size: 10px;
        color: #00d4ff;
        font-weight: 500;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        opacity: 0.85;
    }
    .gw-user-badge {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: white;
        padding: 1px 6px;
        border-radius: 4px;
        display: none;
        width: fit-content;
    }

    /* ── Dropdown mejorado ─────────────────────────────────── */
    #userProfile .dropdown-menu {
        border-radius: 16px;
        border: 1px solid rgba(0,212,255,0.2);
        box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04);
        padding: 8px;
        min-width: 200px;
        margin-top: 8px !important;
        overflow: hidden;
    }

    /* Header del dropdown con fondo GIF/animado */
    .gw-dropdown-header {
        position: relative;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 6px;
        padding: 14px 14px 12px;
        min-height: 70px;
    }
    .gw-dropdown-bg {
        position: absolute;
        inset: 0;
        z-index: 0;
        object-fit: cover;
        width: 100%;
        height: 100%;
        opacity: 0.18;
        filter: saturate(1.5);
    }
    .gw-dropdown-bg-fallback {
        position: absolute;
        inset: 0;
        z-index: 0;
        background: linear-gradient(135deg,
            rgba(0,212,255,0.35) 0%,
            rgba(118,75,162,0.25) 50%,
            rgba(59,130,246,0.2) 100%);
        background-size: 300% 300%;
        animation: gwDropdownBg 6s ease infinite;
    }
    @keyframes gwDropdownBg {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    .gw-dropdown-header-content {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .gw-dropdown-avatar-wrap {
        position: relative;
        width: 44px;
        height: 44px;
        flex-shrink: 0;
    }
    .gw-dropdown-avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid rgba(255,255,255,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg,rgba(0,212,255,0.5),rgba(118,75,162,0.5));
        font-size: 18px;
        color: white;
    }
    .gw-dropdown-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .gw-dropdown-frame {
        position: absolute;
        inset: -5px;
        width: calc(100% + 10px);
        height: calc(100% + 10px);
        border-radius: 50%;
        pointer-events: none;
        z-index: 2;
        object-fit: cover;
    }
    .gw-dropdown-name {
        font-size: 14px;
        font-weight: 700;
        color: #fff;
        text-shadow: 0 1px 4px rgba(0,0,0,0.5);
    }
    .gw-dropdown-fleet {
        font-size: 11px;
        color: rgba(255,255,255,0.7);
        margin-top: 2px;
    }

    .gw-dropdown-divider { border-color: rgba(255,255,255,0.07); margin: 4px 0; }

    #userProfile .dropdown-item {
        border-radius: 8px;
        margin: 1px 0;
        padding: 9px 12px;
        font-size: 13.5px;
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--text-secondary);
        transition: all 0.15s;
    }
    #userProfile .dropdown-item i { width: 16px; text-align: center; opacity: 0.7; }
    #userProfile .dropdown-item:hover { background: rgba(0,212,255,0.12); color: var(--accent); transform: translateX(2px); }
    #userProfile .dropdown-item:hover i { opacity: 1; }
    #userProfile .dropdown-item.danger { color: #fca5a5; }
    #userProfile .dropdown-item.danger:hover { background: rgba(239,68,68,0.1); color: #f87171; transform: translateX(2px); }

    /* ── Chevron animado ───────────────────────────────────── */
    .gw-chevron {
        font-size: 10px;
        color: #00d4ff;
        transition: transform 0.2s ease;
        z-index: 1;
    }
    #userProfile .user-profile.show .gw-chevron,
    #userProfile .user-profile[aria-expanded="true"] .gw-chevron { transform: rotate(180deg); }
    `;
    document.head.appendChild(style);
})();

// ── Actualizar avatares (header + dropdown) ───────────────────
function _updateAllAvatars(src, framePath) {
    // Avatar pequeño del header
    var inner = document.querySelector('.gw-avatar-inner');
    if (inner) {
        inner.innerHTML = src
            ? '<img src="' + src.replace(/"/g,'&quot;') + '" alt="">'
            : '<i class="fas fa-user"></i>';
    }
    // Avatar grande del dropdown
    var dAvatar = document.querySelector('.gw-dropdown-avatar');
    if (dAvatar) {
        dAvatar.innerHTML = src
            ? '<img src="' + src.replace(/"/g,'&quot;') + '" alt="">'
            : '<i class="fas fa-user"></i>';
    }
    // Marcos
    ['gw-avatar-frame','gw-dropdown-frame'].forEach(function(cls) {
        var el = document.querySelector('.' + cls);
        if (!el) return;
        if (framePath) {
            el.src = framePath;
            el.style.display = 'block';
        } else {
            el.style.display = 'none';
        }
    });
}

// ── Construir el HTML del userProfile ────────────────────────
function _buildProfileHTML(basePath) {
    var up = document.getElementById('userProfile');
    if (!up) return;

    // Calcular ruta del fondo animado del dropdown
    // Puede ser un GIF en /assets/frames/bg-header.gif, o usamos el fallback CSS
    var bgGifPath = basePath + 'assets/frames/bg-header.gif';

    up.innerHTML = `
    <div class="user-profile dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" id="gwProfileToggle">
        <div class="gw-avatar-wrap">
            <div class="gw-avatar-inner"><i class="fas fa-user"></i></div>
            <img class="gw-avatar-frame" src="" alt="" style="display:none;" onerror="this.style.display='none'">
        </div>
        <div class="gw-user-info">
            <span class="gw-user-name" id="userName">Usuario</span>
            <span class="gw-user-fleet" id="userFleet" style="display:none;"></span>
            <span class="gw-user-badge" id="userRoleBadge">⚡ Admin</span>
        </div>
        <i class="fas fa-chevron-down gw-chevron"></i>
    </div>
    <ul class="dropdown-menu dropdown-menu-end" id="gwDropdownMenu">
        <!-- Header animado del dropdown -->
        <li>
            <div class="gw-dropdown-header">
                <div class="gw-dropdown-bg-fallback"></div>
                <img class="gw-dropdown-bg" src="${bgGifPath}" alt="" onerror="this.style.display='none'">
                <div class="gw-dropdown-header-content">
                    <div class="gw-dropdown-avatar-wrap">
                        <div class="gw-dropdown-avatar"><i class="fas fa-user"></i></div>
                        <img class="gw-dropdown-frame" src="" alt="" style="display:none;" onerror="this.style.display='none'">
                    </div>
                    <div>
                        <div class="gw-dropdown-name" id="ddUserName">Usuario</div>
                        <div class="gw-dropdown-fleet" id="ddUserFleet"></div>
                    </div>
                </div>
            </div>
        </li>
        <li><a class="dropdown-item" href="${basePath}pages/profile.html"><i class="fas fa-user"></i><span data-i18n="profile.myprofile">Mi Perfil</span></a></li>
        <li><a class="dropdown-item" href="${basePath}pages/wiki/tracker.html"><i class="fas fa-check-double"></i><span data-i18n="profile.collection">Mi Colección</span></a></li>
        <li><a class="dropdown-item" href="${basePath}pages/favorites.html"><i class="fas fa-star"></i><span data-i18n="profile.favorites">Favoritos</span></a></li>
        <li><a class="dropdown-item" href="${basePath}pages/settings.html"><i class="fas fa-cog"></i><span data-i18n="profile.settings">Configuración</span></a></li>
        <li><hr class="gw-dropdown-divider dropdown-divider"></li>
        <li id="adminMenuItem" style="display:none;"><a class="dropdown-item" href="${basePath}pages/admin/dashboard.html"><i class="fas fa-shield-alt"></i><span data-i18n="profile.admin">Panel Admin</span></a></li>
        <li><a class="dropdown-item danger" href="#" onclick="logout();return false;"><i class="fas fa-sign-out-alt"></i><span data-i18n="auth.logout">Cerrar sesión</span></a></li>
    </ul>`;
}

// ── Construir botones de auth compactos ───────────────────────
function _buildAuthButtons(basePath) {
    var ab = document.getElementById('authButtons');
    if (!ab) return;
    ab.innerHTML = `
        <a href="${basePath}login.html" class="gw-auth-btn gw-btn-login">
            <i class="fas fa-sign-in-alt"></i> <span data-i18n="auth.login">Entrar</span>
        </a>
        <a href="${basePath}register.html" class="gw-auth-btn gw-btn-register">
            <i class="fas fa-user-plus"></i> <span data-i18n="auth.register">Registro</span>
        </a>`;
}

// ── Sesión ────────────────────────────────────────────────────
function checkSession(basePath) {
    if (!window.auth || !window.db) return;
    var authButtons = document.getElementById('authButtons');
    var userProfile = document.getElementById('userProfile');
    if (!authButtons || !userProfile) return;

    authButtons.style.display = 'none';
    userProfile.style.display = 'none';

    // Construir HTML mejorado
    _buildAuthButtons(basePath);
    _buildProfileHTML(basePath);

    window.auth.onAuthStateChanged(function(user) {
        if (user) {
            authButtons.style.display = 'none';
            userProfile.style.display = 'block';

            // Valores iniciales
            _syncNames(user.displayName || user.email || 'Usuario', '');
            if (user.photoURL) _updateAllAvatars(user.photoURL, '');

            // Cargar datos reales desde Firestore
            window.db.collection('users').doc(user.uid).get().then(function(doc) {
                if (!doc.exists) return;
                var d = doc.data();
                var name  = d.username || user.displayName || user.email || 'Usuario';
                var fleet = d.fleet || '';
                _syncNames(name, fleet);

                // Admin badge
                var badgeEl = document.getElementById('userRoleBadge');
                var adminEl = document.getElementById('adminMenuItem');
                if (d.role === 'admin') {
                    if (badgeEl) badgeEl.style.display = 'block';
                    if (adminEl) adminEl.style.display = 'block';
                }

                // Avatar + marco
                var avatar = d.avatar || user.photoURL || '';
                var framePath = _resolveFrame(d, basePath);
                _updateAllAvatars(avatar, framePath);

            }).catch(function() {});

        } else {
            setTimeout(function() {
                if (!window.auth || !window.auth.currentUser) {
                    authButtons.style.display = 'flex';
                    userProfile.style.display = 'none';
                }
            }, 300);
        }
    });
}

function _syncNames(name, fleet) {
    var nameEls  = [document.getElementById('userName'), document.getElementById('ddUserName')];
    var fleetEls = [document.getElementById('userFleet'), document.getElementById('ddUserFleet')];
    nameEls.forEach(function(el) { if (el) el.textContent = name; });
    fleetEls.forEach(function(el) {
        if (!el) return;
        if (fleet) { el.textContent = '⚑ ' + fleet; el.style.display = ''; }
        else { el.textContent = ''; el.style.display = 'none'; }
    });
}

// ── Resolver ruta del marco ───────────────────────────────────
function _resolveFrame(userData, basePath) {
    if (!userData) return '';

    // Si profile-frames.js está cargado, usarlo
    if (typeof window.gwResolveFramePath === 'function') {
        var path = window.gwResolveFramePath(userData);
        // Ajustar ruta relativa según basePath
        return path ? path : '';
    }

    // Fallback simple
    var frameId = userData.profileFrame || '';
    if (!frameId || frameId === 'none') {
        if (userData.role === 'admin') return basePath + 'assets/frames/admin.png';
        return '';
    }
    return basePath + 'assets/frames/' + frameId + '.png';
}

// ── Cerrar sesión ─────────────────────────────────────────────
function logout() {
    if (!window.auth) return;
    window.auth.signOut().then(function() {
        window.location.href = window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
    });
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('themeIcon')) loadTheme();

    var headerScript = document.querySelector('script[src*="header-auth.js"]');
    var basePath = '';
    if (headerScript) {
        basePath = headerScript.getAttribute('src')
            .replace(/js\/header-auth\.js.*$/, '')
            .replace(/header-auth\.js.*$/, '');
    }

    if (document.getElementById('authButtons')) checkSession(basePath);

    // ── Notificaciones ─────────────────────────────────────
    if (headerScript) {
        var notifScript = document.createElement('script');
        notifScript.src = basePath + 'js/notifications.js';
        document.body.appendChild(notifScript);

        // ── i18n ────────────────────────────────────────────
        var i18nScript = document.createElement('script');
        i18nScript.src = basePath + 'js/i18n.js';
        document.body.appendChild(i18nScript);

        // ── Global Chat ────────────────────────────────────
        var chatCSS = document.createElement('link');
        chatCSS.rel = 'stylesheet';
        chatCSS.href = basePath + 'css/global-chat.css';
        document.head.appendChild(chatCSS);

        var chatScript = document.createElement('script');
        chatScript.src = basePath + 'js/global-chat.js';
        document.body.appendChild(chatScript);
    }

    // ── Selector de idioma con dropdown ────────────────────
    var themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle && !document.getElementById('langToggle')) {
        var langWrap      = document.createElement('div');
        langWrap.id       = 'langToggle';
        langWrap.className = 'gw-lang-selector';
        langWrap.style.cssText = 'position:relative;margin-left:4px;';

        // Botón principal
        var langBtn = document.createElement('div');
        langBtn.className = 'theme-toggle';
        langBtn.style.cssText = 'cursor:pointer;display:flex;align-items:center;gap:6px;user-select:none;';
        langBtn.innerHTML = '<span id="langToggleText" style="font-weight:700;font-size:12px;">🇪🇸 ES</span><i class="fas fa-chevron-down" style="font-size:8px;color:var(--text-tertiary);transition:transform 0.2s;"></i>';
        langBtn.onclick = function(e) {
            e.stopPropagation();
            var dd = document.getElementById('langDropdown');
            if (dd) {
                var isOpen = dd.style.display === 'block';
                dd.style.display = isOpen ? 'none' : 'block';
                langBtn.querySelector('i').style.transform = isOpen ? '' : 'rotate(180deg)';
            }
        };

        // Dropdown
        var langDD = document.createElement('div');
        langDD.id = 'langDropdown';
        langDD.style.cssText = 'display:none;position:absolute;top:calc(100% + 8px);right:0;min-width:150px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:12px;padding:6px;box-shadow:0 12px 32px rgba(0,0,0,0.4);backdrop-filter:blur(20px);z-index:9999;animation:fadeInUp 0.2s ease;';

        var langs = [
            { code:'es', flag:'🇪🇸', name:'Español' },
            { code:'en', flag:'🇬🇧', name:'English' },
            { code:'de', flag:'🇩🇪', name:'Deutsch' }
        ];

        langs.forEach(function(l) {
            var item = document.createElement('div');
            item.setAttribute('data-lang-option', l.code);
            item.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;cursor:pointer;font-size:13px;color:var(--text-secondary);transition:all 0.15s;';
            item.innerHTML = '<span style="font-size:18px;">' + l.flag + '</span><span style="font-weight:600;">' + l.name + '</span>';
            item.onmouseenter = function() { this.style.background = 'rgba(0,212,255,0.12)'; this.style.color = 'var(--accent)'; };
            item.onmouseleave = function() {
                var isActive = this.classList.contains('gw-lang-active');
                this.style.background = isActive ? 'rgba(0,212,255,0.08)' : '';
                this.style.color = isActive ? 'var(--accent)' : 'var(--text-secondary)';
            };
            item.onclick = function(e) {
                e.stopPropagation();
                if (typeof window.setLanguage === 'function') window.setLanguage(l.code);
                langDD.style.display = 'none';
                langBtn.querySelector('i').style.transform = '';
            };
            langDD.appendChild(item);
        });

        langWrap.appendChild(langBtn);
        langWrap.appendChild(langDD);
        themeToggle.parentNode.insertBefore(langWrap, themeToggle.nextSibling);

        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', function() {
            langDD.style.display = 'none';
            langBtn.querySelector('i').style.transform = '';
        });
    }

    // ── Buscador global compacto ────────────────────────────
    var userSection = document.querySelector('.user-section');
    if (userSection && !document.getElementById('globalNavSearch')) {
        var form    = document.createElement('form');
        form.id     = 'globalNavSearch';
        form.action = basePath + 'pages/search.html';
        form.method = 'get';
        form.style.cssText = 'display:flex;align-items:center;margin-right:4px;';

        var input       = document.createElement('input');
        input.type      = 'search';
        input.name      = 'q';
        input.placeholder = 'Buscar...';
        input.setAttribute('data-i18n-placeholder', 'common.search');
        input.style.cssText = 'padding:5px 12px;border-radius:20px;border:1px solid var(--border-color);background:var(--bg-input);color:var(--text-primary);font-size:12px;width:120px;outline:none;transition:all 0.2s;';
        input.onfocus = function() { this.style.borderColor='var(--accent)'; this.style.width='160px'; };
        input.onblur  = function() { this.style.borderColor='var(--border-color)'; this.style.width='120px'; };

        var searchBtn   = document.createElement('button');
        searchBtn.type  = 'submit';
        searchBtn.innerHTML = '<i class="fas fa-search"></i>';
        searchBtn.style.cssText = 'background:transparent;border:none;color:var(--text-secondary);cursor:pointer;margin-left:-26px;font-size:12px;';

        form.appendChild(input);
        form.appendChild(searchBtn);
        userSection.insertBefore(form, userSection.firstChild);
    }
});