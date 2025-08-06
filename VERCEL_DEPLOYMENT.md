# Guide de Déploiement sur Vercel

## ⚠️ Important : Limitations de Vercel

Vercel utilise un système de fichiers **en lecture seule**. Cela signifie que le fichier `site-data.json` ne peut pas être modifié en production.

## 🔧 Solutions Possibles

### Option 1 : Utiliser MongoDB (Recommandé)

1. **Créer une base de données MongoDB Atlas** (gratuit)
   - Aller sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Créer un cluster gratuit
   - Obtenir la chaîne de connexion

2. **Ajouter la variable d'environnement sur Vercel**
   ```
   MONGODB_URI=mongodb+srv://...
   ```

3. **Modifier le serveur pour utiliser MongoDB** au lieu du fichier JSON

### Option 2 : Utiliser Vercel KV Storage

1. **Activer Vercel KV** dans votre projet Vercel
2. **Utiliser l'API Vercel KV** pour stocker les données

### Option 3 : Solution Temporaire (Lecture Seule)

Pour tester rapidement sur Vercel sans base de données :

1. **Les données seront en lecture seule**
2. **Le panel admin ne pourra pas sauvegarder les modifications**
3. **Utile uniquement pour la démonstration**

## 📝 Configuration Actuelle

Le site est configuré pour fonctionner sur Vercel avec les limitations suivantes :
- ✅ Affichage du site principal
- ✅ Accès au panel admin
- ❌ Sauvegarde des modifications (nécessite une base de données)

## 🚀 Déploiement

1. **Pousser les changements**
   ```bash
   git add .
   git commit -m "Update for Vercel deployment"
   git push origin main
   ```

2. **Vercel détectera automatiquement** les changements et redéploiera

3. **Accès au panel admin**
   - URL : `https://votre-site.vercel.app/admin`
   - Mot de passe : `JuniorAdmin123`

## 💡 Recommandation

Pour un site de production, utilisez MongoDB Atlas (Option 1) qui est gratuit et permet de sauvegarder les données de manière persistante.