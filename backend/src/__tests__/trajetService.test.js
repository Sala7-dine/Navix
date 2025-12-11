import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock Trajet methods
const mockTrajet = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
};

// Mock Camion
const mockCamion = {
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn()
};

// Mock des modules avant import
jest.unstable_mockModule('../models/Trajet.js', () => ({ default: mockTrajet }));
jest.unstable_mockModule('../models/Camion.js', () => ({ default: mockCamion }));

// Import du service après les mocks
const {
  createTrajet,
  getAllTrajets,
  getTrajetById,
  updateTrajet,
  deleteTrajet
} = await import('../services/trajetSerevice.js');

describe('TrajetService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTrajet', () => {
    it('devrait créer un nouveau trajet', async () => {
      const trajetData = {
        camion: 'camion123',
        chauffeur: 'user123',
        destination: 'Paris',
        statut: 'EN_COURS'
      };

      mockCamion.findById.mockResolvedValue({
        _id: 'camion123',
        status: 'DISPONIBLE'
      });
      mockCamion.findByIdAndUpdate.mockResolvedValue({});
      mockTrajet.create.mockResolvedValue({
        ...trajetData,
        populate: jest.fn().mockResolvedValue(trajetData)
      });

      const result = await createTrajet(trajetData);

      expect(mockCamion.findById).toHaveBeenCalledWith('camion123');
      expect(mockTrajet.create).toHaveBeenCalledWith(trajetData);
      expect(mockCamion.findByIdAndUpdate).toHaveBeenCalledWith(
        'camion123',
        { status: 'EN_TRAJET' }
      );
      expect(result).toBeDefined();
    });

    it('devrait lever une erreur si le camion n\'existe pas', async () => {
      mockCamion.findById.mockResolvedValue(null);

      await expect(createTrajet({ camion: 'nonexistent' }))
        .rejects.toThrow('Camion introuvable');
    });

    it('devrait lever une erreur si le camion n\'est pas disponible', async () => {
      mockCamion.findById.mockResolvedValue({
        _id: 'camion123',
        status: 'EN_TRAJET'
      });

      await expect(createTrajet({ camion: 'camion123' }))
        .rejects.toThrow('Le camion n\'est pas disponible');
    });
  });

  describe('getAllTrajets', () => {
    it('devrait retourner tous les trajets', async () => {
      const mockTrajets = [
        { _id: '1', destination: 'Paris' },
        { _id: '2', destination: 'Lyon' }
      ];

      const mockSort = jest.fn().mockResolvedValue(mockTrajets);
      const mockPopulate = jest.fn().mockReturnThis();
      mockTrajet.find.mockReturnValue({
        populate: mockPopulate.mockImplementation(() => ({
          populate: mockPopulate.mockImplementation(() => ({
            populate: mockPopulate.mockReturnValue({ sort: mockSort })
          }))
        }))
      });

      const result = await getAllTrajets();

      expect(mockTrajet.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockTrajets);
      expect(result).toHaveLength(2);
    });

    it('devrait filtrer les trajets', async () => {
      const filters = { statut: 'EN_COURS' };
      const mockSort = jest.fn().mockResolvedValue([]);
      const mockPopulate = jest.fn().mockReturnThis();
      mockTrajet.find.mockReturnValue({
        populate: mockPopulate.mockImplementation(() => ({
          populate: mockPopulate.mockImplementation(() => ({
            populate: mockPopulate.mockReturnValue({ sort: mockSort })
          }))
        }))
      });

      await getAllTrajets(filters);

      expect(mockTrajet.find).toHaveBeenCalledWith(filters);
    });
  });

  describe('getTrajetById', () => {
    it('devrait retourner un trajet par ID', async () => {
      const mockTrajetData = {
        _id: 'trajet123',
        destination: 'Paris'
      };

      const mockPopulate = jest.fn().mockReturnThis();
      mockTrajet.findById.mockReturnValue({
        populate: mockPopulate.mockImplementation(() => ({
          populate: mockPopulate.mockImplementation(() => ({
            populate: mockPopulate.mockImplementation(() => ({
              populate: mockPopulate.mockResolvedValue(mockTrajetData)
            }))
          }))
        }))
      });

      const result = await getTrajetById('trajet123');

      expect(mockTrajet.findById).toHaveBeenCalledWith('trajet123');
      expect(result).toEqual(mockTrajetData);
    });

    it('devrait lever une erreur si le trajet n\'existe pas', async () => {
      const mockPopulate = jest.fn().mockReturnThis();
      mockTrajet.findById.mockReturnValue({
        populate: mockPopulate.mockImplementation(() => ({
          populate: mockPopulate.mockImplementation(() => ({
            populate: mockPopulate.mockImplementation(() => ({
              populate: mockPopulate.mockResolvedValue(null)
            }))
          }))
        }))
      });

      await expect(getTrajetById('nonexistent'))
        .rejects.toThrow('Trajet introuvable');
    });
  });

  describe('updateTrajet', () => {
    it('devrait mettre à jour un trajet', async () => {
      const updateData = { statut: 'TERMINE' };
      const updatedTrajet = { _id: 'trajet123', ...updateData };

      const mockPopulate = jest.fn().mockReturnThis();
      mockTrajet.findByIdAndUpdate.mockReturnValue({
        populate: mockPopulate.mockImplementation(() => ({
          populate: mockPopulate.mockImplementation(() => ({
            populate: mockPopulate.mockResolvedValue(updatedTrajet)
          }))
        }))
      });

      const result = await updateTrajet('trajet123', updateData);

      expect(mockTrajet.findByIdAndUpdate).toHaveBeenCalledWith(
        'trajet123',
        { $set: updateData },
        { new: true, runValidators: true }
      );
      expect(result).toEqual(updatedTrajet);
    });

    it('devrait lever une erreur si le trajet n\'existe pas', async () => {
      const mockPopulate = jest.fn().mockReturnThis();
      mockTrajet.findByIdAndUpdate.mockReturnValue({
        populate: mockPopulate.mockImplementation(() => ({
          populate: mockPopulate.mockImplementation(() => ({
            populate: mockPopulate.mockResolvedValue(null)
          }))
        }))
      });

      await expect(updateTrajet('nonexistent', {}))
        .rejects.toThrow('Trajet introuvable');
    });
  });

  describe('deleteTrajet', () => {
    it('devrait supprimer un trajet', async () => {
      const mockTrajetData = {
        _id: 'trajet123',
        statut: 'PLANIFIE',
        camion: 'camion123',
        deleteOne: jest.fn().mockResolvedValue({})
      };
      mockTrajet.findById.mockResolvedValue(mockTrajetData);

      const result = await deleteTrajet('trajet123');

      expect(mockTrajet.findById).toHaveBeenCalledWith('trajet123');
      expect(mockTrajetData.deleteOne).toHaveBeenCalled();
      expect(result).toEqual(mockTrajetData);
    });

    it('devrait lever une erreur si le trajet n\'existe pas', async () => {
      mockTrajet.findById.mockResolvedValue(null);

      await expect(deleteTrajet('nonexistent'))
        .rejects.toThrow('Trajet introuvable');
    });

    it('devrait libérer le camion si le trajet était en cours', async () => {
      const mockTrajetData = {
        _id: 'trajet123',
        statut: 'EN_COURS',
        camion: 'camion123',
        deleteOne: jest.fn().mockResolvedValue({})
      };
      mockTrajet.findById.mockResolvedValue(mockTrajetData);
      mockCamion.findByIdAndUpdate.mockResolvedValue({});

      const result = await deleteTrajet('trajet123');

      expect(mockCamion.findByIdAndUpdate).toHaveBeenCalledWith(
        'camion123',
        { status: 'DISPONIBLE' }
      );
      expect(mockTrajetData.deleteOne).toHaveBeenCalled();
      expect(result).toEqual(mockTrajetData);
    });
  });
});
