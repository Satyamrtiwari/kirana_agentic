import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Receipt, ShoppingCart, User } from 'lucide-react';

const Sales = () => {
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        customer: '',
        product: '',
        quantity: 1,
        payment_type: 'Cash'
    });
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (formData.product && formData.quantity) {
            const product = products.find(p => p.id === parseInt(formData.product));
            if (product) {
                setTotalPrice(product.price * formData.quantity);
            }
        } else {
            setTotalPrice(0);
        }
    }, [formData.product, formData.quantity, products]);

    const fetchData = async () => {
        try {
            const [prodRes, custRes] = await Promise.all([
                api.get('products/'),
                api.get('customers/')
            ]);
            setProducts(prodRes.data);
            setCustomers(custRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCustomerChange = (e) => {
        const val = e.target.value;
        setFormData({
            ...formData,
            customer: val,
            payment_type: val === '' ? 'Cash' : formData.payment_type
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const product = products.find(p => p.id === parseInt(formData.product));
        if (product && formData.quantity > product.stock_quantity) {
            alert(`Insufficient stock! Only ${product.stock_quantity} left.`);
            return;
        }
        setIsSubmitting(true);
        try {
            await api.post('sales/', { ...formData, total_price: totalPrice });
            alert("Sale recorded successfully!");
            setFormData({ customer: '', product: '', quantity: 1, payment_type: 'Cash' });
        } catch (err) {
            alert("Error recording sale");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-2xl mx-auto space-y-8 px-4 sm:px-0">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white">New Sale</h1>
                    <p className="text-slate-500 font-medium">Create a new purchase transaction</p>
                </div>
                <div className="p-4 bg-emerald-600/10 rounded-2xl">
                    <ShoppingCart className="w-8 h-8 text-emerald-500" strokeWidth={2.5} />
                </div>
            </div>

            <div className="card border-slate-800 shadow-[0_0_50px_-12px_rgba(16,185,129,0.05)]">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                Select Customer
                            </label>
                            <select className="input-field bg-slate-800" value={formData.customer} onChange={handleCustomerChange}>
                                <option value="">Walk-in / Guest</option>
                                {customers.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Select Product</label>
                            <select required className="input-field bg-slate-800" value={formData.product} onChange={e => setFormData({ ...formData, product: e.target.value })}>
                                <option value="">-- Choose Item --</option>
                                {products.filter(p => p.stock_quantity > 0).map(p => (
                                    <option key={p.id} value={p.id} className="bg-slate-900">{p.name} (₹{p.price})</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Quantity</label>
                                <input type="number" min="1" required className="input-field" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Total Bill</label>
                                <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl text-3xl font-black text-blue-500 shadow-inner">
                                    ₹{totalPrice}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-4 ml-1 uppercase tracking-widest">Transaction Mode</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {['Cash', 'UPI', 'Credit'].map((mode) => {
                                    const isDisabled = mode === 'Credit' && formData.customer === '';
                                    return (
                                        <label
                                            key={mode}
                                            className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all font-black text-sm uppercase tracking-wide ${formData.payment_type === mode
                                                ? 'bg-blue-600/20 border-blue-600 text-blue-400'
                                                : 'bg-slate-800 border-slate-700 text-slate-500'
                                                } ${isDisabled ? 'opacity-20 cursor-not-allowed grayscale' : 'hover:border-slate-500'}`}
                                        >
                                            <input
                                                type="radio"
                                                value={mode}
                                                disabled={isDisabled}
                                                className="hidden"
                                                checked={formData.payment_type === mode}
                                                onChange={e => setFormData({ ...formData, payment_type: e.target.value })}
                                            />
                                            {mode}
                                        </label>
                                    );
                                })}
                            </div>
                            {formData.customer === '' && (
                                <p className="text-[10px] text-slate-600 mt-3 font-bold uppercase tracking-widest">* Register customer to enable Udhaar</p>
                            )}
                        </div>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="btn btn-success w-full py-6 text-2xl font-black tracking-widest shadow-emerald-950/40">
                        <Receipt className="w-8 h-8 mr-3" strokeWidth={2.5} />
                        {isSubmitting ? 'GENERATING RECEIPT...' : 'COMPLETE SALE'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Sales;
