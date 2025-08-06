const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://idffulloption:Junior30@cluster0.wdopvu5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = process.env.DB_NAME || 'myapp';

// Hash du mot de passe admin (JuniorAdmin123)
const ADMIN_PASSWORD_HASH = '$2b$10$YourHashHere'; // Temporaire, sera généré

let db;
let client;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration des sessions pour Vercel
app.use(session({
    secret: process.env.SESSION_SECRET || 'votre-secret-tres-securise-' + Math.random(),
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 heures
        sameSite: 'lax'
    }
}));

// Initialiser les collections et les données par défaut
async function initializeCollections() {
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Créer la collection settings si elle n'existe pas
    if (!collectionNames.includes('settings')) {
        await db.createCollection('settings');
        
        // Insérer les paramètres par défaut
        const defaultSettings = {
            _id: 'site-settings',
            site: {
                title: "Boutique Premium",
                logoUrl: "",
                useTextTitle: true,
                backgroundImage: "",
                backgroundColor: "#000000"
            },
            contact: {
                title: "CONTACTEZ-NOUS",
                mainText: "Bienvenue sur notre page de contact. N'hésitez pas à nous contacter pour toute question ou demande d'information.",
                email: "contact@boutique-premium.com",
                responseTime: "Réponse sous 24h garantie",
                additionalInfo: "Nous sommes disponibles du lundi au vendredi de 9h à 18h."
            },
            social: {
                telegram: "",
                whatsapp: "",
                instagram: "",
                snapchat: ""
            },
            orderButton: {
                text: "Commander",
                link: "#",
                backgroundColor: "#667eea",
                textColor: "#ffffff"
            }
        };
        
        await db.collection('settings').insertOne(defaultSettings);
    }
    
    // Créer la collection products si elle n'existe pas
    if (!collectionNames.includes('products')) {
        await db.createCollection('products');
    }
}

// Routes d'authentification
app.post('/api/auth/login', (req, res) => {
    const { password } = req.body;
    
    // Utiliser le hash stocké dans app.locals ou générer un nouveau
    const hash = app.locals.adminPasswordHash || bcrypt.hashSync('JuniorAdmin123', 10);
    
    if (password === 'JuniorAdmin123' || bcrypt.compareSync(password, hash)) {
        req.session.isAdmin = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

app.get('/api/auth/check', (req, res) => {
    res.json({ authenticated: req.session.isAdmin || false });
});

// Middleware pour vérifier l'authentification admin
const requireAuth = (req, res, next) => {
    if (req.session.isAdmin) {
        next();
    } else {
        res.status(401).json({ error: 'Non autorisé' });
    }
};

// Route pour servir le panel admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Route pour servir les fichiers JS et CSS du panel admin
app.get('/admin.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.js'));
});

// API pour obtenir tous les paramètres
app.get('/api/settings', async (req, res) => {
    try {
        const settings = await db.collection('settings').findOne({ _id: 'site-settings' });
        res.json(settings || {});
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des paramètres' });
    }
});

// API pour les paramètres du site
app.get('/api/site-settings', async (req, res) => {
    try {
        const settings = await db.collection('settings').findOne({ _id: 'site-settings' });
        res.json(settings?.site || {});
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des paramètres' });
    }
});

