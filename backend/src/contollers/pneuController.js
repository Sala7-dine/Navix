import { 
    createPneu,
    getAllPneus,
    getPneuById,
    getPneusByCamion,
    updatePneu,
    deletePneu,
    getPneusCritiques,
    updateUsurePneu
} from "../services/pneuService.js";

export const CreatePneu = async (req, res) => {
    try {
        const pneu = await createPneu(req.body);

        res.status(201).json({
            success: true,
            data: pneu
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const GetAllPneus = async (req, res) => {
    try {
        const { camion } = req.query;
        const filters = camion ? { camion } : {};
        
        const pneus = await getAllPneus(filters);

        res.status(200).json({
            success: true,
            count: pneus.length,
            data: pneus
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const GetPneuById = async (req, res) => {
    try {
        const { id } = req.params;
        const pneu = await getPneuById(id);

        res.status(200).json({
            success: true,
            data: pneu
        });
    } catch(err) {
        res.status(404).json({
            success: false,
            message: err.message
        });
    }
}

export const GetPneusByCamion = async (req, res) => {
    try {
        const { camionId } = req.params;
        const pneus = await getPneusByCamion(camionId);

        res.status(200).json({
            success: true,
            count: pneus.length,
            data: pneus
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const UpdatePneu = async (req, res) => {
    try {
        const { id } = req.params;
        const pneu = await updatePneu(id, req.body);

        res.status(200).json({
            success: true,
            message: 'Pneu modifié avec succès',
            data: pneu
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const DeletePneu = async (req, res) => {
    try {
        const { id } = req.params;
        const pneu = await deletePneu(id);

        res.status(200).json({
            success: true,
            message: 'Pneu supprimé avec succès',
            data: pneu
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const GetPneusCritiques = async (req, res) => {
    try {
        const { seuil } = req.query;
        const pneus = await getPneusCritiques(seuil ? parseInt(seuil) : 80);

        res.status(200).json({
            success: true,
            count: pneus.length,
            data: pneus
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const UpdateUsurePneu = async (req, res) => {
    try {
        const { id } = req.params;
        const { usurePourcentage } = req.body;
        const pneu = await updateUsurePneu(id, usurePourcentage);

        res.status(200).json({
            success: true,
            message: 'Usure du pneu mise à jour',
            data: pneu
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}
