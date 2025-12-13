import * as yup from 'yup';

// ============================================
// Validation pour Maintenance
// ============================================

const piecesReplacees = yup.object({
  nom: yup.string().required('Le nom de la pièce est requis'),
  reference: yup.string().optional(),
  quantite: yup.number().positive('La quantité doit être positive').default(1),
  prix: yup.number().min(0, 'Le prix ne peut pas être négatif').optional(),
});

export const createMaintenanceSchema = yup.object({
  type: yup
    .string()
    .required('Le type de maintenance est requis')
    .oneOf(
      [
        'VIDANGE',
        'REVISION',
        'PNEU',
        'FREIN',
        'TRANSMISSION',
        'SUSPENSION',
        'CLIMATISATION',
        'ELECTRICITE',
        'CARROSSERIE',
        'AUTRE',
      ],
      'Type de maintenance invalide'
    ),
  description: yup
    .string()
    .required('La description est requise')
    .min(5, 'La description doit contenir au moins 5 caractères')
    .max(500, 'La description ne peut pas dépasser 500 caractères'),
  camion: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, 'ID de camion invalide')
    .test('camion-or-pneu', 'Le camion ou le pneu doit être fourni', function (value) {
      const { pneu } = this.parent;
      return value || pneu;
    })
    .optional(),
  pneu: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, 'ID de pneu invalide')
    .optional(),
  cout: yup
    .number()
    .min(0, 'Le coût ne peut pas être négatif')
    .default(0),
  date: yup
    .date()
    .max(new Date(), 'La date ne peut pas être dans le futur')
    .default(() => new Date()),
  statut: yup
    .string()
    .oneOf(
      ['PLANIFIEE', 'EN_COURS', 'TERMINEE', 'ANNULEE'],
      'Statut invalide'
    )
    .default('PLANIFIEE'),
  kilometrageIntervention: yup
    .number()
    .min(0, 'Le kilométrage ne peut pas être négatif')
    .optional(),
  prochainKilometrageIntervention: yup
    .number()
    .min(0, 'Le kilométrage ne peut pas être négatif')
    .when('kilometrageIntervention', (kilometrageIntervention, schema) => {
      return schema.test({
        test: (prochainKilometrage) => {
          if (kilometrageIntervention && prochainKilometrage) {
            return prochainKilometrage > kilometrageIntervention;
          }
          return true;
        },
        message: 'Le prochain kilométrage doit être supérieur au kilométrage actuel',
      });
    })
    .optional(),
  garage: yup
    .string()
    .max(200, 'Le nom du garage ne peut pas dépasser 200 caractères')
    .optional(),
  technicien: yup
    .string()
    .max(100, 'Le nom du technicien ne peut pas dépasser 100 caractères')
    .optional(),
  piecesRemplacees: yup
    .array()
    .of(piecesReplacees)
    .optional(),
  remarques: yup
    .string()
    .max(1000, 'Les remarques ne peuvent pas dépasser 1000 caractères')
    .optional(),
});

export const updateMaintenanceSchema = yup.object({
  type: yup
    .string()
    .oneOf(
      [
        'VIDANGE',
        'REVISION',
        'PNEU',
        'FREIN',
        'TRANSMISSION',
        'SUSPENSION',
        'CLIMATISATION',
        'ELECTRICITE',
        'CARROSSERIE',
        'AUTRE',
      ],
      'Type de maintenance invalide'
    )
    .optional(),
  description: yup
    .string()
    .min(5, 'La description doit contenir au moins 5 caractères')
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .optional(),
  camion: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, 'ID de camion invalide')
    .optional(),
  pneu: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, 'ID de pneu invalide')
    .optional(),
  cout: yup
    .number()
    .min(0, 'Le coût ne peut pas être négatif')
    .optional(),
  date: yup
    .date()
    .max(new Date(), 'La date ne peut pas être dans le futur')
    .optional(),
  statut: yup
    .string()
    .oneOf(
      ['PLANIFIEE', 'EN_COURS', 'TERMINEE', 'ANNULEE'],
      'Statut invalide'
    )
    .optional(),
  kilometrageIntervention: yup
    .number()
    .min(0, 'Le kilométrage ne peut pas être négatif')
    .optional(),
  prochainKilometrageIntervention: yup
    .number()
    .min(0, 'Le kilométrage ne peut pas être négatif')
    .optional(),
  garage: yup
    .string()
    .max(200, 'Le nom du garage ne peut pas dépasser 200 caractères')
    .optional(),
  technicien: yup
    .string()
    .max(100, 'Le nom du technicien ne peut pas dépasser 100 caractères')
    .optional(),
  piecesRemplacees: yup
    .array()
    .of(piecesReplacees)
    .optional(),
  remarques: yup
    .string()
    .max(1000, 'Les remarques ne peuvent pas dépasser 1000 caractères')
    .optional(),
});
