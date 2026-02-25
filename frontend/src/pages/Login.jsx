import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Store, LogIn, ShieldAlert } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full"></div>

            <div className="card w-full max-w-md relative z-10 border-blue-900/30">
                <div className="flex flex-col items-center mb-10">
                    <div className="p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-900/20 mb-6">
                        <Store className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Kirana Store</h1>
                    <p className="text-slate-500 mt-2">Sign in to manage your inventory</p>
                </div>

                {error && (
                    <div className="p-4 bg-red-900/20 text-red-400 border border-red-900/30 rounded-xl mb-6 text-sm flex items-center">
                        <ShieldAlert className="w-4 h-4 mr-2 shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Username</label>
                        <input
                            required
                            className="input-field"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            required
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full py-4 text-xl font-black tracking-wide"
                    >
                        {loading ? 'Authenticating...' : 'Login to Store'}
                    </button>
                </form>

                <p className="text-center mt-8 text-slate-600 text-xs">
                    Protected by ShopGuard Encryption
                </p>
            </div>
        </div>
    );
};

export default Login;
