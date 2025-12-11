import { 
    createCamion, 
    updateCamion, 
    deleteCamion, 
    getCamionById, 
    getAllCamions,
    getCamionsDisponibles 
} from "../services/camionService.js";


export const GetAllCamions = async (req, res) => {
    try {
        const { status } = req.query;
        const filters = status ? { status } : {};
        
        const camions = await getAllCamions(filters);
        res.status(200).json({
            success: true,
            count: camions.length,
            data: camions
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const GetCamion = async (req, res) => {
    try {
        const camion = await getCamionById(req.params.id);
        res.status(200).json({
            success: true,
            data: camion
        });
    } catch(err) {
        res.status(404).json({
            success: false,
            message: err.message
        });
    }
}

export const CreateCamion = async (req, res) => {
    try {
        const camion = await createCamion(req.body);
        res.status(201).json({
            success: true,
            message: 'Camion créé avec succès',
            data: camion
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const UpdateCamion = async (req, res) => {
    try {
        const { id } = req.params;
        const camion = await updateCamion(id, req.body);

        res.status(200).json({
            success: true,
            message: 'Camion modifié avec succès',
            data: camion
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const DeleteCamion = async (req, res) => {
    try {
        const { id } = req.params;
        const camion = await deleteCamion(id);

        res.status(200).json({
            success: true,
            message: 'Camion supprimé avec succès',
            data: camion
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const GetCamionsDisponibles = async (req, res) => {
    try {
        const camions = await getCamionsDisponibles();

        res.status(200).json({
            success: true,
            count: camions.length,
            data: camions
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}