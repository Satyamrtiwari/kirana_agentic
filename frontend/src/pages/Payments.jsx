import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { IndianRupee, ShieldCheck, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Payments = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await api.get('customers/');
            setCustomers(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-8 px-4 sm:px-0">
            <div>
                <h1 className="text-3xl font-black text-white">Financial Audit</h1>
                <p className="text-slate-500 font-medium">Tracking outstanding dues and settlements</p>
            </div>

            <div className="table-container shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="p-4 text-xs tracking-widest">Member Name</th>
                            <th className="p-4 text-xs tracking-widest text-center">Contact</th>
                            <th className="p-4 text-xs tracking-widest text-right">Debit Due</th>
                            <th className="p-4 text-center text-xs tracking-widest">Standing</th>
                            <th className="p-4 text-center text-xs tracking-widest">Portal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(c => {
                            const isPaid = parseFloat(c.total_due) === 0;
                            return (
                                <tr key={c.id} className="hover:bg-slate-800/50 border-b border-slate-800 h-24 transition-colors">
                                    <td className="p-4 font-black text-white text-lg">{c.name}</td>
                                    <td className="p-4 text-slate-500 font-bold text-center tracking-widest">{c.mobile}</td>
                                    <td className={`p-4 text-right font-black text-2xl ${isPaid ? 'text-slate-600' : 'text-red-500'}`}>
                                        ₹{c.total_due}
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className={`inline-flex items-center px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.2em] border shadow-sm ${isPaid ? 'bg-emerald-900/10 text-emerald-500 border-emerald-900/20' : 'bg-red-900/20 text-red-500 border-red-900/30'
                                            }`}>
                                            {isPaid ? <ShieldCheck className="w-3 h-3 mr-2" /> : <Clock className="w-3 h-3 mr-2" />}
                                            {isPaid ? 'Settled' : 'Pending'}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => navigate(`/customers/${c.id}`)}
                                            className="btn btn-primary !py-2.5 !px-5 !text-xs font-black uppercase tracking-widest !rounded-full shadow-blue-950/20"
                                        >
                                            Settlement
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Payments;
