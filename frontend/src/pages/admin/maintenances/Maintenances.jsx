import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMaintenances, createMaintenance, updateMaintenance, deleteMaintenance, demarrerMaintenance, terminerMaintenance } from '../../../features/maintenances/maintenancesSlice';
import { fetchCamions } from '../../../features/camions/camionsSlice';
import { fetchPneus } from '../../../features/pneus/pneusSlice';
import MaintenanceModal from '../../../components/modals/MaintenanceModal';
import '../../admin/AdminDashboard.css';

const Maintenances = () => {
    const dispatch = useDispatch();
    const { maintenances, loading, error } = useSelector((state) => state.maintenances);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMaintenance, setSelectedMaintenance] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [maintenanceToDelete, setMaintenanceToDelete] = useState(null);
    const [notification, setNotification] = useState(null);

    const getTypeLabel = (type) => {
        const labels = {
            'VIDANGE': 'Vidange',
            'PNEU': 'Pneu',
            'REVISION': 'Révision',
            'FREIN': 'Frein',
            'TRANSMISSION': 'Transmission',
            'SUSPENSION': 'Suspension',
            'CLIMATISATION': 'Climatisation',
            'ELECTRICITE': 'Électricité',
            'CARROSSERIE': 'Carrosserie',
            'AUTRE': 'Autre'
        };
        return labels[type] || type;
    };

    const getStatusColor = (statut) => {
        switch (statut) {
            case 'PLANIFIEE':
                return 'bg-blue-500/20 border border-blue-500/50';
            case 'EN_COURS':
                return 'bg-yellow-500/20 border border-yellow-500/50';
            case 'TERMINEE':
                return 'bg-green-500/20 border border-green-500/50';
            case 'ANNULEE':
                return 'bg-red-500/20 border border-red-500/50';
            default:
                return 'bg-gray-500/20 border border-gray-500/50';
        }
    };

    const getStatusText = (statut) => {
        switch (statut) {
            case 'PLANIFIEE': return 'Planifiée';
            case 'EN_COURS': return 'En cours';
            case 'TERMINEE': return 'Terminée';
            case 'ANNULEE': return 'Annulée';
            default: return statut;
        }
    };

    useEffect(() => {
        dispatch(fetchMaintenances());
        dispatch(fetchCamions());
        dispatch(fetchPneus());
    }, [dispatch]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSubmit = async (maintenanceData) => {
        try {
            if (selectedMaintenance) {
                await dispatch(updateMaintenance({ 
                    id: selectedMaintenance._id, 
                    data: maintenanceData 
                })).unwrap();
                showNotification('Maintenance modifiée avec succès');
            } else {
                await dispatch(createMaintenance(maintenanceData)).unwrap();
                showNotification('Maintenance ajoutée avec succès');
            }
            setIsModalOpen(false);
            setSelectedMaintenance(null);
        } catch (err) {
            showNotification(err || 'Une erreur est survenue', 'error');
        }
    };

    const handleEdit = (maintenance) => {
        setSelectedMaintenance(maintenance);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (maintenance) => {
        setMaintenanceToDelete(maintenance);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteMaintenance(maintenanceToDelete._id)).unwrap();
            showNotification('Maintenance supprimée avec succès');
            setShowDeleteConfirm(false);
            setMaintenanceToDelete(null);
        } catch (err) {
            showNotification(err || 'Erreur lors de la suppression', 'error');
        }
    };

    const handleDemarrer = async (maintenanceId) => {
        try {
            await dispatch(demarrerMaintenance(maintenanceId)).unwrap();
            showNotification('Maintenance démarrée avec succès');
        } catch (err) {
            showNotification(err || 'Erreur lors du démarrage', 'error');
        }
    };

    const handleTerminer = async (maintenanceId) => {
        try {
            await dispatch(terminerMaintenance(maintenanceId)).unwrap();
            showNotification('Maintenance terminée avec succès');
        } catch (err) {
            showNotification(err || 'Erreur lors de la finalisation', 'error');
        }
    };

    const handleAddNew = () => {
        setSelectedMaintenance(null);
        setIsModalOpen(true);
    };

    const totalMaintenances = maintenances.length;
    const planifiees = maintenances.filter(m => m.statut === 'PLANIFIEE').length;
    const enCours = maintenances.filter(m => m.statut === 'EN_COURS').length;
    const terminees = maintenances.filter(m => m.statut === 'TERMINEE').length;
    const totalCost = maintenances.reduce((sum, m) => sum + (m.cout || 0), 0);

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
                    <h1 className="text-3xl font-bold text-white mb-2">Gestion des Maintenances</h1>
                    <p className="text-dark-muted">Planifiez et suivez toutes les maintenances</p>
                </div>
                <button 
                    onClick={handleAddNew}
                    className="px-6 py-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                >
                    + Nouvelle Maintenance
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Card 1 - Total */}
                <div className="cyan-card rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-cyan-500/20 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">{totalMaintenances}</span>
                            <span className="text-xs font-medium text-white/80 uppercase">Total</span>
                        </div>
                    </div>
                </div>

                {/* Card 2 - Planifiées */}
                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">{planifiees}</span>
                            <span className="text-xs font-medium text-dark-muted uppercase">Planifiées</span>
                        </div>
                    </div>
                </div>

                {/* Card 3 - En Cours */}
                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">{enCours}</span>
                            <span className="text-xs font-medium text-dark-muted uppercase">En cours</span>
                        </div>
                    </div>
                </div>

                {/* Card 4 - Terminées */}
                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">{terminees}</span>
                            <span className="text-xs font-medium text-dark-muted uppercase">Terminées</span>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="glass-card p-8 rounded-xl border border-white/10 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-cyan border-t-transparent"></div>
                    <p className="text-dark-muted mt-4">Chargement...</p>
                </div>
            ) : maintenances.length === 0 ? (
                <div className="glass-card p-12 rounded-xl border border-white/10 text-center">
                    <svg className="w-16 h-16 mx-auto text-dark-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-white mb-2">Aucune maintenance</h3>
                    <p className="text-dark-muted mb-6">Commencez par ajouter votre première maintenance</p>
                    <button 
                        onClick={handleAddNew}
                        className="px-6 py-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                    >
                        + Ajouter une maintenance
                    </button>
                </div>
            ) : (
                <div className="glass-card p-6 rounded-xl border border-white/10">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">ID</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Type</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Véhicule</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Description</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Date</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Coût</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Statut</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {maintenances.map((maintenance, index) => (
                                    <tr key={maintenance._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4 text-dark-muted">{index + 1}</td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                                                {getTypeLabel(maintenance.type)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-white">
                                            {maintenance.camion?.matricule || maintenance.pneu?.marque || '-'}
                                        </td>
                                        <td className="py-4 px-4 text-dark-muted max-w-xs truncate">
                                            {maintenance.description}
                                        </td>
                                        <td className="py-4 px-4 text-dark-muted">
                                            {maintenance.date ? new Date(maintenance.date).toLocaleDateString('fr-FR') : '-'}
                                        </td>
                                        <td className="py-4 px-4 text-white font-semibold">
                                            {maintenance.cout?.toFixed(2) || '0.00'} DH
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(maintenance.statut)} text-white`}>
                                                {getStatusText(maintenance.statut)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex gap-2">
                                                {maintenance.statut === 'PLANIFIEE' && (
                                                    <button 
                                                        onClick={() => handleDemarrer(maintenance._id)}
                                                        className="p-2 hover:bg-green-500/20 rounded-lg transition-colors group"
                                                        title="Démarrer"
                                                    >
                                                        <svg className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </button>
                                                )}
                                                {maintenance.statut === 'EN_COURS' && (
                                                    <button 
                                                        onClick={() => handleTerminer(maintenance._id)}
                                                        className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors group"
                                                        title="Terminer"
                                                    >
                                                        <svg className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => handleEdit(maintenance)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Modifier"
                                                >
                                                    <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(maintenance)}
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

            <MaintenanceModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedMaintenance(null);
                }}
                onSubmit={handleSubmit}
                maintenance={selectedMaintenance}
                loading={loading}
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
                                Êtes-vous sûr de vouloir supprimer cette maintenance <span className="font-semibold text-white">{getTypeLabel(maintenanceToDelete?.type)}</span> ?
                                Cette action est irréversible.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setMaintenanceToDelete(null);
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

export default Maintenances;
