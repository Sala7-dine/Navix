import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock FuelLog methods
const mockFuelLog = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  calculateTotalByTrajet: jest.fn(),
  getStatsByPeriode: jest.fn()
};

// Mock Trajet
const mockTrajet = {
  findById: jest.fn(),
  find: jest.fn()
};

// Mock des modules avant import
jest.unstable_mockModule('../models/FuelLog.js', () => ({ default: mockFuelLog }));
jest.unstable_mockModule('../models/Trajet.js', () => ({ default: mockTrajet }));

// Import du service après les mocks
const {
  createFuelLog,
  getAllFuelLogs,
  getFuelLogById,
  getFuelLogsByTrajet,
  updateFuelLog,
  deleteFuelLog,
  calculateTotalByTrajet,
  getStatsByPeriode,
  getConsommationMoyenneByCamion
} = await import('../services/fuelLogService.js');

describe('FuelLogService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createFuelLog', () => {
    it('devrait créer un nouveau log de carburant', async () => {
      const fuelLogData = {
        trajet: 'trajet123',
        quantiteLitres: 50,
        coutUnitaire: 1.5
      };

      const mockTrajetData = { _id: 'trajet123', statut: 'EN_COURS' };
      const mockFuelLogCreated = { _id: 'fuel123', ...fuelLogData };

      mockTrajet.findById.mockResolvedValue(mockTrajetData);
      mockFuelLog.create.mockResolvedValue({
        ...mockFuelLogCreated,
        populate: jest.fn().mockResolvedValue(mockFuelLogCreated)
      });

      const result = await createFuelLog(fuelLogData);

      expect(mockTrajet.findById).toHaveBeenCalledWith('trajet123');
      expect(mockFuelLog.create).toHaveBeenCalledWith(fuelLogData);
      expect(result).toEqual(mockFuelLogCreated);
    });

    it('devrait lever une erreur si le trajet n\'existe pas', async () => {
      mockTrajet.findById.mockResolvedValue(null);

      await expect(createFuelLog({ trajet: 'nonexistent' }))
        .rejects.toThrow('Trajet introuvable');
    });

    it('devrait lever une erreur si le trajet n\'est pas en cours', async () => {
      mockTrajet.findById.mockResolvedValue({ statut: 'TERMINE' });

      await expect(createFuelLog({ trajet: 'trajet123' }))
        .rejects.toThrow('Le trajet doit être en cours pour ajouter un ravitaillement');
    });
  });

  describe('getAllFuelLogs', () => {
    it('devrait retourner tous les logs de carburant', async () => {
      const mockFuelLogs = [
        { _id: '1', quantiteLitres: 50 },
        { _id: '2', quantiteLitres: 60 }
      ];

      const mockSort = jest.fn().mockResolvedValue(mockFuelLogs);
      const mockPopulate = jest.fn().mockReturnValue({ sort: mockSort });
      mockFuelLog.find.mockReturnValue({ populate: mockPopulate });

      const result = await getAllFuelLogs();

      expect(mockFuelLog.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockFuelLogs);
      expect(result).toHaveLength(2);
    });

    it('devrait filtrer les logs selon les critères', async () => {
      const filters = { trajet: 'trajet123' };
      const mockSort = jest.fn().mockResolvedValue([]);
      const mockPopulate = jest.fn().mockReturnValue({ sort: mockSort });
      mockFuelLog.find.mockReturnValue({ populate: mockPopulate });

      await getAllFuelLogs(filters);

      expect(mockFuelLog.find).toHaveBeenCalledWith(filters);
    });
  });

  describe('getFuelLogById', () => {
    it('devrait retourner un log par ID', async () => {
      const mockFuelLogData = {
        _id: 'fuel123',
        quantiteLitres: 50
      };

      const mockPopulate = jest.fn().mockResolvedValue(mockFuelLogData);
      mockFuelLog.findById.mockReturnValue({ populate: mockPopulate });

      const result = await getFuelLogById('fuel123');

      expect(mockFuelLog.findById).toHaveBeenCalledWith('fuel123');
      expect(result).toEqual(mockFuelLogData);
    });

    it('devrait lever une erreur si le log n\'existe pas', async () => {
      const mockPopulate = jest.fn().mockResolvedValue(null);
      mockFuelLog.findById.mockReturnValue({ populate: mockPopulate });

      await expect(getFuelLogById('nonexistent'))
        .rejects.toThrow('Ravitaillement introuvable');
    });
  });

  describe('getFuelLogsByTrajet', () => {
    it('devrait retourner les logs d\'un trajet', async () => {
      const mockFuelLogs = [
        { _id: '1', quantiteLitres: 50 },
        { _id: '2', quantiteLitres: 60 }
      ];

      const mockSort = jest.fn().mockResolvedValue(mockFuelLogs);
      mockFuelLog.find.mockReturnValue({ sort: mockSort });

      const result = await getFuelLogsByTrajet('trajet123');

      expect(mockFuelLog.find).toHaveBeenCalledWith({ trajet: 'trajet123' });
      expect(result).toEqual(mockFuelLogs);
    });
  });

  describe('updateFuelLog', () => {
    it('devrait mettre à jour un log', async () => {
      const updateData = { quantiteLitres: 60 };
      const updatedLog = { _id: 'fuel123', ...updateData };

      const mockPopulate = jest.fn().mockResolvedValue(updatedLog);
      mockFuelLog.findByIdAndUpdate.mockReturnValue({ populate: mockPopulate });

      const result = await updateFuelLog('fuel123', updateData);

      expect(mockFuelLog.findByIdAndUpdate).toHaveBeenCalledWith(
        'fuel123',
        { $set: updateData },
        { new: true, runValidators: true }
      );
      expect(result).toEqual(updatedLog);
    });

    it('devrait lever une erreur si le log n\'existe pas', async () => {
      const mockPopulate = jest.fn().mockResolvedValue(null);
      mockFuelLog.findByIdAndUpdate.mockReturnValue({ populate: mockPopulate });

      await expect(updateFuelLog('nonexistent', {}))
        .rejects.toThrow('Ravitaillement introuvable');
    });
  });

  describe('deleteFuelLog', () => {
    it('devrait supprimer un log', async () => {
      const mockFuelLogData = { _id: 'fuel123' };
      mockFuelLog.findByIdAndDelete.mockResolvedValue(mockFuelLogData);

      const result = await deleteFuelLog('fuel123');

      expect(mockFuelLog.findByIdAndDelete).toHaveBeenCalledWith('fuel123');
      expect(result).toEqual(mockFuelLogData);
    });

    it('devrait lever une erreur si le log n\'existe pas', async () => {
      mockFuelLog.findByIdAndDelete.mockResolvedValue(null);

      await expect(deleteFuelLog('nonexistent'))
        .rejects.toThrow('Ravitaillement introuvable');
    });
  });

  describe('calculateTotalByTrajet', () => {
    it('devrait calculer le total pour un trajet', async () => {
      const mockTotals = {
        totalQuantite: 150,
        totalCout: 225
      };

      mockFuelLog.calculateTotalByTrajet.mockResolvedValue(mockTotals);

      const result = await calculateTotalByTrajet('trajet123');

      expect(mockFuelLog.calculateTotalByTrajet).toHaveBeenCalledWith('trajet123');
      expect(result).toEqual(mockTotals);
    });
  });

  describe('getStatsByPeriode', () => {
    it('devrait retourner les stats pour une période', async () => {
      const mockStats = {
        totalCarburant: 500,
        totalCout: 750
      };

      const dateDebut = new Date('2024-01-01');
      const dateFin = new Date('2024-12-31');

      mockFuelLog.getStatsByPeriode.mockResolvedValue(mockStats);

      const result = await getStatsByPeriode(dateDebut, dateFin);

      expect(mockFuelLog.getStatsByPeriode).toHaveBeenCalledWith(dateDebut, dateFin);
      expect(result).toEqual(mockStats);
    });
  });

  describe('getConsommationMoyenneByCamion', () => {
    it('devrait calculer la consommation moyenne d\'un camion', async () => {
      const mockTrajets = [
        { _id: 'trajet1', kilometrageArrivee: 1100, kilometrageDepart: 1000 },
        { _id: 'trajet2', kilometrageArrivee: 1250, kilometrageDepart: 1100 }
      ];

      const mockFuelLogs = [
        { quantiteLitres: 50 },
        { quantiteLitres: 75 }
      ];

      // Premier appel: Trajet.find().select() pour récupérer les IDs
      const mockSelect1 = jest.fn().mockResolvedValue(mockTrajets.map(t => ({ _id: t._id })));
      mockTrajet.find.mockReturnValueOnce({ select: mockSelect1 });

      // Deuxième appel: FuelLog.find()
      mockFuelLog.find.mockResolvedValue(mockFuelLogs);

      // Troisième appel: Trajet.find().select() pour récupérer les kilométrages
      const mockSelect2 = jest.fn().mockResolvedValue(mockTrajets);
      mockTrajet.find.mockReturnValueOnce({ select: mockSelect2 });

      const result = await getConsommationMoyenneByCamion('camion123');

      expect(result).toHaveProperty('consommationMoyenne');
      expect(result).toHaveProperty('totalCarburant', 125);
      expect(result).toHaveProperty('totalDistance', 250);
      expect(result).toHaveProperty('nombreTrajets', 2);
      expect(result.consommationMoyenne).toBe(50); // (125/250)*100
    });

    it('devrait retourner 0 si aucun trajet', async () => {
      const mockSelect = jest.fn().mockResolvedValue([]);
      mockTrajet.find.mockReturnValue({ select: mockSelect });

      const result = await getConsommationMoyenneByCamion('camion123');

      expect(result).toEqual({
        consommationMoyenne: 0,
        totalCarburant: 0,
        totalDistance: 0,
        nombreTrajets: 0
      });
    });
  });
});
