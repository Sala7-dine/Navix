import React, { useState, useEffect } from 'react';

const RemorqueModal = ({ isOpen, onClose, onSubmit, remorque, loading }) => {
    const [formData, setFormData] = useState({
        matricule: '',
        type: 'FRIGORIFIQUE',
        capacite: 0
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (remorque) {
            setFormData({
                matricule: remorque.matricule || '',
                type: remorque.type || 'FRIGORIFIQUE',
                capacite: remorque.capacite || 0
            });
        } else {
            setFormData({
                matricule: '',
                type: 'FRIGORIFIQUE',
                capacite: 0
            });
        }
        setErrors({});
    }, [remorque, isOpen]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        
        if (!formData.matricule.trim()) {
            newErrors.matricule = 'Le matricule est requis';
        }
        if (formData.capacite <= 0) {
            newErrors.capacite = 'La capacité doit être positive';
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xl">
            <div className="bg-[#252140]/95 backdrop-blur-2xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-2xl font-bold text-white">
                        {remorque ? 'Modifier la Remorque' : 'Nouvelle Remorque'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Row 1 - Matricule, Type */}
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
                                placeholder="REM-123"
                            />
                            {errors.matricule && (
                                <p className="mt-1 text-sm text-red-400">{errors.matricule}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Type <span className="text-red-400">*</span>
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border border-white/10 focus:outline-none focus:border-brand-cyan/50 focus:bg-[#1a1633]/80 transition-all"
                            >
                                <option value="FRIGORIFIQUE">Frigorifique</option>
                                <option value="BENNE">Benne</option>
                                <option value="PLATEAU">Plateau</option>
                                <option value="CITERNE">Citerne</option>
                                <option value="PORTE_CONTENEUR">Porte Conteneur</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 2 - Capacité, Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Capacité (tonnes) <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                name="capacite"
                                value={formData.capacite}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border ${
                                    errors.capacite ? 'border-red-500/50' : 'border-white/10'
                                } focus:outline-none focus:border-brand-cyan/50 focus:bg-[#1a1633]/80 transition-all placeholder-gray-500`}
                                min="0"
                                step="0.1"
                            />
                            {errors.capacite && (
                                <p className="mt-1 text-sm text-red-400">{errors.capacite}</p>
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
                            {loading ? 'En cours...' : remorque ? 'Modifier' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RemorqueModal;
