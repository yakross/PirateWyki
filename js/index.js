/**
 * GalaxWiki - Página de inicio
 * Maneja tema, sesión, estadísticas y búsqueda
 */
(function () {
    'use strict';

    const DEBUG = false;
    const log = (...args) => { if (DEBUG) console.log(...args); };

    const auth = window.auth;
    const db = window.db;

    // ==========================================
    // TEMA CLARO/OSCURO
    // ==========================================
    function toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        const themeIcon = document.getElementById('themeIcon');
        if (!themeIcon) return;

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeIcon.className = newTheme === 'light' ? 'fas fa-sun theme-icon' : 'fas fa-moon theme-icon';
        updateThemeColorMeta(newTheme);
    }

    function updateThemeColorMeta(theme) {
        const meta = document.getElementById('themeColorMeta');
        if (meta) meta.content = theme === 'dark' ? '#0f1419' : '#f8fafc';
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        const themeIcon = document.getElementById('themeIcon');
        if (!themeIcon) return;

        document.documentElement.setAttribute('data-theme', savedTheme);
        themeIcon.className = savedTheme === 'light' ? 'fas fa-sun theme-icon' : 'fas fa-moon theme-icon';
        updateThemeColorMeta(savedTheme);
    }

    // ==========================================
    // GESTIÓN DE SESIÓN
    // ==========================================
    function checkSession() {
        const authRef = window.auth;
        const dbRef = window.db;
        const authButtons = document.getElementById('authButtons');
        const userProfile = document.getElementById('userProfile');

        if (!authRef) {
            if (authButtons) authButtons.style.display = 'flex';
            return;
        }

        authRef.onAuthStateChanged(async (user) => {
            if (user) {
                if (authButtons) authButtons.style.display = 'none';
                if (userProfile) userProfile.style.display = 'block';

                const userNameEl = document.getElementById('userName');
                const userFleetEl = document.getElementById('userFleet');
                const adminMenuItem = document.getElementById('adminMenuItem');
                const roleBadge = document.getElementById('userRoleBadge');

                if (userNameEl) userNameEl.textContent = user.email || 'Usuario';
                if (userFleetEl) userFleetEl.textContent = 'Sin Flota';
                if (adminMenuItem) adminMenuItem.style.display = 'none';
                if (roleBadge) roleBadge.style.display = 'none';

                try {
                    const userDoc = await dbRef.collection('users').doc(user.uid).get();
                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        if (userNameEl) userNameEl.textContent = userData.username || user.email;
                        if (userFleetEl) userFleetEl.textContent = userData.fleet || 'Sin Flota';
                        const isAdmin = userData.role === 'admin';
                        if (adminMenuItem) adminMenuItem.style.display = isAdmin ? 'block' : 'none';
                        if (roleBadge) roleBadge.style.display = isAdmin ? 'inline-block' : 'none';
                    }
                } catch (e) {
                    log('Error cargando usuario:', e);
                }
            } else {
                if (authButtons) authButtons.style.display = 'flex';
                if (userProfile) userProfile.style.display = 'none';
            }
        });
    }

    async function logout() {
        if (!auth) return;
        try {
            await auth.signOut();
            location.reload();
        } catch (error) {
            log('Error al cerrar sesión:', error);
        }
    }

    // ==========================================
    // ESTADÍSTICAS (con estados de carga y error)
    // ==========================================
    const statIds = ['shipsCount', 'componentsCount', 'enemiesCount', 'usersCount'];

    function setStatLoading() {
        statIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = '...';
                el.classList.add('stat-loading');
            }
        });
    }

    function setStatValue(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
            el.classList.remove('stat-loading');
            el.title = '';
        }
    }

    function setStatError(ids) {
        (ids || statIds).forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = '—';
                el.classList.remove('stat-loading');
                el.title = 'Error al cargar';
            }
        });
    }

    async function loadStats() {
        if (!window.db) {
            setStatError();
            return;
        }

        setStatLoading();

        try {
            // Colecciones con lectura pública (sin auth)
            const [shipsSnap, componentsSnap, enemiesSnap] = await Promise.all([
                window.db.collection('ships').get(),
                window.db.collection('components').get(),
                window.db.collection('enemies').get()
            ]);

            setStatValue('shipsCount', shipsSnap.size || 0);
            setStatValue('componentsCount', componentsSnap.size || 0);
            setStatValue('enemiesCount', enemiesSnap.size || 0);

            // Usuarios: solo admins pueden listar; si no hay auth o falla, mostrar "—"
            const usersEl = document.getElementById('usersCount');
            if (usersEl) {
                if (window.auth && window.auth.currentUser) {
                    try {
                        const userDoc = await window.db.collection('users').doc(window.auth.currentUser.uid).get();
                        if (userDoc.exists && userDoc.data().role === 'admin') {
                            const usersSnap = await window.db.collection('users').get();
                            usersEl.textContent = usersSnap.size || 0;
                        } else {
                            usersEl.textContent = '—';
                        }
                    } catch (e) {
                        usersEl.textContent = '—';
                    }
                } else {
                    usersEl.textContent = '—';
                }
                usersEl.classList.remove('stat-loading');
                usersEl.title = '';
            }
        } catch (error) {
            log('Error al cargar estadísticas:', error);
            setStatError();
        }
    }

    // ==========================================
    // BÚSQUEDA POR TECLADO (Ctrl/Cmd + K)
    // ==========================================
    function setupSearchShortcut() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const input = document.getElementById('searchInput');
                if (input) {
                    input.focus();
                }
            }
        });
    }

    // ==========================================
    // INICIALIZACIÓN
    // ==========================================
    // ==========================================
    // ÚLTIMAS NOTICIAS
    // ==========================================
    async function loadNewsPreview() {
        const container = document.getElementById('newsPreview');
        const errorEl = document.getElementById('newsLoadError');
        if (!container || !db) return;

        try {
            let snap;
            try {
                snap = await db.collection('news').orderBy('createdAt', 'desc').limit(3).get();
            } catch (idxErr) {
                snap = await db.collection('news').limit(3).get();
            }

            if (snap.empty) {
                container.innerHTML = '<p class="news-empty">Aún no hay noticias. Vuelve pronto.</p>';
                return;
            }

            container.innerHTML = snap.docs.map(doc => {
                const d = doc.data();
                const title = d.title || 'Sin título';
                const excerpt = d.excerpt || (d.content ? String(d.content).slice(0, 120) + '…' : '');
                const img = d.image || 'assets/img/png/logos/pirategalaxy_logo.png';
                return `<a href="pages/news.html" class="news-preview-card">
                    <img src="${img}" alt="" loading="lazy" class="news-preview-img" onerror="this.src='assets/img/png/logos/pirategalaxy_logo.png'">
                    <div class="news-preview-body">
                        <h3 class="news-preview-title">${escapeHtml(title)}</h3>
                        <p class="news-preview-excerpt">${escapeHtml(excerpt)}</p>
                        <span class="news-preview-cta">Leer más <i class="fas fa-arrow-right"></i></span>
                    </div>
                </a>`;
            }).join('');
            if (errorEl) errorEl.style.display = 'none';
        } catch (e) {
            log('Error cargando noticias:', e);
            container.innerHTML = '<p class="news-empty">No se pudieron cargar las noticias.</p>';
            if (errorEl) errorEl.style.display = 'block';
        }
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ==========================================
    // INICIALIZACIÓN
    // ==========================================
    function init() {
        loadTheme();
        checkSession();
        loadStats();
        loadNewsPreview();
        setupSearchShortcut();
    }

    window.addEventListener('DOMContentLoaded', init);

    // Exportar para uso global (ej. onclick logout desde HTML)
    window.toggleTheme = toggleTheme;
    window.logout = logout;
})();
