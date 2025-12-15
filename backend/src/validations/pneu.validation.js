import * as yup from 'yup';

// ============================================
// Validation pour Pneu
// ============================================

export const createPneuSchema = yup.object({
  position: yup
    .string()
    .required('La position du pneu est requise')
    .oneOf(
      [
        'AVANT_GAUCHE',
        'AVANT_DROIT',
        'ARRIERE_GAUCHE',
        'ARRIERE_DROIT',
        'ARRIERE_GAUCHE_EXTERIEUR',
        'ARRIERE_DROIT_EXTERIEUR',
      ],
      'Position invalide'
    ),
  usurePourcentage: yup
    .number()
    .min(0, "L'usure ne peut pas être négative")
    .max(100, "L'usure ne peut pas dépasser 100%")
    .default(0),
  dateInstallation: yup
    .date()
    .default(() => new Date()),
  camion: yup
    .string()
    .required('Le camion associé est requis')
    .matches(/^[0-9a-fA-F]{24}$/, 'ID de camion invalide'),
});

export const updatePneuSchema = yup.object({
  position: yup
    .string()
    .oneOf(
      [
        'AVANT_GAUCHE',
        'AVANT_DROIT',
        'ARRIERE_GAUCHE',
        'ARRIERE_DROIT',
        'ARRIERE_GAUCHE_EXTERIEUR',
        'ARRIERE_DROIT_EXTERIEUR',
      ],
      'Position invalide'
    )
    .optional(),
  usurePourcentage: yup
    .number()
    .min(0, "L'usure ne peut pas être négative")
    .max(100, "L'usure ne peut pas dépasser 100%")
    .optional(),
  dateInstallation: yup
    .date()
    .max(new Date(), "La date d'installation ne peut pas être dans le futur")
    .optional(),
  camion: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, 'ID de camion invalide')
    .optional(),
});
