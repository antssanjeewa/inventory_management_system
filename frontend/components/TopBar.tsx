import React from 'react';

export default function Topbar() {
    return (
        <header className="h-16 border-b border-outline-variant/40 bg-surface-container/80 backdrop-blur-md sticky top-0 flex items-center justify-between px-8 z-40">
            <div className="max-w-xl w-full">

            </div>
            <div className="flex items-center gap-4">
                <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
                    <span className="material-symbols-outlined">notifications</span>
                </button>
                <div className="h-8 w-px bg-outline-variant mx-2"></div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-on-surface leading-none">Operations Lead</p>
                        <p className="text-[10px] text-outline">Inventory Dept</p>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-primary-fixed bg-surface-bright flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-lg">person</span>
                    </div>
                </div>
            </div>
        </header>
    );
}