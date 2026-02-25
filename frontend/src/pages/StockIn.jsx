import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Truck, PackageCheck } from 'lucide-react';

const StockIn = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ supplier_name: '', product: '', quantity_received: '', cost_price: '' });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('products/');
            setProducts(response.data);
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
            await api.post('stock-in/', formData);
            alert("Inventory replenished successfully!");
            setFormData({ supplier_name: '', product: '', quantity_received: '', cost_price: '' });
        } catch (err) {
            alert("Error adding stock");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-2xl mx-auto space-y-8 px-4 sm:px-0">
            <div className="text-center">
                <div className="inline-flex p-4 bg-blue-600/10 rounded-full mb-4">
                    <Truck className="w-10 h-10 text-blue-500" />
                </div>
                <h1 className="text-3xl font-black text-white">Replenish Stock</h1>
                <p className="text-slate-500 font-medium">Record new inventory arrival from suppliers</p>
            </div>

            <div className="card border-slate-800 shadow-[0_0_50px_-12px_rgba(37,99,235,0.05)]">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Supplier Details</label>
                        <input required className="input-field" value={formData.supplier_name} onChange={e => setFormData({ ...formData, supplier_name: e.target.value })} placeholder="e.g. Metro Wholesale India" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Select Item</label>
                        <select required className="input-field bg-slate-800" value={formData.product} onChange={e => setFormData({ ...formData, product: e.target.value })}>
                            <option value="">-- Choose from Inventory --</option>
                            {products.map(p => <option key={p.id} value={p.id} className="bg-slate-900">{p.name} (Current Stock: {p.stock_quantity})</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Quantity New arrival</label>
                            <input type="number" required className="input-field" value={formData.quantity_received} onChange={e => setFormData({ ...formData, quantity_received: e.target.value })} placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Unit Cost Price (₹)</label>
                            <input type="number" step="0.01" required className="input-field" value={formData.cost_price} onChange={e => setFormData({ ...formData, cost_price: e.target.value })} placeholder="0.00" />
                        </div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full py-5 text-xl font-black tracking-wide shadow-blue-900/30">
                        <PackageCheck className="w-6 h-6 mr-3" />
                        {isSubmitting ? 'Processing Entry...' : 'Post Purchase & Update Stock'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StockIn;
