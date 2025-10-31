// js/ships-database.js

class ShipsDatabase {
    constructor() {
        this.initDefaultShips();
    }
    
    initDefaultShips() {
        if (!localStorage.getItem('pirate-ships-db')) {
            const defaultShips = [
                {
                    id: 1,
                    name: 'Starling',
                    class: 'Fighter',
                    faction: 'Independent',
                    rarity: 'common',
                    level: 1,
                    hp: 100,
                    shield: 50,
                    damage: 80,
                    speed: 120,
                    description: 'Una nave ágil y ligera. Perfecta para principiantes.',
                    imageUrl: '🛸'
                },
                {
                    id: 2,
                    name: 'Vulture',
                    class: 'Corvette',
                    faction: 'Corsairs',
                    rarity: 'uncommon',
                    level: 5,
                    hp: 180,
                    shield: 100,
                    damage: 140,
                    speed: 100,
                    description: 'Nave equilibrada con buen poder ofensivo.',
                    imageUrl: '🛰️'
                },
                {
                    id: 3,
                    name: 'Phoenix',
                    class: 'Destroyer',
                    faction: 'Corsairs',
                    rarity: 'rare',
                    level: 15,
                    hp: 350,
                    shield: 250,
                    damage: 220,
                    speed: 80,
                    description: 'Una potencia destructora con blindaje reforzado.',
                    imageUrl: '🚀'
                }
            ];
            localStorage.setItem('pirate-ships-db', JSON.stringify(defaultShips));
        }
    }
    
    getAllShips() {
        const ships = localStorage.getItem('pirate-ships-db');
        return ships ? JSON.parse(ships) : [];
    }
    
    getShip(id) {
        const ships = this.getAllShips();
        return ships.find(ship => ship.id === id);
    }
    
    addShip(ship) {
        const ships = this.getAllShips();
        ship.id = Math.max(...ships.map(s => s.id), 0) + 1;
        ship.rarity = ship.rarity || 'common';
        ships.push(ship);
        localStorage.setItem('pirate-ships-db', JSON.stringify(ships));
        return ship;
    }
    
    updateShip(id, updates) {
        let ships = this.getAllShips();
        ships = ships.map(ship => 
            ship.id === id ? { ...ship, ...updates } : ship
        );
        localStorage.setItem('pirate-ships-db', JSON.stringify(ships));
        return this.getShip(id);
    }
    
    deleteShip(id) {
        let ships = this.getAllShips();
        ships = ships.filter(ship => ship.id !== id);
        localStorage.setItem('pirate-ships-db', JSON.stringify(ships));
    }
    
    searchShips(query) {
        const ships = this.getAllShips();
        return ships.filter(ship => 
            ship.name.toLowerCase().includes(query.toLowerCase()) ||
            ship.class.toLowerCase().includes(query.toLowerCase())
        );
    }
}

const shipsDB = new ShipsDatabase();