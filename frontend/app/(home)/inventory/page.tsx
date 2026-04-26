"use client";

import { useState, useEffect } from 'react';
import PageButton from '@/components/PageButton';
import Breadcrumb from '@/components/Breadcrumb';
import { InventoryItem, getInventoryItems, deleteInventoryItem } from '@/services/InventoryService';
import { Cupboard, Place, getCupboards, getPlaces } from '@/services/StorageService';
import { confirmAction, showError, showSuccess } from '@/lib/alert';
import { TableLoading } from '@/components/TableLoading';
import { TableEmpty } from '@/components/TableEmpty';
import Link from 'next/link';

export default function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [cupboards, setCupboards] = useState<Cupboard[]>([]);
    const [places, setPlaces] = useState<Place[]>([]);
    const [meta, setMeta] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        search: "",
        status: "",
        place_id: "",
        cupboard_id: "",
        page: 1
    });

    useEffect(() => {
        loadFilters();
        loadInventory();
    }, [filters.page, filters.status, filters.place_id]);

    const loadFilters = async () => {
        try {
            const [cpbRes] = await Promise.all([getCupboards()]);
            setCupboards(cpbRes.items);
        } catch (error: any) {
            console.error("Filter loading error:", error);
        }
    };

    const loadPlacesForCupboard = async (cupboardId: string) => {
        if (!cupboardId) {
            setPlaces([]);
            return;
        }
        try {
            const res = await getPlaces(parseInt(cupboardId));
            setPlaces(res.items);
        } catch (error: any) {
            showError(error.message);
        }
    };

    const loadInventory = async () => {
        try {
            setLoading(true);
            const res = await getInventoryItems(filters);
            setItems(res.items);
            setMeta(res.meta);
        } catch (error: any) {
            showError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.SubmitEvent) => {
        e.preventDefault();
        setFilters(f => ({ ...f, page: 1 }));
        loadInventory();
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(f => ({ ...f, [key]: value, page: 1 }));
        if (key === 'cupboard_id') {
            loadPlacesForCupboard(value);
        }
    };

    const handleDelete = async (id: number) => {
        const isConfirmed = await confirmAction("Delete Item?", "This item will be permanently removed from inventory.");
        if (!isConfirmed) return;

        try {
            await deleteInventoryItem(id);
            showSuccess("Item deleted successfully");
            loadInventory();
        } catch (error: any) {
            showError(error.message);
        }
    };

    return (
        <div className="bg-background font-body-md text-on-surface">
            <div className="flex justify-between items-end mb-8">
                <Breadcrumb
                    pageTitle="Item Inventory"
                    items={[
                        { label: "Inventory", active: true }
                    ]}
                />

                <Link href="/inventory/create" className="bg-primary-container hover:bg-primary px-6 py-2.5 rounded-xl text-sm tracking-wider flex items-center gap-2 transition-all active:scale-95 text-on-primary font-bold">
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add New Item
                </Link>
            </div>

            <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
                <div className="p-4 md:p-6 border-b border-outline-variant/20 bg-surface-container/50 flex flex-wrap gap-4 items-center justify-between">
                    <form onSubmit={handleSearch} className="flex-1 min-w-[300px]">
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-lg">search</span>
                            <input
                                type="text"
                                placeholder="Search by name or code..."
                                value={filters.search}
                                onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                                className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                            />
                        </div>
                    </form>

                    <div className="flex flex-wrap gap-3">
                        <FilterSelect
                            value={filters.status}
                            onChange={(e: any) => handleFilterChange('status', e.target.value)}
                            options={[
                                { label: "All Statuses", value: "" },
                                { label: "In Store", value: "In-Store" },
                                { label: "Borrowed", value: "Borrowed" },
                                { label: "Damaged", value: "Damaged" },
                                { label: "Missing", value: "Missing" }
                            ]}
                        />
                        <FilterSelect
                            value={filters.cupboard_id}
                            onChange={(e: any) => handleFilterChange('cupboard_id', e.target.value)}
                            options={[
                                { label: "All Cupboards", value: "" },
                                ...cupboards.map(c => ({ label: c.name, value: c.id.toString() }))
                            ]}
                        />
                        <FilterSelect
                            value={filters.place_id}
                            onChange={(e: any) => handleFilterChange('place_id', e.target.value)}
                            disabled={!filters.cupboard_id}
                            options={[
                                { label: "All Places", value: "" },
                                ...places.map(p => ({ label: p.name, value: p.id.toString() }))
                            ]}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-container-high/40 border-b border-outline-variant/20">
                                <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest">Item details</th>
                                <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest">Unique Code</th>
                                <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest text-right">Qty</th>
                                <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest">Storage Location</th>
                                <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest">Status</th>
                                <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10 font-body-md">
                            {loading ? (
                                <TableLoading colSpan={6} />
                            ) : items.length > 0 ? (
                                items.map(item => (
                                    <InventoryRow key={item.id} item={item} onDelete={() => handleDelete(item.id)} />
                                ))
                            ) : (
                                <TableEmpty colSpan={6} />
                            )}
                        </tbody>
                    </table>
                </div>

                {meta && meta.last_page > 1 && (
                    <div className="p-6 border-t border-outline-variant/20 flex items-center justify-between bg-surface-container/30">
                        <p className="text-body-sm text-outline">
                            Showing <span className="font-bold text-on-surface">{items.length}</span> of {meta.total} items
                        </p>
                        <div className="flex gap-2">
                            <PageButton
                                icon="chevron_left"
                                disabled={meta.current_page === 1}
                                onClick={() => setFilters(f => ({ ...f, page: meta.current_page - 1 }))}
                            />
                            {[...Array(meta.last_page)].map((_, i) => (
                                <PageButton
                                    key={i + 1}
                                    label={(i + 1).toString()}
                                    active={meta.current_page === i + 1}
                                    onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                                />
                            ))}
                            <PageButton
                                icon="chevron_right"
                                disabled={meta.current_page === meta.last_page}
                                onClick={() => setFilters(f => ({ ...f, page: meta.current_page + 1 }))}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function InventoryRow({ item, onDelete }: { item: InventoryItem, onDelete: () => void }) {
    const statusConfig: any = {
        'In-Store': { label: 'In Store', color: "bg-primary/10 text-primary border-primary/20" },
        'Borrowed': { label: 'Borrowed', color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
        'Damaged': { label: 'Damaged', color: "bg-orange-400/10 text-orange-400 border-orange-400/20" },
        'Missing': { label: 'Missing', color: "bg-error/10 text-error border-error/20" },
    };

    const config = statusConfig[item.status as keyof typeof statusConfig] || { label: item.status, color: "bg-outline/10 text-outline border-outline/20" };

    return (
        <tr className="hover:bg-surface-bright/30 transition-colors group">
            <td className="p-5 flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-container-high rounded-xl flex items-center justify-center text-outline group-hover:text-primary transition-colors border border-outline-variant/50 overflow-hidden">
                    {item.image ? (
                        <img src={item.image} alt={item.item_name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="material-symbols-outlined text-[20px]">category</span>
                    )}
                </div>
                <div>
                    <p className="font-bold text-on-surface leading-tight">{item.item_name}</p>
                    {item.serial_number && <p className="text-[10px] text-outline font-mono mt-0.5">{item.serial_number}</p>}
                </div>
            </td>
            <td className="p-5 font-mono text-xs text-outline">{item.code}</td>
            <td className="p-5 text-right font-black">{item.quantity}</td>
            <td className="p-5">
                <div className="flex flex-col">
                    <span className="text-on-surface text-sm font-medium">{item.place?.name || 'N/A'}</span>
                </div>
            </td>
            <td className="p-5">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${config.color}`}>
                    {config.label}
                </span>
            </td>
            <td className="p-5">
                <div className="flex justify-end gap-1 opacity-30 group-hover:opacity-100 transition-opacity">
                    <Link href={`/inventory/${item.id}/edit`} className="p-2 text-on-surface hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </Link>
                    <button onClick={onDelete} className="p-2 text-on-surface hover:text-error hover:bg-error/10 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                    <Link href={`/inventory/${item.id}`} className="p-2 text-on-surface hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </Link>
                </div>
            </td>
        </tr>
    );
}

function FilterSelect({ value, onChange, options, disabled }: any) {
    return (
        <select
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="bg-surface-container-lowest border border-outline-variant text-on-surface-variant rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-primary transition-colors cursor-pointer disabled:opacity-50"
        >
            {options.map((opt: any) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    );
}
