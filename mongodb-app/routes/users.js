const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Middleware pour initialiser le modèle User
const initUserModel = (req, res, next) => {
    req.userModel = new User(req.app.locals.db);
    next();
};

// GET /api/users - Obtenir tous les utilisateurs
router.get('/', initUserModel, async (req, res) => {
    try {
        const users = await req.userModel.findAll();
        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/users/search?q=term - Rechercher des utilisateurs
router.get('/search', initUserModel, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({
                success: false,
                error: 'Search term is required'
            });
        }
        const users = await req.userModel.search(q);
        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/users/:id - Obtenir un utilisateur par ID
router.get('/:id', initUserModel, async (req, res) => {
    try {
        const user = await req.userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST /api/users - Créer un nouvel utilisateur
router.post('/', initUserModel, async (req, res) => {
    try {
        const { name, email, age, city } = req.body;
        
        // Validation basique
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                error: 'Name and email are required'
            });
        }

        const result = await req.userModel.create({
            name,
            email,
            age,
            city
        });

        res.status(201).json({
            success: true,
            data: {
                _id: result.insertedId,
                message: 'User created successfully'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// PUT /api/users/:id - Mettre à jour un utilisateur
router.put('/:id', initUserModel, async (req, res) => {
    try {
        const { name, email, age, city } = req.body;
        
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (age) updateData.age = age;
        if (city) updateData.city = city;

        const result = await req.userModel.update(req.params.id, updateData);
        
        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// DELETE /api/users/:id - Supprimer un utilisateur
router.delete('/:id', initUserModel, async (req, res) => {
    try {
        const result = await req.userModel.delete(req.params.id);
        
        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;