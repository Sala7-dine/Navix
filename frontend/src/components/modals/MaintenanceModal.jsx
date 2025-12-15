import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const MaintenanceModal = ({ isOpen, onClose, onSubmit, maintenance, loading }) => {
    const { camions } = useSelector((state) => state.camions);
    const { pneus } = useSelector((state) => state.pneus);
    
    const [formData, setFormData] = useState({
        type: '',
        description: '',
        cout: '',
        date: '',
        statut: 'PLANIFIEE',
        camion: '',
        pneu: '',
        garage: '',
        technicien: '',
        kilometrage: '',
        prochainEntretien: '',
        remarques: ''
    });
    const [errors, setErrors] = useState({});

    const typeOptions = [
        { value: 'VIDANGE', label: 'Vidange' },
        { value: 'PNEU', label: 'Pneu' },
        { value: 'REVISION', label: 'Révision' },
        { value: 'FREIN', label: 'Frein' },
        { value: 'TRANSMISSION', label: 'Transmission' },
        { value: 'SUSPENSION', label: 'Suspension' },
        { value: 'CLIMATISATION', label: 'Climatisation' },
        { value: 'ELECTRICITE', label: 'Électricité' },
        { value: 'CARROSSERIE', label: 'Carrosserie' },
        { value: 'AUTRE', label: 'Autre' }
    ];

    const statutOptions = [
        { value: 'PLANIFIEE', label: 'Planifiée' },
        { value: 'EN_COURS', label: 'En cours' },
        { value: 'TERMINEE', label: 'Terminée' },
        { value: 'ANNULEE', label: 'Annulée' }
    ];

    useEffect(() => {
        if (maintenance) {
            setFormData({
                type: maintenance.type || '',
                description: maintenance.description || '',
                cout: maintenance.cout || '',
                date: maintenance.date ? new Date(maintenance.date).toISOString().slice(0, 16) : '',
                statut: maintenance.statut || 'PLANIFIEE',
                camion: maintenance.camion?._id || maintenance.camion || '',
                pneu: maintenance.pneu?._id || maintenance.pneu || '',
                garage: maintenance.garage || '',
                technicien: maintenance.technicien || '',
                kilometrage: maintenance.kilometrage || '',
                prochainEntretien: maintenance.prochainEntretien ? new Date(maintenance.prochainEntretien).toISOString().slice(0, 10) : '',
                remarques: maintenance.remarques || ''
            });
        } else {
            setFormData({
                type: '',
                description: '',
                cout: '',
                date: new Date().toISOString().slice(0, 16),
                statut: 'PLANIFIEE',
                camion: '',
                pneu: '',
                garage: '',
                technicien: '',
                kilometrage: '',
                prochainEntretien: '',
                remarques: ''
            });
        }
        setErrors({});
    }, [maintenance, isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.type) newErrors.type = 'Le type est requis';
        if (!formData.description || formData.description.length < 10) {
            newErrors.description = 'La description doit contenir au moins 10 caractères';
        }
        if (!formData.cout || formData.cout < 0) newErrors.cout = 'Le coût doit être positif';
        if (!formData.date) newErrors.date = 'La date est requise';
        if (!formData.camion && !formData.pneu) {
            newErrors.camion = 'Au moins un camion ou un pneu doit être sélectionné';
        }
        if (formData.type === 'PNEU' && !formData.pneu) {
            newErrors.pneu = 'Un pneu doit être sélectionné pour une maintenance de type PNEU';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const dataToSubmit = {
                type: formData.type,
                description: formData.description.trim(),
                cout: parseFloat(formData.cout),
                date: formData.date,
                statut: formData.statut,
                camion: formData.camion || undefined,
                pneu: formData.pneu || undefined,
                garage: formData.garage.trim() || undefined,
                technicien: formData.technicien.trim() || undefined,
                kilometrage: formData.kilometrage ? parseInt(formData.kilometrage) : undefined,
                prochainEntretien: formData.prochainEntretien || undefined,
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-panel p-8 max-w-4xl w-full mx-4 rounded-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {maintenance ? 'Modifier Maintenance' : 'Nouvelle Maintenance'}
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

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2">
                                Type <span className="text-red-400">*</span>
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 glass-card rounded-lg text-white focus:outline-none focus:ring-2 ${
                                    errors.type ? 'ring-2 ring-red-500' : 'focus:ring-brand-cyan/50'
                                }`}
                            >
                                <option value="">Sélectionner un type</option>
                                {typeOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                            {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type}</p>}
                        </div>

                        {/* Statut */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2">
                                Statut <span className="text-red-400">*</span>
                            </label>
                            <select
                                name="statut"
                                value={formData.statut}
                                onChange={handleChange}
                                className="w-full px-4 py-3 glass-card rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                            >
                                {statutOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Camion */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2">
                                Camion {!formData.pneu && <span className="text-red-400">*</span>}
                            </label>
                            <select
                                name="camion"
                                value={formData.camion}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 glass-card rounded-lg text-white focus:outline-none focus:ring-2 ${
                                    errors.camion ? 'ring-2 ring-red-500' : 'focus:ring-brand-cyan/50'
                                }`}
                            >
                                <option value="">Aucun camion</option>
                                {camions.map(camion => (
                                    <option key={camion._id} value={camion._id}>
                                        {camion.matricule} - {camion.marque} {camion.modele}
                                    </option>
                                ))}
                            </select>
                            {errors.camion && <p className="text-red-400 text-sm mt-1">{errors.camion}</p>}
                        </div>

                        {/* Pneu */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2">
                                Pneu {formData.type === 'PNEU' && <span className="text-red-400">*</span>}
                            </label>
                            <select
                                name="pneu"
                                value={formData.pneu}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 glass-card rounded-lg text-white focus:outline-none focus:ring-2 ${
                                    errors.pneu ? 'ring-2 ring-red-500' : 'focus:ring-brand-cyan/50'
                                }`}
                            >
                                <option value="">Aucun pneu</option>
                                {pneus.map(pneu => (
                                    <option key={pneu._id} value={pneu._id}>
                                        {pneu.marque} {pneu.taille} - {pneu.position}
                                    </option>
                                ))}
                            </select>
                            {errors.pneu && <p className="text-red-400 text-sm mt-1">{errors.pneu}</p>}
                        </div>

                        {/* Coût */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2">
                                Coût (DH) <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                name="cout"
                                value={formData.cout}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                className={`w-full px-4 py-3 glass-card rounded-lg text-white focus:outline-none focus:ring-2 ${
                                    errors.cout ? 'ring-2 ring-red-500' : 'focus:ring-brand-cyan/50'
                                }`}
                                placeholder="Ex: 1500.00"
                            />
                            {errors.cout && <p className="text-red-400 text-sm mt-1">{errors.cout}</p>}
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2">
                                Date <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 glass-card rounded-lg text-white focus:outline-none focus:ring-2 ${
                                    errors.date ? 'ring-2 ring-red-500' : 'focus:ring-brand-cyan/50'
                                }`}
                            />
                            {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}
                        </div>

                        {/* Garage */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2">
                                Garage
                            </label>
                            <input
                                type="text"
                                name="garage"
                                value={formData.garage}
                                onChange={handleChange}
                                className="w-full px-4 py-3 glass-card rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                                placeholder="Ex: Garage Auto Service"
                            />
                        </div>

                        {/* Technicien */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2">
                                Technicien
                            </label>
                            <input
                                type="text"
                                name="technicien"
                                value={formData.technicien}
                                onChange={handleChange}
                                className="w-full px-4 py-3 glass-card rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                                placeholder="Ex: Ahmed Benani"
                            />
                        </div>

                        {/* Kilométrage */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2">
                                Kilométrage
                            </label>
                            <input
                                type="number"
                                name="kilometrage"
                                value={formData.kilometrage}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-4 py-3 glass-card rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                                placeholder="Ex: 125000"
                            />
                        </div>

                        {/* Prochain Entretien */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2">
                                Prochain Entretien
                            </label>
                            <input
                                type="date"
                                name="prochainEntretien"
                                value={formData.prochainEntretien}
                                onChange={handleChange}
                                className="w-full px-4 py-3 glass-card rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-dark-muted mb-2">
                                Description <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                minLength="10"
                                maxLength="1000"
                                className={`w-full px-4 py-3 glass-card rounded-lg text-white focus:outline-none focus:ring-2 ${
                                    errors.description ? 'ring-2 ring-red-500' : 'focus:ring-brand-cyan/50'
                                } resize-none`}
                                placeholder="Description détaillée de la maintenance (min 10 caractères)..."
                            />
                            <div className="flex justify-between items-center mt-1">
                                {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}
                                <div className="text-xs text-gray-500 ml-auto">
                                    {formData.description.length}/1000
                                </div>
                            </div>
                        </div>

                        {/* Remarques */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-dark-muted mb-2">
                                Remarques
                            </label>
                            <textarea
                                name="remarques"
                                value={formData.remarques}
                                onChange={handleChange}
                                rows="2"
                                className="w-full px-4 py-3 glass-card rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 resize-none"
                                placeholder="Remarques additionnelles..."
                            />
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
                            {loading ? 'Enregistrement...' : (maintenance ? 'Modifier' : 'Ajouter')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MaintenanceModal;
