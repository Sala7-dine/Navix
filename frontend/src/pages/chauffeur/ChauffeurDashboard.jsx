import React from 'react';
import './ChauffeurDashboard.css';

const ChauffeurDashboard = () => {
    return (
        <div className="chauffeur-dashboard h-screen flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-20 lg:w-64 flex-shrink-0 flex flex-col py-6 px-4 sidebar-bg">
                {/* Logo */}
                <div className="flex items-center gap-3 px-2 mb-12">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-cyan to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-wide text-white hidden lg:block">Navix</span>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 space-y-6">
                    <button onClick={() => {}} className="sidebar-link active flex items-center gap-4 px-2 py-2 text-[#6F6C99] hover:text-white w-full">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
                        <span className="font-medium hidden lg:block">Dashboard</span>
                    </button>
                    <button onClick={() => {}} className="sidebar-link flex items-center gap-4 px-2 py-2 text-[#6F6C99] hover:text-white w-full">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M21 7.25a1.25 1.25 0 00-1.25-1.25H4.25a1.25 1.25 0 00-1.25 1.25v10.5c0 .69.56 1.25 1.25 1.25h15.5c.69 0 1.25-.56 1.25-1.25V7.25zM19 13.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>
                        <span className="font-medium hidden lg:block">Wallet</span>
                    </button>
                    <button onClick={() => {}} className="sidebar-link flex items-center gap-4 px-2 py-2 text-[#6F6C99] hover:text-white w-full">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                        <span className="font-medium hidden lg:block">Messages</span>
                        <span className="w-2 h-2 rounded-full bg-brand-pink ml-auto hidden lg:block shadow-[0_0_8px_#ec4899]"></span>
                    </button>
                    <button onClick={() => {}} className="sidebar-link flex items-center gap-4 px-2 py-2 text-[#6F6C99] hover:text-white w-full">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" /></svg>
                        <span className="font-medium hidden lg:block">Trade</span>
                    </button>
                    <button onClick={() => {}} className="sidebar-link flex items-center gap-4 px-2 py-2 text-[#6F6C99] hover:text-white w-full">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                        <span className="font-medium hidden lg:block">Account Setting</span>
                    </button>
                </nav>

                {/* Logout */}
                <div className="mt-auto">
                    <a href="/login" className="flex items-center gap-4 px-2 py-2 text-[#6F6C99] hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                        <span className="font-medium hidden lg:block">Déconnexion</span>
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative dashboard-main">
                {/* Header */}
                <header className="h-20 flex items-center justify-between px-8 z-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Bonjour, Jean</h1>
                        <p className="text-sm text-dark-muted mt-1">Prêt pour la route ?</p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        {/* Notification Bell */}
                        <button className="relative w-10 h-10 rounded-xl bg-[#15132b] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1e1c36] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                            </svg>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-brand-pink rounded-full"></span>
                        </button>

                        {/* Profile */}
                        <div className="flex items-center gap-3">
                            <img src="https://ui-avatars.com/api/?name=Jean+Dupont&background=B721FF&color=fff" className="w-10 h-10 rounded-lg border-2 border-[#15132b]" alt="Profile"/>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 z-10">
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {/* Card 1 - Trajets */}
                        <div className="cyan-card rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-cyan-500/20 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 01-1.447-.894L15 7m0 13V7"/></svg>
                            </div>
                            
                            <div className="text-right z-10">
                                <div className="flex items-baseline justify-end gap-2 mb-1">
                                    <span className="text-2xl font-bold text-white">142</span>
                                    <span className="text-xs font-medium text-white/80 uppercase">Trajets</span>
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

                        {/* Card 2 - Heures */}
                        <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                            <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                                <svg className="w-6 h-6 text-brand-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                            
                            <div className="text-right z-10">
                                <div className="flex items-baseline justify-end gap-2 mb-1">
                                    <span className="text-2xl font-bold text-white">38h</span>
                                    <span className="text-xs font-medium text-dark-muted uppercase">Heures</span>
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <svg className="w-12 h-5 text-brand-pink/50" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 15c5 0 8-10 12-10s7 15 12 15 8-12 12-12 8 8 10 8"/></svg>
                                    <span className="text-xs font-bold text-red-400 flex items-center">
                                        <svg className="w-3 h-3 mr-1 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                        5.23%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 - Distance */}
                        <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                            <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                                <svg className="w-6 h-6 text-brand-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 01-1.447-.894L15 7m0 13V7"/></svg>
                            </div>
                            
                            <div className="text-right z-10">
                                <div className="flex items-baseline justify-end gap-2 mb-1">
                                    <span className="text-2xl font-bold text-white">1,520km</span>
                                    <span className="text-xs font-medium text-dark-muted uppercase">Distance</span>
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <svg className="w-12 h-5 text-brand-pink/50" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 15c5 0 8-10 12-10s7 15 12 15 8-12 12-12 8 8 10 8"/></svg>
                                    <span className="text-xs font-bold text-red-400 flex items-center">
                                        <svg className="w-3 h-3 mr-1 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                        5.23%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Card 4 - Départ */}
                        <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                            <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                                <svg className="w-6 h-6 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            </div>
                            
                            <div className="text-right z-10">
                                <div className="flex items-baseline justify-end gap-2 mb-1">
                                    <span className="text-2xl font-bold text-white">14:30</span>
                                    <span className="text-xs font-medium text-dark-muted uppercase">Départ</span>
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <svg className="w-12 h-5 text-brand-cyan/50" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12c5 0 8-8 12-8s7 12 12 12 8-10 12-10 8 6 10 6"/></svg>
                                    <span className="text-xs font-bold text-brand-cyan flex items-center">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                        39.69%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Current Mission */}
                    <div className="glass-panel p-8 mb-8 border-l-4 border-brand-pink relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-brand-pink/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 rounded-full bg-brand-pink/20 text-brand-pink text-xs font-bold uppercase tracking-wider">En cours</span>
                                    <h3 className="text-xl font-bold text-white">Livraison #LIV-892</h3>
                                </div>
                                <p className="text-gray-400 mb-4">Transport de matériel électronique fragile.</p>
                                
                                <div className="flex flex-wrap gap-6 text-sm">
                                    <div className="flex items-center gap-2 text-white">
                                        <svg className="w-4 h-4 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                        Destination: <span className="font-medium">Lyon (69000)</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white">
                                        <svg className="w-4 h-4 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        ETA: <span className="font-medium">18:45</span>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                style={{
                                    background: 'linear-gradient(to right, #B721FF, #9333ea)'
                                }}
                                className="px-6 py-3 text-white font-bold rounded-xl shadow-lg shadow-pink-500/25 hover:scale-105 transition-transform">
                                Voir Détails
                            </button>
                        </div>
                    </div>

                    {/* Recent History */}
                    <div className="glass-panel p-6">
                        <h3 className="text-white font-bold mb-6">Historique Récent</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-dark-muted text-xs uppercase tracking-wider border-b border-[#2d2b45]">
                                        <th className="px-4 py-3 font-medium">Date</th>
                                        <th className="px-4 py-3 font-medium">Départ</th>
                                        <th className="px-4 py-3 font-medium">Arrivée</th>
                                        <th className="px-4 py-3 font-medium">Distance</th>
                                        <th className="px-4 py-3 font-medium">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2d2b45]">
                                    <tr className="group hover:bg-[#1e1c36] transition-colors">
                                        <td className="px-4 py-4 text-white">12 Oct 2023</td>
                                        <td className="px-4 py-4 text-gray-400">Paris</td>
                                        <td className="px-4 py-4 text-gray-400">Lille</td>
                                        <td className="px-4 py-4 text-gray-400">225 km</td>
                                        <td className="px-4 py-4"><span className="text-brand-cyan text-xs font-bold px-2 py-1 bg-brand-cyan/10 rounded">Terminé</span></td>
                                    </tr>
                                    <tr className="group hover:bg-[#1e1c36] transition-colors">
                                        <td className="px-4 py-4 text-white">10 Oct 2023</td>
                                        <td className="px-4 py-4 text-gray-400">Lyon</td>
                                        <td className="px-4 py-4 text-gray-400">Marseille</td>
                                        <td className="px-4 py-4 text-gray-400">315 km</td>
                                        <td className="px-4 py-4"><span className="text-brand-cyan text-xs font-bold px-2 py-1 bg-brand-cyan/10 rounded">Terminé</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default ChauffeurDashboard;
