import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, LogOut, Store } from 'lucide-react';

const Navbar = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'Stock In', path: '/stock-in' },
        { name: 'Sales', path: '/sales' },
        { name: 'Customers', path: '/customers' },
        { name: 'Payments', path: '/payments' },
        { name: 'Reports', path: '/reports' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-[500] shadow-xl">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <div className="flex items-center space-x-2 mr-8">
                            <Store className="text-blue-500 w-6 h-6" />
                            <span className="text-xl font-bold text-white">Kirana Store</span>
                        </div>
                        <div className="hidden lg:flex space-x-2">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `px-3 py-2 text-sm font-medium rounded-lg transition-all ${isActive
                                            ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        }`
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    <div className="hidden lg:block">
                        <button onClick={handleLogout} className="btn bg-red-900/20 text-red-400 hover:bg-red-900/30 !py-2 !px-4 !text-sm border border-red-900/30">
                            <LogOut className="w-4 h-4 mr-2" /> Logout
                        </button>
                    </div>

                    <div className="lg:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-400 p-2 hover:bg-slate-800 rounded-lg">
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-slate-900 border-t border-slate-800 py-4 shadow-2xl px-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) =>
                                `block px-3 py-4 text-base font-bold rounded-xl ${isActive ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-400'
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                    <button
                        onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                        className="w-full btn btn-danger mt-4 !rounded-xl"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
