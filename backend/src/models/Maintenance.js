import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Le type de maintenance est requis'],
      enum: {
        values: [
          'VIDANGE',
          'PNEU',
          'REVISION',
          'FREIN',
          'TRANSMISSION',
          'SUSPENSION',
          'CLIMATISATION',
          'ELECTRICITE',
          'CARROSSERIE',
          'AUTRE',
        ],
        message: '{VALUE} n\'est pas un type de maintenance valide',
      },
    },
    description: {
      type: String,
      required: [true, 'La description est requise'],
      trim: true,
      minlength: [10, 'La description doit contenir au moins 10 caractères'],
      maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères'],
    },
    cout: {
      type: Number,
      required: [true, 'Le coût est requis'],
      min: [0, 'Le coût doit être positif'],
    },
    date: {
      type: Date,
      required: [true, 'La date est requise'],
      default: Date.now,
    },
    statut: {
      type: String,
      enum: {
        values: ['PLANIFIEE', 'EN_COURS', 'TERMINEE', 'ANNULEE'],
        message: '{VALUE} n\'est pas un statut valide',
      },
      default: 'PLANIFIEE',
    },
    camion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Camion',
      validate: {
        validator: function (value) {
          // Au moins un des deux (camion ou pneu) doit être renseigné
          return value || this.pneu;
        },
        message: 'La maintenance doit être associée à un camion ou à un pneu',
      },
    },
    pneu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pneu',
      validate: {
        validator: function (value) {
          // Si c'est une maintenance de type PNEU, le pneu doit être renseigné
          if (this.type === 'PNEU' && !value) {
            return false;
          }
          return true;
        },
        message: 'Une maintenance de type PNEU doit avoir un pneu associé',
      },
    },
    garage: {
      type: String,
      trim: true,
    },
    technicien: {
      type: String,
      trim: true,
    },
    kilometrageIntervention: {
      type: Number,
      min: [0, 'Le kilométrage doit être positif'],
    },
    prochainKilometrageIntervention: {
      type: Number,
      min: [0, 'Le kilométrage doit être positif'],
      validate: {
        validator: function (value) {
          if (value && this.kilometrageIntervention) {
            return value > this.kilometrageIntervention;
          }
          return true;
        },
        message: 'Le prochain kilométrage doit être supérieur au kilométrage actuel',
      },
    },
    pieceRemplacees: [
      {
        nom: {
          type: String,
          required: true,
          trim: true,
        },
        reference: {
          type: String,
          trim: true,
        },
        quantite: {
          type: Number,
          default: 1,
          min: [1, 'La quantité doit être au moins 1'],
        },
        prix: {
          type: Number,
          min: [0, 'Le prix doit être positif'],
        },
      },
    ],
    remarques: {
      type: String,
      trim: true,
      maxlength: [1000, 'Les remarques ne peuvent pas dépasser 1000 caractères'],
    },
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les recherches par camion
maintenanceSchema.index({ camion: 1, date: -1 });

// Index pour optimiser les recherches par pneu
maintenanceSchema.index({ pneu: 1, date: -1 });

// Index pour optimiser les recherches par type
maintenanceSchema.index({ type: 1, date: -1 });

// Index pour optimiser les recherches par statut
maintenanceSchema.index({ statut: 1 });

// Index composé pour les recherches de maintenances planifiées
maintenanceSchema.index({ statut: 1, date: 1 });

// Virtual pour calculer le coût total incluant les pièces
// maintenanceSchema.virtual('coutTotal').get(function () {
//   let total = this.cout || 0;
//   if (this.pieceRemplacees && this.pieceRemplacees.length > 0) {
//     const coutPieces = this.pieceRemplacees.reduce((sum, piece) => {
//       return sum + (piece.prix || 0) * (piece.quantite || 1);
//     }, 0);
//     total += coutPieces;
//   }
//   return total;
// });

// Méthode statique pour trouver les maintenances par camion
// maintenanceSchema.statics.findByCamion = function (camionId) {
//   return this.find({ camion: camionId })
//     .sort({ date: -1 })
//     .populate('pneu', 'position usurePourcentage');
// };

// Méthode statique pour trouver les maintenances planifiées
// maintenanceSchema.statics.findPlanifiees = function () {
//   return this.find({ statut: 'PLANIFIEE' })
//     .sort({ date: 1 })
//     .populate('camion', 'matricule marque modele')
//     .populate('pneu', 'position usurePourcentage');
// };

// Méthode statique pour calculer le coût total des maintenances par camion
// maintenanceSchema.statics.calculateCoutByCamion = function (camionId, dateDebut, dateFin) {
//   const match = { camion: mongoose.Types.ObjectId(camionId) };
  
//   if (dateDebut && dateFin) {
//     match.date = { $gte: dateDebut, $lte: dateFin };
//   }
  
//   return this.aggregate([
//     { $match: match },
//     {
//       $group: {
//         _id: '$camion',
//         totalCout: { $sum: '$cout' },
//         nombreMaintenances: { $sum: 1 },
//       },
//     },
//   ]);
// };

// Méthode statique pour obtenir les statistiques par type
maintenanceSchema.statics.getStatsByType = function (dateDebut, dateFin) {
  const match = {};
  
  if (dateDebut && dateFin) {
    match.date = { $gte: dateDebut, $lte: dateFin };
  }
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$type',
        totalCout: { $sum: '$cout' },
        nombreInterventions: { $sum: 1 },
        coutMoyen: { $avg: '$cout' },
      },
    },
    { $sort: { totalCout: -1 } },
  ]);
};

// Méthode d'instance pour terminer une maintenance
// maintenanceSchema.methods.terminer = function () {
//   if (this.statut !== 'EN_COURS') {
//     throw new Error('Seule une maintenance en cours peut être terminée');
//   }
  
//   this.statut = 'TERMINEE';
//   return this.save();
// };

// Méthode d'instance pour démarrer une maintenance
// maintenanceSchema.methods.demarrer = function () {
//   if (this.statut !== 'PLANIFIEE') {
//     throw new Error('Seule une maintenance planifiée peut être démarrée');
//   }
  
//   this.statut = 'EN_COURS';
//   this.date = new Date();
//   return this.save();
// };

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

export default Maintenance;
