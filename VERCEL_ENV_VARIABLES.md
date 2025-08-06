# Variables d'environnement pour Vercel

## Variables requises

Copiez et ajoutez ces variables dans votre projet Vercel :

```
MONGODB_URI=mongodb+srv://idffulloption:Junior30@cluster0.wdopvu5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=myapp
PORT=3000
NODE_ENV=production
SESSION_SECRET=votre-secret-session-très-sécurisé-changez-moi-123456789

# Variables Cloudinary (optionnelles si vous utilisez les uploads)
CLOUDINARY_URL=cloudinary://725121745967616:Z8G5NzYUDTl__-lLZHwTEJ3WjpI@dkluoavpv
CLOUDINARY_CLOUD_NAME=dkluoavpv
CLOUDINARY_API_KEY=725121745967616
CLOUDINARY_API_SECRET=Z8G5NzYUDTl__-lLZHwTEJ3WjpI
CLOUDINARY_UPLOAD_PRESET=ml_default
```

## Comment ajouter ces variables dans Vercel

1. Allez dans votre dashboard Vercel
2. Sélectionnez votre projet
3. Allez dans l'onglet "Settings"
4. Cliquez sur "Environment Variables" dans le menu de gauche
5. Ajoutez chaque variable une par une :
   - Name: Le nom de la variable (ex: MONGODB_URI)
   - Value: La valeur de la variable
   - Environment: Sélectionnez "Production", "Preview" et "Development"
6. Cliquez sur "Save" pour chaque variable

## Note importante sur SESSION_SECRET

⚠️ **IMPORTANT** : Changez la valeur de `SESSION_SECRET` par une chaîne aléatoire sécurisée. Vous pouvez en générer une avec :
```bash
openssl rand -base64 32
```

## Après avoir ajouté les variables

Une fois toutes les variables ajoutées, redéployez votre application pour qu'elles soient prises en compte.