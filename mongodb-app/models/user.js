const { ObjectId } = require('mongodb');

class User {
    constructor(db) {
        this.collection = db.collection('users');
    }

    // Créer un nouvel utilisateur
    async create(userData) {
        try {
            const result = await this.collection.insertOne({
                ...userData,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return result;
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    // Obtenir tous les utilisateurs
    async findAll(query = {}, options = {}) {
        try {
            const users = await this.collection
                .find(query)
                .sort(options.sort || { createdAt: -1 })
                .limit(options.limit || 100)
                .toArray();
            return users;
        } catch (error) {
            throw new Error(`Error finding users: ${error.message}`);
        }
    }

    // Obtenir un utilisateur par ID
    async findById(id) {
        try {
            const user = await this.collection.findOne({ 
                _id: new ObjectId(id) 
            });
            return user;
        } catch (error) {
            throw new Error(`Error finding user: ${error.message}`);
        }
    }

    // Mettre à jour un utilisateur
    async update(id, updateData) {
        try {
            const result = await this.collection.updateOne(
                { _id: new ObjectId(id) },
                { 
                    $set: {
                        ...updateData,
                        updatedAt: new Date()
                    }
                }
            );
            return result;
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    // Supprimer un utilisateur
    async delete(id) {
        try {
            const result = await this.collection.deleteOne({ 
                _id: new ObjectId(id) 
            });
            return result;
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }

    // Rechercher des utilisateurs
    async search(searchTerm) {
        try {
            const users = await this.collection.find({
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { email: { $regex: searchTerm, $options: 'i' } }
                ]
            }).toArray();
            return users;
        } catch (error) {
            throw new Error(`Error searching users: ${error.message}`);
        }
    }
}

module.exports = User;