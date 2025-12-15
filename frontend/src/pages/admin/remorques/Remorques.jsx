import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRemorques, createRemorque, updateRemorque, deleteRemorque } from '../../../features/remorques/remorquesSlice';
import RemorqueModal from '../../../components/modals/RemorqueModal';
import '../../admin/AdminDashboard.css';

const Remorques = () => {
    const dispatch = useDispatch();
    const { remorques, loading, error } = useSelector((state) => state.remorques);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRemorque, setSelectedRemorque] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [remorqueToDelete, setRemorqueToDelete] = useState(null);
    const [notification, setNotification] = useState(null);
    const [modalError, setModalError] = useState(null);

    useEffect(() => {
        dispatch(fetchRemorques());
    }, [dispatch]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSubmit = async (remorqueData) => {
        try {
            setModalError(null);
            if (selectedRemorque) {
                await dispatch(updateRemorque({ 
                    id: selectedRemorque._id, 
                    data: remorqueData 
                })).unwrap();
                showNotification('Remorque modifiée avec succès');
            } else {
                await dispatch(createRemorque(remorqueData)).unwrap();
                showNotification('Remorque ajoutée avec succès');
            }
            setIsModalOpen(false);
            setSelectedRemorque(null);
        } catch (err) {
            setModalError(err || 'Une erreur est survenue');
        }
    };

    const handleEdit = (remorque) => {
        setSelectedRemorque(remorque);
        setModalError(null);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (remorque) => {
        setRemorqueToDelete(remorque);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteRemorque(remorqueToDelete._id)).unwrap();
            showNotification('Remorque supprimée avec succès');
            setShowDeleteConfirm(false);
            setRemorqueToDelete(null);
        } catch (err) {
            showNotification(err || 'Une erreur est survenue', 'error');
        }
    };

    const handleAddNew = () => {
        setSelectedRemorque(null);
        setModalError(null);
        setIsModalOpen(true);
    };

    const getStatusColor = (statut) => {
        switch (statut) {
            case 'DISPONIBLE': return 'bg-green-500';
            case 'EN_MISSION': return 'bg-blue-500';
            case 'EN_TRAJET': return 'bg-yellow-500';
            default: return 'bg-gray-400';
        }
    };

    const getStatusText = (statut) => {
        switch (statut) {
            case 'DISPONIBLE': return 'Disponible';
            case 'EN_MISSION': return 'En mission';
            case 'EN_TRAJET': return 'En trajet';
            default: return statut;
        }
    };

    const totalRemorques = remorques.length;
    const disponibles = remorques.filter(r => r.status === 'DISPONIBLE').length;
    const enMission = remorques.filter(r => r.status === 'EN_MISSION').length;

    return (
        <div className="p-8">
            {notification && (
                <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
                    notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                } text-white`}>
                    {notification.message}
                </div>
            )}

            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Gestion des Remorques</h1>
                    <p className="text-dark-muted">Gérez toutes les remorques de la flotte</p>
                </div>
                <button 
                    onClick={handleAddNew}
                    className="px-6 py-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                >
                    + Nouvelle Remorque
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="cyan-card rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-cyan-500/20 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"/>
                        </svg>
                    </div>
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">{totalRemorques}</span>
                            <span className="text-xs font-medium text-white/80 uppercase">Total</span>
                        </div>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">{disponibles}</span>
                            <span className="text-xs font-medium text-dark-muted uppercase">Disponibles</span>
                        </div>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                        <svg className="w-6 h-6 text-brand-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">{enMission}</span>
                            <span className="text-xs font-medium text-dark-muted uppercase">En Mission</span>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="glass-card p-8 rounded-xl border border-white/10 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-cyan border-t-transparent"></div>
                    <p className="text-dark-muted mt-4">Chargement...</p>
                </div>
            ) : remorques.length === 0 ? (
                <div className="glass-card p-12 rounded-xl border border-white/10 text-center">
                    <svg className="w-16 h-16 mx-auto text-dark-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="text-xl font-semibold text-white mb-2">Aucune remorque</h3>
                    <p className="text-dark-muted mb-6">Commencez par ajouter votre première remorque</p>
                    <button 
                        onClick={handleAddNew}
                        className="px-6 py-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                    >
                        + Ajouter une remorque
                    </button>
                </div>
            ) : (
                <div className="glass-card p-6 rounded-xl border border-white/10">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">ID</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Matricule</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Type</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Capacité</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Statut</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Actions</th>
                                </tr>
                        </thead>
                        <tbody>
                            {remorques.map((remorque, index) => (
                                <tr key={remorque._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-4 text-dark-muted">{index + 1}</td>
                                    <td className="py-4 px-4 text-white font-medium">{remorque.matricule}</td>
                                    <td className="py-4 px-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                            {remorque.type}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-white">{remorque.capacite} t</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(remorque.status)} text-white`}>
                                            {getStatusText(remorque.status)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleEdit(remorque)}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                title="Modifier"
                                            >
                                                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteClick(remorque)}
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

            <RemorqueModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedRemorque(null);
                    setModalError(null);
                }}
                onSubmit={handleSubmit}
                remorque={selectedRemorque}
                loading={loading}
                error={modalError}
            />

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#252140]/95 backdrop-blur-2xl rounded-3xl p-8 max-w-md w-full mx-4 border border-white/10">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Confirmer la suppression</h3>
                            <p className="text-gray-400 mb-6">
                                Êtes-vous sûr de vouloir supprimer la remorque <span className="font-semibold text-white">{remorqueToDelete?.matricule}</span> ?
                                Cette action est irréversible.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setRemorqueToDelete(null);
                                    }}
                                    className="flex-1 px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl font-medium hover:bg-[#1a1633]/80 transition-colors border border-white/10"
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

export default Remorques;
