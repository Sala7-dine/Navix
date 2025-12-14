import React, { useState, useEffect } from 'react';

const CamionModal = ({ isOpen, onClose, onSubmit, camion, loading }) => {
    const [formData, setFormData] = useState({
        matricule: '',
        marque: '',
        modele: '',
        annee: new Date().getFullYear(),
        kilometrage: 0,
        statut: 'DISPONIBLE',
        capaciteCharge: 0,
        typeCarburant: 'DIESEL',
        consommationMoyenne: 0
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (camion) {
            setFormData({
                matricule: camion.matricule || '',
                marque: camion.marque || '',
                modele: camion.modele || '',
                annee: camion.annee || new Date().getFullYear(),
                kilometrage: camion.kilometrage || 0,
                statut: camion.statut || 'DISPONIBLE',
                capaciteCharge: camion.capaciteCharge || 0,
                typeCarburant: camion.typeCarburant || 'DIESEL',
                consommationMoyenne: camion.consommationMoyenne || 0
            });
        } else {
            setFormData({
                matricule: '',
                marque: '',
                modele: '',
                annee: new Date().getFullYear(),
                kilometrage: 0,
                statut: 'DISPONIBLE',
                capaciteCharge: 0,
                typeCarburant: 'DIESEL',
                consommationMoyenne: 0
            });
        }
        setErrors({});
    }, [camion, isOpen]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        
        if (!formData.matricule.trim()) {
            newErrors.matricule = 'Le matricule est requis';
        }
        if (!formData.marque.trim()) {
            newErrors.marque = 'La marque est requise';
        }
        if (!formData.modele.trim()) {
            newErrors.modele = 'Le modèle est requis';
        }
        if (formData.annee < 1900 || formData.annee > new Date().getFullYear() + 1) {
            newErrors.annee = 'Année invalide';
        }
        if (formData.kilometrage < 0) {
            newErrors.kilometrage = 'Le kilométrage doit être positif';
        }
        if (formData.capaciteCharge <= 0) {
            newErrors.capaciteCharge = 'La capacité de charge doit être positive';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="glass-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-2xl font-bold text-white">
                        {camion ? 'Modifier le Camion' : 'Nouveau Camion'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Row 1 - Matricule, Marque */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Matricule <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="matricule"
                                value={formData.matricule}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 bg-[#15132b] text-white rounded-lg border ${
                                    errors.matricule ? 'border-red-500' : 'border-white/10'
                                } focus:outline-none focus:border-brand-cyan transition-colors`}
                                placeholder="ABC-123"
                            />
                            {errors.matricule && (
                                <p className="mt-1 text-sm text-red-400">{errors.matricule}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Marque <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="marque"
                                value={formData.marque}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 bg-[#15132b] text-white rounded-lg border ${
                                    errors.marque ? 'border-red-500' : 'border-white/10'
                                } focus:outline-none focus:border-brand-cyan transition-colors`}
                                placeholder="Mercedes, Volvo, Scania..."
                            />
                            {errors.marque && (
                                <p className="mt-1 text-sm text-red-400">{errors.marque}</p>
                            )}
                        </div>
                    </div>

                    {/* Row 2 - Modèle, Année */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Modèle <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="modele"
                                value={formData.modele}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 bg-[#15132b] text-white rounded-lg border ${
                                    errors.modele ? 'border-red-500' : 'border-white/10'
                                } focus:outline-none focus:border-brand-cyan transition-colors`}
                                placeholder="Actros, FH16, R500..."
                            />
                            {errors.modele && (
                                <p className="mt-1 text-sm text-red-400">{errors.modele}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Année <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                name="annee"
                                value={formData.annee}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 bg-[#15132b] text-white rounded-lg border ${
                                    errors.annee ? 'border-red-500' : 'border-white/10'
                                } focus:outline-none focus:border-brand-cyan transition-colors`}
                                min="1900"
                                max={new Date().getFullYear() + 1}
                            />
                            {errors.annee && (
                                <p className="mt-1 text-sm text-red-400">{errors.annee}</p>
                            )}
                        </div>
                    </div>

                    {/* Row 3 - Kilométrage, Capacité */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Kilométrage (km)
                            </label>
                            <input
                                type="number"
                                name="kilometrage"
                                value={formData.kilometrage}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 bg-[#15132b] text-white rounded-lg border ${
                                    errors.kilometrage ? 'border-red-500' : 'border-white/10'
                                } focus:outline-none focus:border-brand-cyan transition-colors`}
                                min="0"
                            />
                            {errors.kilometrage && (
                                <p className="mt-1 text-sm text-red-400">{errors.kilometrage}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Capacité de Charge (tonnes) <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                name="capaciteCharge"
                                value={formData.capaciteCharge}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 bg-[#15132b] text-white rounded-lg border ${
                                    errors.capaciteCharge ? 'border-red-500' : 'border-white/10'
                                } focus:outline-none focus:border-brand-cyan transition-colors`}
                                min="0"
                                step="0.1"
                            />
                            {errors.capaciteCharge && (
                                <p className="mt-1 text-sm text-red-400">{errors.capaciteCharge}</p>
                            )}
                        </div>
                    </div>

                    {/* Row 4 - Type Carburant, Consommation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Type de Carburant
                            </label>
                            <select
                                name="typeCarburant"
                                value={formData.typeCarburant}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-[#15132b] text-white rounded-lg border border-white/10 focus:outline-none focus:border-brand-cyan transition-colors"
                            >
                                <option value="DIESEL">Diesel</option>
                                <option value="ESSENCE">Essence</option>
                                <option value="ELECTRIQUE">Électrique</option>
                                <option value="HYBRIDE">Hybride</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Consommation Moyenne (L/100km)
                            </label>
                            <input
                                type="number"
                                name="consommationMoyenne"
                                value={formData.consommationMoyenne}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-[#15132b] text-white rounded-lg border border-white/10 focus:outline-none focus:border-brand-cyan transition-colors"
                                min="0"
                                step="0.1"
                            />
                        </div>
                    </div>

                    {/* Row 5 - Statut */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Statut
                        </label>
                        <select
                            name="statut"
                            value={formData.statut}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-[#15132b] text-white rounded-lg border border-white/10 focus:outline-none focus:border-brand-cyan transition-colors"
                        >
                            <option value="DISPONIBLE">Disponible</option>
                            <option value="EN_MISSION">En Mission</option>
                            <option value="EN_TRAJET">En Trajet</option>
                            <option value="MAINTENANCE">Maintenance</option>
                            <option value="HORS_SERVICE">Hors Service</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-white/5 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                            disabled={loading}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'En cours...' : camion ? 'Modifier' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CamionModal;
