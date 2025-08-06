const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration du mot de passe admin
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('JuniorAdmin123', 10);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Configuration des sessions
app.use(session({
    secret: 'junior-admin-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 heures
    }
}));

// Fichier pour stocker les données
const DATA_FILE = 'site-data.json';

// Initialiser les données par défaut
async function initializeData() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        const defaultData = {
            contactContent: {
                title: "CONTACTEZ-NOUS",
                mainText: "Bienvenue sur notre page de contact. N'hésitez pas à nous contacter pour toute question ou demande d'information.",
                email: "contact@boutique-premium.com",
                responseTime: "Réponse sous 24h garantie",
                additionalInfo: "Nous sommes disponibles du lundi au vendredi de 9h à 18h."
            },
            products: []
        };
        await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2));
    }
}

// Lire les données
async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch {
        return { contactContent: {}, products: [] };
    }
}

// Écrire les données
async function writeData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Middleware d'authentification
function requireAuth(req, res, next) {
    if (!req.session.isAdmin) {
        return res.status(401).json({ error: 'Non autorisé' });
    }
    next();
}

// Route de connexion admin
app.post('/api/admin/login', async (req, res) => {
    const { password } = req.body;
    
    if (!password) {
        return res.status(400).json({ error: 'Mot de passe requis' });
    }
    
    const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    
    if (isValid) {
        req.session.isAdmin = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Mot de passe incorrect' });
    }
});

// Route de déconnexion
app.post('/api/admin/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Vérifier l'état de connexion
app.get('/api/admin/check', (req, res) => {
    res.json({ isAdmin: !!req.session.isAdmin });
});

// API pour le contenu de la page contact
app.get('/api/contact-content', async (req, res) => {
    const data = await readData();
    res.json(data.contactContent);
});

// API pour mettre à jour le contenu de contact (admin seulement)
app.put('/api/admin/contact-content', requireAuth, async (req, res) => {
    const data = await readData();
    data.contactContent = { ...data.contactContent, ...req.body };
    await writeData(data);
    res.json({ success: true, content: data.contactContent });
});

// API pour les produits
app.get('/api/products', async (req, res) => {
    const data = await readData();
    res.json(data.products);
});

// API pour ajouter un produit (admin seulement)
app.post('/api/admin/products', requireAuth, async (req, res) => {
    const data = await readData();
    const newProduct = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    data.products.push(newProduct);
    await writeData(data);
    res.json({ success: true, product: newProduct });
});

// API pour mettre à jour un produit (admin seulement)
app.put('/api/admin/products/:id', requireAuth, async (req, res) => {
    const data = await readData();
    const index = data.products.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    data.products[index] = { ...data.products[index], ...req.body };
    await writeData(data);
    res.json({ success: true, product: data.products[index] });
});

// API pour supprimer un produit (admin seulement)
app.delete('/api/admin/products/:id', requireAuth, async (req, res) => {
    const data = await readData();
    data.products = data.products.filter(p => p.id !== req.params.id);
    await writeData(data);
    res.json({ success: true });
});

// Route pour servir le panel admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Initialiser et démarrer le serveur
initializeData().then(() => {
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur http://localhost:${PORT}`);
        console.log(`Panel admin accessible sur http://localhost:${PORT}/admin`);
        console.log(`Mot de passe admin: JuniorAdmin123`);
    });
});