import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from './firebase-config.js';

class FirebaseAuth {
    constructor() {
        this.currentUser = null;
        this.isAuthAvailable = false;
        this.setupAuth();
    }

    // Configuration de l'authentification avec gestion d'erreurs
    setupAuth() {
        if (!auth) {
            console.warn('⚠️ Firebase Auth non disponible');
            return;
        }

        this.isAuthAvailable = true;
        this.onAuthStateChanged();
    }

    // Écouter les changements d'état d'authentification
    onAuthStateChanged() {
        if (!this.isAuthAvailable) return;

        try {
            auth.onAuthStateChanged((user) => {
                this.currentUser = user;
                if (user) {
                    console.log('✅ Utilisateur connecté:', user.email);
                } else {
                    console.log('👤 Utilisateur déconnecté');
                }
            });
        } catch (error) {
            console.error('❌ Erreur surveillance auth:', error);
        }
    }

    // Connexion avec email/mot de passe
    async signIn(email, password) {
        if (!this.isAuthAvailable) {
            return { success: false, error: 'Firebase Auth non disponible' };
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('✅ Connexion réussie:', user.email);
            return { success: true, user };
        } catch (error) {
            console.error('❌ Erreur de connexion:', error.message);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    // Créer un nouveau compte
    async signUp(email, password) {
        if (!this.isAuthAvailable) {
            return { success: false, error: 'Firebase Auth non disponible' };
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('✅ Compte créé:', user.email);
            return { success: true, user };
        } catch (error) {
            console.error('❌ Erreur création compte:', error.message);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    // Déconnexion
    async signOut() {
        if (!this.isAuthAvailable) {
            return { success: false, error: 'Firebase Auth non disponible' };
        }

        try {
            await signOut(auth);
            console.log('✅ Déconnexion réussie');
            return { success: true };
        } catch (error) {
            console.error('❌ Erreur déconnexion:', error.message);
            return { success: false, error: error.message };
        }
    }

    // Vérifier si l'utilisateur est connecté
    isAuthenticated() {
        return this.currentUser !== null && this.isAuthAvailable;
    }

    // Obtenir l'utilisateur actuel
    getCurrentUser() {
        return this.currentUser;
    }

    // Messages d'erreur traduits
    getErrorMessage(errorCode) {
        const errors = {
            'auth/user-not-found': 'Utilisateur non trouvé',
            'auth/wrong-password': 'Mot de passe incorrect',
            'auth/email-already-in-use': 'Cette adresse email est déjà utilisée',
            'auth/weak-password': 'Le mot de passe est trop faible',
            'auth/invalid-email': 'Adresse email invalide',
            'auth/network-request-failed': 'Erreur de connexion réseau',
            'auth/too-many-requests': 'Trop de tentatives, réessayez plus tard'
        };
        
        return errors[errorCode] || 'Erreur d\'authentification inconnue';
    }
}

// Exporter une instance unique
export const firebaseAuth = new FirebaseAuth();