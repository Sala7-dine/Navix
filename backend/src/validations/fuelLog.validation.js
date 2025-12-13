import * as yup from 'yup';

// ============================================
// Validation pour FuelLog
// ============================================

export const createFuelLogSchema = yup.object({
  trajet: yup
    .string()
    .required('Le trajet est requis')
    .matches(/^[0-9a-fA-F]{24}$/, 'ID de trajet invalide'),
  volumeLitres: yup
    .number()
    .required('Le volume en litres est requis')
    .positive('Le volume doit être positif')
    .min(1, 'Le volume minimum est de 1 litre')
    .max(2000, 'Le volume maximum est de 2000 litres'),
  prixTotal: yup
    .number()
    .required('Le prix total est requis')
    .positive('Le prix doit être positif')
    .min(0.01, 'Le prix minimum est de 0.01'),
  prixParLitre: yup
    .number()
    .positive('Le prix par litre doit être positif')
    .optional(), // Sera calculé automatiquement
  date: yup
    .date()
    .max(new Date(), 'La date ne peut pas être dans le futur')
    .default(() => new Date()),
  lieuStation: yup
    .string()
    .min(2, 'Le lieu de la station doit contenir au moins 2 caractères')
    .max(200, 'Le lieu de la station ne peut pas dépasser 200 caractères')
    .optional(),
  remarques: yup
    .string()
    .max(500, 'Les remarques ne peuvent pas dépasser 500 caractères')
    .optional(),
});

export const updateFuelLogSchema = yup.object({
  trajet: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, 'ID de trajet invalide')
    .optional(),
  volumeLitres: yup
    .number()
    .positive('Le volume doit être positif')
    .min(1, 'Le volume minimum est de 1 litre')
    .max(2000, 'Le volume maximum est de 2000 litres')
    .optional(),
  prixTotal: yup
    .number()
    .positive('Le prix doit être positif')
    .min(0.01, 'Le prix minimum est de 0.01')
    .optional(),
  prixParLitre: yup
    .number()
    .positive('Le prix par litre doit être positif')
    .optional(),
  date: yup
    .date()
    .max(new Date(), 'La date ne peut pas être dans le futur')
    .optional(),
  lieuStation: yup
    .string()
    .min(2, 'Le lieu de la station doit contenir au moins 2 caractères')
    .max(200, 'Le lieu de la station ne peut pas dépasser 200 caractères')
    .optional(),
  remarques: yup
    .string()
    .max(500, 'Les remarques ne peuvent pas dépasser 500 caractères')
    .optional(),
});
