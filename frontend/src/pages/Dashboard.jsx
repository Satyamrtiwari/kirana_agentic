import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardCards from '../components/DashboardCards';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusCircle, ShoppingCart, UserPlus, FileText, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('reports/dashboard/');
                setStats(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <LoadingSpinner />;

    const quickActions = [
        { label: 'Add Product', icon: PlusCircle, path: '/products', bg: 'bg-blue-600' },
        { label: 'New Sale', icon: ShoppingCart, path: '/sales', bg: 'bg-emerald-600' },
        { label: 'Add Customer', icon: UserPlus, path: '/customers', bg: 'bg-indigo-600' },
        { label: 'View Reports', icon: FileText, path: '/reports', bg: 'bg-slate-700' },
    ];

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Store Dashboard</h1>
                    <div className="flex items-center text-slate-500 mt-2 font-medium space-x-2">
                        <Activity className="w-4 h-4 text-blue-500" />
                        <span>Live Analytics & Inventory</span>
                    </div>
                </div>
            </div>

            <DashboardCards stats={stats} />

            <div className="space-y-8">
                <h2 className="text-xl font-bold text-slate-200">System Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(action.path)}
                            className={`btn ${action.bg} text-white flex-col space-y-4 py-12 rounded-2xl shadow-2xl transition-all hover:-translate-y-2 hover:brightness-110 active:scale-95`}
                        >
                            <action.icon size={44} strokeWidth={2.5} />
                            <span className="text-xl font-black">{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
