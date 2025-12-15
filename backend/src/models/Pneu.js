import mongoose from 'mongoose';

const pneuSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: [true, 'La position du pneu est requise'],
      enum: {
        values: [
          'AVANT_GAUCHE',
          'AVANT_DROIT',
          'ARRIERE_GAUCHE',
          'ARRIERE_DROIT',
          'ARRIERE_GAUCHE_EXTERIEUR',
          'ARRIERE_DROIT_EXTERIEUR',
        ],
        message: '{VALUE} n\'est pas une position valide',
      },
    },
    usurePourcentage: {
      type: Number,
      required: [true, 'Le pourcentage d\'usure est requis'],
      min: [0, 'L\'usure ne peut pas être négative'],
      max: [100, 'L\'usure ne peut pas dépasser 100%'],
      default: 0,
    },
    dateInstallation: {
      type: Date,
      required: [true, 'La date d\'installation est requise'],
      default: Date.now,
    },
    camion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Camion',
      required: [true, 'Le camion associé est requis'],
    },
  },
  {
    timestamps: true,
  }
);

// Index composé pour optimiser les recherches par camion et position
pneuSchema.index({ camion: 1, position: 1 });

// Index pour rechercher les pneus par niveau d'usure
pneuSchema.index({ usurePourcentage: 1 });

// Middleware pre-remove pour cascade delete (COMPOSITION)
// Supprimer toutes les maintenances associées quand le pneu est supprimé
pneuSchema.pre('deleteOne', { document: true, query: false }, async function () {
  const Maintenance = mongoose.model('Maintenance');
  await Maintenance.deleteMany({ pneu: this._id });
});

// Virtual pour obtenir toutes les maintenances du pneu
pneuSchema.virtual('maintenances', {
  ref: 'Maintenance',
  localField: '_id',
  foreignField: 'pneu',
});

// Méthode virtuelle pour vérifier si le pneu doit être changé
pneuSchema.virtual('doitEtreChange').get(function () {
  return this.usurePourcentage >= 80;
});


const Pneu = mongoose.model('Pneu', pneuSchema);

export default Pneu;
