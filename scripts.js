/**
 * ===========================================
 * GALAXWYKI - CONTROLADOR v4.0 
 * TAILWIND + BOOTSTRAP + VANILLA JS
 * ===========================================
 * 
 * Sistema completo de gestión de interfaz con:
 * - Dark/Light mode avanzado
 * - Sidebar responsivo mejorado
 * - Sistema de búsqueda inteligente
 * - Notificaciones toast
 * - Animaciones fluidas
 * - Navegación SPA
 * - Gestión de estado avanzada
 * 
 * @author GalaxWyki Team
 * @version 4.0.0
 * @since 2024
 * ===========================================
 */
class GalaxWykiApp {
    constructor() {
        // === ELEMENTOS DEL DOM ===
        this.elements = {
            appLayout: document.getElementById('appLayout'),
            sidebar: document.getElementById('sidebar'),
            sidebarContent: document.getElementById('sidebarContent'),
            sidebarToggle: document.getElementById('sidebarToggle'),
            mobileMenuToggle: document.getElementById('mobileMenuToggle'),
            mobileOverlay: document.getElementById('mobileOverlay'),
            themeToggle: document.getElementById('themeToggle'),
            searchInput: document.getElementById('searchInput'),
            searchClear: document.getElementById('searchClear'),
            searchResults: document.getElementById('searchResults'),
            loadingOverlay: document.getElementById('loadingOverlay'),
            contentArea: document.getElementById('contentArea'),
            toastContainer: document.getElementById('toastContainer'),
            navLinks: document.querySelectorAll('.nav-link'),
            dropdownItems: document.querySelectorAll('.dropdown'),
            submenuLinks: document.querySelectorAll('.submenu-link')
        };
        // === CONFIGURACIÓN ===
        this.config = {
            storageKeys: {
                theme: 'galaxwyki-theme-v4',
                sidebarState: 'galaxwyki-sidebar-v4',
                activeSection: 'galaxwyki-active-section-v4',
                userSettings: 'galaxwyki-settings-v4'
            },
            classes: {
                darkMode: 'dark',
                sidebarCollapsed: 'sidebar-collapsed',
                sidebarShow: 'show',
                dropdownExpanded: 'dropdown-expanded',
                submenuShow: 'show',
                activeLink: 'active',
                loading: 'loading'
            },
            animations: {
                duration: 300,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                springEasing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
            },
            search: {
                minLength: 2,
                debounceTime: 300,
                maxResults: 8
            },
            toast: {
                duration: 4000,
                maxVisible: 5
            }
        };
        // === ESTADO DE LA APLICACIÓN ===
        this.state = {
            theme: 'light',
            sidebarCollapsed: false,
            sidebarVisible: false,
            activeSection: 'home',
            searchTerm: '',
            isLoading: false,
            notifications: [],
            isMobile: window.innerWidth < 1024,
            settings: {
                animations: true,
                sounds: false,
                autoSave: true,
                compactMode: false
            }
        };
        // === DATA PARA BÚSQUEDA ===
        this.searchData = [
            { title: 'Naves de Combate', url: '#ships', category: 'Naves', icon: 'bi-rocket-takeoff', description: 'Explora todas las naves disponibles' },
            { title: 'Misiones Principales', url: '#missions', category: 'Misiones', icon: 'bi-clipboard-check', description: 'Guías completas de misiones' },
            { title: 'Sistemas Planetarios', url: '#systems', category: 'Universo', icon: 'bi-globe', description: 'Mapas y información planetaria' },
            { title: 'Conquistas PvP', url: '#conquests', category: 'Combate', icon: 'bi-sword', description: 'Estrategias de combate PvP' },
            { title: 'Planos de Construcción', url: '#blueprints', category: 'Recursos', icon: 'bi-box-seam', description: 'Planos y construcciones' },
            { title: 'Personajes', url: '#characters', category: 'Historia', icon: 'bi-person-circle', description: 'Historia y personajes del juego' },
            { title: 'Calculadora', url: '#calculator', category: 'Herramientas', icon: 'bi-calculator', description: 'Calcular recursos y costos' },
            { title: 'Tienda', url: '#store', category: 'Comercio', icon: 'bi-cart', description: 'Items y precios de la tienda' },
            { title: 'Screenshots', url: '#screenshots', category: 'Galería', icon: 'bi-image', description: 'Galería de imágenes' },
            { title: 'Eventos', url: '#events', category: 'Noticias', icon: 'bi-calendar-event', description: 'Eventos especiales del juego' }
        ];
        // === TIMERS Y DEBOUNCING ===
        this.timers = {
            search: null,
            resize: null,
            toast: new Map()
        };
        // Inicializar la aplicación
        this.init();
    }
    /**
     * Inicializa la aplicación
     */
    async init() {
        console.log('🚀 Inicializando GalaxWyki v4.0...');
        try {
            // Mostrar loading
            this.showLoading('Iniciando aplicación...');
            // Cargar configuraciones
            await this.loadUserSettings();
            await this.detectSystemPreferences();
            // Configurar componentes
            this.setupEventListeners();
            this.setupNavigation();
            this.setupSearch();
            this.setupResponsiveHandling();
            // Aplicar estado inicial
            this.applyInitialState();
            // Configurar lazy loading
            this.setupLazyLoading();
            // Simular carga inicial
            await this.sleep(800);
            // Ocultar loading y mostrar bienvenida
            this.hideLoading();
            this.showToast('¡Bienvenido a GalaxWyki!', 'success', {
                icon: 'bi-stars',
                duration: 3000
            });
            console.log('✅ GalaxWyki v4.0 inicializado correctamente');
        } catch (error) {
            console.error('❌ Error inicializando:', error);
            this.hideLoading();
            this.showToast('Error al inicializar la aplicación', 'error');
        }
    }
    /**
     * Función auxiliar para delays
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * Carga configuraciones del usuario
     */
    async loadUserSettings() {
        try {
            // Cargar tema
            const savedTheme = localStorage.getItem(this.config.storageKeys.theme);
            if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
                this.state.theme = savedTheme;
            }
            // Cargar estado del sidebar
            const savedSidebarState = localStorage.getItem(this.config.storageKeys.sidebarState);
            if (savedSidebarState === 'collapsed') {
                this.state.sidebarCollapsed = true;
            }
            // Cargar sección activa
            const savedSection = localStorage.getItem(this.config.storageKeys.activeSection);
            if (savedSection && this.isValidSection(savedSection)) {
                this.state.activeSection = savedSection;
            }
            // Cargar configuraciones de usuario
            const savedSettings = localStorage.getItem(this.config.storageKeys.userSettings);
            if (savedSettings) {
                try {
                    this.state.settings = { ...this.state.settings, ...JSON.parse(savedSettings) };
                } catch (e) {
                    console.warn('Error parsing user settings:', e);
                }
            }
            console.log('📁 Configuraciones cargadas');
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }
    /**
     * Detecta preferencias del sistema
     */
    async detectSystemPreferences() {
        // Detectar tema del sistema si no hay preferencia guardada
        if (!localStorage.getItem(this.config.storageKeys.theme)) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.state.theme = prefersDark ? 'dark' : 'light';
        }
        // Detectar preferencia de movimiento reducido
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            this.state.settings.animations = false;
        }
        // Escuchar cambios en preferencias del sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.config.storageKeys.theme)) {
                this.state.theme = e.matches ? 'dark' : 'light';
                this.applyTheme();
            }
        });
    }
    /**
     * Configura todos los event listeners
     */
    setupEventListeners() {
        // Toggle del sidebar (desktop)
        this.elements.sidebarToggle?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleSidebar();
        });
        // Toggle del menú móvil
        this.elements.mobileMenuToggle?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileSidebar();
        });
        // Overlay móvil
        this.elements.mobileOverlay?.addEventListener('click', () => {
            this.closeMobileSidebar();
        });
        // Toggle del tema
        this.elements.themeToggle?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleTheme();
        });
        // Navegación principal
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Verificar si el link es parte de un dropdown
                const parentDropdown = link.closest('.dropdown');
                if (parentDropdown) {
                     // Es un dropdown, manejarlo
                     e.preventDefault();
                     this.toggleDropdown(parentDropdown);
                } else {
                    // No es un dropdown, manejar navegación normal
                    this.handleNavigation(e, link);
                }
            });
        });
        // Dropdowns (Manejo alternativo si se quiere un comportamiento diferente)
        // this.elements.dropdownItems.forEach(dropdown => {
        //     const link = dropdown.querySelector('.nav-link');
        //     if (link) {
        //         link.addEventListener('click', (e) => {
        //             e.preventDefault();
        //             this.toggleDropdown(dropdown);
        //         });
        //     }
        // });
        // Submenús
        this.elements.submenuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavigation(e, link);
            });
        });
        // Búsqueda
        this.elements.searchInput?.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });
        this.elements.searchInput?.addEventListener('focus', () => {
            this.handleSearchFocus();
        });
        this.elements.searchInput?.addEventListener('blur', () => {
            setTimeout(() => this.handleSearchBlur(), 200);
        });
        this.elements.searchInput?.addEventListener('keydown', (e) => {
            this.handleSearchKeydown(e);
        });
        this.elements.searchClear?.addEventListener('click', (e) => {
            e.preventDefault();
            this.clearSearch();
        });
        // Atajos de teclado
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
        // Resize del navegador
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });
        // Clicks fuera de dropdowns
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                this.closeAllDropdowns();
            }
        });
        // Prevenir pérdida de datos
        window.addEventListener('beforeunload', () => {
            this.saveUserSettings();
        });
        // Scroll events para lazy loading
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
        console.log('🎯 Event listeners configurados');
    }
    /**
     * Configura el sistema de navegación
     */
    setupNavigation() {
        // Configurar navegación por historial
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (hash && hash !== this.state.activeSection && this.isValidSection(hash)) {
                this.navigateToSection(hash, false);
            }
        });
        // Configurar hash inicial
        const currentHash = window.location.hash.substring(1);
        if (currentHash && this.isValidSection(currentHash)) {
            this.state.activeSection = currentHash;
        }
        console.log('🧭 Navegación configurada');
    }
    /**
     * Configura el sistema de búsqueda
     */
    setupSearch() {
        // Configurar autocompletado y navegación con teclado
        this.elements.searchInput?.addEventListener('keydown', (e) => {
            const results = this.elements.searchResults?.querySelectorAll('.search-result-item');
            switch (e.key) {
                case 'Escape':
                    this.clearSearch();
                    this.elements.searchInput.blur();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    if (results && results.length > 0) {
                        results[0].focus();
                    }
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (results && results.length > 0) {
                        results[0].click();
                    }
                    break;
            }
        });
        console.log('🔍 Búsqueda configurada');
    }
    /**
     * Configura el manejo responsivo
     */
    setupResponsiveHandling() {
        // Detectar cambios de tamaño
        this.handleWindowResize();
        // Configurar breakpoints
        const mediaQuery = window.matchMedia('(max-width: 1023.98px)');
        mediaQuery.addEventListener('change', (e) => {
            this.state.isMobile = e.matches;
            if (!e.matches) {
                this.closeMobileSidebar();
            }
        });
        console.log('📱 Manejo responsivo configurado');
    }
    /**
     * Configura lazy loading para imágenes y contenido
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });
            // Observar imágenes lazy
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    /**
     * Aplica el estado inicial
     */
    applyInitialState() {
        // Aplicar tema
        this.applyTheme();
        // Aplicar estado del sidebar
        if (this.state.sidebarCollapsed && !this.state.isMobile) {
            this.elements.sidebar?.classList.add(this.config.classes.sidebarCollapsed);
        }
        // Activar sección inicial
        this.setActiveSection(this.state.activeSection);
        // Aplicar configuraciones de animación
        if (!this.state.settings.animations) {
            document.body.classList.add('no-animations');
        }
        console.log('🎨 Estado inicial aplicado');
    }
    /**
     * Aplica el tema actual
     */
    applyTheme() {
        const isDark = this.state.theme === 'dark';
        document.documentElement.classList.toggle(this.config.classes.darkMode, isDark);
        // Actualizar meta theme-color
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
            themeColorMeta.content = isDark ? '#1f2937' : '#ffffff';
        }
    }
    /**
     * Alterna el tema con animación mejorada
     */
    async toggleTheme() {
        const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
        // Animación de transición suave
        if (this.state.settings.animations) {
            document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
            // Efecto de rotación del botón
            if (this.elements.themeToggle) {
                this.elements.themeToggle.style.transform = 'scale(0.8) rotate(180deg)';
                setTimeout(() => {
                    this.elements.themeToggle.style.transform = 'scale(1) rotate(0deg)';
                }, 150);
            }
        }
        this.state.theme = newTheme;
        this.applyTheme();
        // Guardar preferencia
        localStorage.setItem(this.config.storageKeys.theme, newTheme);
        // Resetear transición
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
        this.showToast(`Tema cambiado a ${newTheme === 'dark' ? 'oscuro' : 'claro'}`, 'info', {
            icon: newTheme === 'dark' ? 'bi-moon-stars' : 'bi-sun',
            duration: 2000
        });
        console.log(`🎨 Tema cambiado a: ${newTheme}`);
    }
    /**
     * Alterna el sidebar en desktop
     */
    toggleSidebar() {
        if (this.state.isMobile) return;
        this.state.sidebarCollapsed = !this.state.sidebarCollapsed;
        this.elements.sidebar?.classList.toggle(
            this.config.classes.sidebarCollapsed, 
            this.state.sidebarCollapsed
        );
        // Guardar estado
        localStorage.setItem(
            this.config.storageKeys.sidebarState,
            this.state.sidebarCollapsed ? 'collapsed' : 'expanded'
        );
        // Cerrar dropdowns al colapsar
        if (this.state.sidebarCollapsed) {
            this.closeAllDropdowns();
            this.clearSearch();
        }
        // Trigger resize para componentes que lo necesiten
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, this.config.animations.duration);
    }
    /**
     * Alterna el sidebar móvil
     */
    toggleMobileSidebar() {
        if (!this.state.isMobile) return;
        this.state.sidebarVisible = !this.state.sidebarVisible;
        if (this.state.sidebarVisible) {
            this.showMobileSidebar();
        } else {
            this.closeMobileSidebar();
        }
    }
    /**
     * Muestra el sidebar móvil
     */
    showMobileSidebar() {
        this.elements.sidebar?.classList.add(this.config.classes.sidebarShow);
        this.elements.mobileOverlay?.classList.add(this.config.classes.sidebarShow);
        document.body.style.overflow = 'hidden';
        this.state.sidebarVisible = true;
    }
    /**
     * Cierra el sidebar móvil
     */
    closeMobileSidebar() {
        this.elements.sidebar?.classList.remove(this.config.classes.sidebarShow);
        this.elements.mobileOverlay?.classList.remove(this.config.classes.sidebarShow);
        document.body.style.overflow = '';
        this.state.sidebarVisible = false;
    }
    /**
     * Maneja la entrada de búsqueda
     */
    handleSearchInput(value) {
        if (this.timers.search) {
            clearTimeout(this.timers.search);
        }
        this.state.searchTerm = value.trim();
        // Mostrar/ocultar botón de limpiar
        if (this.elements.searchClear) {
            this.elements.searchClear.style.display = value ? 'flex' : 'none';
        }
        // Búsqueda con debounce
        this.timers.search = setTimeout(() => {
            this.performSearch(this.state.searchTerm);
        }, this.config.search.debounceTime);
    }
    /**
     * Maneja el foco en búsqueda
     */
    handleSearchFocus() {
        if (this.state.searchTerm.length >= this.config.search.minLength) {
            this.showSearchResults();
        }
    }
    /**
     * Maneja la pérdida de foco en búsqueda
     */
    handleSearchBlur() {
        this.hideSearchResults();
    }
    /**
     * Maneja teclas especiales en búsqueda
     */
    handleSearchKeydown(e) {
        const results = this.elements.searchResults?.querySelectorAll('.search-result-item');
        switch (e.key) {
            case 'Escape':
                this.clearSearch();
                this.elements.searchInput?.blur();
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (results && results.length > 0) {
                    results[0].focus();
                }
                break;
            case 'Enter':
                e.preventDefault();
                if (results && results.length > 0) {
                    results[0].click();
                }
                break;
        }
    }
    /**
     * Realiza la búsqueda
     */
    performSearch(term) {
        if (!term || term.length < this.config.search.minLength) {
            this.hideSearchResults();
            return;
        }
        const results = this.searchData
            .filter(item => 
                item.title.toLowerCase().includes(term.toLowerCase()) ||
                item.category.toLowerCase().includes(term.toLowerCase()) ||
                item.description.toLowerCase().includes(term.toLowerCase())
            )
            .slice(0, this.config.search.maxResults);
        this.displaySearchResults(results, term);
    }
    /**
     * Muestra los resultados de búsqueda
     */
    displaySearchResults(results, term = '') {
        if (!this.elements.searchResults) return;
        if (results.length === 0) {
            this.elements.searchResults.innerHTML = `
                <div class="search-no-results p-8 text-center text-gray-500 dark:text-gray-400">
                    <i class="bi bi-search text-4xl mb-4 opacity-30"></i>
                    <p class="text-lg font-medium mb-2">No se encontraron resultados</p>
                    <p class="text-sm">Intenta con otros términos de búsqueda</p>
                </div>
            `;
        } else {
            this.elements.searchResults.innerHTML = results.map(result => `
                <div class="search-result-item p-4 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 border-b border-gray-100 dark:border-gray-600 last:border-b-0" 
                     data-url="${result.url}" 
                     tabindex="0">
                    <div class="flex items-center space-x-4">
                        <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i class="${result.icon} text-white"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                ${this.highlightSearchTerm(result.title, term)}
                            </h4>
                            <p class="text-sm text-gray-600 dark:text-gray-400 truncate">${result.description}</p>
                            <span class="inline-block text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                                ${result.category}
                            </span>
                        </div>
                        <i class="bi bi-arrow-right text-gray-400 flex-shrink-0"></i>
                    </div>
                </div>
            `).join('');
            // Agregar event listeners
            this.elements.searchResults.querySelectorAll('.search-result-item').forEach((item, index) => {
                item.addEventListener('click', () => {
                    const url = item.getAttribute('data-url');
                    if (url.startsWith('#')) {
                        this.navigateToSection(url.substring(1));
                        this.clearSearch();
                        if (this.state.isMobile) {
                            this.closeMobileSidebar();
                        }
                    }
                });
                item.addEventListener('keydown', (e) => {
                    const items = this.elements.searchResults.querySelectorAll('.search-result-item');
                    switch (e.key) {
                        case 'Enter':
                            item.click();
                            break;
                        case 'ArrowDown':
                            e.preventDefault();
                            const nextIndex = (index + 1) % items.length;
                            items[nextIndex].focus();
                            break;
                        case 'ArrowUp':
                            e.preventDefault();
                            const prevIndex = (index - 1 + items.length) % items.length;
                            items[prevIndex].focus();
                            break;
                        case 'Escape':
                            this.clearSearch();
                            this.elements.searchInput?.focus();
                            break;
                    }
                });
            });
        }
        this.showSearchResults();
    }
    /**
     * Resalta términos de búsqueda
     */
    highlightSearchTerm(text, term) {
        if (!term) return text;
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-600 px-1 rounded">$1</mark>');
    }
    /**
     * Muestra los resultados de búsqueda
     */
    showSearchResults() {
        if (this.elements.searchResults) {
            this.elements.searchResults.classList.remove('hidden');
        }
    }
    /**
     * Oculta los resultados de búsqueda
     */
    hideSearchResults() {
        if (this.elements.searchResults) {
            this.elements.searchResults.classList.add('hidden');
        }
    }
    /**
     * Limpia la búsqueda
     */
    clearSearch() {
        if (this.elements.searchInput) {
            this.elements.searchInput.value = '';
        }
        if (this.elements.searchClear) {
            this.elements.searchClear.style.display = 'none';
        }
        this.state.searchTerm = '';
        this.hideSearchResults();
    }
    /**
     * Maneja la navegación
     */
    handleNavigation(e, link) {
        const section = link.getAttribute('data-section');
        if (section) {
            e.preventDefault();
            this.navigateToSection(section);
            // Cerrar sidebar móvil si está abierto
            if (this.state.isMobile && this.state.sidebarVisible) {
                this.closeMobileSidebar();
            }
        }
    }
    /**
     * Navega a una sección
     */
    async navigateToSection(section, updateHash = true) {
        if (this.state.isLoading || section === this.state.activeSection) {
            return;
        }
        if (!this.isValidSection(section)) {
            console.warn(`Sección inválida: ${section}`);
            return;
        }
        try {
            this.showLoading(`Cargando ${this.getSectionName(section)}...`);
            // Simular carga de contenido
            await this.sleep(400);
            // Actualizar estado
            this.setActiveSection(section);
            await this.loadSectionContent(section);
            // Actualizar URL
            if (updateHash) {
                if (section !== 'home') {
                    window.location.hash = section;
                } else {
                    history.replaceState('', document.title, window.location.pathname);
                }
            }
            // Guardar estado
            localStorage.setItem(this.config.storageKeys.activeSection, section);
            this.hideLoading();
        } catch (error) {
            console.error('Error navigating:', error);
            this.hideLoading();
            this.showToast('Error al cargar la sección', 'error');
        }
    }
    /**
     * Establece la sección activa
     */
    setActiveSection(section) {
        // Remover clase activa
        document.querySelectorAll('.nav-link, .submenu-link').forEach(link => {
            link.classList.remove(this.config.classes.activeLink);
        });
        // Activar enlace correspondiente
        const activeLink = document.querySelector(`[data-section="${section}"]`);
        if (activeLink) {
            activeLink.classList.add(this.config.classes.activeLink);
            // Si está en submenú, expandir dropdown padre
            const parentDropdown = activeLink.closest('.dropdown');
            if (parentDropdown && !this.state.sidebarCollapsed) {
                this.openDropdown(parentDropdown);
            }
        }
        this.state.activeSection = section;
    }
    /**
     * Carga contenido de sección
     */
    async loadSectionContent(section) {
        this.updateBreadcrumbs(section);
        this.updatePageTitle(section);
        // Simular carga de contenido específico
        await this.sleep(200);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    /**
     * Actualiza breadcrumbs
     */
    updateBreadcrumbs(section) {
        const breadcrumbCurrent = document.querySelector('.breadcrumb-item.active');
        if (breadcrumbCurrent) {
            breadcrumbCurrent.textContent = this.getSectionName(section);
        }
    }
    /**
     * Actualiza título de página
     */
    updatePageTitle(section) {
        const pageTitle = document.querySelector('.page-title, h1');
        const pageSubtitle = document.querySelector('.page-subtitle');
        const titles = this.getSectionTitles(section);
        if (pageTitle) {
            pageTitle.textContent = titles.title;
            document.title = `${titles.title} - GalaxWyki`;
        }
        if (pageSubtitle) {
            pageSubtitle.textContent = titles.subtitle;
        }
    }
    /**
     * Obtiene títulos de sección
     */
    getSectionTitles(section) {
        const titles = {
            'home': { title: 'Bienvenido a GalaxWyki', subtitle: 'Tu portal completo al universo de Pirate Galaxy' },
            'ships': { title: 'Naves de Combate', subtitle: 'Explora la flota completa de naves disponibles' },
            'missions': { title: 'Centro de Misiones', subtitle: 'Todas las misiones y objetivos del juego' },
            'systems': { title: 'Sistemas Planetarios', subtitle: 'Explora el vasto universo de Pirate Galaxy' },
            'conquests': { title: 'Conquistas y PvP', subtitle: 'Domina el espacio con estrategias avanzadas' },
            'calculator': { title: 'Calculadora de Recursos', subtitle: 'Planifica tus construcciones y mejoras' },
            'blueprints': { title: 'Planos de Construcción', subtitle: 'Guías y recursos para construcción' },
            'store': { title: 'Tienda del Juego', subtitle: 'Items y precios actualizados' },
            'characters': { title: 'Personajes', subtitle: 'Historia y lore del universo Pirate Galaxy' },
            'screenshots': { title: 'Galería', subtitle: 'Screenshots y contenido visual' },
            'events': { title: 'Eventos', subtitle: 'Eventos especiales y actualizaciones' },
            'settings': { title: 'Configuración', subtitle: 'Personaliza tu experiencia' },
            'notifications': { title: 'Notificaciones', subtitle: 'Centro de notificaciones y alertas' }
        };
        return titles[section] || { 
            title: this.getSectionName(section), 
            subtitle: `Información sobre ${this.getSectionName(section).toLowerCase()}` 
        };
    }
    /**
     * Obtiene nombre de sección
     */
    getSectionName(section) {
        const names = {
            'home': 'Inicio',
            'blueprints': 'Planos',
            'ships': 'Naves',
            'missions': 'Misiones',
            'characters': 'Personajes',
            'ships-history': 'Historia de Naves',
            'structures': 'Estructuras',
            'avatar': 'Avatar',
            'systems': 'Sistemas Planetarios',
            'conquests': 'Conquistas',
            'store': 'Tienda',
            'screenshots': 'Screenshots',
            'misc': 'Miscelánea',
            'events': 'Eventos',
            'calculator': 'Calculadora',
            'notifications': 'Notificaciones',
            'settings': 'Configuración'
        };
        return names[section] || 'Sección';
    }
    /**
     * Valida si una sección es válida
     */
    isValidSection(section) {
        const validSections = [
            'home', 'blueprints', 'ships', 'missions', 'characters', 
            'ships-history', 'structures', 'avatar', 'systems', 
            'conquests', 'store', 'screenshots', 'misc', 'events', 
            'calculator', 'notifications', 'settings'
        ];
        return validSections.includes(section);
    }
    /**
     * Alterna dropdown
     */
    toggleDropdown(dropdown) {
        if (this.state.sidebarCollapsed) return;
        const isExpanded = dropdown.classList.contains(this.config.classes.dropdownExpanded);
        // Cerrar otros dropdowns
        this.closeAllDropdowns();
        if (!isExpanded) {
            this.openDropdown(dropdown);
        }
    }
    /**
     * Abre dropdown
     */
    openDropdown(dropdown) {
        const submenu = dropdown.querySelector('.submenu');
        dropdown.classList.add(this.config.classes.dropdownExpanded);
        if (submenu) {
            submenu.classList.add(this.config.classes.submenuShow);
        }
    }
    /**
     * Cierra todos los dropdowns
     */
    closeAllDropdowns() {
        this.elements.dropdownItems.forEach(dropdown => {
            const submenu = dropdown.querySelector('.submenu');
            dropdown.classList.remove(this.config.classes.dropdownExpanded);
            if (submenu) {
                submenu.classList.remove(this.config.classes.submenuShow);
            }
        });
    }
    /**
     * Maneja atajos de teclado
     */
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K para búsqueda
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.elements.searchInput?.focus();
        }
        // Ctrl/Cmd + B para sidebar
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            this.state.isMobile ? this.toggleMobileSidebar() : this.toggleSidebar();
        }
        // Ctrl/Cmd + D para tema
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            this.toggleTheme();
        }
        // Escape para cerrar elementos
        if (e.key === 'Escape') {
            this.closeAllDropdowns();
            this.hideSearchResults();
            if (this.state.isMobile && this.state.sidebarVisible) {
                this.closeMobileSidebar();
            }
        }
    }
    /**
     * Maneja resize de ventana
     */
    handleWindowResize() {
        if (this.timers.resize) {
            clearTimeout(this.timers.resize);
        }
        this.timers.resize = setTimeout(() => {
            const wasMobile = this.state.isMobile;
            this.state.isMobile = window.innerWidth < 1024;
            // Si cambió de móvil a desktop, cerrar sidebar móvil
            if (wasMobile && !this.state.isMobile) {
                this.closeMobileSidebar();
            }
        }, 150);
    }
    /**
     * Maneja scroll para efectos
     */
    handleScroll() {
        // Implementar efectos de scroll si es necesario
    }
    /**
     * Muestra loading
     */
    showLoading(message = 'Cargando...') {
        if (this.elements.loadingOverlay) {
            const loadingText = this.elements.loadingOverlay.querySelector('.loading-text');
            if (loadingText) {
                loadingText.textContent = message;
            }
            this.elements.loadingOverlay.classList.remove('hidden');
            this.state.isLoading = true;
        }
    }
    /**
     * Oculta loading
     */
    hideLoading() {
        if (this.elements.loadingOverlay) {
            this.elements.loadingOverlay.classList.add('hidden');
            this.state.isLoading = false;
        }
    }
    /**
     * Sistema de notificaciones toast mejorado
     */
    showToast(message, type = 'info', options = {}) {
        const {
            icon = this.getToastIcon(type),
            duration = this.config.toast.duration,
            closable = true
        } = options;
        // Limitar número de toasts visibles
        const existingToasts = this.elements.toastContainer?.children.length || 0;
        if (existingToasts >= this.config.toast.maxVisible) {
            const oldestToast = this.elements.toastContainer?.firstElementChild;
            if (oldestToast) {
                this.removeToast(oldestToast);
            }
        }
        const toastId = Date.now();
        const toast = document.createElement('div');
        toast.id = `toast-${toastId}`;
        toast.className = `toast toast-${type} relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 mb-4 min-w-80 max-w-96 animate-slideInUp`;
        toast.innerHTML = `
            <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                    <div class="w-10 h-10 ${this.getToastIconBg(type)} rounded-lg flex items-center justify-center">
                        <i class="${icon} text-white"></i>
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">${message}</p>
                </div>
                ${closable ? `
                    <button class="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" onclick="window.GalaxWykiInstance.removeToast(this.parentElement.parentElement)">
                        <i class="bi bi-x-lg text-sm"></i>
                    </button>
                ` : ''}
            </div>
            <div class="toast-progress absolute bottom-0 left-0 h-1 ${this.getToastProgressBg(type)} rounded-full"></div>
        `;
        this.elements.toastContainer?.appendChild(toast);
        // Auto-remove
        const timer = setTimeout(() => {
            this.removeToast(toast);
        }, duration);
        this.timers.toast.set(toastId, timer);
        // Pausar en hover
        toast.addEventListener('mouseenter', () => {
            const timer = this.timers.toast.get(toastId);
            if (timer) {
                clearTimeout(timer);
            }
        });
        toast.addEventListener('mouseleave', () => {
            const newTimer = setTimeout(() => {
                this.removeToast(toast);
            }, 1000); // Tiempo reducido al salir del hover
            this.timers.toast.set(toastId, newTimer);
        });
    }
    /**
     * Remueve un toast
     */
    removeToast(toastElement) {
        if (toastElement && toastElement.parentElement) {
            toastElement.style.animation = 'slideOutRight 0.3s ease-in-out forwards';
            setTimeout(() => {
                if (toastElement.parentElement) {
                    toastElement.parentElement.removeChild(toastElement);
                }
            }, 300);
            // Limpiar timer
            const toastId = toastElement.id.split('-')[1];
            if (this.timers.toast.has(toastId)) {
                clearTimeout(this.timers.toast.get(toastId));
                this.timers.toast.delete(toastId);
            }
        }
    }
    /**
     * Obtiene icono de toast según tipo
     */
    getToastIcon(type) {
        const icons = {
            success: 'bi-check-circle-fill',
            error: 'bi-x-circle-fill',
            warning: 'bi-exclamation-triangle-fill',
            info: 'bi-info-circle-fill'
        };
        return icons[type] || icons.info;
    }
    /**
     * Obtiene color de fondo del icono
     */
    getToastIconBg(type) {
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };
        return colors[type] || colors.info;
    }
    /**
     * Obtiene color de la barra de progreso
     */
    getToastProgressBg(type) {
        const colors = {
            success: 'bg-green-400',
            error: 'bg-red-400',
            warning: 'bg-yellow-400',
            info: 'bg-blue-400'
        };
        return colors[type] || colors.info;
    }
    /**
     * Guarda configuraciones de usuario
     */
    saveUserSettings() {
        try {
            localStorage.setItem(
                this.config.storageKeys.userSettings,
                JSON.stringify(this.state.settings)
            );
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }
    /**
     * Métodos públicos para acceso externo
     */
    goToSection(section) {
        this.navigateToSection(section);
    }
    getState() {
        return { ...this.state };
    }
    updateSettings(newSettings) {
        this.state.settings = { ...this.state.settings, ...newSettings };
        this.saveUserSettings();
        // Aplicar configuraciones inmediatamente
        if (newSettings.animations !== undefined) {
            document.body.classList.toggle('no-animations', !newSettings.animations);
        }
    }
    /**
     * Limpieza de recursos
     */
    destroy() {
        // Limpiar todos los timers
        Object.values(this.timers).forEach(timer => {
            if (timer instanceof Map) {
                timer.forEach(t => clearTimeout(t));
                timer.clear();
            } else if (timer) {
                clearTimeout(timer);
            }
        });
        // Guardar estado final
        this.saveUserSettings();
        console.log('Aplicación limpiada correctamente');
    }
}
/**
 * ===========================================
 * INICIALIZACIÓN Y CONFIGURACIÓN GLOBAL
 * ===========================================
 */
