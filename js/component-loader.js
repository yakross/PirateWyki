// js/component-loader.js
// Sistema de componentes reutilizables para HTML puro

class ComponentLoader {
    constructor() {
        this.components = {};
        this.loadedCount = 0;
        this.totalComponents = 0;
    }

    // Cargar un componente desde un archivo
    async loadComponent(name, path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load ${name}: ${response.statusText}`);
            }
            const html = await response.text();
            this.components[name] = html;
            return html;
        } catch (error) {
            console.error(`Error loading component ${name}:`, error);
            return `<div class="error">Component ${name} not found</div>`;
        }
    }

    // Insertar componente en el DOM
    insertComponent(elementId, componentName) {
        const element = document.getElementById(elementId);
        if (element && this.components[componentName]) {
            element.innerHTML = this.components[componentName];
            
            // Reinicializar scripts dentro del componente
            this.executeScripts(element);
            
            // Reinicializar iconos Lucide si existen
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    // Ejecutar scripts dentro de componentes cargados
    executeScripts(container) {
        const scripts = container.querySelectorAll('script');
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            newScript.textContent = script.textContent;
            document.body.appendChild(newScript);
        });
    }

    // Cargar múltiples componentes
    async loadAll(components) {
        this.totalComponents = Object.keys(components).length;
        const promises = Object.entries(components).map(([name, path]) => 
            this.loadComponent(name, path)
        );
        await Promise.all(promises);
    }

    // Renderizar todos los componentes en la página
    renderAll(mappings) {
        Object.entries(mappings).forEach(([elementId, componentName]) => {
            this.insertComponent(elementId, componentName);
        });
    }
}

// Instancia global
const componentLoader = new ComponentLoader();

if (!window.location.pathname.includes('admin-panel.html')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initComponents);
    } else {
        initComponents();
    }
}

// Función helper para inicializar componentes en una página
async function initComponents() {
    // Definir qué componentes cargar
    await componentLoader.loadAll({
        'header': 'components/header.html',
        'gameNavbar': 'components/game-navbar.html',
        'footer': 'components/footer.html',
        'shipViewer': 'components/ship-viewer.html'
    });

    // Mapear componentes a elementos del DOM
    componentLoader.renderAll({
        'header-placeholder': 'header',
        'game-navbar-placeholder': 'gameNavbar',
        'footer-placeholder': 'footer',
        'ship-viewer-placeholder': 'shipViewer'
    });
}

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
} else {
    initComponents();
}