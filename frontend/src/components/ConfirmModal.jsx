import React from 'react';
import { AlertCircle } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[1000] animate-in fade-in duration-300">
            <div className="bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-800 scale-in-center overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[60px] rounded-full -mr-16 -mt-16"></div>

                <div className="flex flex-col items-center text-center">
                    <div className="p-4 bg-red-900/20 rounded-full mb-6">
                        <AlertCircle className="w-10 h-10 text-red-500" strokeWidth={2} />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2">{title || 'Confirm Action'}</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed font-medium">{message || 'This action is permanent and cannot be reversed.'}</p>

                    <div className="flex w-full gap-4">
                        <button
                            onClick={onConfirm}
                            className="btn btn-danger flex-1 py-3 text-base shadow-red-950/20"
                        >
                            Delete
                        </button>
                        <button
                            onClick={onClose}
                            className="btn btn-secondary flex-1 py-3 text-base font-bold"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
