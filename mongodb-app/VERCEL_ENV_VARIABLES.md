# Variables d'environnement pour Vercel

Copiez ces variables dans les paramètres de votre projet Vercel :

## 🔐 Variables à configurer dans Vercel

### MongoDB
```
MONGODB_URI=mongodb+srv://idffulloption:Junior30@cluster0.wdopvu5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=myapp
```

### Cloudinary
```
CLOUDINARY_URL=cloudinary://725121745967616:Z8G5NzYUDTl__-lLZHwTEJ3WjpI@dkluoavpv
CLOUDINARY_CLOUD_NAME=dkluoavpv
CLOUDINARY_API_KEY=725121745967616
CLOUDINARY_API_SECRET=Z8G5NzYUDTl__-lLZHwTEJ3WjpI
CLOUDINARY_UPLOAD_PRESET=ml_default
```

### Application
```
PORT=3000
NODE_ENV=production
```

## 📋 Instructions pour Vercel

1. **Connectez-vous à Vercel** : https://vercel.com

2. **Importez votre projet** :
   - Cliquez sur "New Project"
   - Importez depuis GitHub/GitLab/Bitbucket
   - Ou utilisez Vercel CLI : `vercel`

3. **Ajoutez les variables d'environnement** :
   - Allez dans Project Settings → Environment Variables
   - Ajoutez chaque variable une par une
   - Ou utilisez le bouton "Bulk Edit" et collez :

```env
MONGODB_URI="mongodb+srv://idffulloption:Junior30@cluster0.wdopvu5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME="myapp"
CLOUDINARY_URL="cloudinary://725121745967616:Z8G5NzYUDTl__-lLZHwTEJ3WjpI@dkluoavpv"
CLOUDINARY_CLOUD_NAME="dkluoavpv"
CLOUDINARY_API_KEY="725121745967616"
CLOUDINARY_API_SECRET="Z8G5NzYUDTl__-lLZHwTEJ3WjpI"
CLOUDINARY_UPLOAD_PRESET="ml_default"
PORT="3000"
NODE_ENV="production"
```

## 🚀 Déploiement avec Vercel CLI

Si vous préférez utiliser la ligne de commande :

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Ajouter les variables d'environnement
vercel env add MONGODB_URI
vercel env add DB_NAME
vercel env add CLOUDINARY_URL
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
vercel env add CLOUDINARY_UPLOAD_PRESET
vercel env add PORT
vercel env add NODE_ENV
```

## ⚠️ Notes importantes

1. **MongoDB Atlas** : Assurez-vous que l'accès depuis n'importe quelle IP est autorisé (0.0.0.0/0) dans MongoDB Atlas Network Access

2. **CORS** : L'application est déjà configurée avec CORS pour accepter les requêtes de n'importe quel domaine

3. **Fichiers statiques** : Si vous voulez servir le fichier HTML d'exemple, créez un dossier `public` et déplacez-y les fichiers

4. **Logs** : Consultez les logs Vercel pour déboguer : `vercel logs`

## 🔗 URLs après déploiement

Votre API sera accessible à :
- Production : `https://votre-app.vercel.app`
- Preview : `https://votre-app-git-branch.vercel.app`

### Endpoints principaux :
- `GET /` - Info API
- `GET /health` - Santé de l'API
- `GET /api/users` - Liste des utilisateurs
- `POST /api/uploads/avatar` - Upload d'avatar
- `GET /api/uploads/preset-info` - Info Cloudinary

## 🛡️ Sécurité

Pour la production, considérez :
1. Limiter les domaines CORS
2. Ajouter une authentification
3. Utiliser des rate limits
4. Masquer les erreurs détaillées