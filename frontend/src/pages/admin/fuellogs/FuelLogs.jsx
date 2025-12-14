import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFuelLogs, createFuelLog, updateFuelLog, deleteFuelLog } from '../../../features/fuelLogs/fuelLogsSlice';
import { fetchTrajets } from '../../../features/trajets/trajetsSlice';
import FuelLogModal from '../../../components/modals/FuelLogModal';
import '../../admin/AdminDashboard.css';

const FuelLogs = () => {
    const dispatch = useDispatch();
    const { fuelLogs, loading, error } = useSelector((state) => state.fuelLogs);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFuelLog, setSelectedFuelLog] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [fuelLogToDelete, setFuelLogToDelete] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        dispatch(fetchFuelLogs());
        dispatch(fetchTrajets());
    }, [dispatch]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSubmit = async (fuelLogData) => {
        try {
            if (selectedFuelLog) {
                await dispatch(updateFuelLog({ 
                    id: selectedFuelLog._id, 
                    data: fuelLogData 
                })).unwrap();
                showNotification('Log carburant modifié avec succès');
            } else {
                await dispatch(createFuelLog(fuelLogData)).unwrap();
                showNotification('Log carburant ajouté avec succès');
            }
            setIsModalOpen(false);
            setSelectedFuelLog(null);
        } catch (err) {
            showNotification(err || 'Une erreur est survenue', 'error');
        }
    };

    const handleEdit = (fuelLog) => {
        setSelectedFuelLog(fuelLog);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (fuelLog) => {
        setFuelLogToDelete(fuelLog);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteFuelLog(fuelLogToDelete._id)).unwrap();
            showNotification('Log carburant supprimé avec succès');
            setShowDeleteConfirm(false);
            setFuelLogToDelete(null);
        } catch (err) {
            showNotification(err || 'Erreur lors de la suppression', 'error');
        }
    };

    const handleAddNew = () => {
        setSelectedFuelLog(null);
        setIsModalOpen(true);
    };

    const totalLogs = fuelLogs.length;
    const totalVolume = fuelLogs.reduce((sum, log) => sum + (log.volumeLitres || 0), 0);
    const totalCost = fuelLogs.reduce((sum, log) => sum + (log.prixTotal || 0), 0);
    const avgPricePerLitre = totalVolume > 0 ? (totalCost / totalVolume).toFixed(2) : 0;

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
                    <h1 className="text-3xl font-bold text-white mb-2">Gestion du Carburant</h1>
                    <p className="text-dark-muted">Suivez toutes les consommations de carburant</p>
                </div>
                <button 
                    onClick={handleAddNew}
                    className="px-6 py-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                >
                    + Nouveau Plein
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Card 1 - Total Logs */}
                <div className="cyan-card rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-cyan-500/20 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">{totalLogs}</span>
                            <span className="text-xs font-medium text-white/80 uppercase">Pleins</span>
                        </div>
                    </div>
                </div>

                {/* Card 2 - Total Volume */}
                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    </div>
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">{totalVolume.toFixed(0)}L</span>
                            <span className="text-xs font-medium text-dark-muted uppercase">Volume</span>
                        </div>
                    </div>
                </div>

                {/* Card 3 - Total Cost */}
                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">{totalCost.toFixed(2)}</span>
                            <span className="text-xs font-medium text-dark-muted uppercase">DH</span>
                        </div>
                    </div>
                </div>

                {/* Card 4 - Avg Price/Litre */}
                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">{avgPricePerLitre}</span>
                            <span className="text-xs font-medium text-dark-muted uppercase">DH/L</span>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="glass-card p-8 rounded-xl border border-white/10 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-cyan border-t-transparent"></div>
                    <p className="text-dark-muted mt-4">Chargement...</p>
                </div>
            ) : fuelLogs.length === 0 ? (
                <div className="glass-card p-12 rounded-xl border border-white/10 text-center">
                    <svg className="w-16 h-16 mx-auto text-dark-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-white mb-2">Aucun log de carburant</h3>
                    <p className="text-dark-muted mb-6">Commencez par ajouter votre premier plein de carburant</p>
                    <button 
                        onClick={handleAddNew}
                        className="px-6 py-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                    >
                        + Ajouter un plein
                    </button>
                </div>
            ) : (
                <div className="glass-card p-6 rounded-xl border border-white/10">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">ID</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Trajet</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Volume (L)</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Prix/L</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Total (DH)</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Date</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Station</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fuelLogs.map((log, index) => (
                                    <tr key={log._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4 text-dark-muted">{index + 1}</td>
                                        <td className="py-4 px-4 text-white">
                                            {log.trajet?.lieuDepart && log.trajet?.lieuArrivee 
                                                ? `${log.trajet.lieuDepart} → ${log.trajet.lieuArrivee}`
                                                : '-'}
                                        </td>
                                        <td className="py-4 px-4 text-white">{log.volumeLitres?.toFixed(2) || '0.00'}</td>
                                        <td className="py-4 px-4 text-dark-muted">{log.prixParLitre?.toFixed(2) || '0.00'}</td>
                                        <td className="py-4 px-4 text-white font-semibold">{log.prixTotal?.toFixed(2) || '0.00'}</td>
                                        <td className="py-4 px-4 text-dark-muted">
                                            {log.date ? new Date(log.date).toLocaleDateString('fr-FR', { 
                                                year: 'numeric', 
                                                month: 'short', 
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : '-'}
                                        </td>
                                        <td className="py-4 px-4 text-dark-muted">{log.lieuStation || '-'}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleEdit(log)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Modifier"
                                                >
                                                    <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(log)}
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

            <FuelLogModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedFuelLog(null);
                }}
                onSubmit={handleSubmit}
                fuelLog={selectedFuelLog}
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
                                Êtes-vous sûr de vouloir supprimer ce log de carburant de <span className="font-semibold text-white">{fuelLogToDelete?.volumeLitres?.toFixed(2)} litres</span> ?
                                Cette action est irréversible.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setFuelLogToDelete(null);
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

export default FuelLogs;
