import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPneus, createPneu, updatePneu, deletePneu } from '../../../features/pneus/pneusSlice';
import { fetchCamions } from '../../../features/camions/camionsSlice';
import PneuModal from '../../../components/modals/PneuModal';
import '../../admin/AdminDashboard.css';

const Pneus = () => {
    const dispatch = useDispatch();
    const { pneus, loading } = useSelector((state) => state.pneus);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPneu, setSelectedPneu] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [pneuToDelete, setPneuToDelete] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        dispatch(fetchPneus());
        dispatch(fetchCamions());
    }, [dispatch]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSubmit = async (pneuData) => {
        try {
            if (selectedPneu) {
                await dispatch(updatePneu({ 
                    id: selectedPneu._id, 
                    data: pneuData 
                })).unwrap();
                showNotification('Pneu modifié avec succès');
            } else {
                await dispatch(createPneu(pneuData)).unwrap();
                showNotification('Pneu ajouté avec succès');
            }
            setIsModalOpen(false);
            setSelectedPneu(null);
        } catch (err) {
            showNotification(err || 'Une erreur est survenue', 'error');
        }
    };

    const handleEdit = (pneu) => {
        setSelectedPneu(pneu);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (pneu) => {
        setPneuToDelete(pneu);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        try {
            await dispatch(deletePneu(pneuToDelete._id)).unwrap();
            showNotification('Pneu supprimé avec succès');
            setShowDeleteConfirm(false);
            setPneuToDelete(null);
        } catch (err) {
            showNotification(err || 'Erreur lors de la suppression', 'error');
        }
    };

    const handleAddNew = () => {
        setSelectedPneu(null);
        setIsModalOpen(true);
    };

    const getPositionLabel = (position) => {
        const labels = {
            'AVANT_GAUCHE': 'Avant Gauche',
            'AVANT_DROIT': 'Avant Droit',
            'ARRIERE_GAUCHE': 'Arrière Gauche',
            'ARRIERE_DROIT': 'Arrière Droit',
            'ROUE_SECOURS': 'Roue Secours'
        };
        return labels[position] || position;
    };

    const getUsureColor = (usure) => {
        if (usure >= 70) return 'bg-red-500/20 text-red-400';
        if (usure >= 40) return 'bg-yellow-500/20 text-yellow-400';
        return 'bg-green-500/20 text-green-400';
    };

    const totalPneus = pneus.length;
    const bonEtat = pneus.filter(p => p.usurePourcentage < 40).length;
    const aSurveiller = pneus.filter(p => p.usurePourcentage >= 40 && p.usurePourcentage < 70).length;
    const critique = pneus.filter(p => p.usurePourcentage >= 70).length;

    return (
        <div className="p-8">
            {notification && (
                <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
                    notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                } text-white`}>
                    {notification.message}
                </div>
            )}

            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Gestion des Pneus</h1>
                    <p className="text-dark-muted">Suivez l'état de tous les pneus de la flotte</p>
                </div>
                <button 
                    onClick={handleAddNew}
                    className="px-6 py-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                >
                    + Nouveau Pneu
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="cyan-card rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-cyan-500/20">
                    <div>
                        <p className="text-white/80 text-sm mb-2">Total Pneus</p>
                        <p className="text-4xl font-bold text-white">{totalPneus}</p>
                    </div>
                    <div className="bg-white/10 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9" strokeWidth="2"/>
                            <circle cx="12" cy="12" r="4" strokeWidth="2"/>
                        </svg>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    <div className="relative z-10">
                        <p className="text-dark-muted text-sm mb-2">Bon État</p>
                        <p className="text-4xl font-bold text-white">{bonEtat}</p>
                    </div>
                    <div className="relative z-10 bg-green-500/10 p-3 rounded-lg">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    <div className="relative z-10">
                        <p className="text-dark-muted text-sm mb-2">À Surveiller</p>
                        <p className="text-4xl font-bold text-white">{aSurveiller}</p>
                    </div>
                    <div className="relative z-10 bg-yellow-500/10 p-3 rounded-lg">
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v4m0 4h.01" />
                        </svg>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    <div className="relative z-10">
                        <p className="text-dark-muted text-sm mb-2">Critique</p>
                        <p className="text-4xl font-bold text-white">{critique}</p>
                    </div>
                    <div className="relative z-10 bg-red-500/10 p-3 rounded-lg">
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="glass-panel p-8 rounded-xl text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-cyan border-t-transparent"></div>
                    <p className="text-dark-muted mt-4">Chargement...</p>
                </div>
            ) : pneus.length === 0 ? (
                <div className="glass-panel p-12 rounded-xl text-center">
                    <svg className="w-12 h-12 mx-auto text-dark-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="9" strokeWidth="2"/>
                        <circle cx="12" cy="12" r="4" strokeWidth="2"/>
                    </svg>
                    <h3 className="text-xl font-semibold text-white mb-2">Aucun pneu</h3>
                    <p className="text-dark-muted mb-6">Commencez par ajouter votre premier pneu</p>
                    <button 
                        onClick={handleAddNew}
                        className="px-6 py-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                    >
                        + Ajouter un pneu
                    </button>
                </div>
            ) : (
                <div className="glass-panel p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#2d2b45]">
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">ID</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Camion</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Position</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Marque / Modèle</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Date Installation</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Kilométrage</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Usure</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2d2b45]">
                                {pneus.map((pneu, index) => (
                                    <tr key={pneu._id} className="hover:bg-[#1e1c36] transition-colors">
                                        <td className="py-4 px-4 text-dark-muted">{index + 1}</td>
                                        <td className="py-4 px-4 text-white font-medium">
                                            {pneu.camion?.matricule || 'N/A'}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                                                {getPositionLabel(pneu.position)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="text-white font-medium">{pneu.camion?.marque || '-'}</div>
                                            <div className="text-dark-muted text-xs">{pneu.camion?.modele || '-'}</div>
                                        </td>
                                        <td className="py-4 px-4 text-dark-muted">
                                            {pneu.dateInstallation ? new Date(pneu.dateInstallation).toLocaleDateString('fr-FR') : '-'}
                                        </td>
                                        <td className="py-4 px-4 text-dark-muted">
                                            {pneu.camion?.kilometrage?.toLocaleString() || '-'}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUsureColor(pneu.usurePourcentage)}`}>
                                                {pneu.usurePourcentage}%
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleEdit(pneu)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Modifier"
                                                >
                                                    <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(pneu)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <PneuModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedPneu(null);
                }}
                onSubmit={handleSubmit}
                pneu={selectedPneu}
                loading={loading}
            />

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="glass-panel p-8 max-w-md w-full mx-4 rounded-2xl">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Confirmer la suppression</h3>
                            <p className="text-dark-muted mb-6">
                                Êtes-vous sûr de vouloir supprimer le pneu en position <span className="font-semibold text-white">{getPositionLabel(pneuToDelete?.position)}</span> du camion <span className="font-semibold text-white">{pneuToDelete?.camion?.matricule}</span> ?
                                Cette action est irréversible.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setPneuToDelete(null);
                                    }}
                                    className="flex-1 px-4 py-3 glass-card text-white rounded-xl font-medium hover:bg-white/10 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-red-500/50 transition-all"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pneus;
