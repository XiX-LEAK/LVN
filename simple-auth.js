// Système d'authentification simple avec mot de passe uniquement
class SimpleAuth {
    constructor() {
        this.isLoggedIn = localStorage.getItem('lvn_logged_in') === 'true';
        this.adminPassword = 'admin123'; // Mot de passe par défaut
    }

    // Vérifier le mot de passe
    async login(password) {
        try {
            if (password === this.adminPassword) {
                localStorage.setItem('lvn_logged_in', 'true');
                this.isLoggedIn = true;
                return { success: true };
            } else {
                return { success: false, error: 'Mot de passe incorrect' };
            }
        } catch (error) {
            return { success: false, error: 'Erreur de connexion' };
        }
    }

    // Déconnexion
    logout() {
        localStorage.removeItem('lvn_logged_in');
        this.isLoggedIn = false;
        return { success: true };
    }

    // Vérifier si connecté
    isAuthenticated() {
        return this.isLoggedIn;
    }
}

// Exporter une instance unique
export const simpleAuth = new SimpleAuth();