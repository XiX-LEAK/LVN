# LVN Coiffeur - Interface d'Administration Firebase

Interface d'administration moderne pour salon de coiffure intégrée avec Firebase.

## 🚀 Fonctionnalités

- **Authentification Firebase** : Connexion sécurisée avec email/mot de passe
- **Gestion des rendez-vous** : CRUD complet avec Firestore
- **Recherche et filtres** : Recherche par nom de client, filtres par statut et paiement
- **Interface responsive** : Design moderne compatible mobile/desktop
- **Temps réel** : Synchronisation automatique des données

## 📦 Installation

1. Cloner le projet
2. Installer les dépendances :
```bash
npm install
```

3. Configurer Firebase :
   - Les clés Firebase sont déjà configurées dans `firebase-config.js`
   - Le projet pointe vers `lvn-simple.firebaseapp.com`

## 🔧 Utilisation

### Démarrage du serveur de développement
```bash
npm run dev
```
Le serveur démarre sur http://localhost:8080 et ouvre automatiquement le navigateur.

### Fichiers principaux
- `index-firebase.html` : Interface principale avec Firebase
- `firebase-config.js` : Configuration Firebase
- `firebase-auth.js` : Gestion de l'authentification  
- `firebase-rdv.js` : Gestion des rendez-vous
- `assets/css/style.css` : Styles existants

## 🔑 Authentification

Pour vous connecter, vous devez créer un compte dans la console Firebase ou utiliser un compte existant configuré dans le projet Firebase `lvn-simple`.

## 📅 Gestion des Rendez-vous

### Ajouter un rendez-vous
- Cliquer sur "Nouveau RDV"
- Remplir les informations (date, heure, client, service, etc.)
- Sauvegarder

### Modifier un rendez-vous  
- Cliquer sur "Modifier" dans la carte du rendez-vous
- Modifier les informations
- Sauvegarder

### Actions rapides
- **Terminer** : Marque le RDV comme terminé
- **Payé** : Marque le paiement comme effectué
- **Supprimer** : Supprime le rendez-vous (avec confirmation)

### Recherche et filtres
- **Recherche** : Par nom de client
- **Filtre statut** : Prévu, Arrivé, En cours, Terminé, Annulé
- **Filtre paiement** : Non payé, Payé, Gratuit

### Navigation par date
- Sélecteur de date
- Boutons précédent/suivant
- Bouton "Aujourd'hui"

## 🔥 Structure Firebase

### Collection : `rendez-vous`
```javascript
{
  id: "auto-generated",
  date: "2025-01-01",
  time: "10:00",
  clientName: "Nom Client",
  clientPhone: "0123456789",
  service: "coupe",
  price: 25.00,
  status: "prevu", // prevu, arrive, encours, termine, annule
  paymentStatus: "unpaid", // unpaid, paid, comped
  notes: "Notes supplémentaires",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🎨 Interface

### Pages disponibles
1. **Rendez-vous** : Gestion complète des RDV
2. **Services** : À venir (interface de gestion des services)
3. **Statistiques** : À venir (tableau de bord)

### Design
- Glass morphism avec effets de flou
- Animations CSS fluides
- Responsive design
- Thème moderne noir et blanc

## 🛠️ Développement

### Structure des fichiers
```
LVN-main/
├── index-firebase.html     # Interface principale
├── firebase-config.js      # Configuration Firebase
├── firebase-auth.js        # Authentification
├── firebase-rdv.js         # Gestion RDV
├── assets/css/style.css    # Styles
├── package.json            # Dépendances
└── README.md              # Documentation
```

### Scripts npm
- `npm start` : Serveur de production
- `npm run dev` : Serveur de développement avec ouverture auto
- `npm install` : Installation des dépendances

## 🔒 Sécurité

- Authentification Firebase requise
- Règles Firestore configurées côté serveur
- Validation des données côté client et serveur

## 📱 Responsive

L'interface s'adapte automatiquement aux différentes tailles d'écran :
- Desktop : Interface complète
- Tablet : Navigation adaptée  
- Mobile : Interface optimisée tactile

## 🎯 Prochaines fonctionnalités

- [ ] Gestion des services et tarifs
- [ ] Statistiques et rapports
- [ ] Notifications temps réel
- [ ] Export des données
- [ ] Calendrier hebdomadaire/mensuel
- [ ] Gestion des clients
- [ ] Historique des modifications

---

**Développé avec Firebase 🔥 pour LVN Coiffeur**