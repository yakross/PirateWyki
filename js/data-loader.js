// js/data-loader.js
// Sistema centralizado para cargar y cachear datos JSON del juego

class DataLoader {
    constructor() {
        this.cache = {};
        this.loading = {};
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

    // ===== SHIPS =====
    
    async getShips() {
        const data = await this.loadJSON('ships.json');
        return data.ships;
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
            ship.description.toLowerCase().includes(q) ||
            ship.type.toLowerCase().includes(q) ||
            ship.class.toLowerCase().includes(q)
        );
    }

    async getShipTypes() {
        const data = await this.loadJSON('ships.json');
        return data.shipTypes;
    }

    // ===== SYSTEMS =====
    
    async getSystems() {
        const data = await this.loadJSON('systems.json');
        return data.systems;
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
        return system ? system.planets : [];
    }

    // ===== PLANETS =====
    
    async getPlanets() {
        const data = await this.loadJSON('planets.json');
        return data.planets || [];
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

    // ===== EQUIPMENT =====
    
    async getEquipment() {
        const data = await this.loadJSON('equipment.json');
        return data.equipment || [];
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
        console.log('All data preloaded successfully');
    }

    // Obtener estadísticas generales
    async getStats() {
        const [ships, systems] = await Promise.all([
            this.getShips(),
            this.getSystems()
        ]);

        return {
            totalShips: ships.length,
            totalSystems: systems.length,
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