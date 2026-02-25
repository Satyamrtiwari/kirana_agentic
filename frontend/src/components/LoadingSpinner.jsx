import React from 'react';

const LoadingSpinner = () => (
    <div className="flex flex-col justify-center items-center p-20 space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600/20 border-t-blue-600"></div>
        <p className="text-slate-500 font-bold animate-pulse tracking-widest text-xs uppercase">Loading Store Data</p>
    </div>
);

export default LoadingSpinner;