// Variable global
let GalaxWykiInstance = null;
/**
 * Inicialización cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        GalaxWykiInstance = new GalaxWykiApp();
        window.GalaxWykiInstance = GalaxWykiInstance;
        // Incrementar contador de sesiones
        const sessions = parseInt(localStorage.getItem('galaxwyki-sessions') || '0') + 1;
        localStorage.setItem('galaxwyki-sessions', sessions.toString());
        // Configurar manejo de errores globales
        window.addEventListener('error', (e) => {
            console.error('Error global:', e.error);
            GalaxWykiInstance?.showToast('Error inesperado en la aplicación', 'error');
        });
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promesa rechazada:', e.reason);
            GalaxWykiInstance?.showToast('Error en operación asíncrona', 'error');
        });
    } catch (error) {
        console.error('Error fatal:', error);
        document.body.innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div class="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md mx-4">
                    <div class="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="bi bi-exclamation-triangle text-red-500 text-2xl"></i>
                    </div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Error de Inicialización</h1>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">Ha ocurrido un error al cargar GalaxWyki.</p>
                    <button onclick="location.reload()" 
                            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                        Recargar Página
                    </button>
                </div>
            </div>
        `;
    }
});
/**
 * Limpieza al salir
 */
window.addEventListener('beforeunload', () => {
    if (GalaxWykiInstance) {
        GalaxWykiInstance.destroy();
    }
});
/**
 * ===========================================
 * UTILIDADES GLOBALES
 * ===========================================
 */
