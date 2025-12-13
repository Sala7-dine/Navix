import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import './AdminDashboard.css';

// Register Chart.js components
Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            
            // Gradients
            const gradientPink = ctx.createLinearGradient(0, 0, 0, 400);
            gradientPink.addColorStop(0, 'rgba(183, 33, 255, 0.2)');
            gradientPink.addColorStop(1, 'rgba(183, 33, 255, 0)');

            const gradientCyan = ctx.createLinearGradient(0, 0, 0, 400);
            gradientCyan.addColorStop(0, 'rgba(33, 212, 253, 0.2)');
            gradientCyan.addColorStop(1, 'rgba(33, 212, 253, 0)');

            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
                    datasets: [
                        {
                            label: 'Distance',
                            data: [2500, 3800, 3200, 4500, 4200, 5800, 5200],
                            borderColor: '#B721FF',
                            backgroundColor: gradientPink,
                            borderWidth: 3,
                            tension: 0.4,
                            fill: true,
                            pointBackgroundColor: '#0d0b21',
                            pointBorderColor: '#B721FF',
                            pointBorderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6
                        },
                        {
                            label: 'Carburant',
                            data: [2800, 3200, 2900, 3800, 3500, 4200, 4800],
                            borderColor: '#21D4FD',
                            backgroundColor: gradientCyan,
                            borderWidth: 3,
                            tension: 0.4,
                            fill: true,
                            pointBackgroundColor: '#0d0b21',
                            pointBorderColor: '#21D4FD',
                            pointBorderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6
                        },
                        {
                            label: 'Prévision',
                            data: [3000, 3500, 3300, 4000, 3800, 4500, 4700],
                            borderColor: '#F7D54A',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            tension: 0.4,
                            fill: false,
                            pointRadius: 0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#15132b',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: '#2d2b45',
                            borderWidth: 1,
                            padding: 12,
                            displayColors: true,
                            usePointStyle: true
                        }
                    },
                    scales: {
                        y: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.03)',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#6c6a7d',
                                font: { size: 11 }
                            },
                            beginAtZero: true
                        },
                        x: {
                            grid: { display: false },
                            ticks: {
                                color: '#6c6a7d',
                                font: { size: 11 }
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    }
                }
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    return (
        <div className="admin-dashboard h-screen flex overflow-hidden">
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
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
                        <span className="font-medium text-sm hidden lg:block">Dashboard</span>
                    </button>
                    <button onClick={() => {}} className="sidebar-link flex items-center gap-4 px-2 py-2 text-[#6F6C99] hover:text-white w-full">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M21 7.25a1.25 1.25 0 00-1.25-1.25H4.25a1.25 1.25 0 00-1.25 1.25v10.5c0 .69.56 1.25 1.25 1.25h15.5c.69 0 1.25-.56 1.25-1.25V7.25zM19 13.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>
                        <span className="font-medium text-sm hidden lg:block">Wallet</span>
                    </button>
                    <button onClick={() => {}} className="sidebar-link flex items-center gap-4 px-2 py-2 text-[#6F6C99] hover:text-white w-full">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                        <span className="font-medium text-sm hidden lg:block">Messages</span>
                        <span className="w-2 h-2 rounded-full bg-brand-pink ml-auto hidden lg:block shadow-[0_0_8px_#ec4899]"></span>
                    </button>
                    <button onClick={() => {}} className="sidebar-link flex items-center gap-4 px-2 py-2 text-[#6F6C99] hover:text-white w-full">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" /></svg>
                        <span className="font-medium text-sm hidden lg:block">Trade</span>
                    </button>
                    <button onClick={() => {}} className="sidebar-link flex items-center gap-4 px-2 py-2 text-[#6F6C99] hover:text-white w-full">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                        <span className="font-medium text-sm hidden lg:block">Account Setting</span>
                    </button>
                </nav>

                {/* Logout */}
                <div className="mt-auto">
                    <button onClick={() => { dispatch(logout()); navigate('/login'); }} className="flex items-center gap-4 px-2 py-2 text-[#6F6C99] hover:text-white transition-colors w-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                        <span className="font-medium hidden lg:block">Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative dashboard-main">
                {/* Header */}
                <header className="h-20 flex items-center justify-between px-8 z-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                        <p className="text-sm text-dark-muted mt-1">Vue d'ensemble de la flotte</p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        {/* Search */}
                        <div className="relative hidden md:block">
                            <input type="text" className="bg-[#15132b] text-sm text-white rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-brand-cyan placeholder-gray-500 w-64" placeholder="Rechercher..."/>
                            <svg className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </div>

                        {/* Grid Icon */}
                        <button className="text-gray-400 hover:text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                        </button>

                        {/* Notification Bell */}
                        <button className="relative w-10 h-10 rounded-xl bg-gradient-to-r from-brand-pink to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 hover:scale-105 transition-transform">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                            </svg>
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-brand-pink text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
                        </button>

                        {/* Profile */}
                        <div className="flex items-center gap-3">
                            <img src="https://ui-avatars.com/api/?name=Admin+User&background=21D4FD&color=fff" className="w-10 h-10 rounded-lg border-2 border-[#15132b]" alt="Profile"/>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium text-white">Admin User</p>
                                <svg className="w-4 h-4 text-gray-500 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto p-8 z-10">
                    <div className="flex flex-col lg:flex-row gap-8 h-full">
                        
                        {/* Left Column (Main) */}
                        <div className="flex-1 flex flex-col gap-8">
                            
                            {/* Cards Section */}
                            <div>
                                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">Statistiques Flotte</h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    {/* Card 1 - Chauffeurs */}
                                    <div className="cyan-card rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-cyan-500/20 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                        </div>
                                        
                                        <div className="text-right z-10">
                                            <div className="flex items-baseline justify-end gap-2 mb-1">
                                                <span className="text-2xl font-bold text-white">24</span>
                                                <span className="text-xs font-medium text-white/80 uppercase">Chauffeurs</span>
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

                                    {/* Card 2 - Véhicules */}
                                    <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                                        <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                                            <svg className="w-6 h-6 text-brand-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                                        </div>
                                        
                                        <div className="text-right z-10">
                                            <div className="flex items-baseline justify-end gap-2 mb-1">
                                                <span className="text-2xl font-bold text-white">18</span>
                                                <span className="text-xs font-medium text-dark-muted uppercase">Véhicules</span>
                                            </div>
                                            <div className="flex items-center justify-end gap-2">
                                                <svg className="w-12 h-5 text-brand-pink/50" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 15c5 0 8-10 12-10s7 15 12 15 8-12 12-12 8 8 10 8"/></svg>
                                                <span className="text-xs font-bold text-red-400 flex items-center">
                                                    <svg className="w-3 h-3 mr-1 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                                    2.4%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card 3 - Trajets */}
                                    <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                                        <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                                            <svg className="w-6 h-6 text-brand-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                                        </div>
                                        
                                        <div className="text-right z-10">
                                            <div className="flex items-baseline justify-end gap-2 mb-1">
                                                <span className="text-2xl font-bold text-white">156</span>
                                                <span className="text-xs font-medium text-dark-muted uppercase">Trajets</span>
                                            </div>
                                            <div className="flex items-center justify-end gap-2">
                                                <svg className="w-12 h-5 text-brand-pink/50" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 15c5 0 8-10 12-10s7 15 12 15 8-12 12-12 8 8 10 8"/></svg>
                                                <span className="text-xs font-bold text-red-400 flex items-center">
                                                    <svg className="w-3 h-3 mr-1 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                                    2.4%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card 4 - Heures */}
                                    <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                                        <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                                            <svg className="w-6 h-6 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        </div>
                                        
                                        <div className="text-right z-10">
                                            <div className="flex items-baseline justify-end gap-2 mb-1">
                                                <span className="text-2xl font-bold text-white">342h</span>
                                                <span className="text-xs font-medium text-dark-muted uppercase">Heures</span>
                                            </div>
                                            <div className="flex items-center justify-end gap-2">
                                                <svg className="w-12 h-5 text-brand-cyan/50" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12c5 0 8-8 12-8s7 12 12 12 8-10 12-10 8 6 10 6"/></svg>
                                                <span className="text-xs font-bold text-brand-cyan flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                                    8.1%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Chart Section */}
                            <div className="flex-1 min-h-[400px] relative">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex gap-6">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-brand-pink"></span>
                                            <span className="text-sm text-gray-400">Distance (km)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-brand-cyan"></span>
                                            <span className="text-sm text-gray-400">Carburant (L)</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 rounded-lg bg-[#15132b] text-xs text-white hover:bg-brand-cyan hover:text-black transition-colors">1H</button>
                                        <button className="px-3 py-1 rounded-lg bg-[#15132b] text-xs text-white hover:bg-brand-cyan hover:text-black transition-colors">1D</button>
                                        <button className="px-3 py-1 rounded-lg bg-brand-cyan text-xs text-black font-bold">1W</button>
                                        <button className="px-3 py-1 rounded-lg bg-[#15132b] text-xs text-white hover:bg-brand-cyan hover:text-black transition-colors">1M</button>
                                    </div>
                                </div>
                                
                                {/* Chart Container */}
                                <div className="w-full h-[350px]">
                                    <canvas ref={chartRef}></canvas>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
