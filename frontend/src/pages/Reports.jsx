import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Download, FileBarChart, PieChart, Package as StockIcon, UserMinus } from 'lucide-react';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('sales');
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReport();
    }, [activeTab]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const response = await api.get(`reports/${activeTab}/`);
            setReportData(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'sales', label: 'Sales Feed', icon: FileBarChart },
        { id: 'stock', label: 'Stock Audit', icon: StockIcon },
        { id: 'pending-payments', label: 'Debt Log', icon: UserMinus }
    ];

    return (
        <div className="space-y-10 px-4 sm:px-0">
            <div className="flex justify-between items-center flex-wrap gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">Intelligence</h1>
                    <p className="text-slate-500 font-medium italic">Data driven insights for your business</p>
                </div>
                <button
                    onClick={() => alert("CSV Export feature coming soon!")}
                    className="btn btn-secondary !py-3 !px-6 text-sm font-black tracking-widest uppercase flex items-center"
                >
                    <Download className="w-4 h-4 mr-2" /> Data Export
                </button>
            </div>

            <div className="flex flex-wrap gap-4 border-b border-slate-800 pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-8 py-5 font-black text-xs uppercase tracking-[0.2em] transition-all rounded-t-2xl border-x border-t ${activeTab === tab.id
                                ? 'bg-blue-600/10 text-blue-400 border-slate-800 border-b-bg-slate-950 -mb-2.5'
                                : 'text-slate-500 border-transparent hover:text-slate-300'
                            }`}
                    >
                        <tab.icon className="w-4 h-4 mr-3" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading ? <LoadingSpinner /> : (
                <div className="table-container shadow-2xl border-slate-800">
                    {activeTab === 'sales' && (
                        <table className="w-full text-left">
                            <thead>
                                <tr>
                                    <th className="p-5">Time Stamp</th>
                                    <th className="p-5">Item Name</th>
                                    <th className="p-5 text-center">Units</th>
                                    <th className="p-5 text-right">Revenue</th>
                                    <th className="p-5 text-center">Mode</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((s, i) => (
                                    <tr key={i} className="hover:bg-slate-800/50 border-b border-slate-800 transition-colors h-20">
                                        <td className="p-5 text-[10px] font-black text-slate-500 tracking-widest">{new Date(s.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }).toUpperCase()}</td>
                                        <td className="p-5 font-black text-white text-lg">{s.product}</td>
                                        <td className="p-5 text-center font-bold text-slate-400">{s.quantity}</td>
                                        <td className="p-5 text-right font-black text-blue-500 text-xl">₹{s.total_price}</td>
                                        <td className="p-5 text-center">
                                            <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-[0.1em] uppercase border ${s.payment_type === 'Credit' ? 'bg-red-900/20 text-red-500 border-red-900/30' : 'bg-emerald-900/10 text-emerald-500 border-emerald-900/20'
                                                }`}>
                                                {s.payment_type}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'stock' && (
                        <table className="w-full text-left">
                            <thead>
                                <tr>
                                    <th className="p-5">Identifier</th>
                                    <th className="p-5">Tag</th>
                                    <th className="p-5 text-right">Retail Price</th>
                                    <th className="p-5 text-center">Available Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((p, i) => (
                                    <tr key={i} className="hover:bg-slate-800/50 border-b border-slate-800 transition-colors h-20">
                                        <td className="p-5 font-black text-white text-xl">{p.name}</td>
                                        <td className="p-5 text-slate-500 font-bold uppercase tracking-widest text-[10px]">{p.category}</td>
                                        <td className="p-5 text-right font-black text-blue-500 text-xl">₹{p.price}</td>
                                        <td className="p-5 text-center">
                                            <div className={`inline-block px-6 py-2 rounded-full font-black text-lg ${p.stock < 10 ? 'bg-red-900/20 text-red-500 border border-red-900/30' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                                                {p.stock}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'pending-payments' && (
                        <table className="w-full text-left">
                            <thead>
                                <tr>
                                    <th className="p-5">Profile Name</th>
                                    <th className="p-5">Link Contact</th>
                                    <th className="p-5 text-right">Deficit Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((c, i) => (
                                    <tr key={i} className="hover:bg-slate-800/50 border-b border-slate-800 transition-colors h-24">
                                        <td className="p-5 font-black text-white text-2xl tracking-tighter">{c.name}</td>
                                        <td className="p-5 text-slate-500 font-black tracking-[0.2em] text-sm">{c.mobile}</td>
                                        <td className="p-5 text-right font-black text-4xl text-red-500 drop-shadow-lg shadow-red-500/20">₹{c.total_due}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default Reports;
