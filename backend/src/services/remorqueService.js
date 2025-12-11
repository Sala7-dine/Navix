import Remorque from "../models/Remorque.js";

export const createRemorque = async (remorqueData) => {
    try {
        const remorque = await Remorque.create(remorqueData);
        return remorque;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getAllRemorques = async (filters = {}) => {
    try {
        const remorques = await Remorque.find(filters);
        return remorques;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getRemorqueById = async (id) => {
    try {
        const remorque = await Remorque.findById(id)
            .populate('trajets');
        
        if (!remorque) {
            throw new Error('Remorque introuvable');
        }
        return remorque;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const updateRemorque = async (id, updateData) => {
    try {
        const remorque = await Remorque.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        
        if (!remorque) {
            throw new Error('Remorque introuvable');
        }
        
        return remorque;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const deleteRemorque = async (id) => {
    try {
        const remorque = await Remorque.findById(id);
        if (!remorque) {
            throw new Error('Remorque introuvable');
        }
        
        // Vérifier qu'elle n'est pas utilisée dans un trajet en cours
        const Trajet = (await import("../models/Trajet.js")).default;
        const trajetEnCours = await Trajet.findOne({ 
            remorque: id, 
            statut: 'EN_COURS' 
        });
        
        if (trajetEnCours) {
            throw new Error('Impossible de supprimer une remorque utilisée dans un trajet en cours');
        }
        
        await Remorque.findByIdAndDelete(id);
        return remorque;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getRemorquesByType = async (type) => {
    try {
        const remorques = await Remorque.findByType(type);
        return remorques;
    } catch(err) {
        throw new Error(err.message);
    }
}