// Formatear fechas
function formatDate(date, options = {}) {
    const defaultOptions = {
// Formatear fechas
function formatDate(date, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Intl.DateTimeFormat('es-ES', {...defaultOptions, ...options}).format(new Date(date));
}
// Función de debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
// Generar IDs únicos
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
// Detectar dispositivos móviles
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
// Obtener información del navegador
function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';
    return {
        name: browser,
        userAgent: ua,
        language: navigator.language,
        platform: navigator.platform,
        online: navigator.onLine
    };
}
// Validar email
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
// Sanitizar texto
function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
// Formatear números
function formatNumber(num, options = {}) {
    return new Intl.NumberFormat('es-ES', options).format(num);
}
// Copiar al portapapeles
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        GalaxWykiInstance?.showToast('Copiado al portapapeles', 'success', { duration: 2000 });
        return true;
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        GalaxWykiInstance?.showToast('Error al copiar', 'error');
        return false;
    }
}
// Compartir contenido (Web Share API)
async function shareContent(title, text, url) {
    if (navigator.share) {
        try {
            await navigator.share({ title, text, url });
            return true;
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error sharing:', error);
            }
            return false;
        }
    } else {
        // Fallback: copiar URL
        return await copyToClipboard(url || window.location.href);
    }
}
/**
 * ===========================================
 * API PARA DESARROLLADORES
 * ===========================================
 */
