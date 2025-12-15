import React from 'react';
import { useNavigate } from 'react-router-dom';
import { STORAGE_KEYS } from '../../config/constants';

const PendingApproval = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // Récupérer les infos de l'utilisateur du localStorage
    const userData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DATA) || localStorage.getItem('NAVIX_USER') || '{}');

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a1f] via-[#1a1a3e] to-[#0a0a1f] flex items-center justify-center p-4">
            <div className="glass-panel p-10 max-w-lg w-full rounded-2xl text-center">
                {/* Icon */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-6 border border-yellow-500/30">
                    <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-white mb-4">
                    Compte en attente d'approbation
                </h1>

                {/* Message */}
                <p className="text-dark-muted mb-2">
                    Bonjour <span className="text-white font-semibold">{userData.fullName || 'Utilisateur'}</span>,
                </p>
                <p className="text-dark-muted mb-8">
                    Votre compte a été créé avec succès ! Un administrateur doit maintenant l'activer avant que vous puissiez accéder à l'application.
                    Vous recevrez une notification par email dès que votre compte sera activé.
                </p>

                {/* Info Box */}
                <div className="glass-card p-6 rounded-xl mb-8 border border-yellow-500/20">
                    <div className="flex items-start gap-4">
                        <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-left">
                            <h3 className="text-white font-semibold mb-2">Que faire en attendant ?</h3>
                            <ul className="text-dark-muted text-sm space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-400">•</span>
                                    <span>Vérifiez régulièrement vos emails</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-400">•</span>
                                    <span>Contactez votre administrateur si nécessaire</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-400">•</span>
                                    <span>L'activation peut prendre quelques heures</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center">
                    <button
                        onClick={handleLogout}
                        className="px-8 py-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                    >
                        Retourner à la page de connexion
                    </button>
                </div>

                {/* Footer */}
                <p className="text-dark-muted text-xs mt-6">
                    Email de connexion : <span className="text-white">{userData.email || 'N/A'}</span>
                </p>
            </div>
        </div>
    );
};

export default PendingApproval;
