// js/data-loader.js
// Sistema centralizado para cargar y cachear datos JSON del juego
// ✨ Ahora soporta datos dinámicos del Admin Panel (localStorage)

class DataLoader {
    constructor() {
        this.cache = {};
        this.loading = {};
        
        // 🔥 NUEVO: Keys para localStorage del admin panel
        this.STORAGE_KEYS = {
            ships: 'pirate-ships-db',
            components: 'pirate-components-db',
            planets: 'pirate-planets-db',
            systems: 'pirate-systems-db'
        };
    }

    // Cargar archivo JSON con caché
    async loadJSON(filename) {
        if (this.cache[filename]) {
            return this.cache[filename];
        }

        if (this.loading[filename]) {
            return this.loading[filename];
        }

        this.loading[filename] = this._fetchJSON(filename);
        
        try {
            const data = await this.loading[filename];
            this.cache[filename] = data;
            delete this.loading[filename];
            return data;
        } catch (error) {
            delete this.loading[filename];
            throw error;
        }
    }

    async _fetchJSON(filename) {
        try {
            const response = await fetch(`data/${filename}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error loading ${filename}:`, error);
            throw error;
        }
    }

    // 🔥 NUEVO: Combina datos base (JSON) con datos del admin (localStorage)
    mergeWithLocalStorage(baseData, storageKey) {
        try {
            const storedData = localStorage.getItem(storageKey);
            if (!storedData) return baseData;

            const parsed = JSON.parse(storedData);
            if (!Array.isArray(parsed)) return baseData;

            // Filtrar solo datos válidos
            const validData = parsed.filter(item => item && item.id && item.name);
            
            if (validData.length > 0) {
                console.log(`[DataLoader] Mezclando ${baseData.length} base + ${validData.length} admin (${storageKey})`);
            }
            
            return [...baseData, ...validData];
        } catch (error) {
            console.warn('[DataLoader] Error al mezclar datos:', error);
            return baseData;
        }
    }

