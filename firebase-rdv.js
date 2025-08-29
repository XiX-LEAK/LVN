import { db, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy, enableNetwork, disableNetwork, isFileMode, isFirebaseAvailable } from './firebase-config.js';
import { localStorageManager } from './local-storage-manager.js';

class RendezVousManager {
    constructor() {
        this.collectionName = 'rendez-vous';
        this.isOnline = navigator.onLine;
        this.forceLocalMode = isFileMode; // Forcer mode local en file://
        this.setupNetworkListeners();
        
        // Afficher le mode utilisé
        if (this.forceLocalMode) {
            console.log('📁 Mode LOCAL activé (file:// protocol)');
        } else if (isFirebaseAvailable) {
            console.log('🔥 Mode FIREBASE activé');
        } else {
            console.log('💾 Mode LOCAL activé (Firebase indisponible)');
        }
    }

    // Gérer les événements réseau
    setupNetworkListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('🌐 Connexion rétablie - synchronisation avec Firebase');
            if (db) {
                enableNetwork(db).catch(error => console.warn('⚠️ Erreur enableNetwork:', error));
            }
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('📴 Mode hors ligne activé');
            if (db) {
                disableNetwork(db).catch(error => console.warn('⚠️ Erreur disableNetwork:', error));
            }
        });
    }

    // Vérifier la disponibilité de Firestore
    isFirestoreAvailable() {
        return !this.forceLocalMode && db !== null && db !== undefined;
    }

    // Ajouter un nouveau rendez-vous
    async addRendezVous(rdvData) {
        // Mode local forcé ou Firebase indisponible
        if (this.forceLocalMode || !this.isFirestoreAvailable()) {
            return localStorageManager.addRendezVous(rdvData);
        }

        try {
            const docRef = await addDoc(collection(db, this.collectionName), {
                ...rdvData,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log('✅ Rendez-vous ajouté Firebase:', docRef.id);
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('❌ Erreur Firebase, basculement local:', error);
            return localStorageManager.addRendezVous(rdvData);
        }
    }

    // Récupérer tous les rendez-vous
    async getAllRendezVous() {
        try {
            if (!this.isFirestoreAvailable()) {
                throw new Error('Firestore non disponible');
            }

            const q = query(collection(db, this.collectionName), orderBy('date', 'asc'), orderBy('time', 'asc'));
            const querySnapshot = await getDocs(q);
            const rdvs = [];
            
            querySnapshot.forEach((doc) => {
                rdvs.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            console.log('✅ Rendez-vous Firebase récupérés:', rdvs.length);
            return { success: true, data: rdvs };
        } catch (error) {
            console.error('❌ Erreur récupération Firebase:', error);
            
            // Fallback: récupérer les données locales
            const localData = this.getLocalData();
            const rdvs = Object.values(localData).sort((a, b) => {
                if (a.date === b.date) {
                    return a.time.localeCompare(b.time);
                }
                return a.date.localeCompare(b.date);
            });
            
            console.log('💾 Rendez-vous locaux récupérés:', rdvs.length);
            return { success: true, data: rdvs, offline: true };
        }
    }

    // Récupérer les rendez-vous par date
    async getRendezVousByDate(date) {
        try {
            const q = query(
                collection(db, this.collectionName), 
                where('date', '==', date),
                orderBy('time', 'asc')
            );
            const querySnapshot = await getDocs(q);
            const rdvs = [];
            
            querySnapshot.forEach((doc) => {
                rdvs.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return { success: true, data: rdvs };
        } catch (error) {
            console.error('Erreur récupération par date:', error);
            return { success: false, error: error.message };
        }
    }

    // Mettre à jour un rendez-vous
    async updateRendezVous(rdvId, updateData) {
        try {
            const rdvRef = doc(db, this.collectionName, rdvId);
            await updateDoc(rdvRef, {
                ...updateData,
                updatedAt: new Date()
            });
            
            console.log('Rendez-vous mis à jour:', rdvId);
            return { success: true };
        } catch (error) {
            console.error('Erreur mise à jour rendez-vous:', error);
            return { success: false, error: error.message };
        }
    }

    // Supprimer un rendez-vous
    async deleteRendezVous(rdvId) {
        try {
            await deleteDoc(doc(db, this.collectionName, rdvId));
            console.log('Rendez-vous supprimé:', rdvId);
            return { success: true };
        } catch (error) {
            console.error('Erreur suppression rendez-vous:', error);
            return { success: false, error: error.message };
        }
    }

    // Rechercher des rendez-vous
    async searchRendezVous(searchTerm) {
        try {
            // Note: Firestore ne supporte pas la recherche textuelle complète
            // Cette fonction fait une recherche basique par nom de client
            const q = query(collection(db, this.collectionName));
            const querySnapshot = await getDocs(q);
            const rdvs = [];
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // Recherche simple dans le nom du client
                if (data.clientName && data.clientName.toLowerCase().includes(searchTerm.toLowerCase())) {
                    rdvs.push({
                        id: doc.id,
                        ...data
                    });
                }
            });
            
            return { success: true, data: rdvs };
        } catch (error) {
            console.error('Erreur recherche rendez-vous:', error);
            return { success: false, error: error.message };
        }
    }

    // Changer le statut d'un rendez-vous
    async updateStatus(rdvId, newStatus) {
        return await this.updateRendezVous(rdvId, { status: newStatus });
    }

    // Marquer un rendez-vous comme payé/non payé
    async updatePaymentStatus(rdvId, paymentStatus) {
        return await this.updateRendezVous(rdvId, { paymentStatus: paymentStatus });
    }

    // === MÉTHODES DE GESTION LOCALE ===
    
    // Récupérer les données locales
    getLocalData() {
        try {
            const data = localStorage.getItem('lvn_rendez_vous');
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('❌ Erreur lecture localStorage:', error);
            return {};
        }
    }

    // Sauvegarder les données locales
    saveLocalData(data) {
        try {
            localStorage.setItem('lvn_rendez_vous', JSON.stringify(data));
        } catch (error) {
            console.error('❌ Erreur sauvegarde localStorage:', error);
        }
    }

    // Synchroniser les données locales avec Firestore
    async syncLocalToFirestore() {
        if (!this.isFirestoreAvailable() || !this.isOnline) {
            return { success: false, error: 'Firebase non disponible' };
        }

        const localData = this.getLocalData();
        const pendingSync = Object.values(localData).filter(rdv => rdv.syncPending);
        
        if (pendingSync.length === 0) {
            return { success: true, synced: 0 };
        }

        let syncedCount = 0;
        const updatedLocalData = { ...localData };

        for (const rdv of pendingSync) {
            try {
                // Retirer les métadonnées locales
                const { id, syncPending, ...cleanRdvData } = rdv;
                
                // Ajouter à Firestore
                const docRef = await addDoc(collection(db, this.collectionName), {
                    ...cleanRdvData,
                    createdAt: new Date(rdv.createdAt),
                    updatedAt: new Date()
                });

                // Supprimer de localStorage et marquer comme synchronisé
                delete updatedLocalData[rdv.id];
                syncedCount++;
                
                console.log('🔄 Rendez-vous synchronisé:', rdv.id, '→', docRef.id);
                
            } catch (error) {
                console.error('❌ Erreur synchronisation:', rdv.id, error);
            }
        }

        this.saveLocalData(updatedLocalData);
        console.log(`✅ Synchronisation terminée: ${syncedCount}/${pendingSync.length} éléments`);
        
        return { success: true, synced: syncedCount, total: pendingSync.length };
    }

    // Obtenir des statistiques sur les données locales/distant
    async getDataStats() {
        const localData = this.getLocalData();
        const pendingSync = Object.values(localData).filter(rdv => rdv.syncPending);
        
        return {
            local: Object.keys(localData).length,
            pendingSync: pendingSync.length,
            isOnline: this.isOnline,
            firestoreAvailable: this.isFirestoreAvailable()
        };
    }
}

// Exporter une instance unique
export const rdvManager = new RendezVousManager();