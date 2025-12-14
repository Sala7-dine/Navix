import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const FuelLogModal = ({ isOpen, onClose, onSubmit, fuelLog, loading }) => {
    const { trajets } = useSelector((state) => state.trajets);
    
    const [formData, setFormData] = useState({
        trajet: '',
        volumeLitres: '',
        prixTotal: '',
        date: '',
        lieuStation: '',
        remarques: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (fuelLog) {
            setFormData({
                trajet: fuelLog.trajet?._id || fuelLog.trajet || '',
                volumeLitres: fuelLog.volumeLitres || '',
                prixTotal: fuelLog.prixTotal || '',
                date: fuelLog.date ? new Date(fuelLog.date).toISOString().slice(0, 16) : '',
                lieuStation: fuelLog.lieuStation || '',
                remarques: fuelLog.remarques || ''
            });
        } else {
            setFormData({
                trajet: '',
                volumeLitres: '',
                prixTotal: '',
                date: new Date().toISOString().slice(0, 16),
                lieuStation: '',
                remarques: ''
            });
        }
        setErrors({});
    }, [fuelLog, isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.trajet) newErrors.trajet = 'Le trajet est requis';
        if (!formData.volumeLitres || formData.volumeLitres <= 0) newErrors.volumeLitres = 'Le volume doit être positif';
        if (!formData.prixTotal || formData.prixTotal < 0) newErrors.prixTotal = 'Le prix doit être positif';
        if (!formData.date) newErrors.date = 'La date est requise';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const dataToSubmit = {
                trajet: formData.trajet,
                volumeLitres: parseFloat(formData.volumeLitres),
                prixTotal: parseFloat(formData.prixTotal),
                date: formData.date,
                lieuStation: formData.lieuStation.trim() || undefined,
                remarques: formData.remarques.trim() || undefined
            };

            // Remove undefined fields
            Object.keys(dataToSubmit).forEach(key => {
                if (dataToSubmit[key] === undefined) {
                    delete dataToSubmit[key];
                }
            });

            onSubmit(dataToSubmit);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const prixParLitre = formData.volumeLitres > 0 && formData.prixTotal >= 0
        ? (formData.prixTotal / formData.volumeLitres).toFixed(2)
        : '0.00';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xl flex items-center justify-center z-50 p-4">
            <div className="bg-[#252140]/95 backdrop-blur-2xl rounded-3xl p-8 max-w-2xl w-full mx-4 border border-white/10 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {fuelLog ? 'Modifier Log Carburant' : 'Nouveau Log Carburant'}
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

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Trajet */}
                        <div className="md:col-span-2">
                            <label className="block text-gray-400 text-sm font-medium mb-2">
                                Trajet <span className="text-red-400">*</span>
                            </label>
                            <select
                                name="trajet"
                                value={formData.trajet}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border ${
                                    errors.trajet ? 'border-red-500' : 'border-white/10'
                                } focus:outline-none focus:bg-[#1a1633]/80 focus:border-brand-cyan/50 transition-all`}
                            >
                                <option value="">Sélectionner un trajet</option>
                                {trajets.map(trajet => (
                                    <option key={trajet._id} value={trajet._id}>
                                        {trajet.lieuDepart} → {trajet.lieuArrivee} - {trajet.chauffeur?.fullName || 'N/A'}
                                    </option>
                                ))}
                            </select>
                            {errors.trajet && <p className="text-red-400 text-sm mt-1">{errors.trajet}</p>}
                        </div>

                        {/* Volume en Litres */}
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">
                                Volume (Litres) <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                name="volumeLitres"
                                value={formData.volumeLitres}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                className={`w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border ${
                                    errors.volumeLitres ? 'border-red-500' : 'border-white/10'
                                } focus:outline-none focus:bg-[#1a1633]/80 focus:border-brand-cyan/50 transition-all`}
                                placeholder="Ex: 150.50"
                            />
                            {errors.volumeLitres && <p className="text-red-400 text-sm mt-1">{errors.volumeLitres}</p>}
                        </div>

                        {/* Prix Total */}
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">
                                Prix Total (DH) <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                name="prixTotal"
                                value={formData.prixTotal}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                className={`w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border ${
                                    errors.prixTotal ? 'border-red-500' : 'border-white/10'
                                } focus:outline-none focus:bg-[#1a1633]/80 focus:border-brand-cyan/50 transition-all`}
                                placeholder="Ex: 1800.00"
                            />
                            {errors.prixTotal && <p className="text-red-400 text-sm mt-1">{errors.prixTotal}</p>}
                        </div>

                        {/* Prix par Litre (Calculé automatiquement) */}
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">
                                Prix par Litre (DH)
                            </label>
                            <div className="w-full px-4 py-3 bg-[#1a1633]/40 text-gray-400 rounded-xl border border-white/10">
                                {prixParLitre} DH/L
                            </div>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">
                                Date <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border ${
                                    errors.date ? 'border-red-500' : 'border-white/10'
                                } focus:outline-none focus:bg-[#1a1633]/80 focus:border-brand-cyan/50 transition-all`}
                            />
                            {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}
                        </div>

                        {/* Lieu Station */}
                        <div className="md:col-span-2">
                            <label className="block text-gray-400 text-sm font-medium mb-2">
                                Lieu de la Station
                            </label>
                            <input
                                type="text"
                                name="lieuStation"
                                value={formData.lieuStation}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border border-white/10 focus:outline-none focus:bg-[#1a1633]/80 focus:border-brand-cyan/50 transition-all"
                                placeholder="Ex: Station Total - Casablanca"
                            />
                        </div>

                        {/* Remarques */}
                        <div className="md:col-span-2">
                            <label className="block text-gray-400 text-sm font-medium mb-2">
                                Remarques
                            </label>
                            <textarea
                                name="remarques"
                                value={formData.remarques}
                                onChange={handleChange}
                                rows="3"
                                maxLength="500"
                                className="w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border border-white/10 focus:outline-none focus:bg-[#1a1633]/80 focus:border-brand-cyan/50 transition-all resize-none"
                                placeholder="Remarques additionnelles..."
                            />
                            <div className="text-xs text-gray-500 mt-1 text-right">
                                {formData.remarques.length}/500
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-[#1a1633]/60 text-white rounded-xl font-medium hover:bg-[#1a1633]/80 transition-colors border border-white/10"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Enregistrement...' : (fuelLog ? 'Modifier' : 'Ajouter')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FuelLogModal;
