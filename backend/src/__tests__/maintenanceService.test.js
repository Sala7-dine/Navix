import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock Maintenance methods
const mockMaintenance = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  findByCamion: jest.fn()
};

// Mock Camion
const mockCamion = {
  findById: jest.fn()
};

// Mock Pneu
const mockPneu = {
  findById: jest.fn()
};

// Mock des modules avant import
jest.unstable_mockModule('../models/Maintenance.js', () => ({ default: mockMaintenance }));
jest.unstable_mockModule('../models/Camion.js', () => ({ default: mockCamion }));
jest.unstable_mockModule('../models/Pneu.js', () => ({ default: mockPneu }));

// Import du service après les mocks
const {
  createMaintenance,
  getAllMaintenances,
  getMaintenanceById,
  getMaintenancesByCamion,
  updateMaintenance,
  deleteMaintenance
} = await import('../services/maintenanceService.js');

describe('MaintenanceService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMaintenance', () => {
    it('devrait créer une nouvelle maintenance', async () => {
      const maintenanceData = {
        camion: 'camion123',
        type: 'PREVENTIVE',
        description: 'Révision complète'
      };

      mockCamion.findById.mockResolvedValue({ _id: 'camion123' });
      mockMaintenance.create.mockResolvedValue({
        ...maintenanceData,
        populate: jest.fn().mockResolvedValue(maintenanceData)
      });

      const result = await createMaintenance(maintenanceData);

      expect(mockCamion.findById).toHaveBeenCalledWith('camion123');
      expect(mockMaintenance.create).toHaveBeenCalledWith(maintenanceData);
      expect(result).toBeDefined();
    });

    it('devrait lever une erreur si le camion n\'existe pas', async () => {
      mockCamion.findById.mockResolvedValue(null);

      await expect(createMaintenance({ camion: 'nonexistent' }))
        .rejects.toThrow('Camion introuvable');
    });

    it('devrait lever une erreur si le pneu n\'existe pas', async () => {
      mockCamion.findById.mockResolvedValue({ _id: 'camion123' });
      mockPneu.findById.mockResolvedValue(null);

      await expect(createMaintenance({ camion: 'camion123', pneu: 'nonexistent' }))
        .rejects.toThrow('Pneu introuvable');
    });

    it('devrait créer une maintenance sans camion ni pneu', async () => {
      const maintenanceData = {
        type: 'AUTRE',
        description: 'Maintenance générale'
      };

      mockMaintenance.create.mockResolvedValue({
        ...maintenanceData,
        populate: jest.fn().mockResolvedValue(maintenanceData)
      });

      const result = await createMaintenance(maintenanceData);

      expect(mockMaintenance.create).toHaveBeenCalledWith(maintenanceData);
      expect(result).toBeDefined();
    });
  });

  describe('getAllMaintenances', () => {
    it('devrait retourner toutes les maintenances', async () => {
      const mockMaintenances = [
        { _id: '1', type: 'PREVENTIVE' },
        { _id: '2', type: 'CORRECTIVE' }
      ];

      const mockSort = jest.fn().mockResolvedValue(mockMaintenances);
      const mockPopulate = jest.fn().mockReturnThis();
      mockMaintenance.find.mockReturnValue({
        populate: mockPopulate.mockImplementation(() => ({
          populate: mockPopulate.mockReturnValue({ sort: mockSort })
        }))
      });

      const result = await getAllMaintenances();

      expect(mockMaintenance.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockMaintenances);
      expect(result).toHaveLength(2);
    });

    it('devrait filtrer les maintenances', async () => {
      const filters = { type: 'PREVENTIVE' };
      const mockSort = jest.fn().mockResolvedValue([]);
      const mockPopulate = jest.fn().mockReturnThis();
      mockMaintenance.find.mockReturnValue({
        populate: mockPopulate.mockImplementation(() => ({
          populate: mockPopulate.mockReturnValue({ sort: mockSort })
        }))
      });

      await getAllMaintenances(filters);

      expect(mockMaintenance.find).toHaveBeenCalledWith(filters);
    });
  });

  describe('getMaintenanceById', () => {
    it('devrait retourner une maintenance par ID', async () => {
      const mockMaintenanceData = {
        _id: 'maintenance123',
        type: 'PREVENTIVE'
      };

      const mockPopulate = jest.fn().mockReturnThis();
      mockMaintenance.findById.mockReturnValue({
        populate: mockPopulate.mockImplementation(() => ({
          populate: mockPopulate.mockResolvedValue(mockMaintenanceData)
        }))
      });

      const result = await getMaintenanceById('maintenance123');

      expect(mockMaintenance.findById).toHaveBeenCalledWith('maintenance123');
      expect(result).toEqual(mockMaintenanceData);
    });

    it('devrait lever une erreur si la maintenance n\'existe pas', async () => {
      const mockPopulate = jest.fn().mockReturnThis();
      mockMaintenance.findById.mockReturnValue({
        populate: mockPopulate.mockImplementation(() => ({
          populate: mockPopulate.mockResolvedValue(null)
        }))
      });

      await expect(getMaintenanceById('nonexistent'))
        .rejects.toThrow('Maintenance introuvable');
    });
  });

  describe('getMaintenancesByCamion', () => {
    it('devrait retourner les maintenances d\'un camion', async () => {
      const mockMaintenances = [
        { _id: '1', camion: 'camion123' },
        { _id: '2', camion: 'camion123' }
      ];

      mockMaintenance.findByCamion.mockResolvedValue(mockMaintenances);

      const result = await getMaintenancesByCamion('camion123');

      expect(mockMaintenance.findByCamion).toHaveBeenCalledWith('camion123');
      expect(result).toEqual(mockMaintenances);
    });
  });

  describe('updateMaintenance', () => {
    it('devrait mettre à jour une maintenance', async () => {
      const updateData = { description: 'Révision mise à jour' };
      const updatedMaintenance = { _id: 'maintenance123', ...updateData };

      const mockPopulate = jest.fn().mockReturnThis();
      mockMaintenance.findByIdAndUpdate.mockReturnValue({
        populate: mockPopulate.mockImplementation(() => ({
          populate: mockPopulate.mockResolvedValue(updatedMaintenance)
        }))
      });

      const result = await updateMaintenance('maintenance123', updateData);

      expect(mockMaintenance.findByIdAndUpdate).toHaveBeenCalledWith(
        'maintenance123',
        { $set: updateData },
        { new: true, runValidators: true }
      );
      expect(result).toEqual(updatedMaintenance);
    });

    it('devrait lever une erreur si la maintenance n\'existe pas', async () => {
      const mockPopulate = jest.fn().mockReturnThis();
      mockMaintenance.findByIdAndUpdate.mockReturnValue({
        populate: mockPopulate.mockImplementation(() => ({
          populate: mockPopulate.mockResolvedValue(null)
        }))
      });

      await expect(updateMaintenance('nonexistent', {}))
        .rejects.toThrow('Maintenance introuvable');
    });
  });

  describe('deleteMaintenance', () => {
    it('devrait supprimer une maintenance', async () => {
      const mockMaintenanceData = { _id: 'maintenance123' };
      mockMaintenance.findByIdAndDelete.mockResolvedValue(mockMaintenanceData);

      const result = await deleteMaintenance('maintenance123');

      expect(mockMaintenance.findByIdAndDelete).toHaveBeenCalledWith('maintenance123');
      expect(result).toEqual(mockMaintenanceData);
    });

    it('devrait lever une erreur si la maintenance n\'existe pas', async () => {
      mockMaintenance.findByIdAndDelete.mockResolvedValue(null);

      await expect(deleteMaintenance('nonexistent'))
        .rejects.toThrow('Maintenance introuvable');
    });
  });
});
