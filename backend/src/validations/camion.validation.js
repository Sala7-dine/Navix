import * as yup from 'yup';

// ============================================
// Validation pour Camion
// ============================================

export const createCamionSchema = yup.object({
  matricule: yup
    .string()
    .required('Le matricule est requis')
    .uppercase('Le matricule doit être en majuscules')
    .matches(
      /^[A-Z0-9-]+$/,
      'Le matricule doit contenir uniquement des lettres majuscules, chiffres et tirets'
    ),
  marque: yup
    .string()
    .required('La marque est requise')
    .min(2, 'La marque doit contenir au moins 2 caractères')
    .max(50, 'La marque ne peut pas dépasser 50 caractères'),
  modele: yup
    .string()
    .required('Le modèle est requis')
    .min(2, 'Le modèle doit contenir au moins 2 caractères')
    .max(50, 'Le modèle ne peut pas dépasser 50 caractères'),
  capaciteReservoir: yup
    .number()
    .required('La capacité du réservoir est requise')
    .positive('La capacité du réservoir doit être positive')
    .min(50, 'La capacité minimale est de 50 litres')
    .max(2000, 'La capacité maximale est de 2000 litres'),
  kilometrageActuel: yup
    .number()
    .min(0, 'Le kilométrage ne peut pas être négatif')
    .max(10000000, 'Le kilométrage semble invalide')
    .default(0),
  status: yup
    .string()
    .oneOf(
      ['DISPONIBLE', 'EN_MISSION', 'EN_TRAJET', 'MAINTENANCE'],
      'Statut invalide'
    )
    .default('DISPONIBLE'),
});

export const updateCamionSchema = yup.object({
  matricule: yup
    .string()
    .uppercase('Le matricule doit être en majuscules')
    .matches(
      /^[A-Z0-9-]+$/,
      'Le matricule doit contenir uniquement des lettres majuscules, chiffres et tirets'
    )
    .optional(),
  marque: yup
    .string()
    .min(2, 'La marque doit contenir au moins 2 caractères')
    .max(50, 'La marque ne peut pas dépasser 50 caractères')
    .optional(),
  modele: yup
    .string()
    .min(2, 'Le modèle doit contenir au moins 2 caractères')
    .max(50, 'Le modèle ne peut pas dépasser 50 caractères')
    .optional(),
  capaciteReservoir: yup
    .number()
    .positive('La capacité du réservoir doit être positive')
    .min(50, 'La capacité minimale est de 50 litres')
    .max(2000, 'La capacité maximale est de 2000 litres')
    .optional(),
  kilometrageActuel: yup
    .number()
    .min(0, 'Le kilométrage ne peut pas être négatif')
    .max(10000000, 'Le kilométrage semble invalide')
    .optional(),
  status: yup
    .string()
    .oneOf(
      ['DISPONIBLE', 'EN_MISSION', 'EN_TRAJET', 'MAINTENANCE'],
      'Statut invalide'
    )
    .optional(),
});
