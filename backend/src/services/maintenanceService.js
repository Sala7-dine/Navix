import Maintenance from "../models/Maintenance.js";
import Camion from "../models/Camion.js";
import Pneu from "../models/Pneu.js";

export const createMaintenance = async (maintenanceData) => {
    try {
        // Vérifier que le camion existe si fourni
        if (maintenanceData.camion) {
            const camion = await Camion.findById(maintenanceData.camion);
            if (!camion) {
                throw new Error('Camion introuvable');
            }
        }
        
        // Vérifier que le pneu existe si fourni
        if (maintenanceData.pneu) {
            const pneu = await Pneu.findById(maintenanceData.pneu);
            if (!pneu) {
                throw new Error('Pneu introuvable');
            }
        }
        
        const maintenance = await Maintenance.create(maintenanceData);
        return await maintenance.populate(['camion', 'pneu']);
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getAllMaintenances = async (filters = {}) => {
    try {
        const maintenances = await Maintenance.find(filters)
            .populate('camion', 'matricule marque modele')
            .populate('pneu', 'position usurePourcentage')
            .sort({ date: -1 });
        return maintenances;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getMaintenanceById = async (id) => {
    try {
        const maintenance = await Maintenance.findById(id)
            .populate('camion', 'matricule marque modele kilometrageActuel')
            .populate('pneu', 'position usurePourcentage dateInstallation');
        
        if (!maintenance) {
            throw new Error('Maintenance introuvable');
        }
        return maintenance;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getMaintenancesByCamion = async (camionId) => {
    try {
        const maintenances = await Maintenance.findByCamion(camionId);
        return maintenances;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const updateMaintenance = async (id, updateData) => {
    try {
        const maintenance = await Maintenance.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        )
        .populate('camion', 'matricule marque modele')
        .populate('pneu', 'position usurePourcentage');
        
        if (!maintenance) {
            throw new Error('Maintenance introuvable');
        }
        
        return maintenance;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const deleteMaintenance = async (id) => {
    try {
        const maintenance = await Maintenance.findByIdAndDelete(id);
        if (!maintenance) {
            throw new Error('Maintenance introuvable');
        }
        
        return maintenance;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getMaintenancesPlanifiees = async () => {
    try {
        const maintenances = await Maintenance.findPlanifiees();
        return maintenances;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const demarrerMaintenance = async (id) => {
    try {
        const maintenance = await Maintenance.findById(id);
        if (!maintenance) {
            throw new Error('Maintenance introuvable');
        }
        
        await maintenance.demarrer();
        return await maintenance.populate(['camion', 'pneu']);
    } catch(err) {
        throw new Error(err.message);
    }
}

export const terminerMaintenance = async (id) => {
    try {
        const maintenance = await Maintenance.findById(id);
        if (!maintenance) {
            throw new Error('Maintenance introuvable');
        }
        
        await maintenance.terminer();
        
        // Si c'était une maintenance de camion, libérer le statut
        if (maintenance.camion) {
            await Camion.findByIdAndUpdate(maintenance.camion, {
                status: 'DISPONIBLE'
            });
        }
        
        return await maintenance.populate(['camion', 'pneu']);
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getStatsByType = async (dateDebut, dateFin) => {
    try {
        const stats = await Maintenance.getStatsByType(dateDebut, dateFin);
        return stats;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const calculateCoutByCamion = async (camionId, dateDebut, dateFin) => {
    try {
        const stats = await Maintenance.calculateCoutByCamion(camionId, dateDebut, dateFin);
        return stats;
    } catch(err) {
        throw new Error(err.message);
    }
}
