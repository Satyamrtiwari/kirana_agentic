import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { IndianRupee, ArrowLeft, History, Wallet2, Trash2 } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentData, setPaymentData] = useState({ amount_paid: '', payment_mode: 'Cash' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [custRes, salesRes] = await Promise.all([
                api.get(`customers/${id}/`),
                api.get(`reports/sales/`)
            ]);
            setCustomer(custRes.data);
            setSales(salesRes.data.filter(s => s.customer === custRes.data.name));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('payments/', {
                customer: customer.id,
                amount_paid: paymentData.amount_paid,
                payment_mode: paymentData.payment_mode
            });
            setShowPaymentModal(false);
            setPaymentData({ amount_paid: '', payment_mode: 'Cash' });
            fetchData();
            alert("Payment processed!");
        } catch (err) {
            alert("Error recording payment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`customers/${id}/`);
            navigate('/customers');
        } catch (err) {
            alert("Error deleting customer");
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-10 px-4 sm:px-0">
            <div className="flex justify-between items-center">
                <button onClick={() => navigate('/customers')} className="flex items-center text-slate-500 font-bold hover:text-blue-500 transition-colors uppercase tracking-widest text-xs">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Customers
                </button>
                <button onClick={() => setShowDeleteModal(true)} className="btn btn-danger !py-2 !px-4 !text-xs !rounded-lg">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Profile
                </button>
            </div>

            <div className="flex justify-between items-center flex-wrap gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-white">{customer.name}</h1>
                    <div className="flex items-center space-x-4 text-slate-500 font-bold">
                        <span>{customer.mobile}</span>
                        <span className="w-2 h-2 bg-slate-700 rounded-full"></span>
                        <span className="italic">{customer.address || 'Global Store Member'}</span>
                    </div>
                </div>
                <button
                    disabled={parseFloat(customer.total_due) === 0}
                    onClick={() => { setPaymentData({ ...paymentData, amount_paid: customer.total_due }); setShowPaymentModal(true); }}
                    className="btn btn-success !py-4 !px-8 shadow-emerald-950/40"
                >
                    <IndianRupee className="w-5 h-5 mr-3" /> Process Payment
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="card text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet2 className="w-12 h-12" />
                    </div>
                    <p className="text-xs text-slate-500 font-black mb-3 uppercase tracking-[0.2em]">Total Spend</p>
                    <p className="text-4xl font-black text-white">₹{customer.total_purchases || '-'}</p>
                </div>
                <div className="card text-center">
                    <p className="text-xs text-slate-500 font-black mb-3 uppercase tracking-[0.2em]">Credit Limit</p>
                    <p className="text-4xl font-black text-blue-500">₹{customer.credit_limit || '5000'}</p>
                </div>
                <div className="card text-center border-red-900/30 bg-red-900/5 ring-1 ring-red-900/20">
                    <p className="text-xs text-red-500/70 font-black mb-3 uppercase tracking-[0.2em]">Current Balance</p>
                    <p className="text-4xl font-black text-red-500">₹{customer.total_due}</p>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-black text-white flex items-center">
                    <History className="w-6 h-6 mr-3 text-blue-500" />
                    Transaction Ledger
                </h2>
                <div className="table-container shadow-2xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th className="p-4 text-xs tracking-widest">Entry Date</th>
                                <th className="p-4 text-xs tracking-widest">Product Item</th>
                                <th className="p-4 text-xs tracking-widest text-center">Qty</th>
                                <th className="p-4 text-xs tracking-widest text-right">Bill Amt</th>
                                <th className="p-4 text-xs tracking-widest text-center">Method</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map((s, i) => (
                                <tr key={i} className="hover:bg-slate-800/50 border-b border-slate-800 h-20 transition-colors">
                                    <td className="p-4 text-slate-500 font-bold">{new Date(s.date).toLocaleDateString()}</td>
                                    <td className="p-4 font-black text-white">{s.product}</td>
                                    <td className="p-4 text-center font-bold text-slate-400">{s.quantity}</td>
                                    <td className="p-4 text-right font-black text-blue-500 text-lg">₹{s.total_price}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${s.payment_type === 'Credit' ? 'bg-red-900/20 text-red-500 border-red-900/30' : 'bg-emerald-900/10 text-emerald-500 border-emerald-900/20'
                                            }`}>
                                            {s.payment_type}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[1000] animate-in fade-in duration-300">
                    <div className="card w-full max-w-sm shadow-[0_0_50px_-12px_rgba(16,185,129,0.1)]">
                        <h2 className="text-2xl font-black text-white mb-8 text-center uppercase tracking-widest">Settlement Portal</h2>
                        <form onSubmit={handlePayment} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Amount to Clear (₹)</label>
                                <input type="number" step="0.01" required className="input-field text-3xl font-black text-emerald-500" value={paymentData.amount_paid} onChange={e => setPaymentData({ ...paymentData, amount_paid: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Settlement Mode</label>
                                <select className="input-field bg-slate-800" value={paymentData.payment_mode} onChange={e => setPaymentData({ ...paymentData, payment_mode: e.target.value })}>
                                    <option value="Cash">Physical Cash</option>
                                    <option value="UPI">Digital UPI</option>
                                </select>
                            </div>
                            <div className="flex space-x-4 pt-6">
                                <button type="submit" disabled={isSubmitting} className="btn btn-success flex-1 py-5 font-black uppercase tracking-widest">
                                    {isSubmitting ? 'Confirming...' : 'Confirm Payment'}
                                </button>
                                <button type="button" onClick={() => setShowPaymentModal(false)} className="btn btn-secondary flex-1 py-5 font-black uppercase tracking-widest">Dismiss</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showDeleteModal && (
                <ConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDelete}
                    title="Delete Customer"
                    message={`Are you sure you want to delete ${customer?.name}? All history will be lost.`}
                />
            )}
        </div>
    );
};

export default CustomerDetail;
