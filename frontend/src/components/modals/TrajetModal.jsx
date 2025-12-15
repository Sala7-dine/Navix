import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const TrajetModal = ({ isOpen, onClose, onSubmit, trajet, loading, error }) => {
    const { users } = useSelector((state) => state.users);
    const { camions } = useSelector((state) => state.camions);
    const { remorques } = useSelector((state) => state.remorques);

    const [formData, setFormData] = useState({
        chauffeur: '',
        camion: '',
        remorque: '',
        lieuDepart: '',
        lieuArrivee: '',
        dateDepart: '',
        description: ''
    });

    useEffect(() => {
        if (trajet) {
            setFormData({
                chauffeur: trajet.chauffeur?._id || trajet.chauffeur || '',
                camion: trajet.camion?._id || trajet.camion || '',
                remorque: trajet.remorque?._id || trajet.remorque || '',
                lieuDepart: trajet.lieuDepart || '',
                lieuArrivee: trajet.lieuArrivee || '',
                dateDepart: trajet.dateDepart ? new Date(trajet.dateDepart).toISOString().slice(0, 16) : '',
                description: trajet.description || trajet.remarques || ''
            });
        } else {
            setFormData({
                chauffeur: '',
                camion: '',
                remorque: '',
                lieuDepart: '',
                lieuArrivee: '',
                dateDepart: '',
                description: ''
            });
        }
    }, [trajet]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.chauffeur || !formData.camion || !formData.lieuDepart || 
            !formData.lieuArrivee || !formData.dateDepart) {
            alert('Veuillez remplir tous les champs requis');
            return;
        }

        // Prepare data - remove empty fields
        const dataToSubmit = { ...formData };
        if (!dataToSubmit.remorque) delete dataToSubmit.remorque;
        if (!dataToSubmit.description) delete dataToSubmit.description;

        onSubmit(dataToSubmit);
    };

    if (!isOpen) return null;

    const chauffeurs = users.filter(u => u.role === 'chauffeur');

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xl flex items-center justify-center z-50 p-4">
            <div className="bg-[#252140]/95 backdrop-blur-2xl rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {trajet ? 'Modifier le trajet' : 'Ajouter un trajet'}
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

                {error && (
                    <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">
                                Chauffeur *
                            </label>
                            <select
                                name="chauffeur"
                                value={formData.chauffeur}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border border-white/10 focus:border-brand-cyan/50 focus:bg-[#1a1633]/80 focus:outline-none transition-all"
                            >
                                <option value="">Sélectionner un chauffeur</option>
                                {chauffeurs.map(chauffeur => (
                                    <option key={chauffeur._id} value={chauffeur._id}>
                                        {chauffeur.fullName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">
                                Camion *
                            </label>
                            <select
                                name="camion"
                                value={formData.camion}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border border-white/10 focus:border-brand-cyan/50 focus:bg-[#1a1633]/80 focus:outline-none transition-all"
                            >
                                <option value="">Sélectionner un camion</option>
                                {camions.map(camion => (
                                    <option key={camion._id} value={camion._id}>
                                        {camion.matricule} - {camion.marque} {camion.modele}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">
                            Remorque
                        </label>
                        <select
                            name="remorque"
                            value={formData.remorque}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border border-white/10 focus:border-brand-cyan/50 focus:bg-[#1a1633]/80 focus:outline-none transition-all"
                        >
                            <option value="">Sans remorque</option>
                            {remorques.map(remorque => (
                                <option key={remorque._id} value={remorque._id}>
                                    {remorque.matricule} - {remorque.type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">
                                Lieu de départ *
                            </label>
                            <input
                                type="text"
                                name="lieuDepart"
                                value={formData.lieuDepart}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border border-white/10 focus:border-brand-cyan/50 focus:bg-[#1a1633]/80 focus:outline-none transition-all"
                                placeholder="Ex: Casablanca"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">
                                Lieu d'arrivée *
                            </label>
                            <input
                                type="text"
                                name="lieuArrivee"
                                value={formData.lieuArrivee}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border border-white/10 focus:border-brand-cyan/50 focus:bg-[#1a1633]/80 focus:outline-none transition-all"
                                placeholder="Ex: Marrakech"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">
                            Date de départ *
                        </label>
                        <input
                            type="datetime-local"
                            name="dateDepart"
                            value={formData.dateDepart}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border border-white/10 focus:border-brand-cyan/50 focus:bg-[#1a1633]/80 focus:outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            maxLength="1000"
                            className="w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border border-white/10 focus:border-brand-cyan/50 focus:bg-[#1a1633]/80 focus:outline-none transition-all resize-none"
                            placeholder="Description du trajet..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-[#1a1633]/60 text-white rounded-xl font-medium hover:bg-[#1a1633]/80 transition-colors border border-white/10"
                            disabled={loading}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Chargement...' : trajet ? 'Modifier' : 'Ajouter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TrajetModal;
