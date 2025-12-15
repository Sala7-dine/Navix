import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../../features/users/usersSlice';
import UserModal from '../../../components/modals/UserModal';
import '../../admin/AdminDashboard.css';

const Users = () => {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.users);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSubmit = async (userData) => {
        try {
            if (selectedUser) {
                await dispatch(updateUser({ 
                    id: selectedUser._id, 
                    data: userData 
                })).unwrap();
                showNotification('Utilisateur modifié avec succès');
            } else {
                await dispatch(createUser(userData)).unwrap();
                showNotification('Utilisateur ajouté avec succès');
            }
            setIsModalOpen(false);
            setSelectedUser(null);
        } catch (err) {
            showNotification(err || 'Une erreur est survenue', 'error');
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteUser(userToDelete._id)).unwrap();
            showNotification('Utilisateur supprimé avec succès');
            setShowDeleteConfirm(false);
            setUserToDelete(null);
        } catch (err) {
            showNotification(err || 'Une erreur est survenue', 'error');
        }
    };

    const handleAddNew = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const totalUsers = users.length;
    const chauffeurs = users.filter(u => u.role === 'chauffeur').length;
    const admins = users.filter(u => u.role === 'admin').length;
    const actifs = users.filter(u => u.status === true).length;

    const handleToggleStatus = async (user) => {
        try {
            const newStatus = !user.status;
            await dispatch(updateUser({ 
                id: user._id, 
                data: { status: newStatus }
            })).unwrap();
            showNotification(`Utilisateur ${newStatus ? 'activé' : 'désactivé'} avec succès`);
        } catch (err) {
            showNotification(err || 'Une erreur est survenue', 'error');
        }
    };

    const getRoleColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
            case 'chauffeur': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getStatusColor = (status) => {
        return status ? 'bg-green-500' : 'bg-gray-500';
    };

    const getStatusText = (status) => {
        return status ? 'Actif' : 'Inactif';
    };

    return (
        <div className="p-8">
            {notification && (
                <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
                    notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                } text-white`}>
                    {notification.message}
                </div>
            )}

            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Gestion des Utilisateurs</h1>
                    <p className="text-dark-muted">Gérez tous les utilisateurs de la plateforme</p>
                </div>
                <button 
                    onClick={handleAddNew}
                    className="px-6 py-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                >
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
                            <span className="text-2xl font-bold text-white">{totalUsers}</span>
                            <span className="text-xs font-medium text-white/80 uppercase">Total</span>
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
                            <span className="text-2xl font-bold text-white">{chauffeurs}</span>
                            <span className="text-xs font-medium text-dark-muted uppercase">Chauffeurs</span>
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
                            <span className="text-2xl font-bold text-white">{admins}</span>
                            <span className="text-xs font-medium text-dark-muted uppercase">Admins</span>
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
                            <span className="text-2xl font-bold text-white">{actifs}</span>
                            <span className="text-xs font-medium text-dark-muted uppercase">Actifs</span>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="glass-card p-8 rounded-xl border border-white/10 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-cyan border-t-transparent"></div>
                    <p className="text-dark-muted mt-4">Chargement...</p>
                </div>
            ) : users.length === 0 ? (
                <div className="glass-card p-12 rounded-xl border border-white/10 text-center">
                    <svg className="w-16 h-16 mx-auto text-dark-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-white mb-2">Aucun utilisateur</h3>
                    <p className="text-dark-muted mb-6">Commencez par ajouter votre premier utilisateur</p>
                    <button 
                        onClick={handleAddNew}
                        className="px-6 py-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                    >
                        + Ajouter un utilisateur
                    </button>
                </div>
            ) : (
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
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Statut</th>
                                    <th className="text-left py-4 px-4 text-dark-muted font-medium text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4 text-dark-muted">{index + 1}</td>
                                        <td className="py-4 px-4 text-white font-medium">{user.fullName}</td>
                                        <td className="py-4 px-4 text-dark-muted">{user.email}</td>
                                        <td className="py-4 px-4 text-dark-muted">{user.telephone || '-'}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                                {user.role?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <button
                                                onClick={() => handleToggleStatus(user)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)} text-white hover:opacity-80 transition-opacity cursor-pointer`}
                                                title={user.status ? 'Cliquez pour désactiver' : 'Cliquez pour activer'}
                                            >
                                                {getStatusText(user.status)}
                                            </button>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleEdit(user)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Modifier"
                                                >
                                                    <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(user)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Supprimer"
                                                >
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
            )}

            <UserModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedUser(null);
                }}
                onSubmit={handleSubmit}
                user={selectedUser}
                loading={loading}
            />

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#252140]/95 backdrop-blur-2xl rounded-3xl p-8 max-w-md w-full mx-4 border border-white/10">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Confirmer la suppression</h3>
                            <p className="text-gray-400 mb-6">
                                Êtes-vous sûr de vouloir supprimer l'utilisateur <span className="font-semibold text-white">{userToDelete?.fullName}</span> ?
                                Cette action est irréversible.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setUserToDelete(null);
                                    }}
                                    className="flex-1 px-4 py-3 bg-[#1a1633]/60 text-white rounded-xl font-medium hover:bg-[#1a1633]/80 transition-colors border border-white/10"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-red-500/50 transition-all"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
