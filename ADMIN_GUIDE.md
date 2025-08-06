# Guide du Panel Administrateur

## 🚀 Démarrage

1. **Installer les dépendances** :
```bash
npm install
```

2. **Démarrer le serveur** :
```bash
npm start
```

3. **Accéder au site** :
- Site principal : http://localhost:3000
- Panel admin : http://localhost:3000/admin

## 🔐 Connexion Admin

- **URL** : http://localhost:3000/admin
- **Mot de passe** : `JuniorAdmin123`

## 📝 Fonctionnalités du Panel Admin

### 1. Gestion de la Page Contact
- Modifier le titre de la page
- Modifier le texte principal
- Changer l'email de contact
- Modifier le temps de réponse
- Ajouter des informations supplémentaires

### 2. Gestion des Produits
- Ajouter de nouveaux produits
- Modifier les produits existants
- Supprimer des produits
- Chaque produit contient :
  - Nom
  - Prix
  - Image (URL)
  - Description
  - Catégorie

## 🔄 Modifications en Temps Réel

Les modifications effectuées dans le panel admin sont immédiatement visibles sur le site :
- La page contact se met à jour automatiquement
- Les produits sont synchronisés avec la base de données locale

## 📁 Structure des Données

Les données sont stockées dans `site-data.json` :
```json
{
  "contactContent": {
    "title": "CONTACTEZ-NOUS",
    "mainText": "...",
    "email": "contact@boutique-premium.com",
    "responseTime": "Réponse sous 24h garantie",
    "additionalInfo": "..."
  },
  "products": [
    {
      "id": "123456789",
      "name": "Produit 1",
      "price": 29.99,
      "image": "https://...",
      "description": "...",
      "category": "...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## 🛡️ Sécurité

- Le panel admin est protégé par mot de passe
- Les sessions expirent après 24 heures
- Le mot de passe est hashé avec bcrypt

## 🎨 Interface

Le panel admin dispose d'une interface moderne avec :
- Design responsive
- Animations fluides
- Messages de succès/erreur
- Modal pour l'édition des produits
- Navigation par onglets

## ⚠️ Notes Importantes

1. **Sauvegarde** : Les données sont stockées localement dans `site-data.json`. Pensez à sauvegarder ce fichier régulièrement.

2. **Images** : Utilisez des URLs d'images hébergées (Cloudinary, Imgur, etc.) pour les produits.

3. **Session** : Si vous êtes déconnecté, reconnectez-vous avec le mot de passe.

4. **Production** : Pour la production, configurez les variables d'environnement et utilisez une vraie base de données.

## 🚨 Dépannage

- **Erreur de connexion** : Vérifiez que le serveur est bien démarré
- **Mot de passe incorrect** : Utilisez exactement `JuniorAdmin123`
- **Modifications non visibles** : Rafraîchissez la page ou videz le cache du navigateur

---

Pour toute question ou problème, consultez le code source ou contactez le développeur.