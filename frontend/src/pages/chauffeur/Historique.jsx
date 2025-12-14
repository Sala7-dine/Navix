import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrajets } from '../../features/trajets/trajetsSlice';

const Historique = () => {
    const dispatch = useDispatch();
    const { trajets, loading } = useSelector((state) => state.trajets);
    const { user } = useSelector((state) => state.auth);

    // Filtrer les trajets terminés du chauffeur connecté
    const trajetsTermines = trajets.filter(
        trajet => trajet.chauffeur?._id === user?.userId && trajet.statut === 'TERMINE'
    );

    useEffect(() => {
        dispatch(fetchTrajets());
    }, [dispatch]);

    // Calculer les statistiques
    const totalDistance = trajetsTermines.reduce((sum, t) => sum + (t.distance || 0), 0);
    const moyenneDistance = trajetsTermines.length > 0 ? (totalDistance / trajetsTermines.length).toFixed(0) : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-cyan/30 border-t-brand-cyan rounded-full animate-spin"></div>
                    <p className="text-gray-400">Chargement de l'historique...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Historique des Trajets</h1>
                    <p className="text-gray-400">Consultez vos trajets terminés</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#252140]/95 backdrop-blur-2xl rounded-2xl border border-white/10 p-6 hover:border-green-500/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center border border-green-500/30">
                            <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-bold text-white">{trajetsTermines.length}</p>
                        <p className="text-sm text-gray-400">Trajets Terminés</p>
                    </div>
                </div>

                <div className="bg-[#252140]/95 backdrop-blur-2xl rounded-2xl border border-white/10 p-6 hover:border-brand-cyan/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-cyan/20 to-blue-600/20 flex items-center justify-center border border-brand-cyan/30">
                            <svg className="w-6 h-6 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-bold text-white">{totalDistance.toLocaleString()} km</p>
                        <p className="text-sm text-gray-400">Distance Totale</p>
                    </div>
                </div>

                <div className="bg-[#252140]/95 backdrop-blur-2xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center border border-purple-500/30">
                            <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-bold text-white">{moyenneDistance} km</p>
                        <p className="text-sm text-gray-400">Moyenne / Trajet</p>
                    </div>
                </div>
            </div>

            {/* Historique List */}
            <div className="bg-[#252140]/95 backdrop-blur-2xl rounded-3xl border border-white/10 p-6">
                {trajetsTermines.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-cyan/20 to-blue-600/20 flex items-center justify-center mx-auto mb-6 border border-brand-cyan/30">
                            <svg className="w-10 h-10 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Aucun trajet terminé</h3>
                        <p className="text-gray-400">Votre historique apparaîtra ici une fois que vous aurez terminé des trajets</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Itinéraire</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Camion</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Remorque</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Distance</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {trajetsTermines.map((trajet) => (
                                    <tr key={trajet._id} className="group hover:bg-white/5 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                </svg>
                                                <div>
                                                    <div className="text-sm font-medium text-white">
                                                        {new Date(trajet.dateDepart).toLocaleDateString('fr-FR')}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {new Date(trajet.dateDepart).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-white font-medium">{trajet.depart}</span>
                                                <svg className="w-4 h-4 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                                                </svg>
                                                <span className="text-white font-medium">{trajet.destination}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                                                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
                                                </svg>
                                                <span className="text-sm text-gray-300">{trajet.camion?.immatriculation || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
                                                </svg>
                                                <span className="text-sm text-gray-300">{trajet.remorque?.immatriculation || 'Sans'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                                </svg>
                                                <span className="text-sm font-medium text-white">{trajet.distance || 0} km</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex px-3 py-1 rounded-lg text-xs font-bold border text-green-400 bg-green-500/10 border-green-500/30">
                                                Terminé
                                            </span>
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

export default Historique;
