// ============================================
// DATA SYNC SYSTEM v3.0
// Sistema de sincronización entre Admin Panel y páginas públicas
// ============================================

class DataSync {
    constructor() {
        this.STORAGE_KEYS = {
            ships: 'pirate-ships-db',
            components: 'pirate-components-db',
            planets: 'pirate-planets-db',
            systems: 'pirate-systems-db'
        };
        
        this.API_ENDPOINTS = {
            ships: 'data/ships.json',
            components: 'data/components.json',
            planets: 'data/planets.json',
            systems: 'data/systems.json'
        };
        
        this.cache = {};
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutos
        
        console.log('[DataSync] Inicializado v3.0');
    }
    
    // ============================================
    // OBTENER DATOS (Prioridad: localStorage > JSON > Cache)
    // ============================================
    
    async getShips(forceRefresh = false) {
        return this.getData('ships', forceRefresh);
    }
    
    async getComponents(forceRefresh = false) {
        return this.getData('components', forceRefresh);
    }
    
    async getPlanets(forceRefresh = false) {
        return this.getData('planets', forceRefresh);
    }
    
    async getSystems(forceRefresh = false) {
        return this.getData('systems', forceRefresh);
    }
    
    async getData(type, forceRefresh = false) {
        // 1. Verificar caché si no se fuerza refresh
        if (!forceRefresh && this.cache[type] && this.cache[type].expiry > Date.now()) {
            console.log(`[DataSync] Usando caché para ${type} (${this.cache[type].data.length} items)`);
            return this.cache[type].data;
        }
        
        // 2. Intentar obtener desde localStorage (datos del admin)
        const localData = this.getFromLocalStorage(type);
        if (localData && localData.length > 0) {
            console.log(`[DataSync] ✅ Datos de ${type} desde localStorage (Admin):`, localData.length);
            this.updateCache(type, localData);
            return localData;
        }
        
        // 3. Si no hay datos locales, cargar desde JSON
        try {
            console.log(`[DataSync] 📄 Cargando ${type} desde JSON...`);
            const jsonData = await this.loadFromJSON(type);
            this.updateCache(type, jsonData);
            console.log(`[DataSync] ✅ ${type} cargado desde JSON:`, jsonData.length);
            return jsonData;
        } catch (error) {
            console.error(`[DataSync] ❌ Error cargando ${type}:`, error);
            return [];
        }
    }
    
    // ============================================
    // LEER DESDE LOCALSTORAGE
    // ============================================
    
    getFromLocalStorage(type) {
        try {
            const key = this.STORAGE_KEYS[type];
            const raw = localStorage.getItem(key);
            if (!raw) return [];
            
            const data = JSON.parse(raw);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error(`[DataSync] Error leyendo localStorage[${type}]:`, error);
            return [];
        }
    }
    
    // ============================================
    // CARGAR DESDE JSON
    // ============================================
    
    async loadFromJSON(type) {
        const endpoint = this.API_ENDPOINTS[type];
        const response = await fetch(endpoint);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Extraer array según estructura
        if (type === 'ships' && data.ships) {
            return this.normalizeShips(data.ships);
        }
        
        if (Array.isArray(data)) {
            return data;
        }
        
        return data[type] || [];
    }
    
    // ============================================
    // NORMALIZACIÓN DE DATOS
    // ============================================
    
    normalizeShips(ships) {
        return ships.map(ship => {
            // Si ya tiene la estructura nueva del admin, devolverla tal cual
            if (ship.armors && Array.isArray(ship.armors)) {
                return ship;
            }
            
            // Si tiene estructura antigua, convertirla
            return {
                id: ship.id,
                name: ship.name,
                classes: ship.type ? [ship.type] : [],
                level: ship.level || 1,
                system: ship.system || 'sol',
                
                armorIndex: ship.hull || 0,
                speed: ship.speed || 0,
                performance: 0,
                
                armors: [],
                componentSlots: (ship.weaponSlots || 0) + (ship.shieldSlots || 0) + (ship.engineSlots || 0) + (ship.specialSlots || 0),
                slotComponents: [],
                
                crionita: ship.credits || 0,
                oro: 0,
                sellPrice: Math.floor((ship.credits || 0) * 0.5),
                
                cortexSlots: [],
                droneSlots: [],
                
                paintCost: 0,
                renameCost: 0,
                
                obtainMethod: 'tienda',
                obtainLocation: ship.blueprint || '',
                blueprintsRequired: 0,
                requirements: [],
                
                image2D: ship.imageUrl || null,
                model3D: null,
                description: ship.description || '',
                lore: '',
                
                metadata: {
                    tier: ship.tier || 1,
                    class: ship.class || 'Unknown',
                    featured: ship.featured || false,
                    popular: ship.popular || false,
                    isHybrid: ship.isHybrid || false,
                    isSpecial: ship.isSpecial || false,
                    createdAt: new Date().toISOString()
                }
            };
        });
    }
    
