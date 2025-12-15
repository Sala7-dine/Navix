import React, { useState, useEffect } from 'react';

const CamionModal = ({ isOpen, onClose, onSubmit, camion, loading, error }) => {
    const [formData, setFormData] = useState({
        matricule: '',
        marque: '',
        modele: '',
        capaciteReservoir: 0,
        kilometrageActuel: 0
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (camion) {
            setFormData({
                matricule: camion.matricule || '',
                marque: camion.marque || '',
                modele: camion.modele || '',
                capaciteReservoir: camion.capaciteReservoir || 0,
                kilometrageActuel: camion.kilometrageActuel || 0
            });
        } else {
            setFormData({
                matricule: '',
                marque: '',
                modele: '',
                capaciteReservoir: 0,
                kilometrageActuel: 0
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
        if (formData.kilometrageActuel < 0) {
            newErrors.kilometrageActuel = 'Le kilométrage doit être positif';
        }
        if (formData.capaciteReservoir <= 0) {
            newErrors.capaciteReservoir = 'La capacité du réservoir doit être positive';
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-panel p-8 max-w-2xl w-full mx-4 rounded-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {camion ? 'Modifier le Camion' : 'Nouveau Camion'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Row 1 - Matricule, Marque */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Matricule <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="matricule"
                                value={formData.matricule}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border ${
                                    errors.matricule ? 'border-red-500/50' : 'border-white/10'
                                } focus:outline-none focus:border-brand-cyan/50 focus:bg-[#1a1633]/80 transition-all placeholder-gray-500`}
                                placeholder="ABC-123"
                            />
                            {errors.matricule && (
                                <p className="mt-1 text-sm text-red-400">{errors.matricule}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Marque <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="marque"
                                value={formData.marque}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border ${
                                    errors.marque ? 'border-red-500/50' : 'border-white/10'
                                } focus:outline-none focus:border-brand-cyan/50 focus:bg-[#1a1633]/80 transition-all placeholder-gray-500`}
                                placeholder="Mercedes, Volvo, Scania..."
                            />
                            {errors.marque && (
                                <p className="mt-1 text-sm text-red-400">{errors.marque}</p>
                            )}
                        </div>
                    </div>

                    {/* Row 2 - Modèle */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Modèle <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="modele"
                            value={formData.modele}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border ${
                                errors.modele ? 'border-red-500/50' : 'border-white/10'
                            } focus:outline-none focus:border-brand-cyan/50 focus:bg-[#1a1633]/80 transition-all placeholder-gray-500`}
                            placeholder="T High 3000..."
                        />
                        {errors.modele && (
                            <p className="mt-1 text-sm text-red-400">{errors.modele}</p>
                        )}
                    </div>

                    {/* Row 3 - Kilométrage Actuel, Capacité Réservoir */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Kilométrage Actuel (km) <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                name="kilometrageActuel"
                                value={formData.kilometrageActuel}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border ${
                                    errors.kilometrageActuel ? 'border-red-500/50' : 'border-white/10'
                                } focus:outline-none focus:border-brand-cyan/50 focus:bg-[#1a1633]/80 transition-all placeholder-gray-500`}
                                min="0"
                            />
                            {errors.kilometrageActuel && (
                                <p className="mt-1 text-sm text-red-400">{errors.kilometrageActuel}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Capacité Réservoir (litres) <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                name="capaciteReservoir"
                                value={formData.capaciteReservoir}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border ${
                                    errors.capaciteReservoir ? 'border-red-500/50' : 'border-white/10'
                                } focus:outline-none focus:border-brand-cyan/50 focus:bg-[#1a1633]/80 transition-all placeholder-gray-500`}
                                min="0"
                            />
                            {errors.capaciteReservoir && (
                                <p className="mt-1 text-sm text-red-400">{errors.capaciteReservoir}</p>
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-white/5 text-gray-300 rounded-xl font-medium hover:bg-white/10 transition-all"
                            disabled={loading}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
