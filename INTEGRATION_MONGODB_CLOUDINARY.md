# Guide d'intégration MongoDB + Cloudinary

## 📋 Vue d'ensemble

Votre boutique est maintenant prête pour être connectée à MongoDB (base de données) et Cloudinary (stockage de médias).

## 🔧 Fichiers créés pour l'intégration

### 1. **config-template.js**
Template de configuration pour vos credentials MongoDB et Cloudinary.

### 2. **api-example.js**
Exemple d'API backend avec Express.js pour gérer les produits.

### 3. **api-client.js**
Code JavaScript côté client pour communiquer avec votre API.

## 🚀 Étapes d'intégration

### Étape 1: Configuration Backend

1. **Créez un nouveau projet Node.js** pour votre API :
```bash
mkdir boutique-api
cd boutique-api
npm init -y
npm install express mongoose cloudinary multer cors dotenv
```

2. **Copiez `api-example.js`** dans votre projet API et renommez-le `server.js`

3. **Créez un fichier `.env`** avec vos credentials :
```env
MONGODB_URI=mongodb+srv://VOTRE_USER:VOTRE_PASSWORD@cluster.mongodb.net/boutique
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
PORT=3000
```

### Étape 2: Configuration Frontend

1. **Ajoutez `api-client.js`** à vos pages HTML :
```html
<!-- Ajoutez avant la fermeture de </body> -->
<script src="api-client.js"></script>
```

2. **Modifiez l'URL de l'API** dans `api-client.js` :
```javascript
const API_URL = 'https://votre-api.com/api'; // Votre URL de production
```

### Étape 3: Structure MongoDB

Chaque produit dans MongoDB aura cette structure :
```javascript
{
  name: "sahas-terps",
  title: "Sahas terps",
  subtitle: "Plusieurs variétés",
  variants: ["Unicorz", "Marmalade", "Yellow Mints"],
  badges: ["STATIC SIFT US 🇺🇸", "PREMIUM"],
  description: "• Tropicana Cookies\n130/73u\nPremium 12 sur 10 fresh pressed",
  prices: [
    { quantity: "5g", amount: "200€" },
    { quantity: "10g", amount: "350€" },
    { quantity: "20g", amount: "680€" },
    { quantity: "50g", amount: "1300€" },
    { quantity: "100g", amount: "2500€" }
  ],
  imageUrl: "https://res.cloudinary.com/...",     // URL Cloudinary
  videoUrl: "https://res.cloudinary.com/...",     // URL Cloudinary
  thumbnailUrl: "https://res.cloudinary.com/...", // Thumbnail vidéo
  telegramLink: "https://t.me/votre_telegram"
}
```

### Étape 4: Upload de médias vers Cloudinary

#### Pour les vidéos (format 9:16) :
- Format recommandé : MP4
- Résolution : 1080x1920 (portrait)
- Taille max : 100MB
- Les vidéos seront automatiquement optimisées

#### Pour les images :
- Format : JPG, PNG, WebP
- Résolution : 800x500
- Les images seront automatiquement optimisées

### Étape 5: Déploiement

1. **Backend (API)** :
   - Heroku, Railway, ou Render
   - Configurez les variables d'environnement

2. **Frontend (Site statique)** :
   - Continue avec Vercel
   - Mettez à jour `API_URL` dans `api-client.js`

## 📱 Fonctionnalités disponibles

### Page d'accueil
- ✅ Chargement automatique des produits depuis MongoDB
- ✅ Images hébergées sur Cloudinary
- ✅ Grille responsive 2 colonnes

### Page détail produit
- ✅ Chargement des détails depuis MongoDB
- ✅ Vidéo unique hébergée sur Cloudinary
- ✅ Prix dynamiques
- ✅ Lien Telegram personnalisé par produit

## 🔐 Sécurité

1. **Ne jamais exposer vos credentials** dans le code frontend
2. **Utilisez HTTPS** pour votre API
3. **Ajoutez une authentification** si nécessaire
4. **Limitez les CORS** à votre domaine

## 📝 Exemple d'utilisation

### Ajouter un produit via l'API :
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "nouveau-produit",
    "title": "Nouveau Produit",
    "subtitle": "Edition limitée",
    "variants": ["Variant 1", "Variant 2"],
    "badges": ["PREMIUM", "LIMITED"],
    "description": "Description du produit",
    "prices": [
      {"quantity": "5g", "amount": "250€"},
      {"quantity": "10g", "amount": "450€"}
    ],
    "telegramLink": "https://t.me/votre_telegram"
  }'
```

### Upload une vidéo :
```bash
curl -X POST http://localhost:3000/api/products/PRODUCT_ID/video \
  -F "video=@/chemin/vers/video.mp4"
```

## 🆘 Support

Si vous avez besoin d'aide pour :
- Créer un compte MongoDB Atlas
- Créer un compte Cloudinary
- Déployer votre API
- Configurer les CORS

N'hésitez pas à demander !

## ✅ Checklist d'intégration

- [ ] Compte MongoDB créé
- [ ] Compte Cloudinary créé
- [ ] API backend déployée
- [ ] Variables d'environnement configurées
- [ ] `api-client.js` ajouté aux pages HTML
- [ ] URL de l'API mise à jour
- [ ] Premier produit créé
- [ ] Vidéo uploadée sur Cloudinary
- [ ] Test complet effectué