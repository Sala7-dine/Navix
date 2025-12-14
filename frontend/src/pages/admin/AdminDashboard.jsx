import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import Sidebar from '../../components/layout/Sidebar';
import Camions from './camions/Camions';
import Trajets from './trajets/Trajets';
import Pneus from './pneus/Pneus';
import Remorques from './remorques/Remorques';
import Maintenances from './maintenances/Maintenances';
import Users from './users/Users';
import FuelLogs from './fuellogs/FuelLogs';
import { fetchCamions } from '../../features/camions/camionsSlice';
import { fetchTrajets } from '../../features/trajets/trajetsSlice';
import { fetchMaintenances } from '../../features/maintenances/maintenancesSlice';
import { fetchPneus } from '../../features/pneus/pneusSlice';
import { fetchUsers } from '../../features/users/usersSlice';
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
    const [activeSection, setActiveSection] = useState('dashboard');
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    // Redux selectors
    const { camions } = useSelector((state) => state.camions);
    const { trajets } = useSelector((state) => state.trajets);
    const { maintenances } = useSelector((state) => state.maintenances);
    const { pneus } = useSelector((state) => state.pneus);
    const { users } = useSelector((state) => state.users);

    // Fetch data
    useEffect(() => {
        dispatch(fetchCamions());
        dispatch(fetchTrajets());
        dispatch(fetchMaintenances());
        dispatch(fetchPneus());
        dispatch(fetchUsers());
    }, [dispatch]);

    // Calculate statistics
    const totalCamions = camions.length;
    const camionsDisponibles = camions.filter(c => c.statut === 'DISPONIBLE').length;
    const camionsEnService = camions.filter(c => c.statut === 'EN_SERVICE').length;
    const camionsEnMaintenance = camions.filter(c => c.statut === 'EN_MAINTENANCE').length;

    const totalTrajets = trajets.length;
    const trajetsEnCours = trajets.filter(t => t.statut === 'EN_COURS').length;
    const trajetsPlanifies = trajets.filter(t => t.statut === 'PLANIFIE').length;
    const trajetsTermines = trajets.filter(t => t.statut === 'TERMINE').length;

    const totalMaintenances = maintenances.length;
    const maintenancesEnCours = maintenances.filter(m => m.statut === 'EN_COURS').length;
    const maintenancesPlanifiees = maintenances.filter(m => m.statut === 'PLANIFIEE').length;

    const totalPneus = pneus.length;
    const pneusBonEtat = pneus.filter(p => p.usurePourcentage < 40).length;
    const pneusASurveiller = pneus.filter(p => p.usurePourcentage >= 40 && p.usurePourcentage < 70).length;
    const pneusCritique = pneus.filter(p => p.usurePourcentage >= 70).length;

    const totalUsers = users.length;
    const chauffeurs = users.filter(u => u.role === 'CHAUFFEUR').length;
    const admins = users.filter(u => u.role === 'ADMIN').length;

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
            <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

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
                <div className="flex-1 overflow-y-auto z-10">
                    {/* Conditional Rendering based on activeSection */}
                    {activeSection === 'camions' && <Camions />}
                    {activeSection === 'trajets' && <Trajets />}
                    {activeSection === 'pneus' && <Pneus />}
                    {activeSection === 'remorques' && <Remorques />}
                    {activeSection === 'maintenances' && <Maintenances />}
                    {activeSection === 'users' && <Users />}
                    {activeSection === 'fuellogs' && <FuelLogs />}
                    
                    {/* Dashboard Default View */}
                    {activeSection === 'dashboard' && (
                    <div className="p-8">
                    <div className="flex flex-col lg:flex-row gap-8 h-full">
                        
                        {/* Left Column (Main) */}
                        <div className="flex-1 flex flex-col gap-8">
                            
                            {/* Cards Section */}
                            <div>
                                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">Statistiques Flotte</h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    {/* Card 1 - Camions */}
                                    <div className="cyan-card rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-cyan-500/20 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0h-.01M15 17a2 2 0 104 0m-4 0h-.01"/>
                                            </svg>
                                        </div>
                                        
                                        <div className="text-right z-10">
                                            <div className="flex items-baseline justify-end gap-2 mb-1">
                                                <span className="text-2xl font-bold text-white">{totalCamions}</span>
                                                <span className="text-xs font-medium text-white/80 uppercase">Camions</span>
                                            </div>
                                            <div className="flex items-center justify-end gap-2">
                                                <svg className="w-12 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 10c5 0 8-5 12-5s7 10 12 10 8-8 12-8 8 5 10 5"/></svg>
                                                <span className="text-xs font-bold text-white flex items-center bg-white/20 px-1.5 py-0.5 rounded backdrop-blur-sm">
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                                    {totalCamions > 0 ? Math.round((camionsDisponibles / totalCamions) * 100) : 0}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card 2 - Trajets */}
                                    <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                                        <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                                            <svg className="w-6 h-6 text-brand-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                                            </svg>
                                        </div>
                                        
                                        <div className="text-right z-10">
                                            <div className="flex items-baseline justify-end gap-2 mb-1">
                                                <span className="text-2xl font-bold text-white">{totalTrajets}</span>
                                                <span className="text-xs font-medium text-dark-muted uppercase">Trajets</span>
                                            </div>
                                            <div className="flex items-center justify-end gap-2">
                                                <svg className="w-12 h-5 text-brand-pink/50" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 15c5 0 8-10 12-10s7 15 12 15 8-12 12-12 8 8 10 8"/></svg>
                                                <span className="text-xs font-bold text-green-400 flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                                    {totalTrajets > 0 ? Math.round((trajetsEnCours / totalTrajets) * 100) : 0}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card 3 - Maintenances */}
                                    <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                                        <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                                            <svg className="w-6 h-6 text-brand-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            </svg>
                                        </div>
                                        
                                        <div className="text-right z-10">
                                            <div className="flex items-baseline justify-end gap-2 mb-1">
                                                <span className="text-2xl font-bold text-white">{totalMaintenances}</span>
                                                <span className="text-xs font-medium text-dark-muted uppercase">Maintenances</span>
                                            </div>
                                            <div className="flex items-center justify-end gap-2">
                                                <svg className="w-12 h-5 text-brand-pink/50" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 10c5 0 8 5 12 5s7-8 12-8 8 6 12 6 8-4 10-4"/></svg>
                                                <span className="text-xs font-bold text-orange-400 flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01"/></svg>
                                                    {totalMaintenances > 0 ? Math.round((maintenancesEnCours / totalMaintenances) * 100) : 0}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card 4 - Pneus */}
                                    <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                                        <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                                            <svg className="w-6 h-6 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="9" strokeWidth="2"/>
                                                <circle cx="12" cy="12" r="4" strokeWidth="2"/>
                                            </svg>
                                        </div>
                                        
                                        <div className="text-right z-10">
                                            <div className="flex items-baseline justify-end gap-2 mb-1">
                                                <span className="text-2xl font-bold text-white">{totalPneus}</span>
                                                <span className="text-xs font-medium text-dark-muted uppercase">Pneus</span>
                                            </div>
                                            <div className="flex items-center justify-end gap-2">
                                                <svg className="w-12 h-5 text-brand-cyan/50" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12c5 0 8-8 12-8s7 12 12 12 8-10 12-10 8 6 10 6"/></svg>
                                                <span className="text-xs font-bold text-brand-cyan flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                                    {totalPneus > 0 ? Math.round((pneusBonEtat / totalPneus) * 100) : 0}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Stats Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    {/* Users Card */}
                                    <div className="glass-panel rounded-2xl p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-white font-semibold">Utilisateurs</h3>
                                            <div className="bg-blue-500/10 p-2 rounded-lg">
                                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-dark-muted text-sm">Total</span>
                                                <span className="text-white font-bold text-xl">{totalUsers}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-dark-muted text-sm">Chauffeurs</span>
                                                <span className="text-cyan-400 font-semibold">{chauffeurs}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-dark-muted text-sm">Administrateurs</span>
                                                <span className="text-purple-400 font-semibold">{admins}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fleet Health Card */}
                                    <div className="glass-panel rounded-2xl p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-white font-semibold">État de la Flotte</h3>
                                            <div className="bg-green-500/10 p-2 rounded-lg">
                                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-dark-muted text-sm">Disponibilité</span>
                                                <span className="text-green-400 font-semibold">{totalCamions > 0 ? Math.round((camionsDisponibles / totalCamions) * 100) : 0}%</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-dark-muted text-sm">En Service</span>
                                                <span className="text-blue-400 font-semibold">{totalCamions > 0 ? Math.round((camionsEnService / totalCamions) * 100) : 0}%</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-dark-muted text-sm">Maintenance</span>
                                                <span className="text-orange-400 font-semibold">{totalCamions > 0 ? Math.round((camionsEnMaintenance / totalCamions) * 100) : 0}%</span>
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
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
