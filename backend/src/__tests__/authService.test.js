import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock user instance - sera retourné par le constructor User
const createMockUserInstance = (overrides = {}) => ({
  _id: 'user123',
  email: 'test@example.com',
  fullName: 'Test User',
  roles: ['gestionnaire'],
  setPassword: jest.fn().mockResolvedValue(undefined),
  save: jest.fn().mockResolvedValue(undefined),
  validatePassword: jest.fn(),
  ...overrides
});

let mockUserInstance;

// Mock des modèles - User doit être une fonction constructeur
const mockUser = jest.fn();
mockUser.findOne = jest.fn();
mockUser.create = jest.fn();
mockUser.find = jest.fn();
mockUser.findOneAndUpdate = jest.fn();

const mockRefreshToken = {
  create: jest.fn(),
  findOne: jest.fn(),
  findOneAndDelete: jest.fn(),
};

// Mock bcrypt
const mockBcrypt = {
  hash: jest.fn(),
  compare: jest.fn()
};

// Mock tokens utils
const mockGenerateJti = jest.fn(() => 'mock-jti-123');
const mockSignAccessToken = jest.fn(() => 'mock-access-token');
const mockSignRefreshToken = jest.fn(() => 'mock-refresh-token');
const mockVerifyRefreshToken = jest.fn();

// Mock des modules avant import
jest.unstable_mockModule('../models/User.js', () => ({ default: mockUser }));
jest.unstable_mockModule('../models/RefreshToken.js', () => ({ default: mockRefreshToken }));
jest.unstable_mockModule('bcryptjs', () => ({ default: mockBcrypt }));
jest.unstable_mockModule('../utils/tokens.js', () => ({
  generateJti: mockGenerateJti,
  signAccessToken: mockSignAccessToken,
  signRefreshToken: mockSignRefreshToken,
  verifyRefreshToken: mockVerifyRefreshToken
}));

