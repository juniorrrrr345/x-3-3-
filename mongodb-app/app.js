const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectToDatabase, closeDatabaseConnection } = require('./db/connection');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de base
app.get('/', (req, res) => {
    res.json({
        message: 'MongoDB API Server',
        version: '1.0.0',
        endpoints: {
            users: '/api/users',
            health: '/health'
        }
    });
});

// Route de santé
app.get('/health', async (req, res) => {
    try {
        const db = app.locals.db;
        await db.admin().ping();
        res.json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date()
        });
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            database: 'disconnected',
            error: error.message
        });
    }
});

// Routes API
app.use('/api/users', usersRouter);

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Démarrage du serveur
async function startServer() {
    try {
        // Connexion à MongoDB
        const db = await connectToDatabase();
        app.locals.db = db;

        // Démarrer le serveur Express
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
        });

        // Gestion de l'arrêt gracieux
        process.on('SIGINT', async () => {
            console.log('\n⏹️  Shutting down server...');
            server.close(async () => {
                await closeDatabaseConnection();
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Démarrer l'application
startServer();

module.exports = app;