import * as yup from 'yup';

// ============================================
// Validation pour Auth (Login, Register, etc.)
// ============================================

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Email invalide')
    .required("L'email est obligatoire"),
  password: yup
    .string()
    .required('Le mot de passe est obligatoire')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export const registerSchema = yup.object({
  fullName: yup
    .string()
    .required('Le nom complet est obligatoire')
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  email: yup
    .string()
    .email('Email invalide')
    .required("L'email est obligatoire"),
  password: yup
    .string()
    .required('Le mot de passe est obligatoire')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
    ),
  confirmPassword: yup
    .string()
    .required('La confirmation du mot de passe est obligatoire')
    .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas'),
  role: yup
    .string()
    .oneOf(['admin', 'chauffeur'], 'Rôle invalide')
    .default('chauffeur'),
});

export const changePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Le mot de passe actuel est obligatoire'),
  newPassword: yup
    .string()
    .required('Le nouveau mot de passe est obligatoire')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
    )
    .test(
      'different-password',
      'Le nouveau mot de passe doit être différent de l\'ancien',
      function (value) {
        return value !== this.parent.currentPassword;
      }
    ),
  confirmPassword: yup
    .string()
    .required('La confirmation du mot de passe est obligatoire')
    .oneOf([yup.ref('newPassword')], 'Les mots de passe ne correspondent pas'),
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Email invalide')
    .required("L'email est obligatoire"),
});

export const resetPasswordSchema = yup.object({
  token: yup
    .string()
    .required('Le token est obligatoire'),
  newPassword: yup
    .string()
    .required('Le nouveau mot de passe est obligatoire')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
    ),
  confirmPassword: yup
    .string()
    .required('La confirmation du mot de passe est obligatoire')
    .oneOf([yup.ref('newPassword')], 'Les mots de passe ne correspondent pas'),
});

export const refreshTokenSchema = yup.object({
  refreshToken: yup
    .string()
    .required('Le refresh token est obligatoire'),
});
