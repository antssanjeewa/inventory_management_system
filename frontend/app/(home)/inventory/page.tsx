"use client";
import React, { useState, useMemo } from 'react';

const INITIAL_ITEMS = [
    { id: 1, name: "MacBook Pro 16\"", icon: "laptop_mac", code: "CEY-IT-0294", qty: "14", place: "Cupboard A-12", status: "In-Store", statusType: "success" },
    { id: 2, name: "Cisco Nexus Switch", icon: "router", code: "CEY-NET-0012", qty: "02", place: "Server Room B", status: "Borrowed", statusType: "info" },
    { id: 3, name: "Cat6 Ethernet Spool", icon: "settings_input_hdmi", code: "CEY-CAB-9921", qty: "01", place: "Cupboard C-01", status: "Low Stock", statusType: "warning" },
    { id: 4, name: "Dell UltraSharp 27\"", icon: "monitor", code: "CEY-PER-0556", qty: "08", place: "Cupboard B-04", status: "Missing", statusType: "error" },
    { id: 5, name: "HP LaserJet Enterprise", icon: "print", code: "CEY-OFF-0112", qty: "04", place: "Maintenance Dock", status: "Reserved", statusType: "neutral" },
];

export default function InventoryPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const filteredItems = useMemo(() => {
        return INITIAL_ITEMS.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                                 item.code.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === "All" || item.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [search, statusFilter]);

    return (
        <div className="bg-background font-body-md text-on-surface">
            <div className="flex justify-between items-end mb-xl">
                <div className="space-y-1">
                    <nav className="flex items-center gap-2 text-outline text-[10px] tracking-widest uppercase font-bold">
                        <span>Home</span>
                        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                        <span className="text-primary-fixed-dim">Inventory</span>
                    </nav>
                    <h2 className="text-h1 font-h1 tracking-tight">Item Inventory</h2>
                    <p className="text-body-sm text-outline">
                        Manage and track system assets across all storage locations.
                    </p>
                </div>

                <button className="bg-primary-container hover:bg-primary px-6 py-2.5 rounded-xl text-sm tracking-wider flex items-center gap-2 transition-all active:scale-95 text-on-primary font-bold">
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add New Item
                </button>
            </div>

            <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
                <div className="p-lg border-b border-outline-variant/20 bg-surface-container/50 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-3 flex-1">
                        <div className="relative group flex-1 max-w-sm">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-lg">search</span>
                            <input
                                type="text"
                                placeholder="Filter by name or code..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                            />
                        </div>
                        <FilterSelect 
                            value={statusFilter} 
                            onChange={(e: any) => setStatusFilter(e.target.value)}
                            options={["All", "In-Store", "Borrowed", "Low Stock", "Missing", "Reserved"]}
                        />
                        <FilterSelect label="Cupboard A-1" options={["Cupboard A-1", "Cupboard B-4", "Server Room B"]} />
                    </div>

                    <div className="flex gap-2">
                        <IconButton icon="file_download" />
                        <IconButton icon="print" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-container-high/40 border-b border-outline-variant/20">
                                <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest">Item Name</th>
                                <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest">Unique Code</th>
                                <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest text-right">Qty</th>
                                <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest">Place</th>
                                <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest">Status</th>
                                <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10 font-body-md">
                            {filteredItems.length > 0 ? (
                                filteredItems.map(item => (
                                    <InventoryRow key={item.id} {...item} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-outline">
                                        No items found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-lg border-t border-outline-variant/20 flex items-center justify-between bg-surface-container/30">
                    <p className="text-body-sm text-outline">
                        Showing <span className="font-bold text-on-surface">{filteredItems.length}</span> of {INITIAL_ITEMS.length} items
                    </p>
                    <div className="flex gap-1.5 items-center">
                        <PageButton icon="chevron_left" disabled />
                        <PageButton label="1" active />
                        <PageButton icon="chevron_right" disabled={filteredItems.length <= 5} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function InventoryRow({ name, icon, code, qty, place, status, statusType }: any) {
    const statusColors: any = {
        success: "bg-primary/10 text-primary-fixed-dim border-primary/20",
        info: "bg-secondary-container text-on-secondary-container border-outline-variant",
        warning: "bg-tertiary-container/20 text-tertiary border-tertiary/20",
        error: "bg-error-container/20 text-error border-error/30",
        neutral: "bg-surface-container-highest text-outline border-outline-variant"
    };

    return (
        <tr className="hover:bg-surface-bright/30 transition-colors group">
            <td className="p-5 flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-container-high rounded-xl flex items-center justify-center text-outline group-hover:text-primary transition-colors border border-outline-variant/50">
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </div>
                <span className="font-bold text-on-surface">{name}</span>
            </td>
            <td className="p-5 font-mono text-xs text-outline">{code}</td>
            <td className="p-5 text-right font-black">{qty}</td>
            <td className="p-5 text-on-surface-variant">{place}</td>
            <td className="p-5">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border ${statusColors[statusType]}`}>
                    {status}
                </span>
            </td>
            <td className="p-5">
                <div className="flex justify-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-on-surface hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button className="p-2 text-on-surface hover:text-tertiary hover:bg-tertiary/10 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                    </button>
                </div>
            </td>
        </tr>
    );
}

function FilterSelect({ value, onChange, options, label }: any) {
    return (
        <select 
            value={value} 
            onChange={onChange}
            className="bg-surface-container-lowest border border-outline-variant text-on-surface-variant rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-primary transition-colors cursor-pointer"
        >
            {label && <option disabled>{label}</option>}
            {options.map((opt: string) => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
    );
}

function IconButton({ icon }: any) {
    return (
        <button className="p-2.5 border border-outline-variant rounded-xl text-outline hover:text-on-surface hover:bg-surface-bright transition-all">
            <span className="material-symbols-outlined text-lg">{icon}</span>
        </button>
    );
}

function PageButton({ label, icon, active, disabled }: any) {
    return (
        <button
            disabled={disabled}
            className={`w-9 h-9 flex items-center justify-center rounded-xl border text-sm font-bold transition-all
            ${active ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20' :
                    disabled ? 'border-outline-variant text-outline-variant opacity-30 cursor-not-allowed' :
                        'border-outline-variant text-outline hover:bg-surface-bright hover:text-on-surface'}`}
        >
            {icon ? <span className="material-symbols-outlined text-lg">{icon}</span> : label}
        </button>
    );
}