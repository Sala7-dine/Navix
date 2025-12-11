import User from "../models/User.js";

export const createUser = async (user) => {
    try {
        const data = await User.create(user);
        return data; 
    } catch(err) {
        throw new Error(err.message); 
    }
}

export const getAllUsers = async (filters = {}) => {
    try {
        const query = { isDelete: false, ...filters };
        const users = await User.find(query).select('-password');
        return users;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getUserById = async (id) => {
    try {
        const user = await User.findOne({ _id: id, isDelete: false }).select('-password');
        if (!user) {
            throw new Error('Utilisateur introuvable');
        }
        return user;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const updateUser = async (id, updateData) => {
    try {
        // Ne pas permettre la modification du mot de passe via cette route
        if (updateData.password) {
            delete updateData.password;
        }
        
        const user = await User.findOneAndUpdate(
            { _id: id, isDelete: false },
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            throw new Error('Utilisateur introuvable');
        }
        
        return user;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const deleteUser = async (id) => {
    try {
        // Soft delete
        const user = await User.findOneAndUpdate(
            { _id: id, isDelete: false },
            { $set: { isDelete: true } },
            { new: true }
        ).select('-password');
        
        if (!user) {
            throw new Error('Utilisateur introuvable');
        }
        
        return user;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getChauffeurs = async () => {
    try {
        const chauffeurs = await User.find({ 
            role: 'chauffeur', 
            isDelete: false 
        }).select('-password');
        return chauffeurs;
    } catch(err) {
        throw new Error(err.message);
    }
}