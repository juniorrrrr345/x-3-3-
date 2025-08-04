# Cali Rabbit Boutique 🐰

Une boutique premium moderne avec des effets visuels avancés incluant un logo transparent avec effet de flou glassmorphism.

## 🌟 Caractéristiques

- **Logo transparent avec effet de flou** : Utilisation de `backdrop-filter` pour créer un effet glassmorphism
- **Animations fluides** : Particules animées, effet de parallaxe, et animations au survol
- **Design responsive** : Optimisé pour mobile et desktop
- **Interface moderne** : Style mini-application avec navigation en bas
- **Effets visuels avancés** : Gradients animés, effets de lumière, et transitions smooth

## 🚀 Déploiement sur Vercel

### Option 1 : Déploiement via Git

1. Poussez votre code sur GitHub/GitLab/Bitbucket
2. Connectez-vous à [Vercel](https://vercel.com)
3. Cliquez sur "New Project"
4. Importez votre repository
5. Vercel détectera automatiquement qu'il s'agit d'un site statique
6. Cliquez sur "Deploy"

### Option 2 : Déploiement via CLI

1. Installez Vercel CLI :
```bash
npm i -g vercel
```

2. Dans le dossier du projet :
```bash
vercel
```

3. Suivez les instructions pour vous connecter et déployer

### Option 3 : Déploiement direct

1. Allez sur [vercel.com](https://vercel.com)
2. Glissez-déposez le dossier du projet sur la page

## 📁 Structure du projet

```
cali-rabbit-boutique/
├── index.html          # Page principale
├── app.js             # JavaScript pour les animations
├── favicon.svg        # Icône du site
├── vercel.json        # Configuration Vercel
├── package.json       # Métadonnées du projet
└── README.md          # Ce fichier
```

## 🎨 Effet de logo transparent avec flou

L'effet est créé avec plusieurs techniques CSS :

```css
/* Logo transparent */
.logo-overlay {
    opacity: 0.3;
    filter: drop-shadow(0 0 30px rgba(255, 105, 180, 0.5));
}

/* Effet de flou derrière le logo */
.glass-blur {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
}
```

## 🛠️ Développement local

Pour tester localement :

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrez http://localhost:3000 dans votre navigateur.

## 📱 Compatibilité

- Chrome/Edge : ✅ Complet
- Firefox : ✅ Complet
- Safari : ✅ Complet (avec préfixes -webkit)
- Mobile : ✅ Optimisé pour iOS et Android

## 🔧 Personnalisation

### Modifier les couleurs
Changez les couleurs du gradient dans le CSS :
```css
background: linear-gradient(90deg, #ff69b4, #8a2be2);
```

### Ajuster l'effet de flou
Modifiez la valeur du blur :
```css
backdrop-filter: blur(8px); /* Augmentez pour plus de flou */
```

### Changer l'opacité du logo
```css
opacity: 0.3; /* Réduisez pour plus de transparence */
```

## 📄 Licence

MIT License - Utilisez librement ce code pour vos projets !

---

Créé avec ❤️ pour Cali Rabbit