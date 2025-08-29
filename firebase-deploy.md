# Configuration Firebase pour LVN-Simple

## 📋 Instructions de déploiement Firestore Rules

### 1. Installation Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Connexion à Firebase

```bash
firebase login
```

### 3. Initialisation du projet (si pas déjà fait)

```bash
firebase init firestore
# Sélectionner le projet: lvn-simple
# Choisir firestore.rules comme fichier de règles
# Choisir firestore.indexes.json pour les index
```

### 4. Déploiement des règles Firestore

```bash
firebase deploy --only firestore:rules
```

## 🔧 Règles Firestore configurées

### Collection `rendez-vous`
- **Lecture**: Autorisée pour utilisateurs authentifiés
- **Écriture**: Autorisée avec validation des données
- **Validation**:
  - `date`: Format YYYY-MM-DD obligatoire
  - `time`: Format HH:MM obligatoire
  - `clientName`: Nom client non vide obligatoire
  - `service`: Service non vide obligatoire
  - `status`: Valeurs autorisées: prevu, arrive, encours, termine, annule
  - `paymentStatus`: Valeurs autorisées: unpaid, paid, comped
  - `price`: Nombre (optionnel)
  - `clientPhone`: Chaîne (optionnel)
  - `notes`: Chaîne (optionnel)

### Collections futures
- `services`: Lecture/écriture pour utilisateurs authentifiés
- `clients`: Lecture/écriture pour utilisateurs authentifiés

## 🚀 Test des règles

```bash
# Tester les règles localement
firebase emulators:start --only firestore

# Ouvrir l'interface de test
# http://localhost:4000/firestore
```

## 📱 Configuration pour production

### Variables d'environnement recommandées

```javascript
const firebaseConfig = {
  // Configuration actuelle
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  // ... autres paramètres
};
```

### Index Firestore recommandés

```json
{
  "indexes": [
    {
      "collectionGroup": "rendez-vous",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "date",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "time",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "rendez-vous",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "date",
          "order": "ASCENDING"
        }
      ]
    }
  ]
}
```

## 🔒 Sécurité

### Recommandations
1. **Authentification obligatoire** pour toutes les opérations
2. **Validation stricte** des données côté serveur
3. **Audit des accès** via Firebase Console
4. **Limitation des permissions** au strict nécessaire

### Monitoring
- Surveiller les erreurs dans Firebase Console
- Configurer des alertes pour les tentatives d'accès non autorisées
- Analyser régulièrement les métriques d'utilisation