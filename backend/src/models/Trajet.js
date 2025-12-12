import mongoose from 'mongoose';

const trajetSchema = new mongoose.Schema(
  {
    chauffeur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Le chauffeur est requis'],
    },

    camion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Camion',
      required: [true, 'Le camion est requis'],
    },
    remorque: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Remorque',
      default: null,
    },
    statut: {
      type: String,
      enum: {
        values: ['PLANIFIE', 'EN_COURS', 'TERMINE', 'ANNULE'],
        message: '{VALUE} n\'est pas un statut valide',
      },
      default: 'PLANIFIE',
    },
    lieuDepart: {
      type: String,
      required: [true, 'Le lieu de départ est requis'],
      trim: true,
    },
    lieuArrivee: {
      type: String,
      required: [true, 'Le lieu d\'arrivée est requis'],
      trim: true,
    },
    kilometrageDepart: {
      type: Number,
      required: [true, 'Le kilométrage de départ est requis'],
      min: [0, 'Le kilométrage de départ doit être positif'],
    },
    kilometrageArrivee: {
      type: Number,
      min: [0, 'Le kilométrage d\'arrivée doit être positif'],
      validate: {
        validator: function (value) {
          // Valider seulement si le trajet est terminé
          if (this.statut === 'TERMINE' && value) {
            return value >= this.kilometrageDepart;
          }
          return true;
        },
        message: 'Le kilométrage d\'arrivée doit être supérieur au kilométrage de départ',
      },
    },
    dateDepart: {
      type: Date,
      required: [true, 'La date de départ est requise'],
    },
    dateArrivee: {
      type: Date,
      validate: {
        validator: function (value) {
          // Valider seulement si une date d'arrivée est fournie
          if (value) {
            return value >= this.dateDepart;
          }
          return true;
        },
        message: 'La date d\'arrivée doit être postérieure à la date de départ',
      },
    },
    remarques: {
      type: String,
      trim: true,
      maxlength: [1000, 'Les remarques ne peuvent pas dépasser 1000 caractères'],
    },
    volumeGasoilRestant: {
      type: Number,
      min: [0, 'Le volume de gasoil ne peut pas être négatif'],
    },
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les recherches par chauffeur
trajetSchema.index({ chauffeur: 1, dateDepart: -1 });

// Index pour optimiser les recherches par camion
trajetSchema.index({ camion: 1, dateDepart: -1 });

// Index pour optimiser les recherches par statut
trajetSchema.index({ statut: 1 });

// Index composé pour les recherches de trajets actifs
trajetSchema.index({ statut: 1, dateDepart: -1 });

// Middleware pre-remove pour cascade delete (COMPOSITION)
// Supprimer tous les FuelLogs associés quand le trajet est supprimé
trajetSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    const FuelLog = mongoose.model('FuelLog');
    await FuelLog.deleteMany({ trajet: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

// Virtual pour calculer la distance parcourue
// trajetSchema.virtual('distanceParcourue').get(function () {
//   if (this.kilometrageArrivee && this.kilometrageDepart) {
//     return this.kilometrageArrivee - this.kilometrageDepart;
//   }
//   return null;
// });

// Virtual pour calculer la durée du trajet
// trajetSchema.virtual('duree').get(function () {
//   if (this.dateArrivee && this.dateDepart) {
//     return Math.floor((this.dateArrivee - this.dateDepart) / (1000 * 60 * 60)); // en heures
//   }
//   return null;
// });

// Virtual pour obtenir tous les FuelLogs du trajet
trajetSchema.virtual('fuelLogs', {
  ref: 'FuelLog',
  localField: '_id',
  foreignField: 'trajet',
});

// Méthode statique pour trouver les trajets en cours
// trajetSchema.statics.findEnCours = function () {
//   return this.find({ statut: 'EN_COURS' })
//     .populate('chauffeur', 'fullName email')
//     .populate('camion', 'matricule marque modele')
//     .populate('remorque', 'matricule type');
// };

// Méthode statique pour trouver les trajets par chauffeur
// trajetSchema.statics.findByChauffeur = function (chauffeurId) {
//   return this.find({ chauffeur: chauffeurId })
//     .populate('camion', 'matricule marque modele')
//     .populate('remorque', 'matricule type')
//     .sort({ dateDepart: -1 });
// };

// Méthode d'instance pour terminer un trajet
trajetSchema.methods.terminer = function (kilometrageArrivee, dateArrivee = new Date()) {
  if (this.statut !== 'EN_COURS') {
    throw new Error('Seul un trajet en cours peut être terminé');
  }
  
  this.statut = 'TERMINE';
  this.kilometrageArrivee = kilometrageArrivee;
  this.dateArrivee = dateArrivee;
  
  return this.save();
};

// Méthode d'instance pour démarrer un trajet
trajetSchema.methods.demarrer = function () {
  if (this.statut !== 'PLANIFIE') {
    throw new Error('Seul un trajet à faire peut être démarré');
  }
  
  this.statut = 'EN_COURS';
  this.dateDepart = new Date();
  
  return this.save();
};

const Trajet = mongoose.model('Trajet', trajetSchema);

export default Trajet;
