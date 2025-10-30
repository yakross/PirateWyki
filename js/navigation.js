// js/navigation.js
// Sistema de navegación y manejo de rutas mejorado

class Navigation {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.params = this.getURLParams();
        this.user = this.getCurrentUser();
    }

    // ===== GESTIÓN DE USUARIOS =====
    
    getCurrentUser() {
        const userStr = localStorage.getItem('pirate_galaxy_user');
        return userStr ? JSON.parse(userStr) : null;
    }

    setCurrentUser(user) {
        if (user) {
            localStorage.setItem('pirate_galaxy_user', JSON.stringify(user));
            this.user = user;
        } else {
            localStorage.removeItem('pirate_galaxy_user');
            this.user = null;
        }
    }

    isLoggedIn() {
        return this.user !== null;
    }

    logout() {
        this.setCurrentUser(null);
        window.location.href = 'login.html';
    }

    // Verificar si la página requiere autenticación
    requireAuth() {
        const publicPages = ['login.html', 'register.html', 'index.html'];
        const currentPage = this.getCurrentPage() + '.html';
        
        if (!publicPages.includes(currentPage) && !this.isLoggedIn()) {
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
            return false;
        }
        return true;
    }

    // Actualizar UI según estado de login
    updateAuthUI() {
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const userDisplay = document.getElementById('user-display');

        if (this.isLoggedIn()) {
            if (loginBtn) loginBtn.classList.add('hidden');
            if (logoutBtn) logoutBtn.classList.remove('hidden');
            if (userDisplay) {
                userDisplay.textContent = this.user.username;
                userDisplay.classList.remove('hidden');
            }
        } else {
            if (loginBtn) loginBtn.classList.remove('hidden');
            if (logoutBtn) logoutBtn.classList.add('hidden');
            if (userDisplay) userDisplay.classList.add('hidden');
        }
    }

    // ===== NAVEGACIÓN =====

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '') || 'index';
        return page;
    }

    getURLParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    }

    navigateTo(page, params = {}) {
        const url = new URL(window.location.origin + '/' + page + '.html');
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
        window.location.href = url.toString();
    }

    updateParams(params) {
        const url = new URL(window.location);
        Object.entries(params).forEach(([key, value]) => {
            if (value === null || value === undefined) {
                url.searchParams.delete(key);
            } else {
                url.searchParams.set(key, value);
            }
        });
        window.history.pushState({}, '', url);
        this.params = this.getURLParams();
    }

    setActiveNavItem() {
        const navItems = document.querySelectorAll('.game-nav-item');
        const currentPath = window.location.pathname;
        
        navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href && currentPath.includes(href.replace('.html', ''))) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    buildBreadcrumb(items) {
        const breadcrumbContainer = document.getElementById('breadcrumb');
        if (!breadcrumbContainer) return;

        const breadcrumbHTML = items.map((item, index) => {
            const isLast = index === items.length - 1;
            if (isLast) {
                return `<span class="text-gray-400">${item.label}</span>`;
            } else {
                return `
                    <a href="${item.url}" class="text-blue-400 hover:text-blue-300">
                        ${item.label}
                    </a>
                    <i data-lucide="chevron-right" class="w-4 h-4 text-gray-600 inline mx-2"></i>
                `;
            }
        }).join('');

        breadcrumbContainer.innerHTML = breadcrumbHTML;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // ===== FILTROS =====

    initFilters(filterConfig) {
        const { containerId, onFilter } = filterConfig;
        const container = document.getElementById(containerId);
        if (!container) return;

        container.addEventListener('change', (e) => {
            if (e.target.matches('select, input[type="checkbox"], input[type="radio"]')) {
                const filters = this.collectFilters(container);
                onFilter(filters);
            }
        });

        const searchInput = container.querySelector('input[type="search"], input[type="text"]');
        if (searchInput) {
            let debounceTimer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    const filters = this.collectFilters(container);
                    onFilter(filters);
                }, 300);
            });
        }
    }

    collectFilters(container) {
        const filters = {};
        
        container.querySelectorAll('select').forEach(select => {
            if (select.value) {
                filters[select.name || select.id] = select.value;
            }
        });

        const checkboxGroups = {};
        container.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            const name = checkbox.name || checkbox.id;
            if (!checkboxGroups[name]) {
                checkboxGroups[name] = [];
            }
            checkboxGroups[name].push(checkbox.value);
        });
        Object.assign(filters, checkboxGroups);

        container.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
            filters[radio.name] = radio.value;
        });

        container.querySelectorAll('input[type="search"], input[type="text"]').forEach(input => {
            if (input.value.trim()) {
                filters[input.name || input.id] = input.value.trim();
            }
        });

        return filters;
    }

    clearFilters(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.querySelectorAll('select').forEach(select => select.value = '');
        container.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        container.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
        container.querySelectorAll('input[type="search"], input[type="text"]').forEach(input => input.value = '');
    }

    // ===== TABS =====

    initTabs(tabsContainerId) {
        const container = document.getElementById(tabsContainerId);
        if (!container) return;

        const tabs = container.querySelectorAll('[data-tab]');
        const contents = document.querySelectorAll('[data-tab-content]');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');

                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                contents.forEach(content => {
                    if (content.getAttribute('data-tab-content') === tabName) {
                        content.classList.remove('hidden');
                    } else {
                        content.classList.add('hidden');
                    }
                });

                this.updateParams({ tab: tabName });
            });
        });

        const initialTab = this.params.tab;
        if (initialTab) {
            const tabToActivate = Array.from(tabs).find(t => t.getAttribute('data-tab') === initialTab);
            if (tabToActivate) {
                tabToActivate.click();
            }
        }
    }

    // ===== PAGINACIÓN =====

    createPagination(totalItems, itemsPerPage, currentPage, containerId, onPageChange) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const totalPages = Math.ceil(totalItems / itemsPerPage);
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let paginationHTML = '<div class="flex items-center justify-center gap-2 mt-6">';

        paginationHTML += `
            <button 
                class="px-3 py-2 rounded ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-blue-400 hover:bg-gray-700'}"
                ${currentPage === 1 ? 'disabled' : ''}
                onclick="navigation.changePage(${currentPage - 1})"
            >
                <i data-lucide="chevron-left" class="w-4 h-4"></i>
            </button>
        `;

        const maxButtons = 7;
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);

        if (endPage - startPage < maxButtons - 1) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        if (startPage > 1) {
            paginationHTML += `<button class="px-3 py-2 rounded bg-gray-800 text-blue-400 hover:bg-gray-700" onclick="navigation.changePage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="text-gray-500">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button 
                    class="px-3 py-2 rounded ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-800 text-blue-400 hover:bg-gray-700'}"
                    onclick="navigation.changePage(${i})"
                >
                    ${i}
                </button>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="text-gray-500">...</span>`;
            }
            paginationHTML += `<button class="px-3 py-2 rounded bg-gray-800 text-blue-400 hover:bg-gray-700" onclick="navigation.changePage(${totalPages})">${totalPages}</button>`;
        }

        paginationHTML += `
            <button 
                class="px-3 py-2 rounded ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-blue-400 hover:bg-gray-700'}"
                ${currentPage === totalPages ? 'disabled' : ''}
                onclick="navigation.changePage(${currentPage + 1})"
            >
                <i data-lucide="chevron-right" class="w-4 h-4"></i>
            </button>
        `;

        paginationHTML += '</div>';
        container.innerHTML = paginationHTML;
        if (typeof lucide !== 'undefined') lucide.createIcons();

        this.onPageChangeCallback = onPageChange;
    }

    changePage(page) {
        if (this.onPageChangeCallback) {
            this.onPageChangeCallback(page);
        }
        this.updateParams({ page });
    }

    // ===== UTILIDADES =====

    showNotification(message, type = 'info') {
        const notificationContainer = document.getElementById('notifications');
        if (!notificationContainer) {
            const container = document.createElement('div');
            container.id = 'notifications';
            container.className = 'fixed top-4 right-4 z-50 space-y-2';
            document.body.appendChild(container);
        }

        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };

        const notification = document.createElement('div');
        notification.className = `${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slideIn`;
        notification.innerHTML = `
            <i data-lucide="check-circle" class="w-5 h-5"></i>
            <span>${message}</span>
        `;

        document.getElementById('notifications').appendChild(notification);
        if (typeof lucide !== 'undefined') lucide.createIcons();

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Instancia global
const navigation = new Navigation();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    navigation.setActiveNavItem();
    navigation.updateAuthUI();
});