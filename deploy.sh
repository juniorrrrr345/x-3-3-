#!/bin/bash

echo "🚀 Déploiement sur Vercel..."

# Vérifier que les fichiers existent
if [ ! -f "index.html" ]; then
    echo "❌ Erreur: index.html introuvable!"
    exit 1
fi

# Installer Vercel CLI si nécessaire
if ! command -v vercel &> /dev/null; then
    echo "📦 Installation de Vercel CLI..."
    npm i -g vercel
fi

# Déployer
echo "🔄 Déploiement en cours..."
vercel --prod

echo "✅ Déploiement terminé!"