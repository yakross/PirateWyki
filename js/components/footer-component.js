class WikiFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const basePath = this.getAttribute('basepath') || '';
        const currentYear = new Date().getFullYear();

        this.innerHTML = `
        <footer class="site-footer bg-slate-950 border-t border-slate-800 pt-16 pb-8 mt-24">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    
                    <!-- Branding Col -->
                    <div class="flex flex-col gap-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white text-lg shadow-lg">
                                <i class="fas fa-rocket"></i>
                            </div>
                            <div class="flex flex-col">
                                <span class="text-xl font-bold text-white tracking-tight">GalaxWiki</span>
                                <span class="text-[10px] text-slate-400 tracking-wider uppercase font-medium">Pirate Galaxy</span>
                            </div>
                        </div>
                        <p class="text-sm text-slate-400 leading-relaxed max-w-xs mt-2">
                            La enciclopedia comunitaria definitiva. Encuentra toda la información sobre naves, sistemas, y componentes para dominar el universo.
                        </p>
                    </div>

                    <!-- Links Rapidos -->
                    <div class="flex flex-col gap-4">
                        <h4 class="text-white font-semibold flex items-center gap-2">
                            <i class="fas fa-link text-blue-500 text-sm"></i> Accesos Rápidos
                        </h4>
                        <nav class="flex flex-col gap-2" aria-label="Enlaces rápidos">
                            <a href="${basePath}index.html" class="text-sm text-slate-400 hover:text-blue-400 transition-colors inline-block w-fit">Inicio</a>
                            <a href="${basePath}pages/wiki/ships.html" class="text-sm text-slate-400 hover:text-blue-400 transition-colors inline-block w-fit">Base de Naves</a>
                            <a href="${basePath}pages/wiki/components.html" class="text-sm text-slate-400 hover:text-blue-400 transition-colors inline-block w-fit">Componentes</a>
                            <a href="${basePath}pages/forum.html" class="text-sm text-slate-400 hover:text-blue-400 transition-colors inline-block w-fit">Foro Comunitario</a>
                        </nav>
                    </div>

                    <!-- Comunidad -->
                    <div class="flex flex-col gap-4">
                        <h4 class="text-white font-semibold flex items-center gap-2">
                            <i class="fas fa-users text-purple-500 text-sm"></i> Comunidad
                        </h4>
                        <p class="text-sm text-slate-400 mb-2">
                            Únete y contribuye a la mayor base de datos hispana de Pirate Galaxy.
                        </p>
                        <div class="flex gap-3">
                            <!-- Placeholder botones sociales -->
                            <a href="#" class="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                                <i class="fab fa-discord"></i>
                            </a>
                            <a href="#" class="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-400 hover:text-white transition-all">
                                <i class="fab fa-twitter"></i>
                            </a>
                        </div>
                    </div>

                </div>

                <div class="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p class="text-xs text-slate-500">
                        &copy; ${currentYear} GalaxWiki. Una herramienta no oficial creada por fans.
                    </p>
                    <p class="text-xs text-slate-500">
                        "Pirate Galaxy" es una marca registrada de <span class="text-slate-400 font-medium">Splitscreen Studios GmbH</span>.
                    </p>
                </div>
            </div>
        </footer>
        `;
    }
}

customElements.define('wiki-footer', WikiFooter);
