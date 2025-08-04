// Template de configuration pour MongoDB et Cloudinary
// Renommez ce fichier en config.js et ajoutez vos credentials

const config = {
    // MongoDB Configuration
    mongodb: {
        uri: 'mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority',
        // ou pour local: 'mongodb://localhost:27017/votre-database'
        
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    
    // Cloudinary Configuration
    cloudinary: {
        cloud_name: 'VOTRE_CLOUD_NAME',
        api_key: 'VOTRE_API_KEY',
        api_secret: 'VOTRE_API_SECRET',
        
        // Options d'upload pour les vidéos
        videoUploadOptions: {
            resource_type: 'video',
            folder: 'products/videos',
            allowed_formats: ['mp4', 'webm', 'mov'],
            max_file_size: 100000000, // 100MB
            transformation: [
                { width: 1080, height: 1920, crop: 'fill' }, // Format 9:16
                { quality: 'auto:good' }
            ]
        },
        
        // Options d'upload pour les images
        imageUploadOptions: {
            folder: 'products/images',
            allowed_formats: ['jpg', 'png', 'webp'],
            transformation: [
                { width: 800, height: 500, crop: 'fill' },
                { quality: 'auto:best' }
            ]
        }
    },
    
    // Structure de données MongoDB pour les produits
    productSchema: {
        name: String,
        title: String,
        subtitle: String,
        variants: [String],
        badges: [String],
        description: String,
        prices: [{
            quantity: String,
            amount: String
        }],
        imageUrl: String,        // URL Cloudinary de l'image
        videoUrl: String,        // URL Cloudinary de la vidéo
        thumbnailUrl: String,    // URL Cloudinary du thumbnail vidéo
        telegramLink: String,
        createdAt: Date,
        updatedAt: Date
    }
};

// Exemple d'utilisation avec Node.js/Express
/*
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

// Configuration Cloudinary
cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
});

// Connexion MongoDB
mongoose.connect(config.mongodb.uri, config.mongodb.options);

// Modèle Mongoose
const Product = mongoose.model('Product', config.productSchema);

// Upload vidéo vers Cloudinary
async function uploadVideo(filePath) {
    try {
        const result = await cloudinary.uploader.upload(filePath, config.cloudinary.videoUploadOptions);
        return result.secure_url;
    } catch (error) {
        console.error('Erreur upload vidéo:', error);
    }
}

// Récupérer un produit
async function getProduct(productId) {
    try {
        const product = await Product.findById(productId);
        return product;
    } catch (error) {
        console.error('Erreur récupération produit:', error);
    }
}
*/

module.exports = config;