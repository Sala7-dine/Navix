import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const PneuModal = ({ isOpen, onClose, onSubmit, pneu, loading }) => {
    const { camions } = useSelector((state) => state.camions);
    
    const [formData, setFormData] = useState({
        camion: '',
        position: 'AVANT_GAUCHE',
        marque: '',
        modele: '',
        numeroSerie: '',
        dateInstallation: '',
        kilometrageInstallation: '',
        pression: '',
        profondeurSculpture: '',
        usurePourcentage: 0
    });

    useEffect(() => {
        if (pneu) {
            setFormData({
                camion: pneu.camion?._id || '',
                position: pneu.position || 'AVANT_GAUCHE',
                marque: pneu.marque || '',
                modele: pneu.modele || '',
                numeroSerie: pneu.numeroSerie || '',
                dateInstallation: pneu.dateInstallation ? new Date(pneu.dateInstallation).toISOString().split('T')[0] : '',
                kilometrageInstallation: pneu.kilometrageInstallation || '',
                pression: pneu.pression || '',
                profondeurSculpture: pneu.profondeurSculpture || '',
                usurePourcentage: pneu.usurePourcentage || 0
            });
        } else {
            setFormData({
                camion: '',
                position: 'AVANT_GAUCHE',
                marque: '',
                modele: '',
                numeroSerie: '',
                dateInstallation: '',
                kilometrageInstallation: '',
                pression: '',
                profondeurSculpture: '',
                usurePourcentage: 0
            });
        }
    }, [pneu]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-panel p-8 max-w-2xl w-full mx-4 rounded-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {pneu ? 'Modifier le Pneu' : 'Nouveau Pneu'}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Camion */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2">
                                Camion <span className="text-red-400">*</span>
                            </label>
                            <select
                                name="camion"
                                value={formData.camion}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 glass-card rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                            >
                                <option value="">Sélectionner un camion</option>
                                {camions.map((camion) => (
                                    <option key={camion._id} value={camion._id}>
                                        {camion.matricule} - {camion.marque} {camion.modele}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Position */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2">
                                Position <span className="text-red-400">*</span>
                            </label>
                            <select
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 glass-card rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                            >
                                <option value="AVANT_GAUCHE">Avant Gauche</option>
                                <option value="AVANT_DROIT">Avant Droit</option>
                                <option value="ARRIERE_GAUCHE">Arrière Gauche</option>
                                <option value="ARRIERE_DROIT">Arrière Droit</option>
                                <option value="ROUE_SECOURS">Roue de Secours</option>
                            </select>
                        </div>

                        {/* Marque */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2">
                                Marque <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="marque"
                                value={formData.marque}
                                onChange={handleChange}
                                required
                                placeholder="Ex: Michelin"
                                className="w-full px-4 py-3 glass-card rounded-lg text-white placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                            />
                        </div>

                        {/* Modèle */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2">
                                Modèle <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="modele"
                                value={formData.modele}
                                onChange={handleChange}
                                required
                                placeholder="Ex: XZE 295/80R22.5"
                                className="w-full px-4 py-3 glass-card rounded-lg text-white placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                            />
                        </div>

                        {/* Numéro de Série */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2">
                                Numéro de Série
                            </label>
                            <input
                                type="text"
                                name="numeroSerie"
                                value={formData.numeroSerie}
                                onChange={handleChange}
                                placeholder="Ex: DOT XXXX"
                                className="w-full px-4 py-3 glass-card rounded-lg text-white placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                            />
                        </div>

                        {/* Date d'Installation */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2">
                                Date d'Installation <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="date"
                                name="dateInstallation"
                                value={formData.dateInstallation}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 glass-card rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                            />
                        </div>

                        {/* Kilométrage Installation */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2">
                                Kilométrage Installation <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                name="kilometrageInstallation"
                                value={formData.kilometrageInstallation}
                                onChange={handleChange}
                                required
                                min="0"
                                placeholder="Ex: 50000"
                                className="w-full px-4 py-3 glass-card rounded-lg text-white placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                            />
                        </div>

                        {/* Pression */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2">
                                Pression (bar)
                            </label>
                            <input
                                type="number"
                                name="pression"
                                value={formData.pression}
                                onChange={handleChange}
                                step="0.1"
                                min="0"
                                placeholder="Ex: 8.5"
                                className="w-full px-4 py-3 glass-card rounded-lg text-white placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                            />
                        </div>

                        {/* Profondeur Sculpture */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2">
                                Profondeur Sculpture (mm)
                            </label>
                            <input
                                type="number"
                                name="profondeurSculpture"
                                value={formData.profondeurSculpture}
                                onChange={handleChange}
                                step="0.1"
                                min="0"
                                placeholder="Ex: 8.5"
                                className="w-full px-4 py-3 glass-card rounded-lg text-white placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                            />
                        </div>

                        {/* Usure Pourcentage */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2">
                                Usure (%) <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                name="usurePourcentage"
                                value={formData.usurePourcentage}
                                onChange={handleChange}
                                required
                                min="0"
                                max="100"
                                placeholder="Ex: 25"
                                className="w-full px-4 py-3 glass-card rounded-lg text-white placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 glass-card text-white rounded-xl font-medium hover:bg-white/10 transition-colors"
                            disabled={loading}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Enregistrement...' : (pneu ? 'Mettre à jour' : 'Créer')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PneuModal;
