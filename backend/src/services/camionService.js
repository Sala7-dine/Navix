import Camion from "../models/Camion.js";
import Trajet from "../models/Trajet.js";

export const getAllCamions = async (filters = {}) => {
    try {
        const camions = await Camion.find(filters);
        return camions;
    } catch (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
};

export const getCamionById = async (id) => {
    try {
        const camion = await Camion.findById(id)
            .populate('pneus')
            .populate('maintenances')
            .populate('trajets');
        
        if (!camion) {
            throw new Error('Camion introuvable');
        }
        return camion;
    } catch (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
};

export const createCamion = async (camionData) => {
    try {
        const camion = new Camion(camionData);
        await camion.save();
        return camion;
    } catch (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
};

export const updateCamion = async (id, camionData) => {
    try {
        const camion = await Camion.findByIdAndUpdate(
            id,
            { $set: camionData },
            { new: true, runValidators: true }
        );

        if(!camion) {
            throw new Error('Camion introuvable');
        }
        
        return camion;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const deleteCamion = async (id) => {
    try {
        const camion = await Camion.findById(id);
        if (!camion) {
            throw new Error('Camion introuvable');
        }
        
        // Vérifier qu'il n'y a pas de trajet en cours
        const trajetEnCours = await Trajet.findOne({ camion: id, statut: 'EN_COURS' });
        
        if (trajetEnCours) {
            throw new Error('Impossible de supprimer un camion avec un trajet en cours');
        }
        
        await Camion.findByIdAndDelete(id);
        return camion;
    } catch (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
};

export const getCamionsDisponibles = async () => {
    try {

        const camions = await Camion.find({ status: 'DISPONIBLE' });
        return camions;

    } catch(err) {
        throw new Error(err.message);
    }
}