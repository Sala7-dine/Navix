import Trajet from "../models/Trajet.js";
import Camion from "../models/Camion.js";
import User from "../models/User.js";
import Remorque from "../models/Remorque.js";
import Maintenance from "../models/Maintenance.js";
import PDFDocument from "pdfkit";

export const createTrajet = async (trajetData) => {

    try {
        // Vérifier que le chauffeur existe et est valide
        if (trajetData.chauffeur) {

            const chauffeur = await User.findOne({ 
                _id: trajetData.chauffeur, 
                role: 'chauffeur'
            });

            if (!chauffeur) {
                throw new Error('Chauffeur introuvable ou invalide');
            }
        }

        // Vérifier que le camion est disponible
        const camion = await Camion.findById(trajetData.camion);
        if (!camion) {
            throw new Error('Camion introuvable');
        }
        if (camion.status !== 'DISPONIBLE') {
            throw new Error('Le camion n\'est pas disponible');
        }

        // Vérifier que le remoruqe est disponible
        const remorque = await Remorque.findById(trajetData.remorque);
        if (!remorque) {
            throw new Error('Remorque introuvable');
        }
        if (remorque.status !== 'DISPONIBLE') {
            throw new Error('Le remorque n\'est pas disponible');
        }


        // Préparer les données du trajet avec le kilométrage de départ
        const trajetComplet = {
            ...trajetData,
            statut: trajetData.statut || 'PLANIFIE',
            kilometrageDepart: camion.kilometrageActuel
        };

        const trajet = await Trajet.create(trajetComplet);

        // Mettre à jour le statut du camion et remorque
        if (trajet) {
            await Camion.findByIdAndUpdate(trajetData.camion, { status: 'EN_MISSION' });
            await Remorque.findByIdAndUpdate(trajetData.remorque, { status: 'EN_MISSION' });
        }
        
        return await trajet.populate(['chauffeur', 'camion', 'remorque']);
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getAllTrajets = async (filters = {}) => {
    try {
        const trajets = await Trajet.find(filters)
            .populate('chauffeur', 'fullName email')
            .populate('camion', 'matricule marque modele')
            .populate('remorque', 'matricule type')
            .sort({ dateDepart: -1 });
        return trajets;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getTrajetById = async (id) => {
    try {
        const trajet = await Trajet.findById(id)
            .populate('chauffeur', 'fullName email telephone')
            .populate('camion', 'matricule marque modele')
            .populate('remorque', 'matricule type capacite')
            .populate('fuelLogs');
        
        if (!trajet) {
            throw new Error('Trajet introuvable');
        }
        return trajet;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const updateTrajet = async (id, updateData) => {
    try {
        const trajet = await Trajet.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        )
        .populate('chauffeur', 'fullName email')
        .populate('camion', 'matricule marque modele')
        .populate('remorque', 'matricule type');
        
        if (!trajet) {
            throw new Error('Trajet introuvable');
        }

        return trajet;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const deleteTrajet = async (id) => {
    try {
        const trajet = await Trajet.findByIdAndDelete(id);
        if (!trajet) {
            throw new Error('Trajet introuvable');
        }
        
        // Libérer le camion si le trajet était en cours
        if (trajet) {
            await Camion.findByIdAndUpdate(trajet.camion, { status: 'DISPONIBLE' });
            await Remorque.findByIdAndUpdate(trajet.remorque, { status: 'DISPONIBLE' });
        }

        return trajet;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getTrajetsEnCours = async () => {
    try {
        const trajets = await Trajet.findEnCours();
        return trajets;
    } catch(err) {
        throw new Error(err.message);
    }
}

export const getTrajetsByChauffeur = async (chauffeurId) => {
    try {
        const trajets = await Trajet.findByChauffeur(chauffeurId);
        return trajets;
    } catch(err) {
        throw new Error(err.message);
    }
}

// ============ NOUVELLES FONCTIONNALITÉS ============

/**
 * Chauffeur: Mettre à jour le statut du trajet (PLANIFIE -> EN_COURS -> TERMINE)
 */
export const updateStatutTrajet = async (trajetId, nouveauStatut, chauffeurId, data = {}) => {
    try {
        const trajet = await Trajet.findById(trajetId);
        if (!trajet) {
            throw new Error('Trajet introuvable');
        }

        // Vérifier que le chauffeur est bien assigné à ce trajet
        if (trajet.chauffeur.toString() !== chauffeurId.toString()) {
            throw new Error('Vous n\'êtes pas autorisé à modifier ce trajet');
        }

        // Valider les transitions de statut
        const transitionsValides = {
            'PLANIFIE': ['EN_COURS'],
            'EN_COURS': ['TERMINE'],
            'TERMINE': []
        };

        if (!transitionsValides[trajet.statut].includes(nouveauStatut)) {
            throw new Error(`Transition de statut invalide: ${trajet.statut} -> ${nouveauStatut}`);
        }

        // Mettre à jour selon le nouveau statut
        if (nouveauStatut === 'EN_COURS') {
            await trajet.demarrer();
            await Camion.findByIdAndUpdate(trajet.camion, { status: 'EN_TRAJET' });
            await Remorque.findByIdAndUpdate(trajet.remorque, { status: 'EN_TRAJET' });
        } else if (nouveauStatut === 'TERMINE') {
            if (!data.kilometrageArrivee) {
                throw new Error('Le kilométrage d\'arrivée est requis');
            }
            await trajet.terminer(data.kilometrageArrivee, data.dateArrivee || new Date());
            
            // Mise à jour automatique du kilométrage du camion
            await updateKilometrageCamion(trajet.camion, data.kilometrageArrivee);
            
            // Libérer le camion et remorque
            await Camion.findByIdAndUpdate(trajet.camion, { status: 'DISPONIBLE' });
            await Remorque.findByIdAndUpdate(trajet.remorque, { status: 'DISPONIBLE' });

            // Vérifier les alertes de maintenance
            await verifierAlertesMaintenance(trajet.camion);
        }

        return await trajet.populate(['chauffeur', 'camion', 'remorque']);
    } catch(err) {
        throw new Error(err.message);
    }
}

/**
 * Chauffeur: Valider kilométrage arrivée et volume gasoil
 */
export const validerFinTrajet = async (trajetId, chauffeurId, { kilometrageArrivee, volumeGasoilRestant }) => {
    try {
        const trajet = await Trajet.findById(trajetId).populate('camion');
        if (!trajet) {
            throw new Error('Trajet introuvable');
        }

        // Vérifier que le chauffeur est bien assigné
        if (trajet.chauffeur.toString() !== chauffeurId.toString()) {
            throw new Error('Vous n\'êtes pas autorisé à valider ce trajet');
        }

        // Vérifier que le trajet est en cours
        if (trajet.statut !== 'EN_COURS') {
            throw new Error('Le trajet doit être en cours pour être validé');
        }

        // Validations
        if (!kilometrageArrivee || kilometrageArrivee <= trajet.kilometrageDepart) {
            throw new Error('Le kilométrage d\'arrivée doit être supérieur au kilométrage de départ');
        }

        if (volumeGasoilRestant !== undefined) {
            if (volumeGasoilRestant < 0 || volumeGasoilRestant > trajet.camion.capaciteReservoir) {
                throw new Error(`Volume de gasoil invalide (doit être entre 0 et ${trajet.camion.capaciteReservoir}L)`);
            }
        }

        // Terminer le trajet
        await trajet.terminer(kilometrageArrivee, new Date());
        
        // Mise à jour automatique du kilométrage du camion
        await updateKilometrageCamion(trajet.camion._id, kilometrageArrivee);
        
        // Enregistrer le volume de gasoil restant si fourni
        if (volumeGasoilRestant !== undefined) {
            trajet.volumeGasoilRestant = volumeGasoilRestant;
            await trajet.save();
        }
        
        // Libérer le camion
        await Camion.findByIdAndUpdate(trajet.camion._id, { status: 'DISPONIBLE' });
        await Remorque.findByIdAndUpdate(trajet.remorque._id, { status: 'DISPONIBLE' });

        // Vérifier les alertes de maintenance
        const alertes = await verifierAlertesMaintenance(trajet.camion._id);

        return {
            trajet: await trajet.populate(['chauffeur', 'camion', 'remorque']),
            alertesMaintenance: alertes
        };
    } catch(err) {
        throw new Error(err.message);
    }
}

/**
 * Mise à jour automatique du kilométrage total du camion
 */
const updateKilometrageCamion = async (camionId, nouveauKilometrage) => {
    try {
        const camion = await Camion.findById(camionId);
        if (!camion) {
            throw new Error('Camion introuvable');
        }

        // Vérifier que le nouveau kilométrage est supérieur à l'ancien
        if (nouveauKilometrage < camion.kilometrageActuel) {
            throw new Error(`Le nouveau kilométrage (${nouveauKilometrage} km) ne peut pas être inférieur au kilométrage actuel (${camion.kilometrageActuel} km)`);
        }

        camion.kilometrageActuel = nouveauKilometrage;
        camion.derniereMAJKilometrage = new Date();
        await camion.save();

        return camion;
    } catch(err) {
        throw new Error(err.message);
    }
}

/**
 * Système de règles de maintenance avec alertes automatiques
 */
const verifierAlertesMaintenance = async (camionId) => {
    try {
        const camion = await Camion.findById(camionId);
        if (!camion) {
            throw new Error('Camion introuvable');
        }

        // Récupérer la dernière maintenance de chaque type
        const derniereVidange = await Maintenance.findOne({
            camion: camionId,
            type: 'VIDANGE'
        }).sort({ date: -1 });

        const derniereRevision = await Maintenance.findOne({
            camion: camionId,
            type: 'REVISION'
        }).sort({ date: -1 });

        const alertes = [];

        // Règles de maintenance
        const SEUILS = {
            VIDANGE: 10000, // km
            REVISION: 30000, // km
            VIDANGE_URGENT: 11000, // km (alerte urgente)
            REVISION_URGENTE: 32000 // km (alerte urgente)
        };

        // Calculer les km depuis la dernière vidange
        const kmDepuisVidange = derniereVidange 
            ? camion.kilometrageActuel - derniereVidange.kilometrageAuMoment
            : camion.kilometrageActuel;

        if (kmDepuisVidange >= SEUILS.VIDANGE_URGENT) {
            alertes.push({
                type: 'VIDANGE',
                niveau: 'URGENT',
                message: `Vidange URGENTE requise ! ${kmDepuisVidange} km depuis la dernière vidange`,
                kmDepuis: kmDepuisVidange,
                seuil: SEUILS.VIDANGE_URGENT
            });
        } else if (kmDepuisVidange >= SEUILS.VIDANGE) {
            alertes.push({
                type: 'VIDANGE',
                niveau: 'ALERTE',
                message: `Vidange recommandée : ${kmDepuisVidange} km depuis la dernière vidange`,
                kmDepuis: kmDepuisVidange,
                seuil: SEUILS.VIDANGE
            });
        }

        // Calculer les km depuis la dernière révision
        const kmDepuisRevision = derniereRevision
            ? camion.kilometrageActuel - derniereRevision.kilometrageAuMoment
            : camion.kilometrageActuel;

        if (kmDepuisRevision >= SEUILS.REVISION_URGENTE) {
            alertes.push({
                type: 'REVISION',
                niveau: 'URGENT',
                message: `Révision URGENTE requise ! ${kmDepuisRevision} km depuis la dernière révision`,
                kmDepuis: kmDepuisRevision,
                seuil: SEUILS.REVISION_URGENTE
            });
        } else if (kmDepuisRevision >= SEUILS.REVISION) {
            alertes.push({
                type: 'REVISION',
                niveau: 'ALERTE',
                message: `Révision recommandée : ${kmDepuisRevision} km depuis la dernière révision`,
                kmDepuis: kmDepuisRevision,
                seuil: SEUILS.REVISION
            });
        }

        // Mettre le camion en maintenance si alerte urgente
        if (alertes.some(a => a.niveau === 'URGENT')) {
            await Camion.findByIdAndUpdate(camionId, {
                status: 'MAINTENANCE',
                alertesMaintenance: alertes
            });
        }

        return alertes;
    } catch(err) {
        throw new Error(err.message);
    }
}

export { updateKilometrageCamion, verifierAlertesMaintenance };

/**
 * Générer un PDF du trajet pour le chauffeur
 */
export const genererPDFTrajet = async (trajetId, chauffeurId) => {
    try {
        // Récupérer le trajet avec toutes les informations
        const trajet = await Trajet.findById(trajetId)
            .populate('chauffeur', 'fullName email telephone')
            .populate('camion', 'matricule marque modele')
            .populate('remorque', 'matricule type capacite');
        
        if (!trajet) {
            throw new Error('Trajet introuvable');
        }

        // Vérifier que le chauffeur est bien assigné à ce trajet
        if (trajet.chauffeur._id.toString() !== chauffeurId.toString()) {
            throw new Error('Vous n\'êtes pas autorisé à télécharger ce trajet');
        }

        // Créer un document PDF
        const doc = new PDFDocument({ margin: 50 });

        // En-tête du document
        doc.fontSize(20)
           .font('Helvetica-Bold')
           .text('RAPPORT DE TRAJET', { align: 'center' })
           .moveDown(0.5);

        doc.fontSize(10)
           .font('Helvetica')
           .text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, { align: 'center' })
           .moveDown(1.5);

        // Informations du trajet
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('INFORMATIONS DU TRAJET', { underline: true })
           .moveDown(0.5);

        doc.fontSize(11)
           .font('Helvetica');

        const yStart = doc.y;
        
        // Colonne de gauche
        doc.text(`Statut: `, 50, yStart, { continued: true })
           .font('Helvetica-Bold')
           .text(trajet.statut);
        
        doc.font('Helvetica')
           .text(`Lieu de départ: `, 50, doc.y, { continued: true })
           .font('Helvetica-Bold')
           .text(trajet.lieuDepart);
        
        doc.font('Helvetica')
           .text(`Lieu d'arrivée: `, 50, doc.y, { continued: true })
           .font('Helvetica-Bold')
           .text(trajet.lieuArrivee);
        
        doc.font('Helvetica')
           .text(`Date de départ: `, 50, doc.y, { continued: true })
           .font('Helvetica-Bold')
           .text(new Date(trajet.dateDepart).toLocaleString('fr-FR'));

        if (trajet.dateArrivee) {
            doc.font('Helvetica')
               .text(`Date d'arrivée: `, 50, doc.y, { continued: true })
               .font('Helvetica-Bold')
               .text(new Date(trajet.dateArrivee).toLocaleString('fr-FR'));
        }

        doc.moveDown(1.5);

        // Kilométrage
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('KILOMÉTRAGE', { underline: true })
           .moveDown(0.5);

        doc.fontSize(11)
           .font('Helvetica')
           .text(`Kilométrage de départ: `, 50, doc.y, { continued: true })
           .font('Helvetica-Bold')
           .text(`${trajet.kilometrageDepart} km`);

        if (trajet.kilometrageArrivee) {
            doc.font('Helvetica')
               .text(`Kilométrage d'arrivée: `, 50, doc.y, { continued: true })
               .font('Helvetica-Bold')
               .text(`${trajet.kilometrageArrivee} km`);

            const distance = trajet.kilometrageArrivee - trajet.kilometrageDepart;
            doc.font('Helvetica')
               .text(`Distance parcourue: `, 50, doc.y, { continued: true })
               .font('Helvetica-Bold')
               .text(`${distance} km`);
        }

        doc.moveDown(1.5);

        // Informations du chauffeur
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('CHAUFFEUR', { underline: true })
           .moveDown(0.5);

        doc.fontSize(11)
           .font('Helvetica')
           .text(`Nom: `, 50, doc.y, { continued: true })
           .font('Helvetica-Bold')
           .text(trajet.chauffeur.fullName);

        doc.font('Helvetica')
           .text(`Email: `, 50, doc.y, { continued: true })
           .font('Helvetica-Bold')
           .text(trajet.chauffeur.email);

        if (trajet.chauffeur.telephone) {
            doc.font('Helvetica')
               .text(`Téléphone: `, 50, doc.y, { continued: true })
               .font('Helvetica-Bold')
               .text(trajet.chauffeur.telephone);
        }

        doc.moveDown(1.5);

        // Informations du véhicule
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('VÉHICULES', { underline: true })
           .moveDown(0.5);

        doc.fontSize(11)
           .font('Helvetica')
           .text('Camion:', { underline: true })
           .moveDown(0.3);

        doc.text(`  Matricule: `, 50, doc.y, { continued: true })
           .font('Helvetica-Bold')
           .text(trajet.camion.matricule);

        doc.font('Helvetica')
           .text(`  Marque/Modèle: `, 50, doc.y, { continued: true })
           .font('Helvetica-Bold')
           .text(`${trajet.camion.marque} ${trajet.camion.modele}`);

        if (trajet.remorque) {
            doc.moveDown(0.5);
            doc.font('Helvetica')
               .text('Remorque:', { underline: true })
               .moveDown(0.3);

            doc.text(`  Matricule: `, 50, doc.y, { continued: true })
               .font('Helvetica-Bold')
               .text(trajet.remorque.matricule);

            doc.font('Helvetica')
               .text(`  Type: `, 50, doc.y, { continued: true })
               .font('Helvetica-Bold')
               .text(trajet.remorque.type);

            if (trajet.remorque.capacite) {
                doc.font('Helvetica')
                   .text(`  Capacité: `, 50, doc.y, { continued: true })
                   .font('Helvetica-Bold')
                   .text(`${trajet.remorque.capacite} tonnes`);
            }
        }

        // Volume de gasoil restant
        if (trajet.volumeGasoilRestant !== undefined && trajet.volumeGasoilRestant !== null) {
            doc.moveDown(1.5);
            doc.fontSize(14)
               .font('Helvetica-Bold')
               .text('CARBURANT', { underline: true })
               .moveDown(0.5);

            doc.fontSize(11)
               .font('Helvetica')
               .text(`Volume de gasoil restant: `, 50, doc.y, { continued: true })
               .font('Helvetica-Bold')
               .text(`${trajet.volumeGasoilRestant} L`);
        }

        // Remarques
        if (trajet.remarques) {
            doc.moveDown(1.5);
            doc.fontSize(14)
               .font('Helvetica-Bold')
               .text('REMARQUES', { underline: true })
               .moveDown(0.5);

            doc.fontSize(11)
               .font('Helvetica')
               .text(trajet.remarques, {
                   width: 500,
                   align: 'justify'
               });
        }

        // Pied de page
        doc.moveDown(2);
        doc.fontSize(9)
           .font('Helvetica-Oblique')
           .text('---', { align: 'center' })
           .text('Ce document a été généré automatiquement par le système Navix', { align: 'center' })
           .text(`ID du trajet: ${trajet._id}`, { align: 'center' });

        return doc;
    } catch(err) {
        throw new Error(err.message);
    }
}