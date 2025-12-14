import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../features/users/usersSlice';

const MonProfil = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { users } = useSelector((state) => state.users);
    const [isEditing, setIsEditing] = useState(false);
    const [notification, setNotification] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: ''
    });

    // Trouver les données complètes du chauffeur
    const chauffeurData = users.find(u => u._id === user?.userId);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        if (chauffeurData) {
            setFormData({
                fullName: chauffeurData.fullName || '',
                email: chauffeurData.email || '',
                phone: chauffeurData.phone || '',
                address: chauffeurData.address || ''
            });
        }
    }, [chauffeurData]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implémenter l'API pour mettre à jour le profil
        showNotification('Profil mis à jour avec succès');
        setIsEditing(false);
    };

    if (!chauffeurData) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-cyan/30 border-t-brand-cyan rounded-full animate-spin"></div>
                    <p className="text-gray-400">Chargement du profil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl backdrop-blur-xl border shadow-lg transform transition-all duration-300 ${
                    notification.type === 'success' 
                        ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                        : 'bg-red-500/20 border-red-500/30 text-red-400'
                }`}>
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span className="font-medium">{notification.message}</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Mon Profil</h1>
                    <p className="text-gray-400">Gérez vos informations personnelles</p>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isEditing
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                            : 'bg-gradient-to-r from-brand-cyan/20 to-blue-600/20 text-brand-cyan border border-brand-cyan/30 hover:from-brand-cyan/30 hover:to-blue-600/30'
                    }`}
                >
                    {isEditing ? 'Annuler' : 'Modifier'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-[#252140]/95 backdrop-blur-2xl rounded-3xl border border-white/10 p-8">
                        <div className="flex flex-col items-center text-center">
                            {/* Avatar */}
                            <div className="relative mb-6">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-cyan to-blue-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white/10 shadow-2xl shadow-cyan-500/30">
                                    {chauffeurData.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'CH'}
                                </div>
                                <div className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-green-500 border-4 border-[#252140] flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                            </div>

                            {/* Info */}
                            <h2 className="text-2xl font-bold text-white mb-2">{chauffeurData.fullName}</h2>
                            <p className="text-brand-cyan font-medium mb-1 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                                </svg>
                                Chauffeur
                            </p>
                            <p className="text-sm text-gray-400 mb-6">{chauffeurData.email}</p>

                            {/* Stats */}
                            <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white mb-1">--</div>
                                    <div className="text-xs text-gray-400">Trajets</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white mb-1">--</div>
                                    <div className="text-xs text-gray-400">km parcourus</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Information Details */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-[#252140]/95 backdrop-blur-2xl rounded-3xl border border-white/10 p-8">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                            </svg>
                            Informations Personnelles
                        </h3>

                        <div className="space-y-6">
                            {/* Nom complet */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Nom Complet
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 rounded-xl text-white border transition-all duration-200 ${
                                        isEditing
                                            ? 'bg-[#1a1633]/60 border-white/10 focus:bg-[#1a1633]/80 focus:border-brand-cyan/50 focus:outline-none'
                                            : 'bg-[#1a1633]/40 border-white/5 cursor-not-allowed'
                                    }`}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 rounded-xl text-white border transition-all duration-200 ${
                                        isEditing
                                            ? 'bg-[#1a1633]/60 border-white/10 focus:bg-[#1a1633]/80 focus:border-brand-cyan/50 focus:outline-none'
                                            : 'bg-[#1a1633]/40 border-white/5 cursor-not-allowed'
                                    }`}
                                />
                            </div>

                            {/* Téléphone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Téléphone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    placeholder="+33 6 00 00 00 00"
                                    className={`w-full px-4 py-3 rounded-xl text-white border transition-all duration-200 ${
                                        isEditing
                                            ? 'bg-[#1a1633]/60 border-white/10 focus:bg-[#1a1633]/80 focus:border-brand-cyan/50 focus:outline-none'
                                            : 'bg-[#1a1633]/40 border-white/5 cursor-not-allowed'
                                    }`}
                                />
                            </div>

                            {/* Adresse */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Adresse
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    rows="3"
                                    placeholder="Votre adresse complète"
                                    className={`w-full px-4 py-3 rounded-xl text-white border transition-all duration-200 resize-none ${
                                        isEditing
                                            ? 'bg-[#1a1633]/60 border-white/10 focus:bg-[#1a1633]/80 focus:border-brand-cyan/50 focus:outline-none'
                                            : 'bg-[#1a1633]/40 border-white/5 cursor-not-allowed'
                                    }`}
                                />
                            </div>

                            {/* Rôle (read-only) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Rôle
                                </label>
                                <input
                                    type="text"
                                    value="Chauffeur"
                                    disabled
                                    className="w-full px-4 py-3 rounded-xl text-gray-400 bg-[#1a1633]/40 border border-white/5 cursor-not-allowed"
                                />
                            </div>

                            {/* Submit Button */}
                            {isEditing && (
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-200"
                                    >
                                        Enregistrer les modifications
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>

                    {/* Security Section */}
                    <div className="bg-[#252140]/95 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 mt-6">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                            </svg>
                            Sécurité
                        </h3>

                        <div className="space-y-4">
                            <button className="w-full px-6 py-3 rounded-xl bg-[#1a1633]/60 text-gray-300 border border-white/10 hover:border-brand-cyan/30 hover:text-brand-cyan transition-all duration-200 flex items-center justify-between group">
                                <span className="font-medium">Changer le mot de passe</span>
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-brand-cyan transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonProfil;
