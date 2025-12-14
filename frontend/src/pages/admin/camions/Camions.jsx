import React, { useState } from 'react';
import '../../admin/AdminDashboard.css';

const Camions = () => {
    const [camions] = useState([
        {
            id: 1,
            matricule: 'ABC-123',
            marque: 'Mercedes',
            modele: 'Actros',
            annee: 2020,
            statut: 'DISPONIBLE',
            kilometrage: 145000
        },
        {
            id: 2,
            matricule: 'DEF-456',
            marque: 'Volvo',
            modele: 'FH16',
            annee: 2019,
            statut: 'EN_MISSION',
            kilometrage: 198000
        },
        {
            id: 3,
            matricule: 'GHI-789',
            marque: 'Scania',
            modele: 'R500',
            annee: 2021,
            statut: 'MAINTENANCE',
            kilometrage: 87000
        }
    ]);

    const getStatusColor = (statut) => {
        switch (statut) {
            case 'DISPONIBLE': return 'bg-green-500';
            case 'EN_MISSION': return 'bg-blue-500';
            case 'EN_TRAJET': return 'bg-yellow-500';
            case 'MAINTENANCE': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    const getStatusText = (statut) => {
        switch (statut) {
            case 'DISPONIBLE': return 'Disponible';
            case 'EN_MISSION': return 'En mission';
            case 'EN_TRAJET': return 'En trajet';
            case 'MAINTENANCE': return 'Maintenance';
            default: return statut;
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
                <button className="px-6 py-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                    + Nouveau Camion
                </button>
            </div>

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
                            <span className="text-2xl font-bold text-white">18</span>
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
                            <span className="text-2xl font-bold text-white">12</span>
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
                            <span className="text-2xl font-bold text-white">4</span>
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
                            <span className="text-2xl font-bold text-white">2</span>
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
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">ID</th>
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Matricule</th>
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Marque</th>
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Modèle</th>
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Année</th>
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Kilométrage</th>
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Statut</th>
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {camions.map((camion) => (
                                <tr key={camion.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-4 text-white">#{camion.id}</td>
                                    <td className="py-4 px-4 text-white font-medium">{camion.matricule}</td>
                                    <td className="py-4 px-4 text-white">{camion.marque}</td>
                                    <td className="py-4 px-4 text-dark-muted">{camion.modele}</td>
                                    <td className="py-4 px-4 text-dark-muted">{camion.annee}</td>
                                    <td className="py-4 px-4 text-dark-muted">{camion.kilometrage.toLocaleString()} km</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(camion.statut)} text-white`}>
                                            {getStatusText(camion.statut)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex gap-2">
                                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
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
        </div>
    );
};

export default Camions;
