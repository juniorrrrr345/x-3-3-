const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Configuration Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Préfixe pour les dossiers (pour séparer de l'autre boutique)
const FOLDER_PREFIX = process.env.CLOUDINARY_FOLDER_PREFIX || 'boutique_x33';

// Configuration du stockage pour les avatars
const avatarStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: `${FOLDER_PREFIX}/avatars`,
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [
            { width: 200, height: 200, crop: 'fill', gravity: 'face' },
            { quality: 'auto' }
        ],
        public_id: (req, file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            return `avatar-${uniqueSuffix}`;
        }
    }
});

// Configuration du stockage pour les images générales
const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: `${FOLDER_PREFIX}/images`,
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 1000, height: 1000, crop: 'limit' },
            { quality: 'auto:good' }
        ],
        public_id: (req, file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const originalName = file.originalname.split('.')[0];
            return `${originalName}-${uniqueSuffix}`;
        }
    }
});

// Créer les middlewares multer
const uploadAvatar = multer({ 
    storage: avatarStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    }
});

const uploadImage = multer({ 
    storage: imageStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max
    }
});

// Fonction utilitaire pour supprimer une image
async function deleteImage(publicId) {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'image:', error);
        throw error;
    }
}

// Fonction pour uploader une image avec des options personnalisées
async function uploadImageWithOptions(filePath, options = {}) {
    try {
        const defaultOptions = {
            folder: `${FOLDER_PREFIX}/custom`,
            use_filename: true,
            unique_filename: true,
            overwrite: false,
            resource_type: 'auto'
        };
        
        const uploadOptions = { ...defaultOptions, ...options };
        const result = await cloudinary.uploader.upload(filePath, uploadOptions);
        return result;
    } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        throw error;
    }
}

// Fonction pour obtenir l'URL optimisée d'une image
function getOptimizedUrl(publicId, options = {}) {
    const defaultOptions = {
        quality: 'auto',
        fetch_format: 'auto'
    };
    
    const transformOptions = { ...defaultOptions, ...options };
    return cloudinary.url(publicId, transformOptions);
}

// Fonction pour créer un upload preset
async function createUploadPreset(name, options = {}) {
    try {
        const defaultOptions = {
            name: `${FOLDER_PREFIX}_${name}`,
            folder: `${FOLDER_PREFIX}/${name}`,
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            transformation: [
                { quality: 'auto:good' },
                { fetch_format: 'auto' }
            ]
        };
        
        const presetOptions = { ...defaultOptions, ...options };
        const result = await cloudinary.api.create_upload_preset(presetOptions);
        return result;
    } catch (error) {
        console.error('Erreur lors de la création du preset:', error);
        throw error;
    }
}

module.exports = {
    cloudinary,
    uploadAvatar,
    uploadImage,
    deleteImage,
    uploadImageWithOptions,
    getOptimizedUrl,
    createUploadPreset
};