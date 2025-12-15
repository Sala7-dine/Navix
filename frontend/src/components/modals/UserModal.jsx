import React, { useState, useEffect } from 'react';

const UserModal = ({ isOpen, onClose, onSubmit, user, loading }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'chauffeur',
        telephone: '',
        dateEmbauche: '',
        numeroPermis: '',
        dateExpirationPermis: '',
        status: false
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                password: '', // Never populate password field on edit
                role: user.role || 'chauffeur',
                telephone: user.telephone || '',
                dateEmbauche: user.dateEmbauche ? new Date(user.dateEmbauche).toISOString().split('T')[0] : '',
                numeroPermis: user.numeroPermis || '',
                dateExpirationPermis: user.dateExpirationPermis ? new Date(user.dateExpirationPermis).toISOString().split('T')[0] : '',
                status: user.status || false
            });
        } else {
            setFormData({
                fullName: '',
                email: '',
                password: '',
                role: 'chauffeur',
                telephone: '',
                dateEmbauche: '',
                numeroPermis: '',
                dateExpirationPermis: '',
                status: false
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.fullName.trim() || !formData.email.trim()) {
            alert('Le nom complet et l\'email sont requis');
            return;
        }

        // Password required only for new users
        if (!user && !formData.password.trim()) {
            alert('Le mot de passe est requis pour les nouveaux utilisateurs');
            return;
        }

        // Prepare data - only include password if it's provided
        const dataToSubmit = { ...formData };
        if (!dataToSubmit.password) {
            delete dataToSubmit.password;
        }

        onSubmit(dataToSubmit);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-panel p-8 max-w-2xl w-full mx-4 rounded-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {user ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
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

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">
                                Nom complet *
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border border-white/10 focus:border-brand-cyan/50 focus:bg-[#1a1633]/80 focus:outline-none transition-all"
                                placeholder="Ex: John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border border-white/10 focus:border-brand-cyan/50 focus:bg-[#1a1633]/80 focus:outline-none transition-all"
                                placeholder="Ex: john@example.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">
                                Mot de passe {!user && '*'}
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border border-white/10 focus:border-brand-cyan/50 focus:bg-[#1a1633]/80 focus:outline-none transition-all"
                                placeholder={user ? "Laisser vide pour ne pas changer" : "Mot de passe"}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">
                                Rôle
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border border-white/10 focus:border-brand-cyan/50 focus:bg-[#1a1633]/80 focus:outline-none transition-all"
                            >
                                <option value="chauffeur">Chauffeur</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">
                                Téléphone
                            </label>
                            <input
                                type="tel"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border border-white/10 focus:border-brand-cyan/50 focus:bg-[#1a1633]/80 focus:outline-none transition-all"
                                placeholder="Ex: +212 600 000 000"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">
                                Date d'embauche
                            </label>
                            <input
                                type="date"
                                name="dateEmbauche"
                                value={formData.dateEmbauche}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border border-white/10 focus:border-brand-cyan/50 focus:bg-[#1a1633]/80 focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">
                                Numéro de permis
                            </label>
                            <input
                                type="text"
                                name="numeroPermis"
                                value={formData.numeroPermis}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border border-white/10 focus:border-brand-cyan/50 focus:bg-[#1a1633]/80 focus:outline-none transition-all"
                                placeholder="Ex: P123456"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">
                                Date d'expiration permis
                            </label>
                            <input
                                type="date"
                                name="dateExpirationPermis"
                                value={formData.dateExpirationPermis}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl border border-white/10 focus:border-brand-cyan/50 focus:bg-[#1a1633]/80 focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="status"
                            checked={formData.status}
                            onChange={handleChange}
                            className="w-4 h-4 text-brand-cyan bg-[#1a1633]/60 border-white/10 rounded focus:ring-brand-cyan focus:ring-2"
                        />
                        <label className="ml-2 text-gray-400 text-sm font-medium">
                            Utilisateur actif
                        </label>
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
                            {loading ? 'Chargement...' : user ? 'Modifier' : 'Ajouter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
