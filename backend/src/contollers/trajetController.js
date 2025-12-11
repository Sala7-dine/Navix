import { 
    createTrajet,
    getAllTrajets,
    getTrajetById,
    updateTrajet,
    deleteTrajet,
    demarrerTrajet,
    terminerTrajet,
    getTrajetsEnCours,
    getTrajetsByChauffeur
} from "../services/trajetSerevice.js";

export const CreateTrajet = async (req, res) => {
    try {
        console.log(req.body); 
        const trajet = await createTrajet(req.body);

        res.status(201).json({
            success: true,
            data: trajet
        }); 
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const GetAllTrajets = async (req, res) => {
    try {
        const { statut, chauffeur, camion } = req.query;
        const filters = {};
        
        if (statut) filters.statut = statut;
        if (chauffeur) filters.chauffeur = chauffeur;
        if (camion) filters.camion = camion;
        
        const trajets = await getAllTrajets(filters);

        res.status(200).json({
            success: true,
            count: trajets.length,
            data: trajets
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const GetTrajetById = async (req, res) => {
    try {
        const { id } = req.params;
        const trajet = await getTrajetById(id);

        res.status(200).json({
            success: true,
            data: trajet
        });
    } catch(err) {
        res.status(404).json({
            success: false,
            message: err.message
        });
    }
}

export const UpdateTrajet = async (req, res) => {
    try {
        const { id } = req.params;
        const trajet = await updateTrajet(id, req.body);

        res.status(200).json({
            success: true,
            message: 'Trajet modifié avec succès',
            data: trajet
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const DeleteTrajet = async (req, res) => {
    try {
        const { id } = req.params;
        const trajet = await deleteTrajet(id);

        res.status(200).json({
            success: true,
            message: 'Trajet supprimé avec succès',
            data: trajet
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const DemarrerTrajet = async (req, res) => {
    try {
        const { id } = req.params;
        const trajet = await demarrerTrajet(id);

        res.status(200).json({
            success: true,
            message: 'Trajet démarré avec succès',
            data: trajet
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const TerminerTrajet = async (req, res) => {
    try {
        const { id } = req.params;
        const trajet = await terminerTrajet(id, req.body);

        res.status(200).json({
            success: true,
            message: 'Trajet terminé avec succès',
            data: trajet
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const GetTrajetsEnCours = async (req, res) => {
    try {
        const trajets = await getTrajetsEnCours();

        res.status(200).json({
            success: true,
            count: trajets.length,
            data: trajets
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const GetTrajetsByChauffeur = async (req, res) => {
    try {
        const { chauffeurId } = req.params;
        const trajets = await getTrajetsByChauffeur(chauffeurId);

        res.status(200).json({
            success: true,
            count: trajets.length,
            data: trajets
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}