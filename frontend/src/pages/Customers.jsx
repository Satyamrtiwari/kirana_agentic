import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { UserPlus, Search, ArrowRight, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', mobile: '', address: '', credit_limit: 5000 });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await api.get('customers/');
            setCustomers(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('customers/', formData);
            setShowForm(false);
            setFormData({ name: '', mobile: '', address: '', credit_limit: 5000 });
            fetchCustomers();
        } catch (err) {
            alert("Error adding customer");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (customer) => {
        setCustomerToDelete(customer);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`customers/${customerToDelete.id}/`);
            setShowDeleteModal(false);
            fetchCustomers();
        } catch (err) {
            alert("Error deleting customer");
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-8 px-4 sm:px-0">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white">Customer Base</h1>
                    <p className="text-slate-500 font-medium">Manage credit and regular customers</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn btn-primary !py-3 !px-6"
                >
                    <UserPlus className="w-5 h-5 mr-2" /> Register Customer
                </button>
            </div>

            <div className="table-container shadow-2xl">
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="p-4 text-xs tracking-widest">Profile Name</th>
                            <th className="p-4 text-xs tracking-widest text-center">Mobile Link</th>
                            <th className="p-4 text-xs tracking-widest text-right">Debit Balance</th>
                            <th className="p-4 text-center text-xs tracking-widest">Portal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(c => (
                            <tr key={c.id} className="hover:bg-slate-800/50 transition-all h-20 border-b border-slate-800">
                                <td className="p-4 font-black text-white text-lg">{c.name}</td>
                                <td className="p-4 text-slate-500 font-bold text-center tracking-widest">{c.mobile}</td>
                                <td className={`p-4 text-right font-black text-xl ${parseFloat(c.total_due) > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                    ₹{c.total_due}
                                </td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => navigate(`/customers/${c.id}`)}
                                        className="btn btn-secondary !py-2 !px-4 !text-xs !rounded-full group mr-2"
                                    >
                                        View Portal <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(c)}
                                        className="btn btn-danger !py-2 !px-4 !text-xs !rounded-full"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[1000] animate-in fade-in duration-300">
                    <div className="card w-full max-w-lg shadow-[0_0_50px_-12px_rgba(37,99,235,0.1)]">
                        <h2 className="text-3xl font-black text-white mb-8 text-center uppercase tracking-widest italic">New Customer Profile</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Full Name</label>
                                <input required className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Mobile Contact</label>
                                <input required className="input-field" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} maxLength="10" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Address</label>
                                <textarea className="input-field h-24" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Credit Limit (₹)</label>
                                <input type="number" required className="input-field" value={formData.credit_limit} onChange={e => setFormData({ ...formData, credit_limit: e.target.value })} />
                            </div>
                            <div className="flex space-x-4 pt-6">
                                <button type="submit" disabled={isSubmitting} className="btn btn-primary flex-1 py-4 font-black">
                                    {isSubmitting ? 'Registering...' : 'Register Profile'}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary flex-1 py-4 font-black">Dismiss</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showDeleteModal && (
                <ConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                    title="Delete Customer"
                    message={`Are you sure you want to delete ${customerToDelete?.name}? All history will be lost.`}
                />
            )}
        </div>
    );
};

export default Customers;
