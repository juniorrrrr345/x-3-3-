const { MongoClient } = require('mongodb');
require('dotenv').config();

let db = null;
let client = null;

async function connectToDatabase() {
    try {
        if (db) {
            return db;
        }

        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        
        console.log('✅ Connected to MongoDB Atlas');
        
        db = client.db(process.env.DB_NAME || 'myapp');
        return db;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

async function closeDatabaseConnection() {
    try {
        if (client) {
            await client.close();
            console.log('🔌 MongoDB connection closed');
        }
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
}

module.exports = {
    connectToDatabase,
    closeDatabaseConnection
};