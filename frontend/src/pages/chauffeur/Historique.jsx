import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMesTrajets } from '../../features/trajets/trajetsSlice';
import { trajetsService } from '../../services/api';

const Historique = () => {
    const dispatch = useDispatch();
    const { trajets, loading } = useSelector((state) => state.trajets);
    const { user } = useSelector((state) => state.auth);
    const [downloadingPDF, setDownloadingPDF] = useState(null);
    const [notification, setNotification] = useState(null);

    // Filtrer uniquement les trajets terminés (fetchMesTrajets retourne déjà les trajets du chauffeur connecté)
    const trajetsTermines = trajets.filter(
        trajet => trajet.statut === 'TERMINE'
    );

    useEffect(() => {
        dispatch(fetchMesTrajets());
    }, [dispatch]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleDownloadPDF = async (trajetId, trajetInfo) => {
        try {
            setDownloadingPDF(trajetId);
            const pdfBlob = await trajetsService.downloadPDF(trajetId);
            
            // Créer un lien de téléchargement
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `trajet_${trajetInfo.lieuDepart}_${trajetInfo.lieuArrivee}_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(link);
            link.click();
            
            // Nettoyer
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
            
            showNotification('PDF téléchargé avec succès !', 'success');
        } catch (error) {
            console.error('Erreur téléchargement PDF:', error);
            showNotification('Erreur lors du téléchargement du PDF', 'error');
        } finally {
            setDownloadingPDF(null);
        }
    };

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
            {/* Notification */}
            {notification && (
                <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl backdrop-blur-xl border shadow-lg transform transition-all duration-300 ${
                    notification.type === 'success' 
                        ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                        : 'bg-red-500/20 border-red-500/30 text-red-400'
                }`}>
                    <div className="flex items-center gap-3">
                        {notification.type === 'success' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        )}
                        <span className="font-medium">{notification.message}</span>
                    </div>
                </div>
            )}
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Historique des Trajets</h1>
                    <p className="text-gray-400">Consultez vos trajets terminés</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Trajets Terminés - Cyan Card */}
                <div className="cyan-card rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-cyan-500/20">
                    <div>
                        <p className="text-white/80 text-sm mb-2">Trajets Terminés</p>
                        <p className="text-4xl font-bold text-white">{trajetsTermines.length}</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                {/* Distance Totale - Glass Card */}
                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-cyan/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    <div className="relative z-10">
                        <p className="text-dark-muted text-sm mb-2">Distance Totale</p>
                        <p className="text-4xl font-bold text-white">{totalDistance.toLocaleString()} km</p>
                    </div>
                    <div className="relative z-10 bg-brand-cyan/10 p-4 rounded-xl">
                        <svg className="w-8 h-8 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                </div>

                {/* Moyenne - Glass Card */}
                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    <div className="relative z-10">
                        <p className="text-dark-muted text-sm mb-2">Moyenne / Trajet</p>
                        <p className="text-4xl font-bold text-white">{moyenneDistance} km</p>
                    </div>
                    <div className="relative z-10 bg-purple-500/10 p-4 rounded-xl">
                        <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Historique List */}
            <div className="glass-panel p-6">
                {trajetsTermines.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-cyan/20 to-blue-600/20 flex items-center justify-center mx-auto mb-6 border border-brand-cyan/30">
                            <svg className="w-10 h-10 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Aucun trajet terminé</h3>
                        <p className="text-dark-muted">Votre historique apparaîtra ici une fois que vous aurez terminé des trajets</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#2d2b45]">
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Date</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Itinéraire</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Camion</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Remorque</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Distance</th>
                                    <th className="text-center py-4 px-4 text-dark-muted font-medium text-sm">Statut</th>
                                    <th className="text-center py-4 px-4 text-dark-muted font-medium text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2d2b45]">
                                {trajetsTermines.map((trajet) => (
                                    <tr key={trajet._id} className="hover:bg-[#1e1c36] transition-colors">
                                        <td className="py-4 px-4 text-dark-muted">
                                            {trajet.dateDepart ? new Date(trajet.dateDepart).toLocaleDateString('fr-FR') : '-'}
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
                                            {trajet.camion?.matricule || 'N/A'}
                                        </td>
                                        <td className="py-4 px-4 text-dark-muted">
                                            {trajet.remorque?.matricule || 'Sans'}
                                        </td>
                                        <td className="py-4 px-4 text-white font-medium">
                                            {trajet.distance || 0} km
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                                                Terminé
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex justify-center gap-2">
                                                {/* Bouton télécharger PDF */}
                                                <button
                                                    onClick={() => handleDownloadPDF(trajet._id, trajet)}
                                                    disabled={downloadingPDF === trajet._id}
                                                    className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                    title="Télécharger PDF"
                                                >
                                                    {downloadingPDF === trajet._id ? (
                                                        <>
                                                            <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                                                            <span>Téléchargement...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            <span>Télécharger PDF</span>
                                                        </>
                                                    )}
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

export default Historique;
