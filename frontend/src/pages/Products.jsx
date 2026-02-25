import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import { Edit2, Trash2, Plus, Package } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({ name: '', category: '', price: '', stock_quantity: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get('products/');
            setProducts(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setFormData({ name: product.name, category: product.category, price: product.price, stock_quantity: product.stock_quantity });
        setShowForm(true);
    };

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`products/${selectedProduct.id}/`);
            fetchProducts();
            setShowDeleteModal(false);
        } catch (err) {
            alert("Error deleting product");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (selectedProduct) {
                await api.put(`products/${selectedProduct.id}/`, formData);
            } else {
                await api.post('products/', formData);
            }
            setShowForm(false);
            setFormData({ name: '', category: '', price: '', stock_quantity: '' });
            setSelectedProduct(null);
            fetchProducts();
        } catch (err) {
            alert("Error saving product");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6 px-4 sm:px-0">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white">Inventory</h1>
                    <p className="text-slate-500 font-medium">Manage your shop items and stock</p>
                </div>
                <button
                    onClick={() => { setSelectedProduct(null); setFormData({ name: '', category: '', price: '', stock_quantity: '' }); setShowForm(true); }}
                    className="btn btn-primary !py-3 !px-6"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add Item
                </button>
            </div>

            <div className="table-container shadow-2xl">
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="p-4">Product Details</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4 text-center">In Stock</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} className="hover:bg-slate-800/50 transition-colors h-20">
                                <td className="p-4">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-slate-800 rounded-lg mr-3">
                                            <Package className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <span className="font-bold text-white">{p.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-500 font-medium italic">{p.category}</td>
                                <td className="p-4 font-black text-blue-500">₹{p.price}</td>
                                <td className="p-4 text-center">
                                    <span className={`px-4 py-1 rounded-full font-black text-xs ${p.stock_quantity < 5 ? 'bg-red-900/20 text-red-500' : 'bg-blue-900/10 text-blue-500'}`}>
                                        {p.stock_quantity}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-center space-x-4">
                                        <button onClick={() => handleEdit(p)} className="p-2 text-slate-500 hover:text-blue-500 hover:bg-slate-800 rounded-lg transition-all">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDeleteClick(p)} className="p-2 text-slate-500 hover:text-red-500 hover:bg-slate-800 rounded-lg transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[1000] animate-in fade-in duration-300">
                    <div className="card w-full max-w-lg border-slate-800 shadow-[0_0_50px_-12px_rgba(37,99,235,0.1)]">
                        <h2 className="text-3xl font-black text-white mb-8">{selectedProduct ? 'Update Item' : 'Create New Item'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Product Name</label>
                                <input required className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Parle-G Large" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Category</label>
                                <input required className="input-field" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Biscuits" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Price (₹)</label>
                                    <input type="number" step="0.01" required className="input-field" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Initial Stock</label>
                                    <input type="number" required className="input-field" value={formData.stock_quantity} onChange={e => setFormData({ ...formData, stock_quantity: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex space-x-4 pt-6">
                                <button type="submit" disabled={isSubmitting} className="btn btn-primary flex-1 py-4 font-black">
                                    {isSubmitting ? 'Saving...' : 'Confirm & Save'}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary flex-1 py-4 font-black">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete Product"
                message={`Permanently remove "${selectedProduct?.name}" from your store inventory?`}
            />
        </div>
    );
};

export default Products;
