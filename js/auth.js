// js/auth.js

class AuthSystem {
    constructor() {
        this.currentUser = this.loadUser();
        this.initAuth();
        this.createAdminIfNotExists();
    }
    
    initAuth() {
        this.updateHeaderAuth();
        this.setupLogoutListener();
    }
    
    createAdminIfNotExists() {
        const adminExists = localStorage.getItem('pirate-user-admin');
        if (!adminExists) {
            const adminUser = {
                id: 0,
                username: 'admin',
                email: 'admin@piratejsz.com',
                password: this.hashPassword('admin123'),
                createdAt: new Date().toISOString(),
                level: 99,
                faction: 'Galactic Authority',
                titleClass: 'Cosmic Admin',
                role: 'admin',
                ships: [],
                achievements: []
            };
            localStorage.setItem('pirate-user-admin', JSON.stringify(adminUser));
        }
    }
    
    loadUser() {
        const userJSON = localStorage.getItem('pirate-user');
        return userJSON ? JSON.parse(userJSON) : null;
    }
    
    saveUser(user) {
        localStorage.setItem('pirate-user', JSON.stringify(user));
        this.currentUser = user;
        this.updateHeaderAuth();
    }
    
    logout() {
        localStorage.removeItem('pirate-user');
        this.currentUser = null;
        this.updateHeaderAuth();
        window.location.href = 'index.html';
    }
    
    register(username, email, password) {
        if (!username || username.length < 3) {
            return { success: false, message: 'El usuario debe tener al menos 3 caracteres' };
        }
        if (username.toLowerCase() === 'admin') {
            return { success: false, message: 'Ese nombre de usuario no está disponible' };
        }
        if (!email || !email.includes('@')) {
            return { success: false, message: 'Email inválido' };
        }
        if (!password || password.length < 6) {
            return { success: false, message: 'La contraseña debe tener al menos 6 caracteres' };
        }
        
        const existingUser = localStorage.getItem(`pirate-user-${username}`);
        if (existingUser) {
            return { success: false, message: 'El usuario ya existe' };
        }
        
        const newUser = {
            id: Date.now(),
            username: username,
            email: email,
            password: this.hashPassword(password),
            createdAt: new Date().toISOString(),
            level: 1,
            faction: 'Independent',
            titleClass: 'Novice Pilot',
            role: 'pilot',
            ships: [],
            achievements: []
        };
        
        localStorage.setItem(`pirate-user-${username}`, JSON.stringify(newUser));
        
        this.saveUser({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            level: newUser.level,
            faction: newUser.faction,
            titleClass: newUser.titleClass,
            role: newUser.role
        });
        
        return { success: true, message: 'Cuenta creada exitosamente' };
    }
    
    login(username, password) {
        const userJSON = localStorage.getItem(`pirate-user-${username}`);
        
        if (!userJSON) {
            return { success: false, message: 'Usuario no encontrado' };
        }
        
        const user = JSON.parse(userJSON);
        
        if (user.password !== this.hashPassword(password)) {
            return { success: false, message: 'Contraseña incorrecta' };
        }
        
        this.saveUser({
            id: user.id,
            username: user.username,
            email: user.email,
            level: user.level,
            faction: user.faction,
            titleClass: user.titleClass,
            role: user.role || 'pilot'
        });
        
        return { success: true, message: 'Login exitoso' };
    }
    
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }
    
    isLoggedIn() {
        return this.currentUser !== null;
    }
    
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
    
    getPublicProfile(username) {
        const userJSON = localStorage.getItem(`pirate-user-${username}`);
        if (!userJSON) return null;
        
        const user = JSON.parse(userJSON);
        return {
            id: user.id,
            username: user.username,
            level: user.level,
            faction: user.faction,
            titleClass: user.titleClass,
            createdAt: user.createdAt,
            ships: user.ships || [],
            achievements: user.achievements || []
        };
    }
    
    updateHeaderAuth() {
        const authContainer = document.getElementById('auth-container');
        if (!authContainer) return;
        
        if (this.currentUser) {
            let adminBtn = '';
            if (this.isAdmin()) {
                adminBtn = `<a href="admin-panel.html" class="game-nav-item flex items-center justify-center p-3 w-11 h-11" title="Panel Admin">
                    <i data-lucide="shield-alert" class="w-5 h-5"></i>
                </a>`;
            }
            
            authContainer.innerHTML = `
                <div class="flex items-center space-x-2">
                    <div class="text-right hidden md:block">
                        <div class="text-sm font-semibold text-gray-100">${this.currentUser.username}</div>
                        <div class="text-xs text-gray-400">${this.currentUser.titleClass}</div>
                    </div>
                    <a href="profile.html" class="game-nav-item flex items-center justify-center p-3 w-11 h-11" title="Mi Perfil">
                        <i data-lucide="user" class="w-5 h-5"></i>
                    </a>
                    ${adminBtn}
                    <button onclick="auth.logout()" class="game-nav-item flex items-center justify-center p-3 w-11 h-11" title="Logout">
                        <i data-lucide="log-out" class="w-5 h-5"></i>
                    </button>
                </div>
            `;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } else {
            authContainer.innerHTML = `
                <div class="flex items-center space-x-2">
                    <a href="login.html" class="game-nav-item">
                        <i data-lucide="log-in" class="w-4 h-4 mr-2"></i>
                        Login
                    </a>
                    <a href="register.html" class="game-nav-item" style="background: linear-gradient(135deg, rgba(155, 165, 180, 0.4) 0%, rgba(135, 145, 165, 0.35) 100%); border: 2px solid rgba(120, 135, 160, 0.65); color: #2d3748;">
                        <i data-lucide="user-plus" class="w-4 h-4 mr-2"></i>
                        Register
                    </a>
                </div>
            `;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
    
    setupLogoutListener() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'pirate-user') {
                this.currentUser = e.newValue ? JSON.parse(e.newValue) : null;
                this.updateHeaderAuth();
            }
        });
    }
}

const auth = new AuthSystem();