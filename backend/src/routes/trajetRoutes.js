import express from "express";

import { 
    CreateTrajet,
    GetAllTrajets,
    GetTrajetById,
    UpdateTrajet,
    DeleteTrajet,
    DemarrerTrajet,
    TerminerTrajet,
    GetTrajetsEnCours,
    GetTrajetsByChauffeur,
    UpdateStatutTrajet,
    ValiderFinTrajet,
    GetMesTrajets
} from "../contollers/trajetController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";

const route = express.Router();

// Routes publiques (authentifiées)
route.get('/chauffeur/mes-trajets', authenticate, GetMesTrajets); // Doit être avant /:id
route.get('/en-cours', authenticate, GetTrajetsEnCours);
route.get('/chauffeur/:chauffeurId', authenticate, GetTrajetsByChauffeur);
route.get('/', authenticate, GetAllTrajets);
route.get('/:id', authenticate, GetTrajetById);

// Routes Admin
route.post('/create', authenticate, requireAdmin, CreateTrajet);
route.put('/update/:id', authenticate, requireAdmin, UpdateTrajet);
route.delete('/delete/:id', authenticate, requireAdmin, DeleteTrajet);

// Routes Chauffeur
route.put('/chauffeur/:id/statut', authenticate, UpdateStatutTrajet);
route.post('/chauffeur/:id/valider', authenticate, ValiderFinTrajet);

// Actions spéciales (anciennes routes)
route.patch('/:id/demarrer', authenticate, DemarrerTrajet);
route.patch('/:id/terminer', authenticate, TerminerTrajet);

export default route;
