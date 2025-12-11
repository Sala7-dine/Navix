# Données de test pour les modèles Mongoose

## 1. User (Chauffeur)
```json
{
  "fullName": "Ahmed Benali",
  "email": "ahmed.benali@navix.com",
  "password": "Password123!",
  "role": "chauffeur",
  "telephone": "+212600123456",
  "dateEmbauche": "2023-01-15T00:00:00.000Z",
  "numeroPermis": "AB123456",
  "dateExpirationPermis": "2026-12-31T00:00:00.000Z"
}
```

## 2. Camion
```json
{
  "matricule": "12345-A-67",
  "marque": "Mercedes-Benz",
  "modele": "Actros 1848",
  "capaciteReservoir": 450,
  "kilometrageActuel": 125000,
  "status": "DISPONIBLE"
}
```

## 3. Remorque
```json
{
  "matricule": "REM-2024-001",
  "type": "FRIGORIFIQUE",
  "capacite": 28000
}
```

## 4. Pneu
```json
{
  "position": "AVANT_GAUCHE",
  "usurePourcentage": 35,
  "dateInstallation": "2024-06-15T00:00:00.000Z",
  "camion": "REMPLACER_PAR_ID_CAMION"
}
```
**Note:** Remplacez `"REMPLACER_PAR_ID_CAMION"` par l'ID réel du camion créé.

## 5. Trajet
```json
{
  "chauffeur": "REMPLACER_PAR_ID_CHAUFFEUR",
  "camion": "REMPLACER_PAR_ID_CAMION",
  "remorque": "REMPLACER_PAR_ID_REMORQUE",
  "statut": "EN_COURS",
  "lieuDepart": "Casablanca",
  "lieuArrivee": "Marrakech",
  "kilometrageDepart": 125000,
  "dateDepart": "2024-12-10T08:00:00.000Z",
  "remarques": "Livraison de produits frais, maintenir température à -18°C"
}
```
**Note:** Remplacez les IDs par les valeurs réelles. Le champ `remorque` est optionnel.

## 6. FuelLog
```json
{
  "trajet": "REMPLACER_PAR_ID_TRAJET",
  "volumeLitres": 180,
  "prixTotal": 2700,
  "date": "2024-12-10T10:30:00.000Z",
  "lieuStation": "Station Shell - Autoroute Casablanca-Marrakech KM 45",
  "remarques": "Plein complet effectué"
}
```
**Note:** Le `prixParLitre` sera calculé automatiquement (15 DH/L dans cet exemple).

## 7. Maintenance
```json
{
  "type": "VIDANGE",
  "description": "Vidange complète avec changement de filtres à huile et à air. Vérification des niveaux de liquide de frein et de refroidissement.",
  "cout": 1500,
  "date": "2024-12-05T09:00:00.000Z",
  "statut": "TERMINEE",
  "camion": "REMPLACER_PAR_ID_CAMION",
  "garage": "Garage Mercedes Casablanca",
  "technicien": "Mohammed Alami",
  "kilometrageIntervention": 125000,
  "prochainKilometrageIntervention": 140000,
  "pieceRemplacees": [
    {
      "nom": "Filtre à huile",
      "reference": "MB-FH-1848",
      "quantite": 1,
      "prix": 250
    },
    {
      "nom": "Filtre à air",
      "reference": "MB-FA-1848",
      "quantite": 1,
      "prix": 180
    }
  ],
  "remarques": "Prochaine vidange recommandée à 140,000 km"
}
```

## 8. Maintenance Pneu (exemple supplémentaire)
```json
{
  "type": "PNEU",
  "description": "Remplacement du pneu avant gauche suite à usure excessive. Équilibrage et parallélisme effectués.",
  "cout": 800,
  "date": "2024-11-20T14:00:00.000Z",
  "statut": "TERMINEE",
  "camion": "REMPLACER_PAR_ID_CAMION",
  "pneu": "REMPLACER_PAR_ID_PNEU",
  "garage": "Garage Pneus Plus",
  "technicien": "Rachid Khalil",
  "kilometrageIntervention": 120000,
  "pieceRemplacees": [
    {
      "nom": "Pneu Michelin XZE",
      "reference": "MCH-315-80-R22.5",
      "quantite": 1,
      "prix": 650
    }
  ],
  "remarques": "Pneu garanti 2 ans ou 150,000 km"
}
```

---

## 📝 Ordre de création recommandé

1. **User** (Chauffeur) - Créer d'abord pour obtenir l'ID
2. **Camion** - Créer ensuite pour obtenir l'ID
3. **Remorque** - Créer pour obtenir l'ID
4. **Pneu** - Utiliser l'ID du camion créé
5. **Trajet** - Utiliser les IDs du chauffeur, camion et remorque
6. **FuelLog** - Utiliser l'ID du trajet créé
7. **Maintenance** - Utiliser l'ID du camion (et optionnellement du pneu)

## 🔧 Exemple de flux complet

```bash
# 1. Créer un chauffeur
POST /api/auth/register
Body: User JSON

# 2. Créer un camion
POST /api/camions
Body: Camion JSON

# 3. Créer une remorque
POST /api/remorques
Body: Remorque JSON

# 4. Créer un pneu (avec l'ID du camion)
POST /api/pneus
Body: Pneu JSON (remplacer l'ID camion)

# 5. Créer un trajet
POST /api/trajets
Body: Trajet JSON (remplacer tous les IDs)

# 6. Créer un fuel log
POST /api/fuel-logs
Body: FuelLog JSON (remplacer l'ID trajet)

# 7. Créer une maintenance
POST /api/maintenances
Body: Maintenance JSON (remplacer l'ID camion)
```
