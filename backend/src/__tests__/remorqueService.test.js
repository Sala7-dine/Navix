import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock Remorque methods
const mockRemorque = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
};

// Mock Trajet (utilisé dans deleteRemorque)
const mockTrajet = {
  findOne: jest.fn()
};

// Mock des modules avant import
jest.unstable_mockModule('../models/Remorque.js', () => ({ default: mockRemorque }));
jest.unstable_mockModule('../models/Trajet.js', () => ({ default: mockTrajet }));

// Import du service après les mocks
const {
  createRemorque,
  getAllRemorques,
  getRemorqueById,
  updateRemorque,
  deleteRemorque
} = await import('../services/remorqueService.js');

describe('RemorqueService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createRemorque', () => {
    it('devrait créer une nouvelle remorque', async () => {
      const remorqueData = {
        immatriculation: 'REM-123',
        type: 'BACHE',
        capacite: 20
      };

      mockRemorque.create.mockResolvedValue(remorqueData);

      const result = await createRemorque(remorqueData);

      expect(mockRemorque.create).toHaveBeenCalledWith(remorqueData);
      expect(result).toEqual(remorqueData);
    });

    it('devrait lever une erreur en cas d\'échec', async () => {
      mockRemorque.create.mockRejectedValue(new Error('Erreur de validation'));

      await expect(createRemorque({}))
        .rejects.toThrow('Erreur de validation');
    });
  });

  describe('getAllRemorques', () => {
    it('devrait retourner toutes les remorques', async () => {
      const mockRemorques = [
        { _id: '1', immatriculation: 'REM-123' },
        { _id: '2', immatriculation: 'REM-456' }
      ];

      mockRemorque.find.mockResolvedValue(mockRemorques);

      const result = await getAllRemorques();

      expect(mockRemorque.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockRemorques);
      expect(result).toHaveLength(2);
    });

    it('devrait filtrer les remorques', async () => {
      const filters = { type: 'BACHE' };
      mockRemorque.find.mockResolvedValue([]);

      await getAllRemorques(filters);

      expect(mockRemorque.find).toHaveBeenCalledWith(filters);
    });
  });

  describe('getRemorqueById', () => {
    it('devrait retourner une remorque par ID', async () => {
      const mockRemorqueData = {
        _id: 'remorque123',
        immatriculation: 'REM-123'
      };

      const mockPopulate = jest.fn().mockResolvedValue(mockRemorqueData);
      mockRemorque.findById.mockReturnValue({ populate: mockPopulate });

      const result = await getRemorqueById('remorque123');

      expect(mockRemorque.findById).toHaveBeenCalledWith('remorque123');
      expect(result).toEqual(mockRemorqueData);
    });

    it('devrait lever une erreur si la remorque n\'existe pas', async () => {
      const mockPopulate = jest.fn().mockResolvedValue(null);
      mockRemorque.findById.mockReturnValue({ populate: mockPopulate });

      await expect(getRemorqueById('nonexistent'))
        .rejects.toThrow('Remorque introuvable');
    });
  });

  describe('updateRemorque', () => {
    it('devrait mettre à jour une remorque', async () => {
      const updateData = { capacite: 25 };
      const updatedRemorque = { _id: 'remorque123', ...updateData };

      mockRemorque.findByIdAndUpdate.mockResolvedValue(updatedRemorque);

      const result = await updateRemorque('remorque123', updateData);

      expect(mockRemorque.findByIdAndUpdate).toHaveBeenCalledWith(
        'remorque123',
        { $set: updateData },
        { new: true, runValidators: true }
      );
      expect(result).toEqual(updatedRemorque);
    });

    it('devrait lever une erreur si la remorque n\'existe pas', async () => {
      mockRemorque.findByIdAndUpdate.mockResolvedValue(null);

      await expect(updateRemorque('nonexistent', {}))
        .rejects.toThrow('Remorque introuvable');
    });
  });

  describe('deleteRemorque', () => {
    it('devrait supprimer une remorque', async () => {
      const mockRemorqueData = { _id: 'remorque123' };
      mockRemorque.findById.mockResolvedValue(mockRemorqueData);
      mockTrajet.findOne.mockResolvedValue(null); // Pas de trajet en cours
      mockRemorque.findByIdAndDelete.mockResolvedValue(mockRemorqueData);

      const result = await deleteRemorque('remorque123');

      expect(mockRemorque.findById).toHaveBeenCalledWith('remorque123');
      expect(mockTrajet.findOne).toHaveBeenCalledWith({
        remorque: 'remorque123',
        statut: 'EN_COURS'
      });
      expect(mockRemorque.findByIdAndDelete).toHaveBeenCalledWith('remorque123');
      expect(result).toEqual(mockRemorqueData);
    });

    it('devrait lever une erreur si la remorque n\'existe pas', async () => {
      mockRemorque.findById.mockResolvedValue(null);

      await expect(deleteRemorque('nonexistent'))
        .rejects.toThrow('Remorque introuvable');
    });

    it('devrait lever une erreur si un trajet est en cours', async () => {
      mockRemorque.findById.mockResolvedValue({ _id: 'remorque123' });
      mockTrajet.findOne.mockResolvedValue({ _id: 'trajet123', statut: 'EN_COURS' });

      await expect(deleteRemorque('remorque123'))
        .rejects.toThrow('Impossible de supprimer une remorque utilisée dans un trajet en cours');
    });
  });
});
