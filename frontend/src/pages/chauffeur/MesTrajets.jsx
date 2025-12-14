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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Total Trajets - Cyan Card */}
                <div className="cyan-card rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-cyan-500/20">
                    <div>
                        <p className="text-white/80 text-sm mb-2">Total Trajets</p>
                        <p className="text-4xl font-bold text-white">{mesTrajets.length}</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                    </div>
                </div>

                {/* En Cours - Glass Card */}
                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    <div className="relative z-10">
                        <p className="text-dark-muted text-sm mb-2">En Cours</p>
                        <p className="text-4xl font-bold text-white">{mesTrajets.filter(t => t.statut === 'EN_COURS').length}</p>
                    </div>
                    <div className="relative z-10 bg-yellow-500/10 p-4 rounded-xl">
                        <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                </div>

                {/* Planifiés - Glass Card */}
                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    <div className="relative z-10">
                        <p className="text-dark-muted text-sm mb-2">Planifiés</p>
                        <p className="text-4xl font-bold text-white">{mesTrajets.filter(t => t.statut === 'PLANIFIE').length}</p>
                    </div>
                    <div className="relative z-10 bg-blue-500/10 p-4 rounded-xl">
                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>

                {/* Terminés - Glass Card */}
                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    <div className="relative z-10">
                        <p className="text-dark-muted text-sm mb-2">Terminés</p>
                        <p className="text-4xl font-bold text-white">{mesTrajets.filter(t => t.statut === 'TERMINE').length}</p>
                    </div>
                    <div className="relative z-10 bg-green-500/10 p-4 rounded-xl">
                        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Trajets List */}
            <div className="glass-panel p-6">
                {mesTrajets.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-cyan/20 to-blue-600/20 flex items-center justify-center mx-auto mb-6 border border-brand-cyan/30">
                            <svg className="w-10 h-10 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Aucun trajet assigné</h3>
                        <p className="text-dark-muted">Aucun trajet ne vous a été assigné pour le moment</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#2d2b45]">
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Statut</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Itinéraire</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Date Départ</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Camion</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Remorque</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Distance</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2d2b45]">
                                {mesTrajets.map((trajet) => (
                                    <tr key={trajet._id} className="hover:bg-[#1e1c36] transition-colors">
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                trajet.statut === 'PLANIFIE' ? 'bg-blue-500/20 text-blue-400' :
                                                trajet.statut === 'EN_COURS' ? 'bg-yellow-500/20 text-yellow-400' :
                                                trajet.statut === 'TERMINE' ? 'bg-green-500/20 text-green-400' :
                                                'bg-red-500/20 text-red-400'
                                            }`}>
                                                {getStatusLabel(trajet.statut)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2 text-white">
                                                <span className="font-medium">{trajet.lieuDepart}</span>
                                                <svg className="w-4 h-4 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                                                </svg>
                                                <span className="font-medium">{trajet.lieuArrivee}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-dark-muted">
                                            {trajet.dateDepart ? new Date(trajet.dateDepart).toLocaleDateString('fr-FR') : '-'}
                                        </td>
                                        <td className="py-4 px-4 text-dark-muted">
                                            {trajet.camion?.matricule || 'N/A'}
                                        </td>
                                        <td className="py-4 px-4 text-dark-muted">
                                            {trajet.remorque?.matricule || 'Sans'}
                                        </td>
                                        <td className="py-4 px-4 text-white font-medium">
                                            {trajet.distance || 0} km
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex gap-2">
                                                {trajet.statut === 'PLANIFIE' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(trajet._id, 'EN_COURS')}
                                                        className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors text-xs font-medium"
                                                    >
                                                        Démarrer
                                                    </button>
                                                )}
                                                {trajet.statut === 'EN_COURS' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(trajet._id, 'TERMINE')}
                                                        className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors text-xs font-medium"
                                                    >
                                                        Terminer
                                                    </button>
                                                )}
                                                <button
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Détails"
                                                >
                                                    <svg className="w-4 h-4 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MesTrajets;
