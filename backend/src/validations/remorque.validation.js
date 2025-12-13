import * as yup from 'yup';

// ============================================
// Validation pour Remorque
// ============================================

export const createRemorqueSchema = yup.object({
  matricule: yup
    .string()
    .required('Le matricule est requis')
    .uppercase('Le matricule doit être en majuscules')
    .matches(
      /^[A-Z0-9-]+$/,
      'Le matricule doit contenir uniquement des lettres majuscules, chiffres et tirets'
    ),
  type: yup
    .string()
    .required('Le type de remorque est requis')
    .oneOf(
      ['FRIGORIFIQUE', 'BENNE', 'PLATEAU', 'CITERNE', 'PORTE_CONTENEUR'],
      'Type de remorque invalide'
    ),
  capacite: yup
    .number()
    .required('La capacité est requise')
    .positive('La capacité doit être positive')
    .min(1, 'La capacité minimale est de 1 tonne')
    .max(100, 'La capacité maximale est de 100 tonnes'),
  status: yup
    .string()
    .oneOf(
      ['DISPONIBLE', 'EN_MISSION', 'EN_TRAJET'],
      'Statut invalide'
    )
    .default('DISPONIBLE'),
});

export const updateRemorqueSchema = yup.object({
  matricule: yup
    .string()
    .uppercase('Le matricule doit être en majuscules')
    .matches(
      /^[A-Z0-9-]+$/,
      'Le matricule doit contenir uniquement des lettres majuscules, chiffres et tirets'
    )
    .optional(),
  type: yup
    .string()
    .oneOf(
      ['FRIGORIFIQUE', 'BENNE', 'PLATEAU', 'CITERNE', 'PORTE_CONTENEUR'],
      'Type de remorque invalide'
    )
    .optional(),
  capacite: yup
    .number()
    .positive('La capacité doit être positive')
    .min(1, 'La capacité minimale est de 1 tonne')
    .max(100, 'La capacité maximale est de 100 tonnes')
    .optional(),
  status: yup
    .string()
    .oneOf(
      ['DISPONIBLE', 'EN_MISSION', 'EN_TRAJET'],
      'Statut invalide'
    )
    .optional(),
});
