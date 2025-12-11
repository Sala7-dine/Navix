import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock Camion instance
const createMockCamionInstance = (overrides = {}) => ({
  _id: 'camion123',
  immatriculation: 'ABC-123',
  marque: 'Mercedes',
  modele: 'Actros',
  status: 'DISPONIBLE',
  save: jest.fn().mockResolvedValue(undefined),
  ...overrides
});

let mockCamionInstance;

// Mock des modèles
const mockCamion = jest.fn();
mockCamion.find = jest.fn();
mockCamion.findById = jest.fn();
mockCamion.findByIdAndUpdate = jest.fn();
mockCamion.findByIdAndDelete = jest.fn();

const mockTrajet = {
  findOne: jest.fn()
};

// Mock des modules avant import
jest.unstable_mockModule('../models/Camion.js', () => ({ default: mockCamion }));
jest.unstable_mockModule('../models/Trajet.js', () => ({ default: mockTrajet }));

// Import du service après les mocks
const {
  getAllCamions,
  getCamionById,
  createCamion,
  updateCamion,
  deleteCamion,
  getCamionsDisponibles
} = await import('../services/camionService.js');

describe('CamionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCamionInstance = createMockCamionInstance();
    mockCamion.mockImplementation(() => mockCamionInstance);
  });

  describe('getAllCamions', () => {
    it('devrait retourner tous les camions', async () => {
      const mockCamions = [
        { _id: '1', immatriculation: 'ABC-123' },
        { _id: '2', immatriculation: 'DEF-456' }
      ];

      mockCamion.find.mockResolvedValue(mockCamions);

      const result = await getAllCamions();

      expect(mockCamion.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockCamions);
      expect(result).toHaveLength(2);
    });

    it('devrait filtrer les camions selon les critères', async () => {
      const filters = { status: 'DISPONIBLE' };
      mockCamion.find.mockResolvedValue([]);

      await getAllCamions(filters);

      expect(mockCamion.find).toHaveBeenCalledWith(filters);
    });

    it('devrait lever une erreur en cas d\'échec', async () => {
      mockCamion.find.mockRejectedValue(new Error('Erreur DB'));

      await expect(getAllCamions()).rejects.toThrow('Erreur DB');
    });
  });

  describe('getCamionById', () => {
    it('devrait retourner un camion par ID avec ses relations', async () => {
      const mockCamionData = {
        _id: 'camion123',
        immatriculation: 'ABC-123',
        pneus: [],
        maintenances: [],
        trajets: []
      };

      const mockPopulate = jest.fn().mockReturnThis();
      mockCamion.findById.mockReturnValue({
        populate: mockPopulate.mockImplementation(() => ({
          populate: mockPopulate.mockImplementation(() => ({
            populate: mockPopulate.mockResolvedValue(mockCamionData)
          }))
        }))
      });

      const result = await getCamionById('camion123');

      expect(mockCamion.findById).toHaveBeenCalledWith('camion123');
      expect(result).toEqual(mockCamionData);
    });

    it('devrait lever une erreur si le camion n\'existe pas', async () => {
      const mockPopulate = jest.fn().mockReturnThis();
      mockCamion.findById.mockReturnValue({
        populate: mockPopulate.mockImplementation(() => ({
          populate: mockPopulate.mockImplementation(() => ({
            populate: mockPopulate.mockResolvedValue(null)
          }))
        }))
      });

      await expect(getCamionById('nonexistent')).rejects.toThrow('Camion introuvable');
    });
  });

  describe('createCamion', () => {
    it('devrait créer un nouveau camion', async () => {
      const camionData = {
        immatriculation: 'ABC-123',
        marque: 'Mercedes',
        modele: 'Actros'
      };

      const result = await createCamion(camionData);

      expect(mockCamion).toHaveBeenCalledWith(camionData);
      expect(mockCamionInstance.save).toHaveBeenCalled();
      expect(result).toEqual(mockCamionInstance);
    });

    it('devrait lever une erreur en cas d\'échec', async () => {
      mockCamionInstance.save.mockRejectedValue(new Error('Erreur de validation'));

      await expect(createCamion({})).rejects.toThrow('Erreur de validation');
    });
  });

  describe('updateCamion', () => {
    it('devrait mettre à jour un camion', async () => {
      const updateData = { marque: 'Volvo' };
      const updatedCamion = { _id: 'camion123', ...updateData };

      mockCamion.findByIdAndUpdate.mockResolvedValue(updatedCamion);

      const result = await updateCamion('camion123', updateData);

      expect(mockCamion.findByIdAndUpdate).toHaveBeenCalledWith(
        'camion123',
        { $set: updateData },
        { new: true, runValidators: true }
      );
      expect(result).toEqual(updatedCamion);
    });

    it('devrait lever une erreur si le camion n\'existe pas', async () => {
      mockCamion.findByIdAndUpdate.mockResolvedValue(null);

      await expect(updateCamion('nonexistent', {})).rejects.toThrow('Camion introuvable');
    });
  });

  describe('deleteCamion', () => {
    it('devrait supprimer un camion', async () => {
      const mockCamionData = { _id: 'camion123', immatriculation: 'ABC-123' };
      
      mockCamion.findById.mockResolvedValue(mockCamionData);
      mockTrajet.findOne.mockResolvedValue(null);
      mockCamion.findByIdAndDelete.mockResolvedValue(mockCamionData);

      const result = await deleteCamion('camion123');

      expect(mockCamion.findById).toHaveBeenCalledWith('camion123');
      expect(mockTrajet.findOne).toHaveBeenCalledWith({ camion: 'camion123', statut: 'EN_COURS' });
      expect(mockCamion.findByIdAndDelete).toHaveBeenCalledWith('camion123');
      expect(result).toEqual(mockCamionData);
    });

    it('devrait lever une erreur si le camion n\'existe pas', async () => {
      mockCamion.findById.mockResolvedValue(null);

      await expect(deleteCamion('nonexistent')).rejects.toThrow('Camion introuvable');
    });

    it('devrait lever une erreur si un trajet est en cours', async () => {
      mockCamion.findById.mockResolvedValue({ _id: 'camion123' });
      mockTrajet.findOne.mockResolvedValue({ _id: 'trajet123', statut: 'EN_COURS' });

      await expect(deleteCamion('camion123')).rejects.toThrow('Impossible de supprimer un camion avec un trajet en cours');
    });
  });

  describe('getCamionsDisponibles', () => {
    it('devrait retourner uniquement les camions disponibles', async () => {
      const mockCamions = [
        { _id: '1', status: 'DISPONIBLE' },
        { _id: '2', status: 'DISPONIBLE' }
      ];

      mockCamion.find.mockResolvedValue(mockCamions);

      const result = await getCamionsDisponibles();

      expect(mockCamion.find).toHaveBeenCalledWith({ status: 'DISPONIBLE' });
      expect(result).toEqual(mockCamions);
    });

    it('devrait lever une erreur en cas d\'échec', async () => {
      mockCamion.find.mockRejectedValue(new Error('Erreur DB'));

      await expect(getCamionsDisponibles()).rejects.toThrow('Erreur DB');
    });
  });
});
