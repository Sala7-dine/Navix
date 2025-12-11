import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock du modèle User
const mockUser = {
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn()
};

// Mock du module User
jest.unstable_mockModule('../models/User.js', () => ({ default: mockUser }));

// Import du service après les mocks
const { createUser, getAllUsers, getUserById, updateUser, deleteUser, getChauffeurs } = await import('../services/userService.js');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('devrait créer un utilisateur avec succès', async () => {
      const userData = {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean@test.com',
        role: 'admin'
      };

      const mockCreatedUser = { _id: '123', ...userData };
      mockUser.create.mockResolvedValue(mockCreatedUser);

      const result = await createUser(userData);

      expect(mockUser.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(mockCreatedUser);
    });

    it('devrait lever une erreur en cas d\'échec', async () => {
      mockUser.create.mockRejectedValue(new Error('Erreur de création'));

      await expect(createUser({})).rejects.toThrow('Erreur de création');
    });
  });

  describe('getAllUsers', () => {
    it('devrait retourner tous les utilisateurs non supprimés', async () => {
      const mockUsers = [
        { _id: '1', nom: 'Dupont', email: 'dupont@test.com' },
        { _id: '2', nom: 'Martin', email: 'martin@test.com' }
      ];

      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockUsers)
      };
      mockUser.find.mockReturnValue(mockQuery);

      const result = await getAllUsers();

      expect(mockUser.find).toHaveBeenCalledWith({ isDelete: false });
      expect(mockQuery.select).toHaveBeenCalledWith('-password');
      expect(result).toEqual(mockUsers);
    });

    it('devrait filtrer par rôle si fourni', async () => {
      const mockQuery = {
        select: jest.fn().mockResolvedValue([])
      };
      mockUser.find.mockReturnValue(mockQuery);

      await getAllUsers({ role: 'chauffeur' });

      expect(mockUser.find).toHaveBeenCalledWith({ isDelete: false, role: 'chauffeur' });
    });
  });

  describe('getUserById', () => {
    it('devrait retourner un utilisateur par ID', async () => {
      const mockUserData = { _id: '123', nom: 'Dupont' };
      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockUserData)
      };
      mockUser.findOne.mockReturnValue(mockQuery);

      const result = await getUserById('123');

      expect(mockUser.findOne).toHaveBeenCalledWith({ _id: '123', isDelete: false });
      expect(result).toEqual(mockUserData);
    });

    it('devrait lever une erreur si l\'utilisateur n\'existe pas', async () => {
      const mockQuery = {
        select: jest.fn().mockResolvedValue(null)
      };
      mockUser.findOne.mockReturnValue(mockQuery);

      await expect(getUserById('999')).rejects.toThrow('Utilisateur introuvable');
    });
  });

  describe('updateUser', () => {
    it('devrait mettre à jour un utilisateur', async () => {
      const mockUpdatedUser = { _id: '123', nom: 'Dupont Updated' };
      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockUpdatedUser)
      };
      mockUser.findOneAndUpdate.mockReturnValue(mockQuery);

      const result = await updateUser('123', { nom: 'Dupont Updated' });

      expect(mockUser.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: '123', isDelete: false },
        { $set: { nom: 'Dupont Updated' } },
        { new: true, runValidators: true }
      );
      expect(result).toEqual(mockUpdatedUser);
    });

    it('devrait supprimer le mot de passe des données de mise à jour', async () => {
      const mockQuery = {
        select: jest.fn().mockResolvedValue({ _id: '123' })
      };
      mockUser.findOneAndUpdate.mockReturnValue(mockQuery);

      await updateUser('123', { nom: 'Test', password: 'secret' });

      const updateCall = mockUser.findOneAndUpdate.mock.calls[0][1];
      expect(updateCall.$set).not.toHaveProperty('password');
    });
  });

  describe('deleteUser', () => {
    it('devrait effectuer une suppression logique', async () => {
      const mockDeletedUser = { _id: '123', isDelete: true };
      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockDeletedUser)
      };
      mockUser.findOneAndUpdate.mockReturnValue(mockQuery);

      const result = await deleteUser('123');

      expect(mockUser.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: '123', isDelete: false },
        { $set: { isDelete: true } },
        { new: true }
      );
      expect(result.isDelete).toBe(true);
    });
  });

  describe('getChauffeurs', () => {
    it('devrait retourner uniquement les chauffeurs', async () => {
      const mockChauffeurs = [
        { _id: '1', nom: 'Chauffeur1', role: 'chauffeur' },
        { _id: '2', nom: 'Chauffeur2', role: 'chauffeur' }
      ];

      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockChauffeurs)
      };
      mockUser.find.mockReturnValue(mockQuery);

      const result = await getChauffeurs();

      expect(mockUser.find).toHaveBeenCalledWith({
        isDelete: false,
        role: 'chauffeur'
      });
      expect(result).toEqual(mockChauffeurs);
    });
  });
});
