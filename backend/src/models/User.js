import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'le nom et prenom est obligatoire'],
    },
    email: {
      type: String,
      required: [true, "l'email et obligatoire est obligatoire"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'le password et obligatoire'],
    },
    role: {
      type: String,
      enum: ['admin', 'chauffeur'],
      default: 'chauffeur',
    },
    telephone: {
      type: String,
      trim: true,
    },
    dateEmbauche: {
      type: Date,
    },
    numeroPermis: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    dateExpirationPermis: {
      type: Date,
    },
    profileImage: {
      type: String,
      default: null,
    },
    status : {
      type : Boolean,
      default : false
    }
  },

  { timestamps: true },
);


// Index pour optimiser les recherches par email
UserSchema.index({ email: 1 });

// Index pour optimiser les recherches par rôle
UserSchema.index({ role: 1 });

// Virtual pour obtenir tous les trajets du chauffeur
UserSchema.virtual('trajets', {
  ref: 'Trajet',
  localField: '_id',
  foreignField: 'chauffeur',
});

// Méthode statique pour trouver les chauffeurs actifs
UserSchema.statics.findChauffeurs = function () {
  return this.find({ role: 'chauffeur', isDelete: false });
};

UserSchema.methods.setPassword = async function (password) {
  this.password = await bcrypt.hash(password, 10);
};

UserSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', UserSchema);
