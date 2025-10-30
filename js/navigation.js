// js/navigation.js
// Sistema de navegación y manejo de rutas

class Navigation {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.params = this.getURLParams();
    }

    // Obtener página actual
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '') || 'index';
        return page;
    }

    // Obtener parámetros de URL
    getURLParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    }

    // Navegar a página con parámetros
    navigateTo(page, params = {}) {
        const url = new URL(window.location.origin + '/' + page + '.html');
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
        window.location.href = url.toString();
    }

    // Actualizar parámetros sin recargar página
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

    // Marcar elemento de navegación activo
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

    // Construir breadcrumb dinámico
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
        lucide.createIcons();
    }

    // Sistema de filtros para páginas
    initFilters(filterConfig) {
        const { containerId, onFilter } = filterConfig;
        const container = document.getElementById(containerId);
        if (!container) return;

        // Escuchar cambios en filtros
        container.addEventListener('change', (e) => {
            if (e.target.matches('select, input[type="checkbox"], input[type="radio"]')) {
                const filters = this.collectFilters(container);
                onFilter(filters);
            }
        });

        // Escuchar input de búsqueda
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

    // Recolectar valores de filtros
    collectFilters(container) {
        const filters = {};
        
        // Selects
        container.querySelectorAll('select').forEach(select => {
            if (select.value) {
                filters[select.name || select.id] = select.value;
            }
        });

        // Checkboxes
        const checkboxGroups = {};
        container.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            const name = checkbox.name || checkbox.id;
            if (!checkboxGroups[name]) {
                checkboxGroups[name] = [];
            }
            checkboxGroups[name].push(checkbox.value);
        });
        Object.assign(filters, checkboxGroups);

        // Radio buttons
        container.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
            filters[radio.name] = radio.value;
        });

        // Text inputs
        container.querySelectorAll('input[type="search"], input[type="text"]').forEach(input => {
            if (input.value.trim()) {
                filters[input.name || input.id] = input.value.trim();
            }
        });

        return filters;
    }

    // Limpiar filtros
    clearFilters(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.querySelectorAll('select').forEach(select => select.value = '');
        container.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        container.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
        container.querySelectorAll('input[type="search"], input[type="text"]').forEach(input => input.value = '');
    }

    // Sistema de tabs
    initTabs(tabsContainerId) {
        const container = document.getElementById(tabsContainerId);
        if (!container) return;

        const tabs = container.querySelectorAll('[data-tab]');
        const contents = document.querySelectorAll('[data-tab-content]');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');

                // Actualizar tabs activos
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Mostrar contenido correspondiente
                contents.forEach(content => {
                    if (content.getAttribute('data-tab-content') === tabName) {
                        content.classList.remove('hidden');
                    } else {
                        content.classList.add('hidden');
                    }
                });

                // Actualizar URL
                this.updateParams({ tab: tabName });
            });
        });

        // Activar tab inicial desde URL
        const initialTab = this.params.tab;
        if (initialTab) {
            const tabToActivate = Array.from(tabs).find(t => t.getAttribute('data-tab') === initialTab);
            if (tabToActivate) {
                tabToActivate.click();
            }
        }
    }

    // Sistema de paginación
    createPagination(totalItems, itemsPerPage, currentPage, containerId, onPageChange) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const totalPages = Math.ceil(totalItems / itemsPerPage);
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let paginationHTML = '<div class="flex items-center justify-center gap-2 mt-6">';

        // Previous button
        paginationHTML += `
            <button 
                class="px-3 py-2 rounded ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-blue-400 hover:bg-gray-700'}"
                ${currentPage === 1 ? 'disabled' : ''}
                onclick="navigation.changePage(${currentPage - 1})"
            >
                <i data-lucide="chevron-left" class="w-4 h-4"></i>
            </button>
        `;

        // Page numbers
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

        // Next button
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
        lucide.createIcons();

        this.onPageChangeCallback = onPageChange;
    }

    changePage(page) {
        if (this.onPageChangeCallback) {
            this.onPageChangeCallback(page);
        }
        this.updateParams({ page });
    }
}

// Instancia global
const navigation = new Navigation();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    navigation.setActiveNavItem();
});