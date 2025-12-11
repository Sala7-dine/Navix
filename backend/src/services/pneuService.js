import Pneu from "../models/Pneu.js";
import Camion from "../models/Camion.js";

export const createPneu = async (pneuData) => {
    try {
        // Vérifier que le camion existe
        const camion = await Camion.findById(pneuData.camion);
        if (!camion) {
            throw new Error('Camion introuvable');
        }
        
        const pneu = await Pneu.create(pneuData);
        return await pneu.populate('camion', 'matricule marque modele');
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getAllPneus = async (filters = {}) => {
    try {
        const pneus = await Pneu.find(filters)
            .populate('camion', 'matricule marque modele')
            .sort({ camion: 1, position: 1 });
        return pneus;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getPneuById = async (id) => {
    try {
        const pneu = await Pneu.findById(id)
            .populate('camion', 'matricule marque modele')
            .populate('maintenances');
        
        if (!pneu) {
            throw new Error('Pneu introuvable');
        }
        return pneu;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getPneusByCamion = async (camionId) => {
    try {
        const pneus = await Pneu.find({ camion: camionId })
            .sort({ position: 1 });
        return pneus;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const updatePneu = async (id, updateData) => {
    try {
        const pneu = await Pneu.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('camion', 'matricule marque modele');
        
        if (!pneu) {
            throw new Error('Pneu introuvable');
        }
        
        return pneu;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const deletePneu = async (id) => {
    try {
        const pneu = await Pneu.findById(id);
        if (!pneu) {
            throw new Error('Pneu introuvable');
        }
        
        await pneu.deleteOne();
        return pneu;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getPneusCritiques = async (seuil = 80) => {
    try {
        const pneus = await Pneu.findCritiques(seuil);
        return pneus;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const updateUsurePneu = async (id, usurePourcentage) => {
    try {
        const pneu = await Pneu.findById(id);
        if (!pneu) {
            throw new Error('Pneu introuvable');
        }
        
        await pneu.updateUsure(usurePourcentage);
        return await pneu.populate('camion', 'matricule marque modele');
    } catch(err) {
        throw new Error(err.message);
    }
}
