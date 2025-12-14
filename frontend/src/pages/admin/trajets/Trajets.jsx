import React, { useState } from 'react';
import '../../admin/AdminDashboard.css';

const Trajets = () => {
    const [trajets] = useState([
        {
            id: 1,
            reference: 'TRJ-001',
            depart: 'Paris',
            destination: 'Lyon',
            camion: 'ABC-123',
            chauffeur: 'Jean Dupont',
            dateDepart: '2024-12-15',
            statut: 'EN_COURS'
        },
        {
            id: 2,
            reference: 'TRJ-002',
            depart: 'Marseille',
            destination: 'Bordeaux',
            camion: 'DEF-456',
            chauffeur: 'Marie Martin',
            dateDepart: '2024-12-16',
            statut: 'PLANIFIE'
        },
        {
            id: 3,
            reference: 'TRJ-003',
            depart: 'Lille',
            destination: 'Toulouse',
            camion: 'GHI-789',
            chauffeur: 'Pierre Leroy',
            dateDepart: '2024-12-12',
            statut: 'TERMINE'
        }
    ]);

    const getStatusColor = (statut) => {
        switch (statut) {
            case 'PLANIFIE': return 'bg-purple-500';
            case 'EN_COURS': return 'bg-blue-500';
            case 'TERMINE': return 'bg-green-500';
            case 'ANNULE': return 'bg-gray-500';
            default: return 'bg-gray-400';
        }
    };

    const getStatusText = (statut) => {
        switch (statut) {
            case 'PLANIFIE': return 'Planifié';
            case 'EN_COURS': return 'En cours';
            case 'TERMINE': return 'Terminé';
            case 'ANNULE': return 'Annulé';
            default: return statut;
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Gestion des Trajets</h1>
                    <p className="text-dark-muted">Gérez tous les trajets de la flotte</p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                    + Nouveau Trajet
                </button>
            </div>

            {/* Stats Cards */}
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
                            <span className="text-2xl font-bold text-white">156</span>
                            <span className="text-xs font-medium text-white/80 uppercase">Total</span>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <svg className="w-12 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 10c5 0 8-5 12-5s7 10 12 10 8-8 12-8 8 5 10 5"/></svg>
                            <span className="text-xs font-bold text-white flex items-center bg-white/20 px-1.5 py-0.5 rounded backdrop-blur-sm">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                15.2%
                            </span>
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
                            <span className="text-2xl font-bold text-white">8</span>
                            <span className="text-xs font-medium text-dark-muted uppercase">En Cours</span>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <svg className="w-12 h-5 text-brand-pink/50" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 15c5 0 8-10 12-10s7 15 12 15 8-12 12-12 8 8 10 8"/></svg>
                            <span className="text-xs font-bold text-brand-pink flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                4.2%
                            </span>
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
                            <span className="text-2xl font-bold text-white">12</span>
                            <span className="text-xs font-medium text-dark-muted uppercase">Planifiés</span>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <svg className="w-12 h-5 text-purple-400/50" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12c5 0 8-8 12-8s7 12 12 12 8-10 12-10 8 6 10 6"/></svg>
                            <span className="text-xs font-bold text-purple-400 flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                8.7%
                            </span>
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
                            <span className="text-2xl font-bold text-white">136</span>
                            <span className="text-xs font-medium text-dark-muted uppercase">Terminés</span>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <svg className="w-12 h-5 text-green-400/50" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 10c5 0 8-5 12-5s7 10 12 10 8-8 12-8 8 5 10 5"/></svg>
                            <span className="text-xs font-bold text-green-400 flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                12.3%
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
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Référence</th>
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Départ</th>
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Destination</th>
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Camion</th>
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Chauffeur</th>
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Date Départ</th>
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Statut</th>
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trajets.map((trajet) => (
                                <tr key={trajet.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-4 text-white font-medium">{trajet.reference}</td>
                                    <td className="py-4 px-4 text-white">{trajet.depart}</td>
                                    <td className="py-4 px-4 text-white">{trajet.destination}</td>
                                    <td className="py-4 px-4 text-dark-muted">{trajet.camion}</td>
                                    <td className="py-4 px-4 text-dark-muted">{trajet.chauffeur}</td>
                                    <td className="py-4 px-4 text-dark-muted">{trajet.dateDepart}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trajet.statut)} text-white`}>
                                            {getStatusText(trajet.statut)}
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

export default Trajets;
