import * as yup from 'yup';

// ============================================
// Validation pour Trajet
// ============================================

export const createTrajetSchema = yup.object({
  chauffeur: yup
    .string()
    .required('Le chauffeur est requis')
    .matches(/^[0-9a-fA-F]{24}$/, 'ID de chauffeur invalide'),
  camion: yup
    .string()
    .required('Le camion est requis')
    .matches(/^[0-9a-fA-F]{24}$/, 'ID de camion invalide'),
  remorque: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, 'ID de remorque invalide')
    .nullable()
    .optional(),
  statut: yup
    .string()
    .oneOf(
      ['PLANIFIE', 'EN_COURS', 'TERMINE', 'ANNULE'],
      'Statut invalide'
    )
    .default('PLANIFIE'),
  lieuDepart: yup
    .string()
    .required('Le lieu de départ est requis')
    .min(3, 'Le lieu de départ doit contenir au moins 3 caractères')
    .max(200, 'Le lieu de départ ne peut pas dépasser 200 caractères'),
  lieuArrivee: yup
    .string()
    .required("Le lieu d'arrivée est requis")
    .min(3, "Le lieu d'arrivée doit contenir au moins 3 caractères")
    .max(200, "Le lieu d'arrivée ne peut pas dépasser 200 caractères"),
  kilometrageDepart: yup
    .number()
    .min(0, 'Le kilométrage de départ doit être positif')
    .optional(),
  kilometrageArrivee: yup
    .number()
    .min(0, "Le kilométrage d'arrivée doit être positif")
    .when('kilometrageDepart', (kilometrageDepart, schema) => {
      return schema.test({
        test: (kilometrageArrivee) => {
          if (kilometrageDepart && kilometrageArrivee) {
            return kilometrageArrivee >= kilometrageDepart;
          }
          return true;
        },
        message: "Le kilométrage d'arrivée doit être supérieur au kilométrage de départ",
      });
    })
    .optional(),
  dateDepart: yup
    .date()
    .required('La date de départ est requise'),
  dateArrivee: yup
    .date()
    .when('dateDepart', (dateDepart, schema) => {
      return schema.test({
        test: (dateArrivee) => {
          if (dateDepart && dateArrivee) {
            return dateArrivee >= dateDepart;
          }
          return true;
        },
        message: "La date d'arrivée doit être postérieure à la date de départ",
      });
    })
    .optional(),
  remarques: yup
    .string()
    .max(1000, 'Les remarques ne peuvent pas dépasser 1000 caractères')
    .optional(),
  volumeGasoilRestant: yup
    .number()
    .min(0, 'Le volume de gasoil ne peut pas être négatif')
    .optional(),
});

export const updateTrajetSchema = yup.object({
  chauffeur: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, 'ID de chauffeur invalide')
    .optional(),
  camion: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, 'ID de camion invalide')
    .optional(),
  remorque: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, 'ID de remorque invalide')
    .nullable()
    .optional(),
  statut: yup
    .string()
    .oneOf(
      ['PLANIFIE', 'EN_COURS', 'TERMINE', 'ANNULE'],
      'Statut invalide'
    )
    .optional(),
  lieuDepart: yup
    .string()
    .min(3, 'Le lieu de départ doit contenir au moins 3 caractères')
    .max(200, 'Le lieu de départ ne peut pas dépasser 200 caractères')
    .optional(),
  lieuArrivee: yup
    .string()
    .min(3, "Le lieu d'arrivée doit contenir au moins 3 caractères")
    .max(200, "Le lieu d'arrivée ne peut pas dépasser 200 caractères")
    .optional(),
  kilometrageDepart: yup
    .number()
    .min(0, 'Le kilométrage de départ doit être positif')
    .optional(),
  kilometrageArrivee: yup
    .number()
    .min(0, "Le kilométrage d'arrivée doit être positif")
    .optional(),
  dateDepart: yup
    .date()
    .optional(),
  dateArrivee: yup
    .date()
    .optional(),
  remarques: yup
    .string()
    .max(1000, 'Les remarques ne peuvent pas dépasser 1000 caractères')
    .optional(),
  volumeGasoilRestant: yup
    .number()
    .min(0, 'Le volume de gasoil ne peut pas être négatif')
    .optional(),
});

// Validation pour la mise à jour du statut par le chauffeur
export const updateStatutTrajetSchema = yup.object({
  statut: yup
    .string()
    .required('Le statut est requis')
    .oneOf(['EN_COURS', 'TERMINE'], 'Seuls les statuts EN_COURS et TERMINE sont autorisés'),
  kilometrageArrivee: yup
    .number()
    .when('statut', {
      is: 'TERMINE',
      then: (schema) => schema.required("Le kilométrage d'arrivée est requis pour terminer un trajet"),
      otherwise: (schema) => schema.optional(),
    }),
  dateArrivee: yup
    .date()
    .optional(),
});

// Validation pour la validation de fin de trajet
export const validerFinTrajetSchema = yup.object({
  kilometrageArrivee: yup
    .number()
    .required("Le kilométrage d'arrivée est requis")
    .positive("Le kilométrage d'arrivée doit être positif"),
  volumeGasoilRestant: yup
    .number()
    .min(0, 'Le volume de gasoil ne peut pas être négatif')
    .optional(),
});