// Exponer utilidades para debugging en desarrollo
if (window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1') || window.location.hostname.includes('dev')) {
    window.GalaxWykiDebug = {
        // Navegación
        goTo: (section) => GalaxWykiInstance?.goToSection(section),
        getState: () => GalaxWykiInstance?.getState(),
        // Tema y UI
        toggleTheme: () => GalaxWykiInstance?.toggleTheme(),
        toggleSidebar: () => GalaxWykiInstance?.toggleSidebar(),
        // Búsqueda y navegación
        search: (term) => GalaxWykiInstance?.performSearch(term),
        clearSearch: () => GalaxWykiInstance?.clearSearch(),
        // Notificaciones
        toast: (msg, type, options) => GalaxWykiInstance?.showToast(msg, type, options),
        // Configuraciones
        updateSettings: (settings) => GalaxWykiInstance?.updateSettings(settings),
        // Utilidades de storage
        clearStorage: () => {
            Object.keys(localStorage)
                .filter(key => key.startsWith('galaxwyki-'))
                .forEach(key => localStorage.removeItem(key));
            console.log('💾 Storage limpiado');
            location.reload();
        },
        exportSettings: () => {
            const settings = {};
            Object.keys(localStorage)
                .filter(key => key.startsWith('galaxwyki-'))
                .forEach(key => {
                    try {
                        settings[key] = JSON.parse(localStorage.getItem(key));
                    } catch {
                        settings[key] = localStorage.getItem(key);
                    }
                });
            console.log('📤 Configuración exportada:', settings);
            return settings;
        },
        importSettings: (settings) => {
            Object.keys(settings).forEach(key => {
                const value = typeof settings[key] === 'object' ? 
                    JSON.stringify(settings[key]) : settings[key];
                localStorage.setItem(key, value);
            });
            console.log('📥 Configuración importada');
            location.reload();
        },
        // Información del sistema
        getSystemInfo: () => ({
            version: '4.0.0',
            browser: getBrowserInfo(),
            mobile: isMobileDevice(),
            performance: {
                memory: performance.memory ? {
                    used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                    total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                    limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
                } : 'No disponible',
                timing: performance.timing,
                navigation: performance.navigation
            },
            storage: {
                used: new Blob(Object.values(localStorage)).size,
                available: 5 * 1024 * 1024 // ~5MB típico
            },
            features: {
                webShare: 'share' in navigator,
                clipboard: 'clipboard' in navigator,
                serviceWorker: 'serviceWorker' in navigator,
                pushManager: 'PushManager' in window,
                notifications: 'Notification' in window
            }
        }),
        // Simulaciones para testing
        simulateError: () => {
            throw new Error('Error simulado para testing');
        },
        simulateSlowNetwork: (delay = 3000) => {
            const originalFetch = window.fetch;
            window.fetch = (...args) => {
                return new Promise(resolve => {
                    setTimeout(() => resolve(originalFetch(...args)), delay);
                });
            };
            console.log(`🐌 Red lenta simulada (${delay}ms de delay)`);
            // Restaurar después de 30 segundos
            setTimeout(() => {
                window.fetch = originalFetch;
                console.log('⚡ Red restaurada a velocidad normal');
            }, 30000);
        },
        // Métricas y estadísticas
        getMetrics: () => {
            const state = GalaxWykiInstance?.getState();
            return {
                sessionDuration: Date.now() - (performance.timing.navigationStart || Date.now()),
                sectionsVisited: Object.keys(localStorage).filter(k => k.includes('visited')).length,
                searchesPerformed: parseInt(localStorage.getItem('galaxwyki-search-count') || '0'),
                themeToggles: parseInt(localStorage.getItem('galaxwyki-theme-toggles') || '0'),
                currentState: state,
                errors: window.GalaxWykiErrors || []
            };
        }
    };
    console.log(`
    🔧 GalaxWyki Debug Mode v4.0
    Comandos disponibles:
    - GalaxWykiDebug.goTo('section') - Navegar a sección
    - GalaxWykiDebug.toggleTheme() - Cambiar tema
    - GalaxWykiDebug.toggleSidebar() - Toggle sidebar
    - GalaxWykiDebug.search('término') - Buscar
    - GalaxWykiDebug.toast('mensaje', 'tipo') - Mostrar toast
    - GalaxWykiDebug.getState() - Estado actual
    - GalaxWykiDebug.getSystemInfo() - Info del sistema
    - GalaxWykiDebug.getMetrics() - Métricas de uso
    - GalaxWykiDebug.clearStorage() - Limpiar datos
    - GalaxWykiDebug.exportSettings() - Exportar configuración
    - GalaxWykiDebug.importSettings(obj) - Importar configuración
    - GalaxWykiDebug.simulateError() - Simular error
    - GalaxWykiDebug.simulateSlowNetwork(delay) - Simular red lenta
    `);
}
/**
 * ===========================================
 * PROGRESSIVE WEB APP SETUP
 * ===========================================
 */
