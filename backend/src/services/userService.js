import User from "../models/User.js";

export const createUser = async (userData) => {
    try {
        const user = new User(userData);
        if (userData.password) {
            await user.setPassword(userData.password);
        }
        await user.save();
        
        const userResponse = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        
        return userResponse;
    } catch(err) {
        throw new Error(err.message); 
    }
}

export const getAllUsers = async (filters = {}) => {
    try {
        const query = { ...filters };
        const users = await User.find(query).select('-passwordHash');
        return users;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getUserById = async (id) => {
    try {
        const user = await User.findById(id).select('-passwordHash');
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
        
        const user = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-passwordHash');
        
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
        const user = await User.findByIdAndDelete(id).select('-passwordHash');
        
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
        }).select('-passwordHash');
        return chauffeurs;
    } catch(err) {
        throw new Error(err.message);
    }
}