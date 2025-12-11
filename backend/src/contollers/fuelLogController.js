import { 
    createFuelLog,
    getAllFuelLogs,
    getFuelLogById,
    getFuelLogsByTrajet,
    updateFuelLog,
    deleteFuelLog,
    calculateTotalByTrajet,
    getStatsByPeriode,
    getConsommationMoyenneByCamion
} from "../services/fuelLogService.js";

export const CreateFuelLog = async (req, res) => {
    try {
        const fuelLog = await createFuelLog(req.body);

        res.status(201).json({
            success: true,
            data: fuelLog
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const GetAllFuelLogs = async (req, res) => {
    try {
        const { trajet } = req.query;
        const filters = {};
        
        if (trajet) filters.trajet = trajet;
        
        const fuelLogs = await getAllFuelLogs(filters);

        res.status(200).json({
            success: true,
            count: fuelLogs.length,
            data: fuelLogs
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const GetFuelLogById = async (req, res) => {
    try {
        const { id } = req.params;
        const fuelLog = await getFuelLogById(id);

        res.status(200).json({
            success: true,
            data: fuelLog
        });
    } catch(err) {
        res.status(404).json({
            success: false,
            message: err.message
        });
    }
}

export const GetFuelLogsByTrajet = async (req, res) => {
    try {
        const { trajetId } = req.params;
        const fuelLogs = await getFuelLogsByTrajet(trajetId);

        res.status(200).json({
            success: true,
            count: fuelLogs.length,
            data: fuelLogs
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const UpdateFuelLog = async (req, res) => {
    try {
        const { id } = req.params;
        const fuelLog = await updateFuelLog(id, req.body);

        res.status(200).json({
            success: true,
            message: 'Ravitaillement modifié avec succès',
            data: fuelLog
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const DeleteFuelLog = async (req, res) => {
    try {
        const { id } = req.params;
        const fuelLog = await deleteFuelLog(id);

        res.status(200).json({
            success: true,
            message: 'Ravitaillement supprimé avec succès',
            data: fuelLog
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const GetTotalByTrajet = async (req, res) => {
    try {
        const { trajetId } = req.params;
        const totals = await calculateTotalByTrajet(trajetId);

        res.status(200).json({
            success: true,
            data: totals
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const GetStatsByPeriode = async (req, res) => {
    try {
        const { dateDebut, dateFin } = req.query;
        const stats = await getStatsByPeriode(
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

export const GetConsommationMoyenneByCamion = async (req, res) => {
    try {
        const { camionId } = req.params;
        const { dateDebut, dateFin } = req.query;
        
        const stats = await getConsommationMoyenneByCamion(
            camionId,
            dateDebut,
            dateFin
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
