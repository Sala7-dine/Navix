import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock Pneu methods
const mockPneu = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
};

// Mock Camion
const mockCamion = {
  findById: jest.fn()
};

// Mock des modules avant import
jest.unstable_mockModule('../models/Pneu.js', () => ({ default: mockPneu }));
jest.unstable_mockModule('../models/Camion.js', () => ({ default: mockCamion }));

// Import du service après les mocks
const {
  createPneu,
  getAllPneus,
  getPneuById,
  getPneusByCamion,
  updatePneu,
  deletePneu
} = await import('../services/pneuService.js');

describe('PneuService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPneu', () => {
    it('devrait créer un nouveau pneu', async () => {
      const pneuData = {
        camion: 'camion123',
        position: 'AVANT_GAUCHE',
        marque: 'Michelin'
      };

      mockCamion.findById.mockResolvedValue({ _id: 'camion123' });
      mockPneu.create.mockResolvedValue({
        ...pneuData,
        populate: jest.fn().mockResolvedValue(pneuData)
      });

      const result = await createPneu(pneuData);

      expect(mockCamion.findById).toHaveBeenCalledWith('camion123');
      expect(mockPneu.create).toHaveBeenCalledWith(pneuData);
      expect(result).toBeDefined();
    });

    it('devrait lever une erreur si le camion n\'existe pas', async () => {
      mockCamion.findById.mockResolvedValue(null);

      await expect(createPneu({ camion: 'nonexistent' }))
        .rejects.toThrow('Camion introuvable');
    });
  });

  describe('getAllPneus', () => {
    it('devrait retourner tous les pneus', async () => {
      const mockPneus = [
        { _id: '1', position: 'AVANT_GAUCHE' },
        { _id: '2', position: 'AVANT_DROIT' }
      ];

      const mockSort = jest.fn().mockResolvedValue(mockPneus);
      const mockPopulate = jest.fn().mockReturnValue({ sort: mockSort });
      mockPneu.find.mockReturnValue({ populate: mockPopulate });

      const result = await getAllPneus();

      expect(mockPneu.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockPneus);
      expect(result).toHaveLength(2);
    });

    it('devrait filtrer les pneus', async () => {
      const filters = { camion: 'camion123' };
      const mockSort = jest.fn().mockResolvedValue([]);
      const mockPopulate = jest.fn().mockReturnValue({ sort: mockSort });
      mockPneu.find.mockReturnValue({ populate: mockPopulate });

      await getAllPneus(filters);

      expect(mockPneu.find).toHaveBeenCalledWith(filters);
    });
  });

  describe('getPneuById', () => {
    it('devrait retourner un pneu par ID', async () => {
      const mockPneuData = {
        _id: 'pneu123',
        position: 'AVANT_GAUCHE'
      };

      const mockPopulate = jest.fn().mockReturnThis();
      mockPneu.findById.mockReturnValue({
        populate: mockPopulate.mockImplementation(() => ({
          populate: mockPopulate.mockResolvedValue(mockPneuData)
        }))
      });

      const result = await getPneuById('pneu123');

      expect(mockPneu.findById).toHaveBeenCalledWith('pneu123');
      expect(result).toEqual(mockPneuData);
    });

    it('devrait lever une erreur si le pneu n\'existe pas', async () => {
      const mockPopulate = jest.fn().mockReturnThis();
      mockPneu.findById.mockReturnValue({
        populate: mockPopulate.mockImplementation(() => ({
          populate: mockPopulate.mockResolvedValue(null)
        }))
      });

      await expect(getPneuById('nonexistent'))
        .rejects.toThrow('Pneu introuvable');
    });
  });

  describe('getPneusByCamion', () => {
    it('devrait retourner les pneus d\'un camion', async () => {
      const mockPneus = [
        { _id: '1', camion: 'camion123', position: 'AVANT_GAUCHE' },
        { _id: '2', camion: 'camion123', position: 'AVANT_DROIT' }
      ];

      const mockSort = jest.fn().mockResolvedValue(mockPneus);
      mockPneu.find.mockReturnValue({ sort: mockSort });

      const result = await getPneusByCamion('camion123');

      expect(mockPneu.find).toHaveBeenCalledWith({ camion: 'camion123' });
      expect(result).toEqual(mockPneus);
    });
  });

  describe('updatePneu', () => {
    it('devrait mettre à jour un pneu', async () => {
      const updateData = { usurePourcentage: 50 };
      const updatedPneu = { _id: 'pneu123', ...updateData };

      const mockPopulate = jest.fn().mockResolvedValue(updatedPneu);
      mockPneu.findByIdAndUpdate.mockReturnValue({ populate: mockPopulate });

      const result = await updatePneu('pneu123', updateData);

      expect(mockPneu.findByIdAndUpdate).toHaveBeenCalledWith(
        'pneu123',
        { $set: updateData },
        { new: true, runValidators: true }
      );
      expect(result).toEqual(updatedPneu);
    });

    it('devrait lever une erreur si le pneu n\'existe pas', async () => {
      const mockPopulate = jest.fn().mockResolvedValue(null);
      mockPneu.findByIdAndUpdate.mockReturnValue({ populate: mockPopulate });

      await expect(updatePneu('nonexistent', {}))
        .rejects.toThrow('Pneu introuvable');
    });
  });

  describe('deletePneu', () => {
    it('devrait supprimer un pneu', async () => {
      const mockPneuData = {
        _id: 'pneu123',
        deleteOne: jest.fn().mockResolvedValue({})
      };
      mockPneu.findById.mockResolvedValue(mockPneuData);

      const result = await deletePneu('pneu123');

      expect(mockPneu.findById).toHaveBeenCalledWith('pneu123');
      expect(mockPneuData.deleteOne).toHaveBeenCalled();
      expect(result).toEqual(mockPneuData);
    });

    it('devrait lever une erreur si le pneu n\'existe pas', async () => {
      mockPneu.findById.mockResolvedValue(null);

      await expect(deletePneu('nonexistent'))
        .rejects.toThrow('Pneu introuvable');
    });
  });
});
