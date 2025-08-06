# MongoDB + Cloudinary API

Une API REST complète avec MongoDB Atlas et Cloudinary pour la gestion des utilisateurs et des uploads d'images.

## 🚀 Fonctionnalités

- ✅ API REST complète avec Express.js
- ✅ Base de données MongoDB Atlas
- ✅ Upload d'images avec Cloudinary
- ✅ Gestion des avatars utilisateurs
- ✅ Opérations CRUD sur les utilisateurs
- ✅ Upload simple et multiple d'images
- ✅ Suppression automatique des images lors de la suppression d'utilisateurs

## 📋 Prérequis

- Node.js (v14 ou supérieur)
- Compte MongoDB Atlas
- Compte Cloudinary

## 🛠️ Installation

1. Cloner le projet
```bash
cd /workspace/mongodb-app
```

2. Installer les dépendances
```bash
npm install
```

3. Les variables d'environnement sont déjà configurées dans `.env`

## 🏃‍♂️ Démarrage

### Mode développement (avec rechargement automatique)
```bash
npm run dev
```

### Mode production
```bash
npm start
```

L'API sera accessible sur `http://localhost:3000`

## 📡 Endpoints API

### Base
- `GET /` - Informations sur l'API
- `GET /health` - Vérifier l'état de l'API et de la connexion MongoDB

### Utilisateurs (`/api/users`)
- `GET /api/users` - Obtenir tous les utilisateurs
- `GET /api/users/:id` - Obtenir un utilisateur par ID
- `POST /api/users` - Créer un nouvel utilisateur
- `PUT /api/users/:id` - Mettre à jour un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur
- `GET /api/users/search?q=terme` - Rechercher des utilisateurs
- `POST /api/users/:id/avatar` - Uploader/Mettre à jour l'avatar
- `DELETE /api/users/:id/avatar` - Supprimer l'avatar

### Uploads (`/api/uploads`)
- `POST /api/uploads/avatar` - Uploader un avatar (max 5MB)
- `POST /api/uploads/image` - Uploader une image (max 10MB)
- `POST /api/uploads/images` - Uploader plusieurs images (max 5)
- `DELETE /api/uploads/:publicId` - Supprimer une image
- `GET /api/uploads/image/:publicId` - Obtenir les détails d'une image
- `GET /api/uploads/preset-info` - Obtenir les informations d'upload
- `POST /api/uploads/create-preset` - Créer un preset personnalisé

## 📝 Exemples d'utilisation

### Créer un utilisateur
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "city": "Paris"
  }'
```

### Uploader un avatar
```bash
curl -X POST http://localhost:3000/api/users/{userId}/avatar \
  -F "avatar=@/path/to/image.jpg"
```

### Upload direct depuis le frontend (Cloudinary)
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('upload_preset', 'ml_default');

fetch('https://api.cloudinary.com/v1_1/dkluoavpv/image/upload', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Image uploaded:', data.secure_url);
});
```

## 🔧 Configuration Cloudinary

### Informations de votre compte
- **Cloud Name**: `dkluoavpv`
- **Upload Preset**: `ml_default`
- **API Key**: `725121745967616`

### Dossiers Cloudinary
- `user-avatars/` - Avatars des utilisateurs (500x500 max)
- `uploads/` - Images générales (1200x1200 max)
- `user-content/` - Contenu uploadé via preset

### Transformations automatiques
- Les avatars sont automatiquement redimensionnés à 500x500 pixels
- Les images générales sont limitées à 1200x1200 pixels
- Optimisation automatique de la qualité

## 🏗️ Structure du projet

```
mongodb-app/
├── app.js              # Point d'entrée de l'application
├── package.json        # Dépendances et scripts
├── .env               # Variables d'environnement
├── db/
│   └── connection.js  # Configuration MongoDB
├── config/
│   └── cloudinary.js  # Configuration Cloudinary
├── models/
│   └── user.js        # Modèle utilisateur
├── routes/
│   ├── users.js       # Routes utilisateurs
│   └── uploads.js     # Routes uploads
└── README.md          # Documentation
```

## 🔒 Sécurité

- Les clés API sont stockées dans les variables d'environnement
- Validation des types de fichiers (images uniquement)
- Limites de taille de fichier configurées
- CORS activé pour les requêtes cross-origin

## 🚨 Notes importantes

1. **MongoDB Atlas** : Assurez-vous que votre IP est whitelistée dans MongoDB Atlas
2. **Cloudinary** : Les images sont stockées de manière permanente sur Cloudinary
3. **Suppression en cascade** : Supprimer un utilisateur supprime automatiquement son avatar de Cloudinary
4. **Limites** : 
   - Avatar : 5MB max
   - Images : 10MB max
   - Upload multiple : 5 images max

## 📊 Monitoring

Pour vérifier l'état de l'API et de la base de données :
```bash
curl http://localhost:3000/health
```

## 🆘 Dépannage

### Erreur de connexion MongoDB
- Vérifiez votre connexion internet
- Assurez-vous que votre IP est whitelistée dans MongoDB Atlas
- Vérifiez les credentials dans le fichier `.env`

### Erreur d'upload Cloudinary
- Vérifiez la taille du fichier
- Assurez-vous que c'est bien une image
- Vérifiez les credentials Cloudinary

## 📚 Ressources

- [Documentation MongoDB](https://docs.mongodb.com/)
- [Documentation Cloudinary](https://cloudinary.com/documentation)
- [Express.js Guide](https://expressjs.com/)

---

Développé avec ❤️ en utilisant MongoDB Atlas et Cloudinary