// API pour mettre à jour les paramètres du site (admin seulement)
app.put('/api/admin/site-settings', requireAuth, async (req, res) => {
    try {
        await db.collection('settings').updateOne(
            { _id: 'site-settings' },
            { $set: { site: req.body } },
            { upsert: true }
        );
        res.json({ success: true, settings: req.body });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
});

// API pour le contenu de la page contact
app.get('/api/contact-content', async (req, res) => {
    try {
        const settings = await db.collection('settings').findOne({ _id: 'site-settings' });
        res.json(settings?.contact || {});
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
});

// API pour mettre à jour le contenu de contact (admin seulement)
app.put('/api/admin/contact-content', requireAuth, async (req, res) => {
    try {
        await db.collection('settings').updateOne(
            { _id: 'site-settings' },
            { $set: { contact: req.body } },
            { upsert: true }
        );
        res.json({ success: true, content: req.body });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
});

// API pour les réseaux sociaux
app.get('/api/social-settings', async (req, res) => {
    try {
        const settings = await db.collection('settings').findOne({ _id: 'site-settings' });
        res.json(settings?.social || {});
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
});

// API pour mettre à jour les réseaux sociaux (admin seulement)
app.put('/api/admin/social-settings', requireAuth, async (req, res) => {
    try {
        await db.collection('settings').updateOne(
            { _id: 'site-settings' },
            { $set: { social: req.body } },
            { upsert: true }
        );
        res.json({ success: true, social: req.body });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
});

// API pour le bouton commander
app.get('/api/order-button', async (req, res) => {
    try {
        const settings = await db.collection('settings').findOne({ _id: 'site-settings' });
        res.json(settings?.orderButton || {});
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
});

// API pour mettre à jour le bouton commander (admin seulement)
app.put('/api/admin/order-button', requireAuth, async (req, res) => {
    try {
        await db.collection('settings').updateOne(
            { _id: 'site-settings' },
            { $set: { orderButton: req.body } },
            { upsert: true }
        );
        res.json({ success: true, orderButton: req.body });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
});

// API pour la page Info
app.get('/api/info-content', async (req, res) => {
    try {
        const settings = await db.collection('settings').findOne({ _id: 'site-settings' });
        res.json(settings?.infoContent || { title: 'Informations', content: '' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
});

// API pour mettre à jour la page Info (admin seulement)
app.put('/api/admin/info-content', requireAuth, async (req, res) => {
    try {
        await db.collection('settings').updateOne(
            { _id: 'site-settings' },
            { $set: { infoContent: req.body } },
            { upsert: true }
        );
        res.json({ success: true, content: req.body });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
});

// API pour la page Canal (réseaux sociaux)
app.get('/api/canal-networks', async (req, res) => {
    try {
        const settings = await db.collection('settings').findOne({ _id: 'site-settings' });
        res.json(settings?.canalNetworks || []);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
});

// API pour mettre à jour les réseaux de la page Canal (admin seulement)
app.put('/api/admin/canal-networks', requireAuth, async (req, res) => {
    try {
        await db.collection('settings').updateOne(
            { _id: 'site-settings' },
            { $set: { canalNetworks: req.body } },
            { upsert: true }
        );
        res.json({ success: true, networks: req.body });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
});

// API pour les produits
app.get('/api/products', async (req, res) => {
    try {
        const products = await db.collection('products').find({}).toArray();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
    }
});

// API pour ajouter un produit (admin seulement)
app.post('/api/admin/products', requireAuth, async (req, res) => {
    try {
        const newProduct = {
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await db.collection('products').insertOne(newProduct);
        newProduct._id = result.insertedId;
        
        res.json({ success: true, product: newProduct });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout du produit' });
    }
});

// API pour mettre à jour un produit (admin seulement)
app.put('/api/admin/products/:id', requireAuth, async (req, res) => {
    try {
        const productId = req.params.id;
        const updateData = {
            ...req.body,
            updatedAt: new Date()
        };
        
        // Enlever l'_id des données de mise à jour
        delete updateData._id;
        
        const result = await db.collection('products').updateOne(
            { _id: new ObjectId(productId) },
            { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
});

// API pour supprimer un produit (admin seulement)
app.delete('/api/admin/products/:id', requireAuth, async (req, res) => {
    try {
        const productId = req.params.id;
        
        const result = await db.collection('products').deleteOne({
            _id: new ObjectId(productId)
        });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
});

// Connexion MongoDB avec retry
async function connectToDatabase() {
    if (db) return db; // Réutiliser la connexion existante
    
    try {
        const options = {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };
        
        client = new MongoClient(MONGODB_URI, options);
        await client.connect();
        db = client.db(DB_NAME);
        console.log('Connecté à MongoDB');
        
        // Initialiser les collections
        await initializeCollections();
        
        // Générer le hash du mot de passe
        const hash = bcrypt.hashSync('JuniorAdmin123', 10);
        app.locals.adminPasswordHash = hash;
        
        return db;
    } catch (error) {
        console.error('Erreur de connexion à MongoDB:', error);
        throw error;
    }
}

// Middleware pour s'assurer que la DB est connectée
async function ensureDatabase(req, res, next) {
    try {
        if (!db) {
            await connectToDatabase();
        }
        next();
    } catch (error) {
        console.error('Erreur DB:', error);
        res.status(500).json({ error: 'Erreur de connexion à la base de données' });
    }
}

// Appliquer le middleware à toutes les routes API
app.use('/api', ensureDatabase);

// Servir les fichiers statiques pour tout le reste
app.use(express.static('.'));

// Route par défaut pour les pages non trouvées (doit être après les routes statiques)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Démarrer le serveur (seulement en local)
if (process.env.NODE_ENV !== 'production') {
    const PORT_LOCAL = PORT || 3000;
    app.listen(PORT_LOCAL, () => {
        console.log(`🚀 Serveur démarré sur http://localhost:${PORT_LOCAL}`);
        console.log(`📊 Panel admin accessible sur http://localhost:${PORT_LOCAL}/admin`);
        console.log(`🔐 Mot de passe admin: JuniorAdmin123`);
    });
}

// Exporter l'app pour Vercel
module.exports = app;