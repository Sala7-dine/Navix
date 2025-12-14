import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrajets } from '../../features/trajets/trajetsSlice';

const MesTrajets = () => {
    const dispatch = useDispatch();
    const { trajets, loading } = useSelector((state) => state.trajets);
    const { user } = useSelector((state) => state.auth);
    const [notification, setNotification] = useState(null);

    // Filtrer les trajets du chauffeur connecté
    const mesTrajets = trajets.filter(trajet => trajet.chauffeur?._id === user?.userId);

    useEffect(() => {
        dispatch(fetchTrajets());
    }, [dispatch]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleUpdateStatus = (trajetId, newStatus) => {
        // TODO: Implémenter l'API pour mettre à jour le statut
        showNotification(`Statut du trajet mis à jour: ${newStatus}`);
    };

    const getStatusColor = (statut) => {
        switch(statut) {
            case 'PLANIFIE':
                return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
            case 'EN_COURS':
                return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
            case 'TERMINE':
                return 'text-green-400 bg-green-500/10 border-green-500/30';
            case 'ANNULE':
                return 'text-red-400 bg-red-500/10 border-red-500/30';
            default:
                return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
        }
    };

    const getStatusLabel = (statut) => {
        const labels = {
            'PLANIFIE': 'Planifié',
            'EN_COURS': 'En Cours',
            'TERMINE': 'Terminé',
            'ANNULE': 'Annulé'
        };
        return labels[statut] || statut;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-cyan/30 border-t-brand-cyan rounded-full animate-spin"></div>
                    <p className="text-gray-400">Chargement de vos trajets...</p>
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
                    <h1 className="text-3xl font-bold text-white mb-2">Mes Trajets</h1>
                    <p className="text-gray-400">Gérez vos trajets assignés</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#252140]/95 backdrop-blur-2xl rounded-2xl border border-white/10 p-6 hover:border-brand-cyan/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-cyan/20 to-blue-600/20 flex items-center justify-center border border-brand-cyan/30">
                            <svg className="w-6 h-6 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-bold text-white">{mesTrajets.length}</p>
                        <p className="text-sm text-gray-400">Total Trajets</p>
                    </div>
                </div>

                <div className="bg-[#252140]/95 backdrop-blur-2xl rounded-2xl border border-white/10 p-6 hover:border-yellow-500/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center border border-yellow-500/30">
                            <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-bold text-white">
                            {mesTrajets.filter(t => t.statut === 'EN_COURS').length}
                        </p>
                        <p className="text-sm text-gray-400">En Cours</p>
                    </div>
                </div>

                <div className="bg-[#252140]/95 backdrop-blur-2xl rounded-2xl border border-white/10 p-6 hover:border-blue-500/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center border border-blue-500/30">
                            <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-bold text-white">
                            {mesTrajets.filter(t => t.statut === 'PLANIFIE').length}
                        </p>
                        <p className="text-sm text-gray-400">Planifiés</p>
                    </div>
                </div>

                <div className="bg-[#252140]/95 backdrop-blur-2xl rounded-2xl border border-white/10 p-6 hover:border-green-500/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center border border-green-500/30">
                            <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-bold text-white">
                            {mesTrajets.filter(t => t.statut === 'TERMINE').length}
                        </p>
                        <p className="text-sm text-gray-400">Terminés</p>
                    </div>
                </div>
            </div>

            {/* Trajets List */}
            <div className="bg-[#252140]/95 backdrop-blur-2xl rounded-3xl border border-white/10 p-6">
                {mesTrajets.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-cyan/20 to-blue-600/20 flex items-center justify-center mx-auto mb-6 border border-brand-cyan/30">
                            <svg className="w-10 h-10 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Aucun trajet assigné</h3>
                        <p className="text-gray-400">Aucun trajet ne vous a été assigné pour le moment</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {mesTrajets.map((trajet) => (
                            <div key={trajet._id} className="bg-[#1a1633]/60 rounded-2xl border border-white/10 p-6 hover:border-brand-cyan/30 transition-all duration-300">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    {/* Info principale */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(trajet.statut)}`}>
                                                {getStatusLabel(trajet.statut)}
                                            </span>
                                            <h3 className="text-lg font-bold text-white">
                                                {trajet.depart} → {trajet.destination}
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <svg className="w-4 h-4 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                </svg>
                                                <span>{new Date(trajet.dateDepart).toLocaleDateString('fr-FR')}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-400">
                                                <svg className="w-4 h-4 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                                                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
                                                </svg>
                                                <span>{trajet.camion?.immatriculation || 'N/A'}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-400">
                                                <svg className="w-4 h-4 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
                                                </svg>
                                                <span>{trajet.remorque?.immatriculation || 'Sans'}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-400">
                                                <svg className="w-4 h-4 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                                </svg>
                                                <span>{trajet.distance || 0} km</span>
                                            </div>
                                        </div>

                                        {trajet.notes && (
                                            <p className="text-sm text-gray-400 bg-[#15132b]/60 rounded-lg px-3 py-2">
                                                {trajet.notes}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        {trajet.statut === 'PLANIFIE' && (
                                            <button
                                                onClick={() => handleUpdateStatus(trajet._id, 'EN_COURS')}
                                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 border border-green-500/30 hover:from-green-500/30 hover:to-green-600/30 transition-all duration-200 font-medium"
                                            >
                                                Démarrer
                                            </button>
                                        )}
                                        {trajet.statut === 'EN_COURS' && (
                                            <button
                                                onClick={() => handleUpdateStatus(trajet._id, 'TERMINE')}
                                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border border-blue-500/30 hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-200 font-medium"
                                            >
                                                Terminer
                                            </button>
                                        )}
                                        <button
                                            className="px-4 py-2 rounded-xl bg-[#1a1633]/80 text-gray-400 border border-white/10 hover:border-brand-cyan/30 hover:text-brand-cyan transition-all duration-200 font-medium"
                                        >
                                            Détails
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MesTrajets;
