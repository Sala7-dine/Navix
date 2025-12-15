import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCamions, createCamion, updateCamion, deleteCamion } from '../../../features/camions/camionsSlice';
import CamionModal from '../../../components/modals/CamionModal';
import '../../admin/AdminDashboard.css';

const Camions = () => {
    const dispatch = useDispatch();
    const { camions, loading, error } = useSelector((state) => state.camions);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCamion, setSelectedCamion] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [camionToDelete, setCamionToDelete] = useState(null);
    const [notification, setNotification] = useState(null);
    const [modalError, setModalError] = useState(null);

    // Fetch camions on mount
    useEffect(() => {
        dispatch(fetchCamions());
    }, [dispatch]);

    // Show notification
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Handle create/update submit
    const handleSubmit = async (formData) => {
        try {
            setModalError(null);
            if (selectedCamion) {
                await dispatch(updateCamion({ id: selectedCamion._id, data: formData })).unwrap();
                showNotification('Camion modifié avec succès');
            } else {
                await dispatch(createCamion(formData)).unwrap();
                showNotification('Camion créé avec succès');
            }
            setIsModalOpen(false);
            setSelectedCamion(null);
        } catch (err) {
            setModalError(err.message || err || 'Une erreur est survenue');
        }
    };

    // Handle edit
    const handleEdit = (camion) => {
        setSelectedCamion(camion);
        setModalError(null);
        setIsModalOpen(true);
    };

    // Handle delete confirm
    const handleDeleteClick = (camion) => {
        setCamionToDelete(camion);
        setShowDeleteConfirm(true);
    };

    // Handle delete
    const handleDelete = async () => {
        try {
            await dispatch(deleteCamion(camionToDelete._id)).unwrap();
            showNotification('Camion supprimé avec succès');
            setShowDeleteConfirm(false);
            setCamionToDelete(null);
        } catch (err) {
            showNotification(err.message || 'Erreur lors de la suppression', 'error');
        }
    };

    // Handle add new
    const handleAddNew = () => {
        setSelectedCamion(null);
        setModalError(null);
        setIsModalOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'DISPONIBLE': return 'bg-green-500';
            case 'EN_MISSION': return 'bg-blue-500';
            case 'EN_TRAJET': return 'bg-yellow-500';
            case 'MAINTENANCE': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'DISPONIBLE': return 'Disponible';
            case 'EN_MISSION': return 'En mission';
            case 'EN_TRAJET': return 'En trajet';
            case 'MAINTENANCE': return 'Maintenance';
            default: return status;
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Gestion des Camions</h1>
                    <p className="text-dark-muted">Gérez tous les camions de la flotte</p>
                </div>
                <button 
                    onClick={handleAddNew}
                    className="px-6 py-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                >
                    + Nouveau Camion
                </button>
            </div>

            {/* Notification */}
            {notification && (
                <div className={`mb-6 p-4 rounded-lg ${
                    notification.type === 'success' ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'
                }`}>
                    <p className={notification.type === 'success' ? 'text-green-300' : 'text-red-300'}>
                        {notification.message}
                    </p>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-cyan"></div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50">
                    <p className="text-red-300">{error}</p>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Card 1 - Total */}
                <div className="cyan-card rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-cyan-500/20 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
                        </svg>
                    </div>
                    
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">{camions.length}</span>
                            <span className="text-xs font-medium text-white/80 uppercase">Total</span>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <svg className="w-12 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 10c5 0 8-5 12-5s7 10 12 10 8-8 12-8 8 5 10 5"/></svg>
                            <span className="text-xs font-bold text-white flex items-center bg-white/20 px-1.5 py-0.5 rounded backdrop-blur-sm">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                8.3%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Card 2 - Disponibles */}
                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">
                                {camions.filter(c => c.status === 'DISPONIBLE').length}
                            </span>
                            <span className="text-xs font-medium text-dark-muted uppercase">Disponibles</span>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <svg className="w-12 h-5 text-green-400/50" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12c5 0 8-8 12-8s7 12 12 12 8-10 12-10 8 6 10 6"/></svg>
                            <span className="text-xs font-bold text-green-400 flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                5.2%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Card 3 - En Mission */}
                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                        <svg className="w-6 h-6 text-brand-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">
                                {camions.filter(c => c.status === 'EN_MISSION').length}
                            </span>
                            <span className="text-xs font-medium text-dark-muted uppercase">En Mission</span>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <svg className="w-12 h-5 text-brand-pink/50" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 15c5 0 8-10 12-10s7 15 12 15 8-12 12-12 8 8 10 8"/></svg>
                            <span className="text-xs font-bold text-red-400 flex items-center">
                                <svg className="w-3 h-3 mr-1 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                1.8%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Card 4 - Maintenance */}
                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                        <svg className="w-6 h-6 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">
                                {camions.filter(c => c.status === 'MAINTENANCE').length}
                            </span>
                            <span className="text-xs font-medium text-dark-muted uppercase">Maintenance</span>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <svg className="w-12 h-5 text-brand-cyan/50" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12c5 0 8-8 12-8s7 12 12 12 8-10 12-10 8 6 10 6"/></svg>
                            <span className="text-xs font-bold text-brand-cyan flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                3.1%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="glass-card p-6 rounded-xl border border-white/10">
                {!loading && camions.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-dark-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-dark-muted mb-4">Aucun camion disponible</p>
                        <button 
                            onClick={handleAddNew}
                            className="px-6 py-2 bg-gradient-to-r from-brand-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                        >
                            Ajouter votre premier camion
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">ID</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Matricule</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Marque</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Modèle</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Kilométrage</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Capacité Réservoir</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Status</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Actions</th>
                                </tr>
                        </thead>
                        <tbody>
                            {camions.map((camion, index) => (
                                <tr key={camion._id || index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-4 text-white">#{index + 1}</td>
                                    <td className="py-4 px-4 text-white font-medium">{camion.matricule}</td>
                                    <td className="py-4 px-4 text-white">{camion.marque}</td>
                                    <td className="py-4 px-4 text-dark-muted">{camion.modele}</td>
                                    <td className="py-4 px-4 text-dark-muted">{camion.kilometrageActuel?.toLocaleString() || 0} km</td>
                                    <td className="py-4 px-4 text-dark-muted">{camion.capaciteReservoir || 0} L</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(camion.status)} text-white`}>
                                            {getStatusText(camion.status)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleEdit(camion)}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                title="Modifier"
                                            >
                                                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteClick(camion)}
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
            )}
            </div>

            {/* Modals */}
            <CamionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedCamion(null);
                    setModalError(null);
                }}
                onSubmit={handleSubmit}
                camion={selectedCamion}
                loading={loading}
                error={modalError}
            />

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="glass-card rounded-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Confirmer la suppression</h3>
                                <p className="text-dark-muted text-sm">Cette action est irréversible</p>
                            </div>
                        </div>
                        <p className="text-white mb-6">
                            Êtes-vous sûr de vouloir supprimer le camion <span className="font-bold text-brand-cyan">{camionToDelete?.matricule}</span> ?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setCamionToDelete(null);
                                }}
                                className="flex-1 px-6 py-3 bg-white/5 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                                disabled={loading}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Suppression...' : 'Supprimer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Camions;
