import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrajets, createTrajet, updateTrajet, deleteTrajet } from '../../../features/trajets/trajetsSlice';
import { fetchUsers } from '../../../features/users/usersSlice';
import { fetchCamions } from '../../../features/camions/camionsSlice';
import { fetchRemorques } from '../../../features/remorques/remorquesSlice';
import TrajetModal from '../../../components/modals/TrajetModal';
import '../../admin/AdminDashboard.css';

const Trajets = () => {
    const dispatch = useDispatch();
    const { trajets, loading, error } = useSelector((state) => state.trajets);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrajet, setSelectedTrajet] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [trajetToDelete, setTrajetToDelete] = useState(null);
    const [notification, setNotification] = useState(null);
    const [modalError, setModalError] = useState(null);

    const getStatusColor = (statut) => {
        switch (statut) {
            case 'PLANIFIE':
                return 'bg-blue-500/20 border border-blue-500/50';
            case 'EN_COURS':
                return 'bg-yellow-500/20 border border-yellow-500/50';
            case 'TERMINE':
                return 'bg-green-500/20 border border-green-500/50';
            case 'ANNULE':
                return 'bg-red-500/20 border border-red-500/50';
            default:
                return 'bg-gray-500/20 border border-gray-500/50';
        }
    };

    const getStatusText = (statut) => {
        switch (statut) {
            case 'PLANIFIE':
                return 'Planifié';
            case 'EN_COURS':
                return 'En cours';
            case 'TERMINE':
                return 'Terminé';
            case 'ANNULE':
                return 'Annulé';
            default:
                return statut;
        }
    };

    useEffect(() => {
        dispatch(fetchTrajets());
        dispatch(fetchUsers());
        dispatch(fetchCamions());
        dispatch(fetchRemorques());
    }, [dispatch]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSubmit = async (trajetData) => {
        try {
            setModalError(null);
            if (selectedTrajet) {
                await dispatch(updateTrajet({ 
                    id: selectedTrajet._id, 
                    data: trajetData 
                })).unwrap();
                showNotification('Trajet modifié avec succès');
            } else {
                await dispatch(createTrajet(trajetData)).unwrap();
                showNotification('Trajet ajouté avec succès');
            }
            setIsModalOpen(false);
            setSelectedTrajet(null);
        } catch (err) {
            setModalError(err || 'Une erreur est survenue');
        }
    };

    const handleEdit = (trajet) => {
        setSelectedTrajet(trajet);
        setModalError(null);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (trajet) => {
        setTrajetToDelete(trajet);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteTrajet(trajetToDelete._id)).unwrap();
            showNotification('Trajet supprimé avec succès');
            setShowDeleteConfirm(false);
            setTrajetToDelete(null);
        } catch (err) {
            showNotification(err || 'Une erreur est survenue', 'error');
        }
    };

    const handleAddNew = () => {
        setSelectedTrajet(null);
        setModalError(null);
        setIsModalOpen(true);
    };

    const totalTrajets = trajets.length;
    const enCours = trajets.filter(t => t.statut === 'EN_COURS').length;
    const planifies = trajets.filter(t => t.statut === 'PLANIFIE').length;
    const termines = trajets.filter(t => t.statut === 'TERMINE').length;

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
                    <h1 className="text-3xl font-bold text-white mb-2">Gestion des Trajets</h1>
                    <p className="text-dark-muted">Gérez tous les trajets de la flotte</p>
                </div>
                <button 
                    onClick={handleAddNew}
                    className="px-6 py-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                >
                    + Nouveau Trajet
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Card 1 - Total */}
                <div className="cyan-card rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-cyan-500/20 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                        </svg>
                    </div>
                    
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">{totalTrajets}</span>
                            <span className="text-xs font-medium text-white/80 uppercase">Total</span>
                        </div>
                    </div>
                </div>

                {/* Card 2 - En Cours */}
                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                        <svg className="w-6 h-6 text-brand-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">{enCours}</span>
                            <span className="text-xs font-medium text-dark-muted uppercase">En Cours</span>
                        </div>
                    </div>
                </div>

                {/* Card 3 - Planifiés */}
                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">{planifies}</span>
                            <span className="text-xs font-medium text-dark-muted uppercase">Planifiés</span>
                        </div>
                    </div>
                </div>

                {/* Card 4 - Terminés */}
                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">{termines}</span>
                            <span className="text-xs font-medium text-dark-muted uppercase">Terminés</span>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="glass-card p-8 rounded-xl border border-white/10 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-cyan border-t-transparent"></div>
                    <p className="text-dark-muted mt-4">Chargement...</p>
                </div>
            ) : trajets.length === 0 ? (
                <div className="glass-card p-12 rounded-xl border border-white/10 text-center">
                    <svg className="w-16 h-16 mx-auto text-dark-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <h3 className="text-xl font-semibold text-white mb-2">Aucun trajet</h3>
                    <p className="text-dark-muted mb-6">Commencez par ajouter votre premier trajet</p>
                    <button 
                        onClick={handleAddNew}
                        className="px-6 py-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                    >
                        + Ajouter un trajet
                    </button>
                </div>
            ) : (
                <div className="glass-card p-6 rounded-xl border border-white/10">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">ID</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Départ</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Arrivée</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Camion</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Chauffeur</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Date Départ</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Statut</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trajets.map((trajet, index) => (
                                    <tr key={trajet._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4 text-dark-muted">{index + 1}</td>
                                        <td className="py-4 px-4 text-white">{trajet.lieuDepart}</td>
                                        <td className="py-4 px-4 text-white">{trajet.lieuArrivee}</td>
                                        <td className="py-4 px-4 text-dark-muted">{trajet.camion?.matricule || '-'}</td>
                                        <td className="py-4 px-4 text-dark-muted">{trajet.chauffeur?.fullName || '-'}</td>
                                        <td className="py-4 px-4 text-dark-muted">
                                            {trajet.dateDepart ? new Date(trajet.dateDepart).toLocaleDateString('fr-FR') : '-'}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trajet.statut)} text-white`}>
                                                {getStatusText(trajet.statut)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleEdit(trajet)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Modifier"
                                                >
                                                    <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(trajet)}
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

            <TrajetModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTrajet(null);
                    setModalError(null);
                }}
                onSubmit={handleSubmit}
                trajet={selectedTrajet}
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
                                Êtes-vous sûr de vouloir supprimer le trajet de <span className="font-semibold text-white">{trajetToDelete?.lieuDepart}</span> à <span className="font-semibold text-white">{trajetToDelete?.lieuArrivee}</span> ?
                                Cette action est irréversible.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setTrajetToDelete(null);
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

export default Trajets;
