import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fuelLogsService, trajetsService } from '../../services/api';

const MesFuelLogs = () => {
    const { user } = useSelector((state) => state.auth);
    const [fuelLogs, setFuelLogs] = useState([]);
    const [mesTrajets, setMesTrajets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [notification, setNotification] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        trajet: '',
        volumeLitres: '',
        prixTotal: '',
        lieuStation: '',
        date: new Date().toISOString().split('T')[0],
        remarques: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Récupérer mes trajets
            const trajetsResponse = await trajetsService.getMesTrajets();
            setMesTrajets(trajetsResponse.data || []);

            // Récupérer tous les fuel logs et filtrer ceux de mes trajets
            const fuelLogsResponse = await fuelLogsService.getAll();
            const allFuelLogs = fuelLogsResponse.data || [];
            
            // Filtrer les fuel logs pour ne garder que ceux de mes trajets
            const trajetIds = (trajetsResponse.data || []).map(t => t._id);
            const myFuelLogs = allFuelLogs.filter(log => 
                trajetIds.includes(log.trajet?._id)
            );
            
            setFuelLogs(myFuelLogs);
        } catch (error) {
            console.error('Erreur chargement:', error);
            showNotification('Erreur lors du chargement des données', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.trajet || !formData.volumeLitres || !formData.prixTotal) {
            showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }

        try {
            setSubmitting(true);
            await fuelLogsService.create({
                trajet: formData.trajet,
                volumeLitres: Number(formData.volumeLitres),
                prixTotal: Number(formData.prixTotal),
                date: formData.date,
                lieuStation: formData.lieuStation,
                remarques: formData.remarques
            });

            showNotification('Ravitaillement enregistré avec succès !', 'success');
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error('Erreur création:', error);
            showNotification(error.response?.data?.message || 'Erreur lors de l\'enregistrement', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            trajet: '',
            volumeLitres: '',
            prixTotal: '',
            lieuStation: '',
            date: new Date().toISOString().split('T')[0],
            remarques: ''
        });
    };

    // Calculer les statistiques
    const totalLitres = fuelLogs.reduce((sum, log) => sum + (log.volumeLitres || 0), 0);
    const totalCout = fuelLogs.reduce((sum, log) => sum + (log.prixTotal || 0), 0);
    const prixMoyenParLitre = totalLitres > 0 ? (totalCout / totalLitres).toFixed(2) : 0;

    // Filtrer les trajets en cours ou terminés pour le formulaire
    const trajetsDisponibles = mesTrajets.filter(t => 
        t.statut === 'EN_COURS' || t.statut === 'TERMINE'
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-cyan/30 border-t-brand-cyan rounded-full animate-spin"></div>
                    <p className="text-gray-400">Chargement des données...</p>
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
                    <h1 className="text-3xl font-bold text-white mb-2">Mes Ravitaillements</h1>
                    <p className="text-gray-400">Gérez vos ravitaillements en carburant</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-brand-cyan to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Nouveau Ravitaillement
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Litres - Cyan Card */}
                <div className="cyan-card rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-cyan-500/20 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">{totalLitres.toFixed(1)}</span>
                            <span className="text-xs font-medium text-white/80 uppercase">Litres</span>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <svg className="w-12 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 10c5 0 8-5 12-5s7 10 12 10 8-8 12-8 8 5 10 5"/></svg>
                            <span className="text-xs font-bold text-white flex items-center bg-white/20 px-1.5 py-0.5 rounded backdrop-blur-sm">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                Total
                            </span>
                        </div>
                    </div>
                </div>

                {/* Coût Total - Glass Card */}
                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                        <svg className="w-6 h-6 text-brand-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">{totalCout.toFixed(2)}</span>
                            <span className="text-xs font-medium text-dark-muted uppercase">DH</span>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <svg className="w-12 h-5 text-brand-pink/50" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 15c5 0 8-10 12-10s7 15 12 15 8-12 12-12 8 8 10 8"/></svg>
                            <span className="text-xs font-bold text-yellow-400 flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01"/></svg>
                                Coût
                            </span>
                        </div>
                    </div>
                </div>

                {/* Prix Moyen - Glass Card */}
                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                        <svg className="w-6 h-6 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">{prixMoyenParLitre}</span>
                            <span className="text-xs font-medium text-dark-muted uppercase">DH/L</span>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <svg className="w-12 h-5 text-brand-cyan/50" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12c5 0 8-8 12-8s7 12 12 12 8-10 12-10 8 6 10 6"/></svg>
                            <span className="text-xs font-bold text-brand-cyan flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                Moyenne
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fuel Logs List */}
            <div className="glass-panel p-6">
                {fuelLogs.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-cyan/20 to-blue-600/20 flex items-center justify-center mx-auto mb-6 border border-brand-cyan/30">
                            <svg className="w-10 h-10 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Aucun ravitaillement</h3>
                        <p className="text-dark-muted">Commencez par ajouter votre premier ravitaillement</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#2d2b45]">
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Date</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Trajet</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Station</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Volume</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Prix/L</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Prix Total</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Remarques</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2d2b45]">
                                {fuelLogs.map((log) => (
                                    <tr key={log._id} className="hover:bg-[#1e1c36] transition-colors">
                                        <td className="py-4 px-4 text-dark-muted">
                                            {new Date(log.date).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="text-white font-medium">
                                                {log.trajet?.lieuDepart} → {log.trajet?.lieuArrivee}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-dark-muted">
                                            {log.lieuStation || '-'}
                                        </td>
                                        <td className="py-4 px-4 text-white font-medium">
                                            {log.volumeLitres} L
                                        </td>
                                        <td className="py-4 px-4 text-brand-cyan font-medium">
                                            {log.prixParLitre?.toFixed(2) || (log.prixTotal / log.volumeLitres).toFixed(2)} DH
                                        </td>
                                        <td className="py-4 px-4 text-white font-bold">
                                            {log.prixTotal.toFixed(2)} DH
                                        </td>
                                        <td className="py-4 px-4 text-dark-muted text-sm">
                                            {log.remarques || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Ajout Ravitaillement */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass-panel p-8 max-w-2xl w-full mx-4 rounded-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white">Nouveau Ravitaillement</h3>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Trajet */}
                                <div>
                                    <label className="block text-sm font-medium text-dark-muted mb-2">
                                        Trajet <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        name="trajet"
                                        value={formData.trajet}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 glass-card rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                                    >
                                        <option value="">Sélectionner un trajet</option>
                                        {trajetsDisponibles.map(trajet => (
                                            <option key={trajet._id} value={trajet._id}>
                                                {trajet.lieuDepart} → {trajet.lieuArrivee} ({trajet.camion?.matricule})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date */}
                                <div>
                                    <label className="block text-sm font-medium text-dark-muted mb-2">
                                        Date <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        required
                                        max={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-3 glass-card rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                                    />
                                </div>

                                {/* Volume */}
                                <div>
                                    <label className="block text-sm font-medium text-dark-muted mb-2">
                                        Volume (Litres) <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="volumeLitres"
                                        value={formData.volumeLitres}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        placeholder="Ex: 150.5"
                                        className="w-full px-4 py-3 glass-card rounded-lg text-white placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                                    />
                                </div>

                                {/* Prix Total */}
                                <div>
                                    <label className="block text-sm font-medium text-dark-muted mb-2">
                                        Prix Total (DH) <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="prixTotal"
                                        value={formData.prixTotal}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        placeholder="Ex: 1500.00"
                                        className="w-full px-4 py-3 glass-card rounded-lg text-white placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                                    />
                                </div>

                                {/* Station */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-dark-muted mb-2">
                                        Lieu de la Station
                                    </label>
                                    <input
                                        type="text"
                                        name="lieuStation"
                                        value={formData.lieuStation}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Station Total Casablanca"
                                        className="w-full px-4 py-3 glass-card rounded-lg text-white placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                                    />
                                </div>

                                {/* Remarques */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-dark-muted mb-2">
                                        Remarques
                                    </label>
                                    <textarea
                                        name="remarques"
                                        value={formData.remarques}
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="Remarques ou notes supplémentaires..."
                                        maxLength="500"
                                        className="w-full px-4 py-3 glass-card rounded-lg text-white placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 resize-none"
                                    />
                                </div>

                                {/* Prix par litre calculé */}
                                {formData.volumeLitres && formData.prixTotal && (
                                    <div className="md:col-span-2">
                                        <div className="glass-card p-4 rounded-lg border border-brand-cyan/30">
                                            <div className="flex items-center justify-between">
                                                <span className="text-dark-muted">Prix par litre calculé:</span>
                                                <span className="text-brand-cyan font-bold text-lg">
                                                    {(Number(formData.prixTotal) / Number(formData.volumeLitres)).toFixed(2)} DH/L
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    disabled={submitting}
                                    className="flex-1 px-4 py-3 glass-card text-white rounded-xl font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-brand-cyan to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Enregistrement...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                            </svg>
                                            Enregistrer
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MesFuelLogs;
