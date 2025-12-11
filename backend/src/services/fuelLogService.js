import FuelLog from "../models/FuelLog.js";
import Trajet from "../models/Trajet.js";

export const createFuelLog = async (fuelLogData) => {
    try {
        // Vérifier que le trajet existe
        const trajet = await Trajet.findById(fuelLogData.trajet);
        if (!trajet) {
            throw new Error('Trajet introuvable');
        }
        
        // Vérifier que le trajet est en cours
        if (trajet.statut !== 'EN_COURS') {
            throw new Error('Le trajet doit être en cours pour ajouter un ravitaillement');
        }
        
        const fuelLog = await FuelLog.create(fuelLogData);
        return await fuelLog.populate('trajet', 'destination pointDepart statut');
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getAllFuelLogs = async (filters = {}) => {
    try {
        const fuelLogs = await FuelLog.find(filters)
            .populate({
                path: 'trajet',
                select: 'destination pointDepart dateDepart statut',
                populate: {
                    path: 'camion',
                    select: 'matricule marque modele'
                }
            })
            .sort({ date: -1 });
        return fuelLogs;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getFuelLogById = async (id) => {
    try {
        const fuelLog = await FuelLog.findById(id)
            .populate({
                path: 'trajet',
                select: 'destination pointDepart dateDepart statut kilometrageDepart',
                populate: {
                    path: 'camion',
                    select: 'matricule marque modele kilometrageActuel'
                }
            });
        
        if (!fuelLog) {
            throw new Error('Ravitaillement introuvable');
        }
        return fuelLog;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getFuelLogsByTrajet = async (trajetId) => {
    try {
        const fuelLogs = await FuelLog.find({ trajet: trajetId })
            .sort({ date: -1 });
        return fuelLogs;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const updateFuelLog = async (id, updateData) => {
    try {
        const fuelLog = await FuelLog.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        )
        .populate('trajet', 'destination pointDepart statut');
        
        if (!fuelLog) {
            throw new Error('Ravitaillement introuvable');
        }
        
        return fuelLog;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const deleteFuelLog = async (id) => {
    try {
        const fuelLog = await FuelLog.findByIdAndDelete(id);
        if (!fuelLog) {
            throw new Error('Ravitaillement introuvable');
        }
        
        return fuelLog;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const calculateTotalByTrajet = async (trajetId) => {
    try {
        const totals = await FuelLog.calculateTotalByTrajet(trajetId);
        return totals;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getStatsByPeriode = async (dateDebut, dateFin) => {
    try {
        const stats = await FuelLog.getStatsByPeriode(dateDebut, dateFin);
        return stats;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getConsommationMoyenneByCamion = async (camionId, dateDebut, dateFin) => {
    try {
        // Récupérer tous les trajets du camion dans la période
        const filters = { camion: camionId, statut: 'TERMINE' };
        if (dateDebut || dateFin) {
            filters.dateArrivee = {};
            if (dateDebut) filters.dateArrivee.$gte = new Date(dateDebut);
            if (dateFin) filters.dateArrivee.$lte = new Date(dateFin);
        }
        
        const trajets = await Trajet.find(filters).select('_id');
        const trajetIds = trajets.map(t => t._id);
        
        if (trajetIds.length === 0) {
            return {
                consommationMoyenne: 0,
                totalCarburant: 0,
                totalDistance: 0,
                nombreTrajets: 0
            };
        }
        
        // Calculer la consommation totale
        const fuelLogs = await FuelLog.find({ trajet: { $in: trajetIds } });
        const totalCarburant = fuelLogs.reduce((sum, log) => sum + log.quantiteLitres, 0);
        
        // Calculer la distance totale
        const trajetsComplets = await Trajet.find({ _id: { $in: trajetIds } })
            .select('kilometrageArrivee kilometrageDepart');
        const totalDistance = trajetsComplets.reduce((sum, trajet) => {
            if (trajet.kilometrageArrivee && trajet.kilometrageDepart) {
                return sum + (trajet.kilometrageArrivee - trajet.kilometrageDepart);
            }
            return sum;
        }, 0);
        
        const consommationMoyenne = totalDistance > 0 
            ? (totalCarburant / totalDistance) * 100 
            : 0;
        
        return {
            consommationMoyenne: Math.round(consommationMoyenne * 100) / 100,
            totalCarburant: Math.round(totalCarburant * 100) / 100,
            totalDistance: Math.round(totalDistance),
            nombreTrajets: trajetIds.length
        };
    } catch(err) {
        throw new Error(err.message);
    }
}