// Registro de Service Worker (opcional)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('✅ Service Worker registrado:', registration);
        } catch (error) {
            console.log('❌ Error registrando Service Worker:', error);
        }
    });
}
// Configurar manejo de instalación PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // Mostrar botón de instalación personalizado si se desea
    GalaxWykiInstance?.showToast('¡Instala GalaxWyki como app!', 'info', {
        icon: 'bi-download',
        duration: 6000
    });
});
window.addEventListener('appinstalled', () => {
    GalaxWykiInstance?.showToast('¡GalaxWyki instalado correctamente!', 'success');
    deferredPrompt = null;
});
/**
 * ===========================================
 * ANIMACIONES Y ESTILOS DINÁMICOS
 * ===========================================
 */
// Agregar estilos CSS dinámicos adicionales
const dynamicStyles = `
    /* Animaciones adicionales para toasts */
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    @keyframes slideInUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    /* Mejoras para modo sin animaciones */
    .no-animations *,
    .no-animations *::before,
    .no-animations *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    /* Estilos para highlighting en búsqueda */
    mark {
        background: linear-gradient(135deg, #fef08a, #facc15);
        color: #374151;
        padding: 0.125rem 0.25rem;
        border-radius: 0.25rem;
        font-weight: 600;
    }
    .dark mark {
        background: linear-gradient(135deg, #ca8a04, #eab308);
        color: #111827;
    }
    /* Loading spinner mejorado */
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #e5e7eb;
        border-top: 4px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    .dark .loading-spinner {
        border-color: #374151;
        border-top-color: #60a5fa;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    /* Efectos de hover mejorados para botones */
    .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }
    .btn:active {
        transform: translateY(0);
    }
    /* Scroll suave para toda la aplicación */
    html {
        scroll-behavior: smooth;
    }
    /* Mejoras de accesibilidad */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
    /* Focus visible para elementos interactivos */
    .focus-visible:focus-visible {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
    }
`;
// Crear e insertar estilos dinámicos
if (!document.getElementById('galaxwyki-dynamic-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'galaxwyki-dynamic-styles';
    styleSheet.textContent = dynamicStyles;
    document.head.appendChild(styleSheet);
}
/**
 * ===========================================
 * CONFIGURACIÓN DE RENDIMIENTO
 * ===========================================
 */
// Optimizaciones de rendimiento
if (window.requestIdleCallback) {
    requestIdleCallback(() => {
        // Precargar recursos no críticos
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = '/api/data.json'; // Ejemplo
        document.head.appendChild(link);
        console.log('🚀 Recursos precargados en idle time');
    });
}
// Configurar Intersection Observer para animaciones lazy
if ('IntersectionObserver' in window) {
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                animationObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    // Observar elementos que necesiten animaciones lazy
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.style.animationPlayState = 'paused';
            animationObserver.observe(el);
        });
    });
}
/**
 * ===========================================
 * MANEJO DE ERRORES GLOBAL
 * ===========================================
 */
