import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import camionBg from '../../assets/images/camion-bg.jpg';
import { login, clearError } from '../../features/auth/authSlice';
import './LoginPage.css';

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        // Redirect if already authenticated
        if (isAuthenticated && user) {
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (user.role === 'chauffeur') {
                navigate('/chauffeur/dashboard');
            }
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        // Clear error on unmount
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const result = await dispatch(login(formData)).unwrap();
            
            // Vérifier si l'utilisateur est en attente d'approbation
            if (result.pending || !result.user.status) {
                // Sauvegarder les infos utilisateur pour la page pending
                localStorage.setItem('NAVIX_USER', JSON.stringify(result.user));
                navigate('/pending');
                return;
            }
            
            // Redirect based on user role
            if (result.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (result.user.role === 'chauffeur') {
                navigate('/chauffeur/dashboard');
            }
        } catch (err) {
            // Error is handled by Redux
            console.error('Login failed:', err);
        }
    };

    return (
        <div className="w-full h-screen flex overflow-hidden">
            
            {/* Left Panel - Welcome */}
            <div className="w-1/2 wave-bg relative flex flex-col items-center justify-center text-white p-12" style={{ backgroundImage: `url(${camionBg})` }}>
                
                {/* Overlay Color */}
                <div className="overlay"></div>
                
                {/* Grid Pattern */}
                <div className="grid-pattern"></div>
                
                {/* Decorative Circles */}
                <div className="circle circle-1"></div>
                <div className="circle circle-2"></div>
                <div className="circle circle-3"></div>
                
                {/* Decorative Dots */}
                <div className="dot" style={{ top: '25%', left: '30%' }}></div>
                <div className="dot" style={{ top: '45%', left: '80%' }}></div>
                <div className="dot" style={{ top: '65%', left: '20%' }}></div>
                <div className="dot" style={{ top: '75%', right: '25%' }}></div>
                <div className="dot" style={{ bottom: '20%', left: '50%' }}></div>
                
                {/* Content */}
                <div className="relative z-10 text-center">
                    <p className="text-lg font-light mb-4">Nice to see you again</p>
                    <h1 className="text-5xl font-bold mb-8 leading-tight">WELCOME BACK</h1>
                    <div className="w-20 h-1 bg-white mx-auto mb-8"></div>
                    <p className="text-white/90 max-w-md leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nos.
                    </p>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-1/2 bg-white flex items-center justify-center p-12">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                            Login Account
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nos.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <input 
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="input-field w-full px-4 py-3 rounded-lg text-gray-700 text-sm" 
                                placeholder="Email ID"
                            />
                        </div>

                        <div>
                            <input 
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="input-field w-full px-4 py-3 rounded-lg text-gray-700 text-sm" 
                                placeholder="Password"
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs">
                            <label className="flex items-center text-gray-600 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    className="w-4 h-4 rounded text-brand-pink focus:ring-brand-pink border-gray-300"
                                />
                                <span className="ml-2">Keep me signed in</span>
                            </label>
                            <a href="/register" className="text-brand-pink hover:underline font-medium">
                                Create account?
                            </a>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            style={{
                                background: 'linear-gradient(to right, #B721FF, #9333ea)'
                            }}
                            className="w-full py-3 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'CONNEXION...' : 'LOGIN'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