    // 🔥 NUEVO: Obtener datos solo de localStorage (fallback)
    getFromStorage(storageKey) {
        try {
            const stored = localStorage.getItem(storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }

    // ===== SHIPS =====
    
    // 🔥 MODIFICADO: Ahora mezcla JSON + localStorage
    async getShips() {
        try {
            const data = await this.loadJSON('ships.json');
            const baseShips = data.ships || [];
            return this.mergeWithLocalStorage(baseShips, this.STORAGE_KEYS.ships);
        } catch (error) {
            console.warn('[DataLoader] Usando solo localStorage para ships');
            return this.getFromStorage(this.STORAGE_KEYS.ships);
        }
    }

    async getShipById(id) {
        const ships = await this.getShips();
        return ships.find(ship => ship.id === id);
    }

    async getShipsByType(type) {
        const ships = await this.getShips();
        return ships.filter(ship => ship.type === type);
    }

    async getShipsBySystem(system) {
        const ships = await this.getShips();
        return ships.filter(ship => ship.system === system);
    }

    async getShipsByTier(tier) {
        const ships = await this.getShips();
        return ships.filter(ship => ship.tier === tier);
    }

    async getShipsByClass(shipClass) {
        const ships = await this.getShips();
        return ships.filter(ship => ship.class === shipClass);
    }

    async getSpecialShips() {
        const ships = await this.getShips();
        return ships.filter(ship => ship.isSpecial || ship.isElite || ship.isHybrid);
    }

    async searchShips(query) {
        const ships = await this.getShips();
        const q = query.toLowerCase();
        return ships.filter(ship => 
            ship.name.toLowerCase().includes(q) ||
            (ship.description && ship.description.toLowerCase().includes(q)) ||
            ship.type.toLowerCase().includes(q) ||
            ship.class.toLowerCase().includes(q)
        );
    }

    async getShipTypes() {
        const data = await this.loadJSON('ships.json');
        return data.shipTypes;
    }

    // ===== SYSTEMS =====
    
    // 🔥 MODIFICADO: Ahora mezcla JSON + localStorage
    async getSystems() {
        try {
            const data = await this.loadJSON('systems.json');
            const baseSystems = data.systems || [];
            return this.mergeWithLocalStorage(baseSystems, this.STORAGE_KEYS.systems);
        } catch (error) {
            console.warn('[DataLoader] Usando solo localStorage para systems');
            return this.getFromStorage(this.STORAGE_KEYS.systems);
        }
    }

    async getSystemById(id) {
        const systems = await this.getSystems();
        return systems.find(sys => sys.id === id);
    }

    async getSystemsByLevel(minLevel, maxLevel) {
        const systems = await this.getSystems();
        return systems.filter(sys => 
            sys.level >= minLevel && sys.level <= maxLevel
        );
    }

    async getPlanetsBySystem(systemId) {
        const system = await this.getSystemById(systemId);
        if (system && system.planets) {
            return system.planets;
        }
        
        // 🔥 NUEVO: Fallback a lista de planetas mezclada
        const allPlanets = await this.getPlanets();
        return allPlanets.filter(p => p.system === systemId);
    }

    // ===== PLANETS =====
    
    // 🔥 MODIFICADO: Ahora mezcla JSON + localStorage
    async getPlanets() {
        try {
            const data = await this.loadJSON('planets.json');
            const basePlanets = data.planets || [];
            return this.mergeWithLocalStorage(basePlanets, this.STORAGE_KEYS.planets);
        } catch (error) {
            console.warn('[DataLoader] Usando solo localStorage para planets');
            return this.getFromStorage(this.STORAGE_KEYS.planets);
        }
    }

    async getPlanetById(id) {
        const planets = await this.getPlanets();
        return planets.find(p => p.id === id);
    }

    // ===== MISSIONS =====
    
    async getMissions() {
        const data = await this.loadJSON('missions.json');
        return data.missions || [];
    }

    async getMissionsByType(type) {
        const missions = await this.getMissions();
        return missions.filter(m => m.type === type);
    }

    async getMissionsBySystem(system) {
        const missions = await this.getMissions();
        return missions.filter(m => m.system === system);
    }

    // ===== EQUIPMENT / COMPONENTS =====
    
    // 🔥 NUEVO: Alias para componentes (usa el mismo que equipment)
    async getComponents() {
        try {
            const data = await this.loadJSON('equipment.json');
            const baseComponents = data.equipment || data.components || [];
            return this.mergeWithLocalStorage(baseComponents, this.STORAGE_KEYS.components);
        } catch (error) {
            console.warn('[DataLoader] Usando solo localStorage para components');
            return this.getFromStorage(this.STORAGE_KEYS.components);
        }
    }
    
    async getEquipment() {
        return this.getComponents(); // Alias
    }

    async getEquipmentByType(type) {
        const equipment = await this.getEquipment();
        return equipment.filter(e => e.type === type);
    }

    async getEquipmentBySlot(slot) {
        const equipment = await this.getEquipment();
        return equipment.filter(e => e.slot === slot);
    }

    // ===== UTILITY METHODS =====

    // Limpiar caché
    clearCache(filename = null) {
        if (filename) {
            delete this.cache[filename];
        } else {
            this.cache = {};
        }
    }

    // Pre-cargar todos los datos importantes
    async preloadAll() {
        const files = ['ships.json', 'systems.json', 'planets.json'];
        await Promise.all(files.map(file => this.loadJSON(file)));
        console.log('[DataLoader] All data preloaded successfully');
    }

    // Obtener estadísticas generales
    async getStats() {
        const [ships, systems, planets, components] = await Promise.all([
            this.getShips(),
            this.getSystems(),
            this.getPlanets(),
            this.getComponents()
        ]);

        return {
            totalShips: ships.length,
            totalSystems: systems.length,
            totalPlanets: planets.length,
            totalComponents: components.length,
            shipsByType: this._countByProperty(ships, 'type'),
            shipsByTier: this._countByProperty(ships, 'tier'),
            shipsByClass: this._countByProperty(ships, 'class')
        };
    }

    _countByProperty(array, property) {
        return array.reduce((acc, item) => {
            const key = item[property];
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
    }

    // Comparar dos naves
    async compareShips(shipId1, shipId2) {
        const [ship1, ship2] = await Promise.all([
            this.getShipById(shipId1),
            this.getShipById(shipId2)
        ]);

        if (!ship1 || !ship2) {
            throw new Error('One or both ships not found');
        }

        return {
            ship1,
            ship2,
            comparison: {
                hull: this._compareValues(ship1.hull, ship2.hull),
                speed: this._compareValues(ship1.speed, ship2.speed),
                cargo: this._compareValues(ship1.cargo, ship2.cargo),
                energy: this._compareValues(ship1.energy, ship2.energy),
                weaponSlots: this._compareValues(ship1.weaponSlots, ship2.weaponSlots),
                shieldSlots: this._compareValues(ship1.shieldSlots, ship2.shieldSlots)
            }
        };
    }

    _compareValues(val1, val2) {
        const diff = val1 - val2;
        return {
            value1: val1,
            value2: val2,
            difference: diff,
            percentage: val2 !== 0 ? ((diff / val2) * 100).toFixed(1) : 0,
            winner: diff > 0 ? 'ship1' : diff < 0 ? 'ship2' : 'tie'
        };
    }

    // 🔥 NUEVO: Filtrar con múltiples criterios
    async filterShips(filters = {}) {
        const ships = await this.getShips();
        return ships.filter(ship => {
            if (filters.class && ship.class !== filters.class) return false;
            if (filters.type && ship.type !== filters.type) return false;
            if (filters.tier && ship.tier !== filters.tier) return false;
            if (filters.minLevel && ship.level < filters.minLevel) return false;
            if (filters.maxLevel && ship.level > filters.maxLevel) return false;
            if (filters.system && ship.system !== filters.system) return false;
            return true;
        });
    }
}

// Instancia global
const dataLoader = new DataLoader();

// Helper: Obtener parámetros de URL
function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
}

// Helper: Formatear números
function formatNumber(num) {
    return num.toLocaleString();
}

// Helper: Obtener color por tipo de nave
function getShipTypeColor(type) {
    const colors = {
        'storm': 'red',
        'tank': 'blue',
        'engineer': 'green',
        'shock': 'purple',
        'parsec': 'cyan',
        'neon': 'pink',
        'raven': 'orange'
    };
    return colors[type] || 'gray';
}

// Helper: Obtener icono por tipo de nave
function getShipTypeIcon(type) {
    const icons = {
        'storm': 'zap',
        'tank': 'shield',
        'engineer': 'wrench',
        'shock': 'activity',
        'parsec': 'sparkles',
        'neon': 'lightbulb',
        'raven': 'bird'
    };
    return icons[type] || 'rocket';
}

// Export para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DataLoader, dataLoader, getURLParams, formatNumber, getShipTypeColor, getShipTypeIcon };
}