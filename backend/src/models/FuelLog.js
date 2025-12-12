import mongoose from 'mongoose';

const fuelLogSchema = new mongoose.Schema(
  {
    trajet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trajet',
      required: [true, 'Le trajet est requis'],
    },
    volumeLitres: {
      type: Number,
      required: [true, 'Le volume en litres est requis'],
      min: [0, 'Le volume doit être positif'],
    },
    prixTotal: {
      type: Number,
      required: [true, 'Le prix total est requis'],
      min: [0, 'Le prix doit être positif'],
    },
    prixParLitre: {
      type: Number,
      min: [0, 'Le prix par litre doit être positif'],
    },
    date: {
      type: Date,
      required: [true, 'La date est requise'],
      default: Date.now,
    },
    lieuStation: {
      type: String,
      trim: true,
    },
    remarques: {
      type: String,
      trim: true,
      maxlength: [500, 'Les remarques ne peuvent pas dépasser 500 caractères'],
    },
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les recherches par trajet
fuelLogSchema.index({ trajet: 1, date: -1 });

// Index pour optimiser les recherches par date
fuelLogSchema.index({ date: -1 });

// Middleware pre-save pour calculer automatiquement le prix par litre
fuelLogSchema.pre('save', function (next) {
  if (this.volumeLitres > 0 && this.prixTotal >= 0) {
    this.prixParLitre = this.prixTotal / this.volumeLitres;
  }
  next();
});

// Virtual pour obtenir les informations du trajet
fuelLogSchema.virtual('trajetInfo', {
  ref: 'Trajet',
  localField: 'trajet',
  foreignField: '_id',
  justOne: true,
});

// Méthode statique pour calculer le coût total de carburant par trajet
fuelLogSchema.statics.calculateTotalByTrajet = function (trajetId) {
  return this.aggregate([
    { $match: { trajet: mongoose.Types.ObjectId(trajetId) } },
    {
      $group: {
        _id: '$trajet',
        totalVolume: { $sum: '$volumeLitres' },
        totalCout: { $sum: '$prixTotal' },
        prixMoyenParLitre: { $avg: '$prixParLitre' },
        nombreRavitaillements: { $sum: 1 },
      },
    },
  ]);
};

// Méthode statique pour obtenir les statistiques de carburant d'une période
fuelLogSchema.statics.getStatsByPeriode = function (dateDebut, dateFin) {
  return this.aggregate([
    {
      $match: {
        date: {
          $gte: dateDebut,
          $lte: dateFin,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalVolume: { $sum: '$volumeLitres' },
        totalCout: { $sum: '$prixTotal' },
        prixMoyenParLitre: { $avg: '$prixParLitre' },
        nombreRavitaillements: { $sum: 1 },
      },
    },
  ]);
};

// Méthode d'instance pour obtenir la consommation
fuelLogSchema.methods.getConsommation = async function () {
  const trajet = await mongoose.model('Trajet').findById(this.trajet);
  if (trajet && trajet.distanceParcourue) {
    return (this.volumeLitres / trajet.distanceParcourue) * 100; // L/100km
  }
  return null;
};

const FuelLog = mongoose.model('FuelLog', fuelLogSchema);

export default FuelLog;
