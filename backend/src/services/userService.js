import User from "../models/User.js";

export const createUser = async (user) => {
    try {
        const data = await User.create(user).select("-password");
        return data; 
    } catch(err) {
        throw new Error(err.message); 
    }
}

export const getAllUsers = async (filters = {}) => {
    try {
        const query = { ...filters };
        const users = await User.find(query).select('-password');
        return users;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getUserById = async (id) => {
    try {
        const user = await User.findOne({ _id: id  }).select('-password');
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
            { _id: id },
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
        const user = await User.findOneAndDelete(id).select('-password');
        
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
            role: 'chauffeur'
        }).select('-password');
        return chauffeurs;
    } catch(err) {
        throw new Error(err.message);
    }
}