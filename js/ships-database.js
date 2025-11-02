// ============================================
// SHIPS DATABASE v3.0
// Funciones específicas para gestionar naves
// ============================================

class ShipsDatabase {
    constructor() {
        this.dataSync = null;
        this.ready = false;
        this.init();
    }
    
    async init() {
        // Esperar a que dataSync esté disponible
        let attempts = 0;
        while (!window.dataSync && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (window.dataSync) {
            this.dataSync = window.dataSync;
            this.ready = true;
            console.log('[ShipsDB] ✅ Inicializado correctamente');
        } else {
            console.error('[ShipsDB] ❌ No se pudo conectar con DataSync');
        }
    }
    
    async waitForReady() {
        while (!this.ready) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    // ============================================
    // OBTENER NAVES
    // ============================================
    
    async getAllShips() {
        await this.waitForReady();
        return await this.dataSync.getShips();
    }
    
    async getShipById(id) {
        await this.waitForReady();
        return await this.dataSync.getShipById(id);
    }
    
    async getShipsBySystem(system) {
        const ships = await this.getAllShips();
        return ships.filter(ship => ship.system === system);
    }
    
    async getShipsByClass(className) {
        const ships = await this.getAllShips();
        return ships.filter(ship => {
            if (Array.isArray(ship.classes)) {
                return ship.classes.includes(className);
            }
            return ship.type === className;
        });
    }
    
    async getShipsByLevel(minLevel, maxLevel = 100) {
        const ships = await this.getAllShips();
        return ships.filter(ship => ship.level >= minLevel && ship.level <= maxLevel);
    }
    
    async getShipsByTier(tier) {
        const ships = await this.getAllShips();
        return ships.filter(ship => ship.metadata?.tier === tier);
    }
    
    async getFeaturedShips() {
        const ships = await this.getAllShips();
        return ships.filter(ship => ship.metadata?.featured === true);
    }
    
    async getPopularShips() {
        const ships = await this.getAllShips();
        return ships.filter(ship => ship.metadata?.popular === true);
    }
    
    async getHybridShips() {
        const ships = await this.getAllShips();
        return ships.filter(ship => ship.metadata?.isHybrid === true);
    }
    
    async getSpecialShips() {
        const ships = await this.getAllShips();
        return ships.filter(ship => ship.metadata?.isSpecial === true || ship.metadata?.isElite === true);
    }
    
    // ============================================
    // BÚSQUEDA AVANZADA
    // ============================================
    
    async search(query, filters = {}) {
        await this.waitForReady();
        return await this.dataSync.searchShips(query, filters);
    }
    
    // ============================================
    // CALCULADORAS DE PRECIOS
    // ============================================
    
    getCortexSlotPrice(ship, slotNumber) {
        if (!ship.cortexSlots || !Array.isArray(ship.cortexSlots)) return 0;
        const slot = ship.cortexSlots.find(s => s.slot === slotNumber);
        return slot ? slot.buyPrice : 0;
    }
    
    getCortexSlotSellPrice(ship, slotNumber) {
        if (!ship.cortexSlots || !Array.isArray(ship.cortexSlots)) return 0;
        const slot = ship.cortexSlots.find(s => s.slot === slotNumber);
        return slot ? slot.sellPrice : 0;
    }
    
    getDroneSlotPrice(ship, slotNumber) {
        if (!ship.droneSlots || !Array.isArray(ship.droneSlots)) return 0;
        const slot = ship.droneSlots.find(s => s.slot === slotNumber);
        return slot ? slot.buyPrice : 0;
    }
    
    getDroneSlotSellPrice(ship, slotNumber) {
        if (!ship.droneSlots || !Array.isArray(ship.droneSlots)) return 0;
        const slot = ship.droneSlots.find(s => s.slot === slotNumber);
        return slot ? slot.sellPrice : 0;
    }
    
    getArmorByName(ship, armorName) {
        if (!ship.armors || !Array.isArray(ship.armors)) return null;
        return ship.armors.find(a => a.name === armorName);
    }
    
    getArmorPrice(ship, armorName) {
        const armor = this.getArmorByName(ship, armorName);
        return armor ? armor.price : 0;
    }
    
    getArmorSellPrice(ship, armorName) {
        const armor = this.getArmorByName(ship, armorName);
        return armor ? armor.sellPrice : 0;
    }
    
    getTotalCortexCost(ship, slotsCount = null) {
        if (!ship.cortexSlots || !Array.isArray(ship.cortexSlots)) return 0;
        const slots = slotsCount 
            ? ship.cortexSlots.slice(0, slotsCount)
            : ship.cortexSlots;
        return slots.reduce((sum, slot) => sum + (slot.buyPrice || 0), 0);
    }
    
    getTotalDroneCost(ship, slotsCount = null) {
        if (!ship.droneSlots || !Array.isArray(ship.droneSlots)) return 0;
        const slots = slotsCount 
            ? ship.droneSlots.slice(0, slotsCount)
            : ship.droneSlots;
        return slots.reduce((sum, slot) => sum + (slot.buyPrice || 0), 0);
    }
    
    getTotalArmorsCost(ship) {
        if (!ship.armors || !Array.isArray(ship.armors)) return 0;
        return ship.armors.reduce((sum, armor) => sum + (armor.price || 0), 0);
    }
    
    getFullUpgradeCost(ship) {
        const cortexCost = this.getTotalCortexCost(ship);
        const droneCost = this.getTotalDroneCost(ship);
        const armorsCost = this.getTotalArmorsCost(ship);
        const baseCost = ship.crionita || 0;
        
        return {
            base: baseCost,
            armors: armorsCost,
            cortex: cortexCost,
            drones: droneCost,
            misc: (ship.paintCost || 0) + (ship.renameCost || 0),
            total: baseCost + armorsCost + cortexCost + droneCost
        };
    }
    
    // ============================================
    // COMPARADOR
    // ============================================
    
    compareShips(ship1, ship2) {
        return {
            name: [ship1.name, ship2.name],
            level: [ship1.level, ship2.level],
            armor: [ship1.armorIndex, ship2.armorIndex],
            speed: [ship1.speed, ship2.speed],
            performance: [ship1.performance, ship2.performance],
            componentSlots: [ship1.componentSlots, ship2.componentSlots],
            crionita: [ship1.crionita, ship2.crionita],
            oro: [ship1.oro || 0, ship2.oro || 0],
            totalUpgradeCost: [
                this.getFullUpgradeCost(ship1).total,
                this.getFullUpgradeCost(ship2).total
            ]
        };
    }
    
    // ============================================
    // UTILIDADES
    // ============================================
    
    formatNumber(num) {
        return Number(num).toLocaleString('es-ES');
    }
    
    getClassIcon(className) {
        const icons = {
            flota: '🚢',
            raider: '⚔️',
            tormenta: '⚡',
            tanque: '🛡️',
            ingeniera: '🔧',
            shock: '💥',
            sniper: '🎯',
            minadora: '⛏️',
            parsec: '🌌',
            rdx: '💣',
            mantis: '🦗',
            neon: '💡',
            tr: '🔺',
            arcanas: '✨',
            hibridas: '🧬'
        };
        return icons[className] || '🚀';
    }
    
    getClassColor(className) {
        const colors = {
            flota: 'blue',
            raider: 'red',
            tormenta: 'yellow',
            tanque: 'cyan',
            ingeniera: 'green',
            shock: 'purple',
            sniper: 'orange',
            minadora: 'gray',
            parsec: 'indigo',
            rdx: 'red',
            mantis: 'lime',
            neon: 'pink',
            tr: 'rose',
            arcanas: 'violet',
            hibridas: 'teal'
        };
        return colors[className] || 'gray';
    }
    
    getObtainMethodLabel(method) {
        const labels = {
            tienda: '🛒 Tienda',
            mision: '📜 Misión',
            drop: '💀 Drop',
            evento: '🎉 Evento',
            planos: '📋 Planos',
            premium: '⭐ Premium'
        };
        return labels[method] || method;
    }
    
    getTierLabel(tier) {
        const labels = {
            1: 'Tier I - Iniciante',
            2: 'Tier II - Intermedio',
            3: 'Tier III - Avanzado',
            4: 'Tier IV - Elite',
            5: 'Tier V - Legendario'
        };
        return labels[tier] || `Tier ${tier}`;
    }
    
    // ============================================
    // MÉTODOS DE COMPATIBILIDAD (para código antiguo)
    // ============================================
    
    getShip(id) {
        return this.getShipById(id);
    }
    
    searchShipsLegacy(query) {
        return this.search(query);
    }
}

// ============================================
// INSTANCIA GLOBAL
// ============================================

const shipsDB = new ShipsDatabase();
window.shipsDB = shipsDB;

console.log('[ShipsDB] Cargado - esperando inicialización...');