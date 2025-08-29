// SOLUTION FINALE: Zero import Firebase en mode file://

console.log(`🔍 Protocole: ${location.protocol}`);

// Variables Firebase
export let auth = null;
export let db = null;
export let analytics = null;
export const isFileMode = location.protocol === 'file:';
export let isFirebaseAvailable = false;

// Mock functions pour mode local
const localModeError = () => { throw new Error('🚫 Firestore désactivé - utilisez localStorage'); };
const localModeAuth = () => Promise.resolve({ success: false, error: 'Mode local actif' });

if (location.protocol === 'file:') {
    // ===== MODE FILE:// - ZERO FIREBASE =====
    console.log('📁 Mode LOCAL détecté - Firebase complètement désactivé');
    console.log('💾 Utilisation localStorage exclusif');
    
    // Export des mocks qui ne touchent jamais à Firebase
    export const signInWithEmailAndPassword = localModeAuth;
    export const createUserWithEmailAndPassword = localModeAuth;
    export const signOut = () => Promise.resolve({ success: true });
    export const collection = localModeError;
    export const addDoc = localModeError;
    export const getDocs = localModeError;
    export const updateDoc = localModeError;
    export const deleteDoc = localModeError;
    export const doc = localModeError;
    export const query = localModeError;
    export const where = localModeError;
    export const orderBy = localModeError;
    export const enableNetwork = () => Promise.resolve();
    export const disableNetwork = () => Promise.resolve();
    
} else {
    // ===== MODE HTTP/HTTPS - FIREBASE NORMAL =====
    console.log('🌐 Mode WEB détecté - Chargement Firebase...');
    
    // Import standard Firebase (seulement exécuté en mode web)
    import { initializeApp } from "firebase/app";
    import { getAnalytics } from "firebase/analytics";
    import { getAuth, signInWithEmailAndPassword as fbSignIn, createUserWithEmailAndPassword as fbCreateUser, signOut as fbSignOut } from "firebase/auth";
    import { getFirestore, collection as fbCollection, addDoc as fbAddDoc, getDocs as fbGetDocs, updateDoc as fbUpdateDoc, deleteDoc as fbDeleteDoc, doc as fbDoc, query as fbQuery, where as fbWhere, orderBy as fbOrderBy, enableNetwork as fbEnableNetwork, disableNetwork as fbDisableNetwork } from "firebase/firestore";

    // Configuration et initialisation
    const firebaseConfig = {
        apiKey: "AIzaSyD9od-leaUSWqvWcBORI88RbOgPVd0kkSs",
        authDomain: "lvn-simple.firebaseapp.com",
        projectId: "lvn-simple",
        storageBucket: "lvn-simple.firebasestorage.app",
        messagingSenderId: "10546147088",
        appId: "1:10546147088:web:7054b9a1eb1a9571857f95",
        measurementId: "G-HNCYTB5813"
    };

    try {
        console.log('🔥 Initialisation Firebase...');
        const app = initializeApp(firebaseConfig);
        
        // Analytics en HTTPS ou localhost seulement
        if (location.protocol === 'https:' || location.hostname === 'localhost') {
            analytics = getAnalytics(app);
            console.log('📊 Analytics activé');
        }
        
        auth = getAuth(app);
        db = getFirestore(app);
        isFirebaseAvailable = true;
        
        console.log('✅ Firebase initialisé avec succès');
        
    } catch (error) {
        console.error('❌ Erreur Firebase:', error);
        auth = null;
        db = null;
        isFirebaseAvailable = false;
    }

    // Export des vraies fonctions Firebase
    export const signInWithEmailAndPassword = fbSignIn;
    export const createUserWithEmailAndPassword = fbCreateUser;
    export const signOut = fbSignOut;
    export const collection = fbCollection;
    export const addDoc = fbAddDoc;
    export const getDocs = fbGetDocs;
    export const updateDoc = fbUpdateDoc;
    export const deleteDoc = fbDeleteDoc;
    export const doc = fbDoc;
    export const query = fbQuery;
    export const where = fbWhere;
    export const orderBy = fbOrderBy;
    export const enableNetwork = fbEnableNetwork;
    export const disableNetwork = fbDisableNetwork;
}