    // ============================================
    // GESTIÓN DE CACHÉ
    // ============================================
    
    updateCache(type, data) {
        this.cache[type] = {
            data: data,
            expiry: Date.now() + this.cacheExpiry,
            timestamp: Date.now()
        };
    }
    
    clearCache(type = null) {
        if (type) {
            delete this.cache[type];
            console.log(`[DataSync] Caché limpiado para ${type}`);
        } else {
            this.cache = {};
            console.log('[DataSync] Caché completo limpiado');
        }
    }
    
    // ============================================
    // BUSCAR POR ID
    // ============================================
    
    async getShipById(id) {
        const ships = await this.getShips();
        return ships.find(ship => ship.id === id);
    }
    
    async getComponentById(id) {
        const components = await this.getComponents();
        return components.find(comp => comp.id === id);
    }
    
    async getPlanetById(id) {
        const planets = await this.getPlanets();
        return planets.find(planet => planet.id === id);
    }
    
    async getSystemById(id) {
        const systems = await this.getSystems();
        return systems.find(system => system.id === id);
    }
    
    // ============================================
    // FILTROS Y BÚSQUEDA
    // ============================================
    
    async searchShips(query, filters = {}) {
        const ships = await this.getShips();
        let results = ships;
        
        // Búsqueda por texto
        if (query && query.trim() !== '') {
            const q = query.toLowerCase();
            results = results.filter(ship => 
                ship.name.toLowerCase().includes(q) ||
                ship.description?.toLowerCase().includes(q) ||
                (Array.isArray(ship.classes) && ship.classes.some(c => c.toLowerCase().includes(q)))
            );
        }
        
        // Filtro por sistema
        if (filters.system && filters.system !== 'all') {
            results = results.filter(ship => ship.system === filters.system);
        }
        
        // Filtro por clase
        if (filters.class && filters.class !== 'all') {
            results = results.filter(ship => 
                Array.isArray(ship.classes) ? ship.classes.includes(filters.class) : ship.type === filters.class
            );
        }
        
        // Filtro por nivel
        if (filters.minLevel) {
            results = results.filter(ship => ship.level >= filters.minLevel);
        }
        
        if (filters.maxLevel) {
            results = results.filter(ship => ship.level <= filters.maxLevel);
        }
        
        // Filtro por tier
        if (filters.tier && filters.tier !== 'all') {
            results = results.filter(ship => ship.metadata?.tier === parseInt(filters.tier));
        }
        
        // Filtro por método de obtención
        if (filters.obtainMethod && filters.obtainMethod !== 'all') {
            results = results.filter(ship => ship.obtainMethod === filters.obtainMethod);
        }
        
        return results;
    }
    
    // ============================================
    // ESTADÍSTICAS
    // ============================================
    
    async getStats() {
        const [ships, components, planets, systems] = await Promise.all([
            this.getShips(),
            this.getComponents(),
            this.getPlanets(),
            this.getSystems()
        ]);
        
        return {
            ships: ships.length,
            components: components.length,
            planets: planets.length,
            systems: systems.length,
            lastSync: new Date().toISOString()
        };
    }
    
    // ============================================
    // UTILIDADES
    // ============================================
    
    async refreshAll() {
        console.log('[DataSync] Refrescando todos los datos...');
        this.clearCache();
        await Promise.all([
            this.getShips(true),
            this.getComponents(true),
            this.getPlanets(true),
            this.getSystems(true)
        ]);
        console.log('[DataSync] ✅ Refresh completo');
    }
    
    hasLocalData(type) {
        const data = this.getFromLocalStorage(type);
        return data && data.length > 0;
    }
    
    async getDataSource(type) {
        if (this.hasLocalData(type)) {
            return 'localStorage (Admin Panel)';
        }
        return `JSON (${this.API_ENDPOINTS[type]})`;
    }
    
    // Obtener información de sistemas
    async getSystemsInfo() {
        const ships = await this.getShips();
        const systemsSet = new Set(ships.map(s => s.system));
        return Array.from(systemsSet).sort();
    }
    
    // Obtener información de clases
    async getClassesInfo() {
        const ships = await this.getShips();
        const classesSet = new Set();
        ships.forEach(ship => {
            if (Array.isArray(ship.classes)) {
                ship.classes.forEach(c => classesSet.add(c));
            } else if (ship.type) {
                classesSet.add(ship.type);
            }
        });
        return Array.from(classesSet).sort();
    }
}

// ============================================
// INSTANCIA GLOBAL
// ============================================

const dataSync = new DataSync();
window.dataSync = dataSync;

// Auto-refresh cada 10 minutos
setInterval(() => {
    console.log('[DataSync] Auto-refresh programado');
    dataSync.clearCache();
}, 10 * 60 * 1000);