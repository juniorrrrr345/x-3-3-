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

// Configuration du stockage pour les avatars d'utilisateurs
const userAvatarStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user-avatars',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 500, height: 500, crop: 'limit' },
            { quality: 'auto' }
        ],
        public_id: (req, file) => {
            // Générer un nom unique pour le fichier
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            return `avatar-${uniqueSuffix}`;
        }
    }
});

// Configuration du stockage pour les images générales
const generalImageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
        transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto:best' }
        ],
        public_id: (req, file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            return `image-${uniqueSuffix}`;
        }
    }
});

// Créer les middleware multer
const uploadAvatar = multer({
    storage: userAvatarStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    },
    fileFilter: (req, file, cb) => {
        // Vérifier le type MIME
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

const uploadImage = multer({
    storage: generalImageStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// Fonctions utilitaires
const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
};

const getImageUrl = (publicId, options = {}) => {
    return cloudinary.url(publicId, {
        secure: true,
        ...options
    });
};

// Créer un upload preset (à exécuter une seule fois)
const createUploadPreset = async () => {
    try {
        const preset = await cloudinary.api.create_upload_preset({
            name: 'user_uploads',
            folder: 'user-content',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            transformation: [
                { width: 1000, height: 1000, crop: 'limit' },
                { quality: 'auto:good' }
            ],
            tags: ['user-upload'],
            use_filename: true,
            unique_filename: true
        });
        console.log('Upload preset created:', preset.name);
        return preset;
    } catch (error) {
        if (error.error && error.error.message.includes('already exists')) {
            console.log('Upload preset already exists');
        } else {
            console.error('Error creating upload preset:', error);
        }
    }
};

module.exports = {
    cloudinary,
    uploadAvatar,
    uploadImage,
    deleteImage,
    getImageUrl,
    createUploadPreset
};