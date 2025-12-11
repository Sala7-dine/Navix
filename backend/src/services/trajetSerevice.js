import Trajet from "../models/Trajet.js";
import Camion from "../models/Camion.js";

export const createTrajet = async (trajetData) => {
    try {
        // Vérifier que le camion est disponible
        const camion = await Camion.findById(trajetData.camion);
        if (!camion) {
            throw new Error('Camion introuvable');
        }
        if (camion.status !== 'DISPONIBLE') {
            throw new Error('Le camion n\'est pas disponible');
        }

        const trajet = await Trajet.create(trajetData);
        
        // Mettre à jour le statut du camion
        await Camion.findByIdAndUpdate(trajetData.camion, {
            status: trajetData.statut === 'EN_COURS' ? 'EN_TRAJET' : 'DISPONIBLE'
        });
        
        return await trajet.populate(['chauffeur', 'camion', 'remorque']);
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getAllTrajets = async (filters = {}) => {
    try {
        const trajets = await Trajet.find(filters)
            .populate('chauffeur', 'fullName email')
            .populate('camion', 'matricule marque modele')
            .populate('remorque', 'matricule type')
            .sort({ dateDepart: -1 });
        return trajets;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getTrajetById = async (id) => {
    try {
        const trajet = await Trajet.findById(id)
            .populate('chauffeur', 'fullName email telephone')
            .populate('camion', 'matricule marque modele')
            .populate('remorque', 'matricule type capacite')
            .populate('fuelLogs');
        
        if (!trajet) {
            throw new Error('Trajet introuvable');
        }
        return trajet;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const updateTrajet = async (id, updateData) => {
    try {
        const trajet = await Trajet.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        )
        .populate('chauffeur', 'fullName email')
        .populate('camion', 'matricule marque modele')
        .populate('remorque', 'matricule type');
        
        if (!trajet) {
            throw new Error('Trajet introuvable');
        }

        return trajet;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const deleteTrajet = async (id) => {
    try {
        const trajet = await Trajet.findById(id);
        if (!trajet) {
            throw new Error('Trajet introuvable');
        }
        
        // Libérer le camion si le trajet était en cours
        if (trajet.statut === 'EN_COURS') {
            await Camion.findByIdAndUpdate(trajet.camion, {
                status: 'DISPONIBLE'
            });
        }
        
        await trajet.deleteOne();
        return trajet;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const demarrerTrajet = async (id) => {
    try {
        const trajet = await Trajet.findById(id);
        if (!trajet) {
            throw new Error('Trajet introuvable');
        }
        
        await trajet.demarrer();
        
        // Mettre à jour le statut du camion
        await Camion.findByIdAndUpdate(trajet.camion, {
            status: 'EN_TRAJET'
        });
        
        return await trajet.populate(['chauffeur', 'camion', 'remorque']);
    } catch(err) {
        throw new Error(err.message);
    }
}

export const terminerTrajet = async (id, { kilometrageArrivee, dateArrivee }) => {
    try {
        const trajet = await Trajet.findById(id);
        if (!trajet) {
            throw new Error('Trajet introuvable');
        }
        
        await trajet.terminer(kilometrageArrivee, dateArrivee);
        
        // Mettre à jour le kilométrage du camion et libérer le statut
        await Camion.findByIdAndUpdate(trajet.camion, {
            kilometrageActuel: kilometrageArrivee,
            status: 'DISPONIBLE'
        });
        
        return await trajet.populate(['chauffeur', 'camion', 'remorque']);
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getTrajetsEnCours = async () => {
    try {
        const trajets = await Trajet.findEnCours();
        return trajets;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getTrajetsByChauffeur = async (chauffeurId) => {
    try {
        const trajets = await Trajet.findByChauffeur(chauffeurId);
        return trajets;
    } catch(err) {
        throw new Error(err.message);
    }
}