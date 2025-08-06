const { ObjectId } = require('mongodb');
const { deleteImage } = require('../config/cloudinary');

class User {
    constructor(db) {
        this.collection = db.collection('users');
    }

    // Créer un nouvel utilisateur
    async create(userData) {
        try {
            const result = await this.collection.insertOne({
                ...userData,
                avatar: userData.avatar || null,
                avatarPublicId: userData.avatarPublicId || null,
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

    // Mettre à jour l'avatar d'un utilisateur
    async updateAvatar(id, avatarData) {
        try {
            // Récupérer l'utilisateur pour obtenir l'ancien avatar
            const user = await this.findById(id);
            
            // Supprimer l'ancien avatar de Cloudinary si il existe
            if (user && user.avatarPublicId) {
                await deleteImage(user.avatarPublicId);
            }

            // Mettre à jour avec le nouvel avatar
            const result = await this.collection.updateOne(
                { _id: new ObjectId(id) },
                { 
                    $set: {
                        avatar: avatarData.url,
                        avatarPublicId: avatarData.publicId,
                        updatedAt: new Date()
                    }
                }
            );
            return result;
        } catch (error) {
            throw new Error(`Error updating avatar: ${error.message}`);
        }
    }

    // Supprimer l'avatar d'un utilisateur
    async removeAvatar(id) {
        try {
            const user = await this.findById(id);
            
            if (user && user.avatarPublicId) {
                // Supprimer de Cloudinary
                await deleteImage(user.avatarPublicId);
                
                // Mettre à jour la base de données
                const result = await this.collection.updateOne(
                    { _id: new ObjectId(id) },
                    { 
                        $set: {
                            avatar: null,
                            avatarPublicId: null,
                            updatedAt: new Date()
                        }
                    }
                );
                return result;
            }
            
            return { modifiedCount: 0 };
        } catch (error) {
            throw new Error(`Error removing avatar: ${error.message}`);
        }
    }

    // Supprimer un utilisateur (modifié pour supprimer aussi l'avatar)
    async delete(id) {
        try {
            // Récupérer l'utilisateur pour obtenir l'avatar
            const user = await this.findById(id);
            
            // Supprimer l'avatar de Cloudinary si il existe
            if (user && user.avatarPublicId) {
                await deleteImage(user.avatarPublicId);
            }

            // Supprimer l'utilisateur
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