import mongoose from 'mongoose';

const camionSchema = new mongoose.Schema(
  {
    matricule: {
      type: String,
      required: [true, 'Le matricule est requis'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    marque: {
      type: String,
      required: [true, 'La marque est requise'],
      trim: true,
    },
    modele: {
      type: String,
      required: [true, 'Le modèle est requis'],
      trim: true,
    },
    capaciteReservoir: {
      type: Number,
      required: [true, 'La capacité du réservoir est requise'],
      min: [0, 'La capacité doit être positive'],
    },
    kilometrageActuel: {
      type: Number,
      required: [true, 'Le kilométrage actuel est requis'],
      min: [0, 'Le kilométrage doit être positif'],
      default: 0,
    },
    derniereMAJKilometrage: {
      type: Date,
      default: Date.now,
    },
    alertesMaintenance: [{
      type: {
        type: String,
        enum: ['VIDANGE', 'REVISION', 'AUTRE']
      },
      niveau: {
        type: String,
        enum: ['ALERTE', 'URGENT']
      },
      message: String,
      kmDepuis: Number,
      seuil: Number,
      dateAlerte: {
        type: Date,
        default: Date.now
      }
    }],
    status: {
      type: String,
      enum: {
        values: ['DISPONIBLE', 'EN_MISSION', 'EN_TRAJET', 'MAINTENANCE'],
        message: '{VALUE} n\'est pas un statut valide',
      },
      default: 'DISPONIBLE',
    }
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les recherches par matricule
camionSchema.index({ matricule: 1 });

// Index pour rechercher par statut
camionSchema.index({ status: 1 });

// Middleware pre-remove pour cascade delete (COMPOSITION)
// Supprimer tous les pneus associés quand le camion est supprimé
camionSchema.pre('deleteOne', { document: true, query: false }, async function () {
  const Pneu = mongoose.model('Pneu');
  await Pneu.deleteMany({ camion: this._id });
  
  const Maintenance = mongoose.model('Maintenance');
  await Maintenance.deleteMany({ camion: this._id });
});

// Virtual pour obtenir tous les pneus du camion
camionSchema.virtual('pneus', {
  ref: 'Pneu',
  localField: '_id',
  foreignField: 'camion',
});

// Virtual pour obtenir toutes les maintenances du camion
camionSchema.virtual('maintenances', {
  ref: 'Maintenance',
  localField: '_id',
  foreignField: 'camion',
});

// Virtual pour obtenir tous les trajets du camion
camionSchema.virtual('trajets', {
  ref: 'Trajet',
  localField: '_id',
  foreignField: 'camion',
});

const Camion = mongoose.model('Camion', camionSchema);

export default Camion;
