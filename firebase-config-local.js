// Configuration pour mode LOCAL (file://) - ZERO Firebase

console.log('📁 Mode LOCAL (file://) - Firebase désactivé');
console.log('💾 Mode localStorage exclusif');

// Exports pour mode local
export const isFileMode = true;
export const isFirebaseAvailable = false;
export const auth = null;
export const db = null;
export const analytics = null;

// Mock functions qui n'appellent jamais Firebase
export const signInWithEmailAndPassword = () => {
    console.log('🚫 Auth désactivé en mode local');
    return Promise.resolve({ success: false, error: 'Mode local actif' });
};

export const createUserWithEmailAndPassword = () => {
    console.log('🚫 Auth désactivé en mode local'); 
    return Promise.resolve({ success: false, error: 'Mode local actif' });
};

export const signOut = () => {
    console.log('🚫 Auth désactivé en mode local');
    return Promise.resolve({ success: true });
};

export const collection = () => { 
    throw new Error('🚫 Firestore désactivé - utilisez localStorage'); 
};

export const addDoc = () => { 
    throw new Error('🚫 Firestore désactivé - utilisez localStorage'); 
};

export const getDocs = () => { 
    throw new Error('🚫 Firestore désactivé - utilisez localStorage'); 
};

export const updateDoc = () => { 
    throw new Error('🚫 Firestore désactivé - utilisez localStorage'); 
};

export const deleteDoc = () => { 
    throw new Error('🚫 Firestore désactivé - utilisez localStorage'); 
};

export const doc = () => { 
    throw new Error('🚫 Firestore désactivé - utilisez localStorage'); 
};

export const query = () => { 
    throw new Error('🚫 Firestore désactivé - utilisez localStorage'); 
};

export const where = () => { 
    throw new Error('🚫 Firestore désactivé - utilisez localStorage'); 
};

export const orderBy = () => { 
    throw new Error('🚫 Firestore désactivé - utilisez localStorage'); 
};

export const enableNetwork = () => {
    console.log('🚫 enableNetwork ignoré en mode local');
    return Promise.resolve();
};

export const disableNetwork = () => {
    console.log('🚫 disableNetwork ignoré en mode local');
    return Promise.resolve();
};