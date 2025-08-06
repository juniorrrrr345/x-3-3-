const express = require('express');
const router = express.Router();
const { 
    uploadAvatar, 
    uploadImage, 
    deleteImage, 
    cloudinary,
    createUploadPreset 
} = require('../config/cloudinary');

// Route pour uploader un avatar
router.post('/avatar', uploadAvatar.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        res.json({
            success: true,
            data: {
                url: req.file.path,
                public_id: req.file.filename,
                size: req.file.size,
                format: req.file.format,
                width: req.file.width,
                height: req.file.height
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Route pour uploader une image générale
router.post('/image', uploadImage.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        res.json({
            success: true,
            data: {
                url: req.file.path,
                public_id: req.file.filename,
                size: req.file.size,
                format: req.file.format,
                width: req.file.width,
                height: req.file.height
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Route pour uploader plusieurs images
router.post('/images', uploadImage.array('images', 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No files uploaded'
            });
        }

        const uploadedFiles = req.files.map(file => ({
            url: file.path,
            public_id: file.filename,
            size: file.size,
            format: file.format
        }));

        res.json({
            success: true,
            count: uploadedFiles.length,
            data: uploadedFiles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Route pour supprimer une image
router.delete('/:publicId', async (req, res) => {
    try {
        const result = await deleteImage(req.params.publicId);
        
        if (result.result === 'ok') {
            res.json({
                success: true,
                message: 'Image deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Image not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Route pour obtenir les informations d'upload preset
router.get('/preset-info', (req, res) => {
    res.json({
        success: true,
        data: {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || 'ml_default',
            api_key: process.env.CLOUDINARY_API_KEY,
            upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
            instructions: {
                direct_upload: "Pour un upload direct depuis le frontend, utilisez l'upload_preset avec l'API Cloudinary",
                example_fetch: {
                    method: "POST",
                    url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
                    body: {
                        file: "votre_fichier",
                        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || 'ml_default'
                    }
                }
            }
        }
    });
});

// Route pour créer un upload preset personnalisé
router.post('/create-preset', async (req, res) => {
    try {
        const preset = await createUploadPreset();
        res.json({
            success: true,
            data: preset || { message: 'Preset already exists or created' }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Route pour obtenir les détails d'une image
router.get('/image/:publicId', async (req, res) => {
    try {
        const result = await cloudinary.api.resource(req.params.publicId);
        res.json({
            success: true,
            data: {
                public_id: result.public_id,
                url: result.secure_url,
                width: result.width,
                height: result.height,
                format: result.format,
                size: result.bytes,
                created_at: result.created_at
            }
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            error: 'Image not found'
        });
    }
});

module.exports = router;