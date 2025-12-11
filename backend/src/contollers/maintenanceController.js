import { 
    createMaintenance,
    getAllMaintenances,
    getMaintenanceById,
    getMaintenancesByCamion,
    updateMaintenance,
    deleteMaintenance,
    getMaintenancesPlanifiees,
    demarrerMaintenance,
    terminerMaintenance,
    getStatsByType,
    calculateCoutByCamion
} from "../services/maintenanceService.js";

export const CreateMaintenance = async (req, res) => {
    try {
        const maintenance = await createMaintenance(req.body);

        res.status(201).json({
            success: true,
            data: maintenance
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const GetAllMaintenances = async (req, res) => {
    try {
        const { type, statut, camion } = req.query;
        const filters = {};
        
        if (type) filters.type = type;
        if (statut) filters.statut = statut;
        if (camion) filters.camion = camion;
        
        const maintenances = await getAllMaintenances(filters);

        res.status(200).json({
            success: true,
            count: maintenances.length,
            data: maintenances
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const GetMaintenanceById = async (req, res) => {
    try {
        const { id } = req.params;
        const maintenance = await getMaintenanceById(id);

        res.status(200).json({
            success: true,
            data: maintenance
        });
    } catch(err) {
        res.status(404).json({
            success: false,
            message: err.message
        });
    }
}

export const GetMaintenancesByCamion = async (req, res) => {
    try {
        const { camionId } = req.params;
        const maintenances = await getMaintenancesByCamion(camionId);

        res.status(200).json({
            success: true,
            count: maintenances.length,
            data: maintenances
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const UpdateMaintenance = async (req, res) => {
    try {
        const { id } = req.params;
        const maintenance = await updateMaintenance(id, req.body);

        res.status(200).json({
            success: true,
            message: 'Maintenance modifiée avec succès',
            data: maintenance
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const DeleteMaintenance = async (req, res) => {
    try {
        const { id } = req.params;
        const maintenance = await deleteMaintenance(id);

        res.status(200).json({
            success: true,
            message: 'Maintenance supprimée avec succès',
            data: maintenance
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const GetMaintenancesPlanifiees = async (req, res) => {
    try {
        const maintenances = await getMaintenancesPlanifiees();

        res.status(200).json({
            success: true,
            count: maintenances.length,
            data: maintenances
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const DemarrerMaintenance = async (req, res) => {
    try {
        const { id } = req.params;
        const maintenance = await demarrerMaintenance(id);

        res.status(200).json({
            success: true,
            message: 'Maintenance démarrée avec succès',
            data: maintenance
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const TerminerMaintenance = async (req, res) => {
    try {
        const { id } = req.params;
        const maintenance = await terminerMaintenance(id);

        res.status(200).json({
            success: true,
            message: 'Maintenance terminée avec succès',
            data: maintenance
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const GetStatsByType = async (req, res) => {
    try {
        const { dateDebut, dateFin } = req.query;
        const stats = await getStatsByType(
            dateDebut ? new Date(dateDebut) : null,
            dateFin ? new Date(dateFin) : null
        );

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const GetCoutByCamion = async (req, res) => {
    try {
        const { camionId } = req.params;
        const { dateDebut, dateFin } = req.query;
        
        const stats = await calculateCoutByCamion(
            camionId,
            dateDebut ? new Date(dateDebut) : null,
            dateFin ? new Date(dateFin) : null
        );

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}
