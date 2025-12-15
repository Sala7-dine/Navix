import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';

const ChauffeurSidebar = ({ activeSection, onSectionChange }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
            )
        },
        {
            id: 'mes-trajets',
            label: 'Mes Trajets',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
            )
        },
        {
            id: 'historique',
            label: 'Historique',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
            )
        },
        {
            id: 'fuel-logs',
            label: 'Carburant',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            )
        },
        {
            id: 'mon-profil',
            label: 'Mon Profil',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            )
        }
    ];

    return (
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
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSectionChange && onSectionChange(item.id)}
                        className={`sidebar-link flex items-center gap-4 px-2 py-2 text-[#6F6C99] hover:text-white w-full ${
                            activeSection === item.id ? 'active' : ''
                        }`}
                    >
                        {item.icon}
                        <span className="font-medium text-sm hidden lg:block">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Logout */}
            <div className="mt-auto">
                <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-4 px-2 py-2 text-[#6F6C99] hover:text-white transition-colors w-full"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    <span className="font-medium hidden lg:block">Déconnexion</span>
                </button>
            </div>
        </aside>
    );
};

export default ChauffeurSidebar;