// Import du service après les mocks
const { register, login, refresh, logout } = await import('../services/authService.js');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUserInstance = createMockUserInstance();
    mockUser.mockImplementation(() => mockUserInstance);
    
    // Ré-configurer les mocks des fonctions token
    mockGenerateJti.mockReturnValue('mock-jti-123');
    mockSignAccessToken.mockReturnValue('mock-access-token');
    mockSignRefreshToken.mockReturnValue('mock-refresh-token');
  });

  describe('register', () => {
    it('devrait créer un nouvel utilisateur avec succès', async () => {
      const userData = {
        email: 'test@test.com',
        password: 'password123',
        fullName: 'Test User',
        roles: ['user']
      };

      mockUser.findOne.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue('hashed-token');
      mockRefreshToken.create.mockResolvedValue({});

      const result = await register(userData);

      expect(mockUser.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(mockUserInstance.setPassword).toHaveBeenCalledWith(userData.password);
      expect(mockUserInstance.save).toHaveBeenCalled();
      expect(mockGenerateJti).toHaveBeenCalled();
      expect(mockSignRefreshToken).toHaveBeenCalled();
      expect(mockSignAccessToken).toHaveBeenCalled();
      expect(mockRefreshToken.create).toHaveBeenCalled();
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('devrait lever une erreur si l\'email existe déjà', async () => {
      mockUser.findOne.mockResolvedValue({ email: 'existing@test.com' });

      await expect(register({
        email: 'existing@test.com',
        password: 'password123',
        fullName: 'Test User',
        roles: ['user']
      })).rejects.toThrow('Email déjà utilisé');
    });
  });

  describe('login', () => {
    it('devrait authentifier un utilisateur avec succès', async () => {
      const mockUserDoc = createMockUserInstance({
        email: 'test@test.com',
        validatePassword: jest.fn().mockResolvedValue(true)
      });

      mockUser.findOne.mockResolvedValue(mockUserDoc);
      mockBcrypt.hash.mockResolvedValue('hashed-token');
      mockRefreshToken.create.mockResolvedValue({});

      const result = await login({
        email: 'test@test.com',
        password: 'password123'
      });

      expect(mockUserDoc.validatePassword).toHaveBeenCalledWith('password123');
      expect(mockRefreshToken.create).toHaveBeenCalled();
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('devrait lever une erreur pour des identifiants incorrects', async () => {
      mockUser.findOne.mockResolvedValue(null);

      await expect(login({
        email: 'wrong@test.com',
        password: 'wrongpass'
      })).rejects.toThrow('Email ou mot de passe incorrect');
    });

    it('devrait lever une erreur pour un mot de passe incorrect', async () => {
      const mockUserDoc = createMockUserInstance({
        validatePassword: jest.fn().mockResolvedValue(false)
      });

      mockUser.findOne.mockResolvedValue(mockUserDoc);

      await expect(login({
        email: 'test@test.com',
        password: 'wrongpass'
      })).rejects.toThrow('Email ou mot de passe incorrect');
    });
  });

  describe('refresh', () => {
    it('devrait générer un nouveau access token', async () => {
      const mockRefreshTokenDoc = {
        user: 'user123',
        tokenHash: 'hashed-token',
        jti: 'jti123',
        revoked: false,
        expiresAt: new Date(Date.now() + 10000)
      };

      mockVerifyRefreshToken.mockReturnValue({
        sub: 'user123',
        jti: 'jti123'
      });
      mockRefreshToken.findOne.mockResolvedValue(mockRefreshTokenDoc);
      mockBcrypt.compare.mockResolvedValue(true);

      const result = await refresh('valid-refresh-token');

      expect(mockVerifyRefreshToken).toHaveBeenCalledWith('valid-refresh-token');
      expect(mockRefreshToken.findOne).toHaveBeenCalledWith({ jti: 'jti123' });
      expect(mockBcrypt.compare).toHaveBeenCalledWith('valid-refresh-token', 'hashed-token');
      expect(mockSignAccessToken).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('devrait lever une erreur pour un token invalide', async () => {
      mockVerifyRefreshToken.mockImplementation(() => {
        throw new Error('Token invalide');
      });

      await expect(refresh('invalid-token')).rejects.toThrow('Refresh token invalide');
    });

    it('devrait lever une erreur si le token n\'existe pas', async () => {
      mockVerifyRefreshToken.mockReturnValue({
        sub: 'user123',
        jti: 'jti123'
      });
      mockRefreshToken.findOne.mockResolvedValue(null);

      await expect(refresh('valid-token')).rejects.toThrow('Refresh token invalide');
    });

    it('devrait lever une erreur si le token est révoqué', async () => {
      mockVerifyRefreshToken.mockReturnValue({
        sub: 'user123',
        jti: 'jti123'
      });
      mockRefreshToken.findOne.mockResolvedValue({
        revoked: true,
        tokenHash: 'hash'
      });

      await expect(refresh('valid-token')).rejects.toThrow('Refresh token invalide');
    });
  });

  describe('logout', () => {
    it('devrait supprimer le refresh token', async () => {
      mockVerifyRefreshToken.mockReturnValue({
        sub: 'user123',
        jti: 'jti123'
      });
      mockRefreshToken.findOneAndDelete.mockResolvedValue({ deletedCount: 1 });

      const result = await logout('valid-refresh-token');

      expect(mockVerifyRefreshToken).toHaveBeenCalledWith('valid-refresh-token');
      expect(mockRefreshToken.findOneAndDelete).toHaveBeenCalledWith({ jti: 'jti123' });
      expect(result).toHaveProperty('message', 'Déconnexion réussie');
    });

    it('devrait lever une erreur pour un token invalide', async () => {
      mockVerifyRefreshToken.mockImplementation(() => {
        throw new Error('Token invalide');
      });

      await expect(logout('invalid-token')).rejects.toThrow();
    });
  });
});