// Colector de errores para debugging
window.GalaxWykiErrors = [];
// Capturar errores JavaScript
window.addEventListener('error', (event) => {
    const error = {
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    window.GalaxWykiErrors.push(error);
    // Mantener solo los últimos 10 errores
    if (window.GalaxWykiErrors.length > 10) {
        window.GalaxWykiErrors.shift();
    }
    console.error('🚨 Error capturado:', error);
});
// Capturar promesas rechazadas
window.addEventListener('unhandledrejection', (event) => {
    const error = {
        type: 'unhandled_promise_rejection',
        reason: event.reason,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    window.GalaxWykiErrors.push(error);
    if (window.GalaxWykiErrors.length > 10) {
        window.GalaxWykiErrors.shift();
    }
    console.error('🚨 Promesa rechazada capturada:', error);
});
/**
 * ===========================================
 * FINALIZACIÓN
 * ===========================================
 */
// Marcar como completamente cargado
window.addEventListener('load', () => {
    window.GalaxWykiLoaded = true;
    // Dispatchar evento personalizado
    document.dispatchEvent(new CustomEvent('galaxwyki:loaded', {
        detail: { 
            version: '4.0.0', 
            timestamp: Date.now(),
            performance: performance.now() 
        }
    }));
    console.log('🎉 GalaxWyki v4.0 completamente cargado y optimizado');
});
// Log de finalización del script
console.log('📜 Script GalaxWyki v4.0 ejecutado correctamente');
