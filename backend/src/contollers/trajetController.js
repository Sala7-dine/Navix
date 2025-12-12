import { 
    createTrajet,
    getAllTrajets,
    getTrajetById,
    updateTrajet,
    deleteTrajet,
    getTrajetsEnCours,
    getTrajetsByChauffeur,
    updateStatutTrajet,
    validerFinTrajet,
    genererPDFTrajet
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


/* CHAUFFEUR: Mettre à jour le statut du trajet */

export const UpdateStatutTrajet = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut, ...data } = req.body;
        const chauffeurId = req.user._id; 

        if (!statut) {
            return res.status(400).json({
                success: false,
                message: 'Le statut est requis'
            });
        }

        const trajet = await updateStatutTrajet(id, statut, chauffeurId, data);

        res.status(200).json({
            success: true,
            message: `Statut du trajet mis à jour: ${statut}`,
            data: trajet
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

/* CHAUFFEUR: Valider kilométrage arrivée et volume gasoil */

export const ValiderFinTrajet = async (req, res) => {
    try {
        const { id } = req.params;
        const { kilometrageArrivee, volumeGasoilRestant } = req.body;
        const chauffeurId = req.user._id; // Récupéré depuis le middleware d'authentification

        if (!kilometrageArrivee) {
            return res.status(400).json({
                success: false,
                message: 'Le kilométrage d\'arrivée est requis'
            });
        }

        const result = await validerFinTrajet(id, chauffeurId, {
            kilometrageArrivee,
            volumeGasoilRestant
        });

        res.status(200).json({
            success: true,
            message: 'Trajet validé avec succès',
            data: result.trajet,
            alertesMaintenance: result.alertesMaintenance.length > 0 
                ? result.alertesMaintenance 
                : undefined
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

/* CHAUFFEUR: Obtenir mes trajets */

export const GetMesTrajets = async (req, res) => {
    try {
        const chauffeurId = req.user._id; 
        const { statut } = req.query;
        
        const filters = { chauffeur: chauffeurId };
        if (statut) filters.statut = statut;
        
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

/* Télécharger le trajet en PDF */ 

export const TelechargerTrajetPDF = async (req, res) => {
    try {
        const { id } = req.params;
        const chauffeurId = req.user._id;

        const pdfDoc = await genererPDFTrajet(id, chauffeurId);

        // Définir les en-têtes HTTP pour le téléchargement du fichier
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=trajet_${id}.pdf`);

        // Écrire le PDF dans la réponse
        pdfDoc.pipe(res);
        pdfDoc.end();
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}