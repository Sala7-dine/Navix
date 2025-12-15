import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { fetchTrajets } from '../../features/trajets/trajetsSlice';
import ChauffeurSidebar from '../../components/layout/ChauffeurSidebar';
import MesTrajets from './MesTrajets';
import Historique from './Historique';
import MonProfil from './MonProfil';
import MesFuelLogs from './MesFuelLogs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import './ChauffeurDashboard.css';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const ChauffeurDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('dashboard');
    const { user } = useSelector((state) => state.auth);
    const { trajets } = useSelector((state) => state.trajets);

    useEffect(() => {
        dispatch(fetchTrajets());
    }, [dispatch]);

    // Filtrer les trajets du chauffeur connecté
    const mesTrajets = trajets.filter(trajet => trajet.chauffeur?._id === user?.userId);
    const trajetsEnCours = mesTrajets.filter(t => t.statut === 'EN_COURS');
    const trajetsPlanifies = mesTrajets.filter(t => t.statut === 'PLANIFIE');
    const trajetsTermines = mesTrajets.filter(t => t.statut === 'TERMINE');

    // Calculer les statistiques
    const totalDistance = mesTrajets.reduce((sum, t) => sum + (t.distance || 0), 0);
    const moyenneDistance = mesTrajets.length > 0 ? (totalDistance / mesTrajets.length).toFixed(0) : 0;

    // Chart data
    const lineChartData = {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [
            {
                label: 'Distance (km)',
                data: [250, 320, 180, 400, 290, 350, 420],
                borderColor: 'rgb(6, 182, 212)',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                tension: 0.4
            }
        ]
    };

    const doughnutChartData = {
        labels: ['Terminés', 'En Cours', 'Planifiés'],
        datasets: [
            {
                data: [trajetsTermines.length, trajetsEnCours.length, trajetsPlanifies.length],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(59, 130, 246, 0.8)'
                ],
                borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(251, 191, 36, 1)',
                    'rgba(59, 130, 246, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: 'rgb(156, 163, 175)'
                }
            }
        },
        scales: {
            y: {
                ticks: { color: 'rgb(156, 163, 175)' },
                grid: { color: 'rgba(255, 255, 255, 0.05)' }
            },
            x: {
                ticks: { color: 'rgb(156, 163, 175)' },
                grid: { color: 'rgba(255, 255, 255, 0.05)' }
            }
        }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: 'rgb(156, 163, 175)',
                    padding: 15
                }
            }
        }
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'mes-trajets':
                return <MesTrajets />;
            case 'historique':
                return <Historique />;
            case 'fuel-logs':
                return <MesFuelLogs />;
            case 'mon-profil':
                return <MonProfil />;
            case 'dashboard':
            default:
                return renderDashboard();
        }
    };

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Cards Section */}
            <div>
                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">Mes Statistiques</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Card 1 - Total Trajets */}
                    <div className="cyan-card rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-cyan-500/20 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                            </svg>
                        </div>
                        
                        <div className="text-right z-10">
                            <div className="flex items-baseline justify-end gap-2 mb-1">
                                <span className="text-2xl font-bold text-white">{mesTrajets.length}</span>
                                <span className="text-xs font-medium text-white/80 uppercase">Trajets</span>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <svg className="w-12 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 10c5 0 8-5 12-5s7 10 12 10 8-8 12-8 8 5 10 5"/></svg>
                                <span className="text-xs font-bold text-white flex items-center bg-white/20 px-1.5 py-0.5 rounded backdrop-blur-sm">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                    {mesTrajets.length > 0 ? Math.round((trajetsTermines.length / mesTrajets.length) * 100) : 0}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 - En Cours */}
                    <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                        <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                            <svg className="w-6 h-6 text-brand-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                            </svg>
                        </div>
                        
                        <div className="text-right z-10">
                            <div className="flex items-baseline justify-end gap-2 mb-1">
                                <span className="text-2xl font-bold text-white">{trajetsEnCours.length}</span>
                                <span className="text-xs font-medium text-dark-muted uppercase">En Cours</span>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <svg className="w-12 h-5 text-brand-pink/50" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 15c5 0 8-10 12-10s7 15 12 15 8-12 12-12 8 8 10 8"/></svg>
                                <span className="text-xs font-bold text-yellow-400 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01"/></svg>
                                    {mesTrajets.length > 0 ? Math.round((trajetsEnCours.length / mesTrajets.length) * 100) : 0}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card 3 - Distance Totale */}
                    <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                        <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                            <svg className="w-6 h-6 text-brand-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                        </div>
                        
                        <div className="text-right z-10">
                            <div className="flex items-baseline justify-end gap-2 mb-1">
                                <span className="text-2xl font-bold text-white">{totalDistance.toLocaleString()}</span>
                                <span className="text-xs font-medium text-dark-muted uppercase">km</span>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <svg className="w-12 h-5 text-brand-pink/50" fill="none" stroke="currentColor" viewBox="0 0 50 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 15c5 0 8-10 12-10s7 15 12 15 8-12 12-12 8 8 10 8"/></svg>
                                <span className="text-xs font-bold text-green-400 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                                    Total
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card 4 - Distance Moyenne */}
                    <div className="glass-card rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:bg-white/5 transition-all duration-300">
                        <div className="w-12 h-12 rounded-full bg-[#2d2b45] flex items-center justify-center">
                            <svg className="w-6 h-6 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                            </svg>
                        </div>
                        
                        <div className="text-right z-10">
                            <div className="flex items-baseline justify-end gap-2 mb-1">
                                <span className="text-2xl font-bold text-white">{moyenneDistance}</span>
                                <span className="text-xs font-medium text-dark-muted uppercase">km/trajet</span>
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

                {/* Secondary Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    {/* Trajets Planifiés */}
                    <div className="glass-panel rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold">Planifiés</h3>
                            <div className="bg-blue-500/10 p-2 rounded-lg">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-dark-muted text-sm">À venir</span>
                                <span className="text-white font-bold text-2xl">{trajetsPlanifies.length}</span>
                            </div>
                            <div className="w-full bg-[#2d2b45] rounded-full h-2">
                                <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all" 
                                    style={{ width: `${mesTrajets.length > 0 ? (trajetsPlanifies.length / mesTrajets.length) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Trajets Terminés */}
                    <div className="glass-panel rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold">Terminés</h3>
                            <div className="bg-green-500/10 p-2 rounded-lg">
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-dark-muted text-sm">Complétés</span>
                                <span className="text-white font-bold text-2xl">{trajetsTermines.length}</span>
                            </div>
                            <div className="w-full bg-[#2d2b45] rounded-full h-2">
                                <div 
                                    className="bg-green-500 h-2 rounded-full transition-all" 
                                    style={{ width: `${mesTrajets.length > 0 ? (trajetsTermines.length / mesTrajets.length) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Taux de Complétion */}
                    <div className="glass-panel rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold">Performance</h3>
                            <div className="bg-cyan-500/10 p-2 rounded-lg">
                                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                                </svg>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-dark-muted text-sm">Taux de succès</span>
                                <span className="text-white font-bold text-2xl">
                                    {mesTrajets.length > 0 ? Math.round((trajetsTermines.length / mesTrajets.length) * 100) : 0}%
                                </span>
                            </div>
                            <div className="w-full bg-[#2d2b45] rounded-full h-2">
                                <div 
                                    className="bg-cyan-500 h-2 rounded-full transition-all" 
                                    style={{ width: `${mesTrajets.length > 0 ? (trajetsTermines.length / mesTrajets.length) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Current Mission - Only if there's a trajet en cours */}
            {trajetsEnCours.length > 0 && (
                <div className="glass-panel p-8 border-l-4 border-brand-pink relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-brand-pink/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 rounded-full bg-brand-pink/20 text-brand-pink text-xs font-bold uppercase tracking-wider">En cours</span>
                                <h3 className="text-xl font-bold text-white">
                                    {trajetsEnCours[0].depart} → {trajetsEnCours[0].destination}
                                </h3>
                            </div>
                            <p className="text-gray-400 mb-4">{trajetsEnCours[0].notes || 'Transport en cours'}</p>
                            
                            <div className="flex flex-wrap gap-6 text-sm">
                                <div className="flex items-center gap-2 text-white">
                                    <svg className="w-4 h-4 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                    Date: <span className="font-medium">{new Date(trajetsEnCours[0].dateDepart).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-white">
                                    <svg className="w-4 h-4 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
                                    </svg>
                                    Camion: <span className="font-medium">{trajetsEnCours[0].camion?.immatriculation || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-white">
                                    <svg className="w-4 h-4 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                    </svg>
                                    Distance: <span className="font-medium">{trajetsEnCours[0].distance || 0} km</span>
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => setActiveSection('mes-trajets')}
                            style={{
                                background: 'linear-gradient(to right, #B721FF, #9333ea)'
                            }}
                            className="px-6 py-3 text-white font-bold rounded-xl shadow-lg shadow-pink-500/25 hover:scale-105 transition-transform">
                            Voir Détails
                        </button>
                    </div>
                </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Line Chart */}
                <div className="glass-panel p-6">
                    <h3 className="text-white font-bold mb-6">Distance Hebdomadaire</h3>
                    <div className="h-64">
                        <Line data={lineChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Doughnut Chart */}
                <div className="glass-panel p-6">
                    <h3 className="text-white font-bold mb-6">Répartition des Trajets</h3>
                    <div className="h-64">
                        <Doughnut data={doughnutChartData} options={doughnutOptions} />
                    </div>
                </div>
            </div>

            {/* Recent Trajets */}
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
                            {mesTrajets.slice(0, 5).map((trajet) => (
                                <tr key={trajet._id} className="group hover:bg-[#1e1c36] transition-colors">
                                    <td className="px-4 py-4 text-white">{new Date(trajet.dateDepart).toLocaleDateString('fr-FR')}</td>
                                    <td className="px-4 py-4 text-gray-400">{trajet.depart}</td>
                                    <td className="px-4 py-4 text-gray-400">{trajet.destination}</td>
                                    <td className="px-4 py-4 text-gray-400">{trajet.distance || 0} km</td>
                                    <td className="px-4 py-4">
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                                            trajet.statut === 'TERMINE' ? 'text-brand-cyan bg-brand-cyan/10' :
                                            trajet.statut === 'EN_COURS' ? 'text-yellow-400 bg-yellow-400/10' :
                                            trajet.statut === 'PLANIFIE' ? 'text-blue-400 bg-blue-400/10' :
                                            'text-gray-400 bg-gray-400/10'
                                        }`}>
                                            {trajet.statut === 'TERMINE' ? 'Terminé' :
                                             trajet.statut === 'EN_COURS' ? 'En Cours' :
                                             trajet.statut === 'PLANIFIE' ? 'Planifié' : trajet.statut}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {mesTrajets.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-400">Aucun trajet pour le moment</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="chauffeur-dashboard h-screen flex overflow-hidden bg-[#0f0e1a]">
            <ChauffeurSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative dashboard-main">
                {/* Header */}
                <header className="h-20 flex items-center justify-between px-8 z-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            {activeSection === 'dashboard' && 'Dashboard'}
                            {activeSection === 'mes-trajets' && 'Mes Trajets'}
                            {activeSection === 'historique' && 'Historique'}
                            {activeSection === 'fuel-logs' && 'Mes Ravitaillements'}
                            {activeSection === 'mon-profil' && 'Mon Profil'}
                        </h1>
                        {activeSection === 'dashboard' && (
                            <p className="text-sm text-dark-muted mt-1">Prêt pour la route ?</p>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-6">
                        {/* Search */}
                        <div className="relative hidden md:block">
                            <input type="text" className="bg-[#15132b] text-sm text-white rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-brand-cyan placeholder-gray-500 w-64" placeholder="Rechercher..."/>
                            <svg className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </div>

                        {/* Notification Bell */}
                        <button className="relative w-10 h-10 rounded-xl bg-gradient-to-r from-brand-pink to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 hover:scale-105 transition-transform">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                            </svg>
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-brand-pink text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
                        </button>

                        {/* Profile */}
                        <div className="flex items-center gap-3">
                            <img 
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'Chauffeur')}&background=06b6d4&color=fff`}
                                className="w-10 h-10 rounded-lg border-2 border-[#15132b]" 
                                alt="Profile"
                            />
                            <div className="hidden md:block">
                                <p className="text-sm font-medium text-white">{user?.fullName || 'Chauffeur'}</p>
                                <svg className="w-4 h-4 text-gray-500 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 z-10">
                    {renderSection()}
                </div>
            </main>
        </div>
    );

};

export default ChauffeurDashboard;
