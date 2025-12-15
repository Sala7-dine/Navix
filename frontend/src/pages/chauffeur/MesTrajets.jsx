import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMesTrajets, updateStatutTrajet } from '../../features/trajets/trajetsSlice';
import { trajetsService } from '../../services/api';

const MesTrajets = () => {
    const dispatch = useDispatch();
    const { trajets, loading } = useSelector((state) => state.trajets);
    const { user } = useSelector((state) => state.auth);
    const [notification, setNotification] = useState(null);
    const [updating, setUpdating] = useState(null);
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [selectedTrajet, setSelectedTrajet] = useState(null);
    const [kilometrageArrivee, setKilometrageArrivee] = useState('');
    const [downloadingPDF, setDownloadingPDF] = useState(null);

    // Les trajets sont déjà filtrés par le backend pour le chauffeur connecté
    const mesTrajets = trajets;

    useEffect(() => {
        dispatch(fetchMesTrajets());
    }, [dispatch]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleUpdateStatus = async (trajetId, newStatus) => {
        try {
            setUpdating(trajetId);
            await dispatch(updateStatutTrajet({ 
                id: trajetId, 
                statut: newStatus 
            })).unwrap();
            
            showNotification(
                newStatus === 'EN_COURS' 
                    ? 'Trajet démarré avec succès !' 
                    : 'Trajet terminé avec succès !',
                'success'
            );
        } catch (error) {
            showNotification(error || 'Erreur lors de la mise à jour', 'error');
        } finally {
            setUpdating(null);
        }
    };

    const handleFinishClick = (trajet) => {
        setSelectedTrajet(trajet);
        setKilometrageArrivee('');
        setShowFinishModal(true);
    };

    const handleFinishTrajet = async () => {
        if (!kilometrageArrivee || kilometrageArrivee <= selectedTrajet.kilometrageDepart) {
            showNotification('Le kilométrage d\'arrivée doit être supérieur au kilométrage de départ', 'error');
            return;
        }

        try {
            setUpdating(selectedTrajet._id);
            await dispatch(updateStatutTrajet({ 
                id: selectedTrajet._id, 
                statut: 'TERMINE',
                kilometrageArrivee: Number(kilometrageArrivee)
            })).unwrap();
            
            showNotification('Trajet terminé avec succès !', 'success');
            setShowFinishModal(false);
            setSelectedTrajet(null);
        } catch (error) {
            showNotification(error || 'Erreur lors de la finalisation', 'error');
        } finally {
            setUpdating(null);
        }
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
                                                        disabled={updating === trajet._id}
                                                        className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                    >
                                                        {updating === trajet._id ? (
                                                            <>
                                                                <div className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                                                                <span>Démarrage...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <span>Démarrer</span>
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                                {trajet.statut === 'EN_COURS' && (
                                                    <button
                                                        onClick={() => handleFinishClick(trajet)}
                                                        disabled={updating === trajet._id}
                                                        className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                    >
                                                        {updating === trajet._id ? (
                                                            <>
                                                                <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                                                <span>En cours...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <span>Terminer</span>
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                                
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
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            <span>PDF</span>
                                                        </>
                                                    )}
                                                </button>

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

            {/* Modal pour terminer le trajet */}
            {showFinishModal && selectedTrajet && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="glass-panel p-8 max-w-md w-full mx-4 rounded-2xl">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Terminer le trajet</h3>
                            <p className="text-dark-muted text-sm">
                                {selectedTrajet.lieuDepart} → {selectedTrajet.lieuArrivee}
                            </p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-dark-muted mb-2">
                                    Kilométrage de départ
                                </label>
                                <div className="glass-card p-3 rounded-lg">
                                    <p className="text-white font-semibold">{selectedTrajet.kilometrageDepart} km</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-muted mb-2">
                                    Kilométrage d'arrivée <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={kilometrageArrivee}
                                    onChange={(e) => setKilometrageArrivee(e.target.value)}
                                    min={selectedTrajet.kilometrageDepart + 1}
                                    placeholder="Entrez le kilométrage final"
                                    className="w-full px-4 py-3 glass-card rounded-lg text-white placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                                />
                                {kilometrageArrivee && Number(kilometrageArrivee) <= selectedTrajet.kilometrageDepart && (
                                    <p className="text-red-400 text-xs mt-1">
                                        Le kilométrage doit être supérieur à {selectedTrajet.kilometrageDepart} km
                                    </p>
                                )}
                            </div>

                            {kilometrageArrivee && Number(kilometrageArrivee) > selectedTrajet.kilometrageDepart && (
                                <div className="glass-card p-3 rounded-lg border border-brand-cyan/30">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-dark-muted">Distance parcourue</span>
                                        <span className="text-brand-cyan font-semibold">
                                            {Number(kilometrageArrivee) - selectedTrajet.kilometrageDepart} km
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowFinishModal(false);
                                    setSelectedTrajet(null);
                                    setKilometrageArrivee('');
                                }}
                                disabled={updating === selectedTrajet._id}
                                className="flex-1 px-4 py-3 glass-card text-white rounded-xl font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleFinishTrajet}
                                disabled={updating === selectedTrajet._id || !kilometrageArrivee || Number(kilometrageArrivee) <= selectedTrajet.kilometrageDepart}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {updating === selectedTrajet._id ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Finalisation...</span>
                                    </>
                                ) : (
                                    'Terminer le trajet'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MesTrajets;
