import { 
    createRemorque,
    getAllRemorques,
    getRemorqueById,
    updateRemorque,
    deleteRemorque,
    getRemorquesByType
} from "../services/remorqueService.js";

export const CreateRemorque = async (req, res) => {
    try {
        const remorque = await createRemorque(req.body);

        res.status(201).json({
            success: true,
            data: remorque
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const GetAllRemorques = async (req, res) => {
    try {
        const { type } = req.query;
        const filters = type ? { type } : {};
        
        const remorques = await getAllRemorques(filters);

        res.status(200).json({
            success: true,
            count: remorques.length,
            data: remorques
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const GetRemorqueById = async (req, res) => {
    try {
        const { id } = req.params;
        const remorque = await getRemorqueById(id);

        res.status(200).json({
            success: true,
            data: remorque
        });
    } catch(err) {
        res.status(404).json({
            success: false,
            message: err.message
        });
    }
}

export const UpdateRemorque = async (req, res) => {
    try {
        const { id } = req.params;
        const remorque = await updateRemorque(id, req.body);

        res.status(200).json({
            success: true,
            message: 'Remorque modifiée avec succès',
            data: remorque
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const DeleteRemorque = async (req, res) => {
    try {
        const { id } = req.params;
        const remorque = await deleteRemorque(id);

        res.status(200).json({
            success: true,
            message: 'Remorque supprimée avec succès',
            data: remorque
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}
