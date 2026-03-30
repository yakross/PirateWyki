class WikiNav extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const basePath = this.getAttribute('basepath') || '';
        // Obtenemos la ruta actual para marcar el link activo
        const currentPath = window.location.pathname;

        const links = [
            { href: `${basePath}index.html`, icon: 'fa-home', text: 'Inicio', match: 'index.html' },
            { href: `${basePath}pages/wiki/ships.html`, icon: 'fa-space-shuttle', text: 'Naves', match: 'ships.html' },
            { href: `${basePath}pages/wiki/components.html`, icon: 'fa-cog', text: 'Componentes', match: 'components.html' },
            { href: `${basePath}pages/wiki/enemies.html`, icon: 'fa-skull', text: 'Enemigos', match: 'enemies.html' },
            { href: `${basePath}pages/wiki/systems.html`, icon: 'fa-globe', text: 'Sistemas', match: 'systems.html' },
            { href: `${basePath}pages/wiki/missions.html`, icon: 'fa-tasks', text: 'Misiones', match: 'missions.html' },
            { href: `${basePath}pages/wiki/misc-info.html`, icon: 'fa-info-circle', text: 'Misc', match: 'misc-info.html' },
            { href: `${basePath}pages/wiki/calculator.html`, icon: 'fa-calculator', text: 'Calculadora', match: 'calculator.html' },
            { href: `${basePath}pages/forum.html`, icon: 'fa-comments', text: 'Foro', match: 'forum.html' },
            { href: `${basePath}pages/news.html`, icon: 'fa-newspaper', text: 'Noticias', match: 'news.html' }
        ];

        let linksHtml = '';
        links.forEach(link => {
            // Lógica simple para determinar cuál es el enlace activo
            const isActive = currentPath.includes(link.match);
            const activeClass = isActive ? 'active' : '';
            linksHtml += `
                <li class="nav-item">
                    <a href="${link.href}" class="nav-link ${activeClass}">
                        <i class="fas ${link.icon} nav-icon"></i>
                        <p>${link.text}</p>
                    </a>
                </li>
            `;
        });

        this.innerHTML = `
            <nav class="navigation">
                <div class="nav-content">
                    <ul class="nav-links">
                        ${linksHtml}
                    </ul>
                </div>
            </nav>
        `;
    }
}

customElements.define('wiki-nav', WikiNav);
