import React, { useState } from 'react';
import '../../admin/AdminDashboard.css';

const Users = () => {
    const [users] = useState([
        {
            id: 1,
            fullName: 'Jean Dupont',
            email: 'jean.dupont@navix.com',
            telephone: '+33 6 12 34 56 78',
            role: 'CHAUFFEUR',
            statut: 'ACTIF',
            dateInscription: '2024-01-15'
        },
        {
            id: 2,
            fullName: 'Marie Martin',
            email: 'marie.martin@navix.com',
            telephone: '+33 6 98 76 54 32',
            role: 'CHAUFFEUR',
            statut: 'ACTIF',
            dateInscription: '2024-02-20'
        },
        {
            id: 3,
            fullName: 'Pierre Dubois',
            email: 'pierre.dubois@navix.com',
            telephone: '+33 6 11 22 33 44',
            role: 'ADMIN',
            statut: 'ACTIF',
            dateInscription: '2024-03-10'
        }
    ]);

    const getRoleColor = (role) => {
        switch (role) {
            case 'ADMIN': return 'bg-purple-500/20 text-purple-400';
            case 'CHAUFFEUR': return 'bg-blue-500/20 text-blue-400';
            case 'MANAGER': return 'bg-green-500/20 text-green-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getStatusColor = (statut) => {
        switch (statut) {
            case 'ACTIF': return 'bg-green-500';
            case 'INACTIF': return 'bg-gray-500';
            case 'SUSPENDU': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    const getStatusText = (statut) => {
        switch (statut) {
            case 'ACTIF': return 'Actif';
            case 'INACTIF': return 'Inactif';
            case 'SUSPENDU': return 'Suspendu';
            default: return statut;
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Gestion des Utilisateurs</h1>
                    <p className="text-dark-muted">Gérez tous les utilisateurs de la plateforme</p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                    + Nouvel Utilisateur
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="cyan-card rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-cyan-500/20 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">24</span>
                            <span className="text-xs font-medium text-white/80 uppercase">Total</span>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <svg className="w-12 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 10c5 0 8-5 12-5s7 10 12 10 8-8 12-8 8 5 10 5"/></svg>
                            <span className="text-xs font-bold text-white flex items-center bg-white/20 px-1.5 py-0.5 rounded backdrop-blur-sm">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                12.5%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                        <svg className="w-6 h-6 text-brand-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">18</span>
                            <span className="text-xs font-medium text-dark-muted uppercase">Chauffeurs</span>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <svg className="w-12 h-5 text-brand-pink/50" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 15c5 0 8-10 12-10s7 15 12 15 8-12 12-12 8 8 10 8"/></svg>
                            <span className="text-xs font-bold text-brand-pink flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                8.3%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div className="text-right z-10">
                        <div className="flex items-baseline justify-end gap-2 mb-1">
                            <span className="text-2xl font-bold text-white">4</span>
                            <span className="text-xs font-medium text-dark-muted uppercase">Admins</span>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <svg className="w-12 h-5 text-purple-400/50" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12c5 0 8-8 12-8s7 12 12 12 8-10 12-10 8 6 10 6"/></svg>
                            <span className="text-xs font-bold text-purple-400 flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                5.5%
                            </span>
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
                            <span className="text-2xl font-bold text-white">22</span>
                            <span className="text-xs font-medium text-dark-muted uppercase">Actifs</span>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <svg className="w-12 h-5 text-green-400/50" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 10c5 0 8-5 12-5s7 10 12 10 8-8 12-8 8 5 10 5"/></svg>
                            <span className="text-xs font-bold text-green-400 flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                16.7%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-card p-6 rounded-xl border border-white/10">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">ID</th>
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Nom Complet</th>
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Email</th>
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Téléphone</th>
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Rôle</th>
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Date Inscription</th>
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Statut</th>
                                <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-4 text-white">#{user.id}</td>
                                    <td className="py-4 px-4 text-white font-medium">{user.fullName}</td>
                                    <td className="py-4 px-4 text-dark-muted">{user.email}</td>
                                    <td className="py-4 px-4 text-dark-muted">{user.telephone}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-dark-muted">{user.dateInscription}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.statut)} text-white`}>
                                            {getStatusText(user.statut)}
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

export default Users;
