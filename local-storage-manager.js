// Gestionnaire localStorage avancé pour LVN-Simple
class LocalStorageManager {
    constructor() {
        this.storageKey = 'lvn_rendez_vous';
        this.settingsKey = 'lvn_settings';
        this.backupKey = 'lvn_backup';
        this.initializeStorage();
    }

    // Initialiser le storage avec structure par défaut
    initializeStorage() {
        if (!this.hasData()) {
            this.saveData({});
            console.log('💾 LocalStorage initialisé');
        }
        
        // Créer une sauvegarde automatique
        this.createBackup();
    }

    // Vérifier si des données existent
    hasData() {
        return localStorage.getItem(this.storageKey) !== null;
    }

    // Récupérer toutes les données
    getData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('❌ Erreur lecture localStorage:', error);
            return this.restoreFromBackup();
        }
    }

    // Sauvegarder les données
    saveData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('❌ Erreur sauvegarde localStorage:', error);
            return false;
        }
    }

    // Ajouter un rendez-vous
    addRendezVous(rdvData) {
        const data = this.getData();
        const id = 'rdv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        data[id] = {
            id,
            ...rdvData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (this.saveData(data)) {
            console.log('✅ RDV ajouté localement:', id);
            return { success: true, id };
        }
        return { success: false, error: 'Erreur sauvegarde' };
    }

    // Mettre à jour un rendez-vous
    updateRendezVous(id, updateData) {
        const data = this.getData();
        
        if (!data[id]) {
            return { success: false, error: 'RDV non trouvé' };
        }
        
        data[id] = {
            ...data[id],
            ...updateData,
            updatedAt: new Date().toISOString()
        };
        
        if (this.saveData(data)) {
            console.log('✅ RDV mis à jour localement:', id);
            return { success: true };
        }
        return { success: false, error: 'Erreur sauvegarde' };
    }

    // Supprimer un rendez-vous
    deleteRendezVous(id) {
        const data = this.getData();
        
        if (!data[id]) {
            return { success: false, error: 'RDV non trouvé' };
        }
        
        delete data[id];
        
        if (this.saveData(data)) {
            console.log('✅ RDV supprimé localement:', id);
            return { success: true };
        }
        return { success: false, error: 'Erreur sauvegarde' };
    }

    // Récupérer tous les rendez-vous triés
    getAllRendezVous() {
        const data = this.getData();
        const rdvs = Object.values(data).sort((a, b) => {
            if (a.date === b.date) {
                return a.time.localeCompare(b.time);
            }
            return a.date.localeCompare(b.date);
        });
        
        return { success: true, data: rdvs };
    }

    // Récupérer les RDV par date
    getRendezVousByDate(date) {
        const data = this.getData();
        const rdvs = Object.values(data)
            .filter(rdv => rdv.date === date)
            .sort((a, b) => a.time.localeCompare(b.time));
        
        return { success: true, data: rdvs };
    }

    // Rechercher des RDV
    searchRendezVous(searchTerm) {
        const data = this.getData();
        const rdvs = Object.values(data).filter(rdv => 
            rdv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (rdv.clientPhone && rdv.clientPhone.includes(searchTerm)) ||
            (rdv.notes && rdv.notes.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
        return { success: true, data: rdvs };
    }

    // Créer une sauvegarde
    createBackup() {
        try {
            const data = this.getData();
            const backup = {
                data,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            localStorage.setItem(this.backupKey, JSON.stringify(backup));
            console.log('💾 Sauvegarde créée');
        } catch (error) {
            console.error('❌ Erreur création sauvegarde:', error);
        }
    }

    // Restaurer depuis la sauvegarde
    restoreFromBackup() {
        try {
            const backupData = localStorage.getItem(this.backupKey);
            if (backupData) {
                const backup = JSON.parse(backupData);
                console.log('🔄 Restauration depuis sauvegarde');
                return backup.data || {};
            }
        } catch (error) {
            console.error('❌ Erreur restauration sauvegarde:', error);
        }
        return {};
    }

    // Exporter les données
    exportData() {
        const data = this.getData();
        const exportObj = {
            data,
            exportDate: new Date().toISOString(),
            totalRecords: Object.keys(data).length
        };
        
        return JSON.stringify(exportObj, null, 2);
    }

    // Importer des données
    importData(jsonString) {
        try {
            const importObj = JSON.parse(jsonString);
            const data = importObj.data || importObj; // Support ancien format
            
            if (this.saveData(data)) {
                console.log('✅ Données importées:', Object.keys(data).length, 'RDV');
                return { success: true, count: Object.keys(data).length };
            }
        } catch (error) {
            console.error('❌ Erreur import:', error);
        }
        return { success: false, error: 'Format invalide' };
    }

    // Statistiques des données
    getStats() {
        const data = this.getData();
        const rdvs = Object.values(data);
        
        const stats = {
            total: rdvs.length,
            today: rdvs.filter(rdv => rdv.date === new Date().toISOString().split('T')[0]).length,
            paid: rdvs.filter(rdv => rdv.paymentStatus === 'paid').length,
            unpaid: rdvs.filter(rdv => rdv.paymentStatus === 'unpaid').length,
            completed: rdvs.filter(rdv => rdv.status === 'termine').length,
            pending: rdvs.filter(rdv => ['prevu', 'arrive', 'encours'].includes(rdv.status)).length
        };
        
        return stats;
    }

    // Nettoyer les anciennes données
    cleanup(daysOld = 365) {
        const data = this.getData();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        
        let cleaned = 0;
        Object.keys(data).forEach(id => {
            const rdv = data[id];
            const rdvDate = new Date(rdv.date);
            if (rdvDate < cutoffDate && rdv.status === 'termine') {
                delete data[id];
                cleaned++;
            }
        });
        
        if (cleaned > 0) {
            this.saveData(data);
            console.log(`🧹 Nettoyage: ${cleaned} anciens RDV supprimés`);
        }
        
        return cleaned;
    }

    // Obtenir la taille du stockage
    getStorageSize() {
        try {
            const data = JSON.stringify(this.getData());
            return {
                bytes: new Blob([data]).size,
                readable: this.formatBytes(new Blob([data]).size)
            };
        } catch (error) {
            return { bytes: 0, readable: '0 B' };
        }
    }

    // Formater les bytes
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}

// Exporter une instance unique
export const localStorageManager = new LocalStorageManager();