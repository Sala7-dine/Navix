import mongoose from 'mongoose';

const remorqueSchema = new mongoose.Schema(
  {
    matricule: {
      type: String,
      required: [true, 'Le matricule est requis'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      required: [true, 'Le type de remorque est requis'],
      trim: true,
      enum: {
        values: ['FRIGORIFIQUE', 'BENNE', 'PLATEAU', 'CITERNE', 'PORTE_CONTENEUR'],
        message: '{VALUE} n\'est pas un type de remorque valide',
      },
    },
      status: {
          type: String,
          enum: {
              values: ['DISPONIBLE', 'EN_TRAJET', 'MAINTENANCE'],
              message: '{VALUE} n\'est pas un statut valide',
          },
          default: 'DISPONIBLE',
      },
    capacite: {
      type: Number,
      required: [true, 'La capacité est requise'],
      min: [0, 'La capacité doit être positive'],
    },
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les recherches par matricule
remorqueSchema.index({ matricule: 1 });

// Index pour rechercher par type
remorqueSchema.index({ type: 1 });

// Virtual pour obtenir tous les trajets utilisant cette remorque
remorqueSchema.virtual('trajets', {
  ref: 'Trajet',
  localField: '_id',
  foreignField: 'remorque',
});

// Méthode statique pour trouver les remorques par type
// remorqueSchema.statics.findByType = function (type) {
//   return this.find({ type });
// };

const Remorque = mongoose.model('Remorque', remorqueSchema);

export default Remorque;
