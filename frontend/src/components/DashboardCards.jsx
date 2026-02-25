import React from 'react';
import { Package, TrendingUp, Wallet, AlertTriangle } from 'lucide-react';

const DashboardCards = ({ stats }) => {
    if (!stats) return null;
    const cards = [
        {
            label: 'Total Products',
            value: stats.total_products,
            icon: Package,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            label: "Today's Sales",
            value: `₹${stats.today_sales}`,
            icon: TrendingUp,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
        {
            label: 'Pending Payments',
            value: `₹${stats.total_pending}`,
            icon: Wallet,
            color: 'text-rose-500',
            bg: 'bg-rose-500/10'
        },
        {
            label: 'Low Stock Items',
            value: stats.low_stock_count,
            icon: AlertTriangle,
            color: stats.low_stock_count > 0 ? 'text-amber-500' : 'text-slate-500',
            bg: stats.low_stock_count > 0 ? 'bg-amber-500/10' : 'bg-slate-800'
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
                <div key={index} className="card group hover:border-slate-700 transition-all flex flex-col items-center justify-center py-10">
                    <div className={`p-4 rounded-2xl ${card.bg} mb-4 group-hover:scale-110 transition-transform`}>
                        <card.icon className={`w-8 h-8 ${card.color}`} strokeWidth={2.5} />
                    </div>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">{card.label}</p>
                    <p className={`text-4xl font-black ${card.color}`}>{card.value}</p>
                </div>
            ))}
        </div>
    );
};

export default DashboardCards;
