// Exemple d'API pour connecter votre boutique à MongoDB et Cloudinary
// Ce fichier montre comment structurer votre backend

// === INSTALLATION DES DÉPENDANCES ===
// npm install express mongoose cloudinary multer cors dotenv

const express = require('express');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors());
app.use(express.json());

// Configuration Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Schéma MongoDB pour les produits
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: String,
    variants: [String],
    badges: [String],
    description: String,
    prices: [{
        quantity: String,
        amount: String
    }],
    imageUrl: String,
    videoUrl: String,
    thumbnailUrl: String,
    telegramLink: String
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// === ROUTES API ===

// Récupérer tous les produits
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort('-createdAt');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Récupérer un produit par ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Créer un nouveau produit
app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Upload vidéo pour un produit
app.post('/api/products/:id/video', upload.single('video'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        // Upload vers Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'video',
            folder: 'products/videos',
            transformation: [
                { width: 1080, height: 1920, crop: 'fill' },
                { quality: 'auto:good' }
            ]
        });

        // Mettre à jour le produit
        product.videoUrl = result.secure_url;
        product.thumbnailUrl = result.thumbnail_url;
        await product.save();

        res.json({
            videoUrl: result.secure_url,
            thumbnailUrl: result.thumbnail_url
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload image pour un produit
app.post('/api/products/:id/image', upload.single('image'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        // Upload vers Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'products/images',
            transformation: [
                { width: 800, height: 500, crop: 'fill' },
                { quality: 'auto:best' }
            ]
        });

        // Mettre à jour le produit
        product.imageUrl = result.secure_url;
        await product.save();

        res.json({ imageUrl: result.secure_url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mettre à jour un produit
app.put('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Supprimer un produit
app.delete('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        res.json({ message: 'Produit supprimé' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API démarrée sur le port ${PORT}`);
});

// === FICHIER .env EXEMPLE ===
/*
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/boutique
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
PORT=3000
*/