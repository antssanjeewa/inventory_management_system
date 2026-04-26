"use client";

import { useEffect, useState } from 'react';
import { InventoryItem, getInventoryItems } from '@/services/InventoryService';
import { createBorrowing } from '@/services/BorrowingService';
import { showSuccess, showError } from '@/lib/alert';
import SearchableSelect from '@/components/ui/SearchableSelect';


interface BorrowingFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function BorrowingForm({ onClose, onSuccess }: BorrowingFormProps) {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loadingItems, setLoadingItems] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        inventory_item_id: "",
        borrower_name: "",
        contact: "",
        borrow_date: new Date().toISOString().split('T')[0],
        expected_return_date: "",
        quantity: 1
    });

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async (search = "") => {
        try {
            setLoadingItems(true);
            const res = await getInventoryItems({
                status: 'In-Store',
                search: search
            });
            setItems(res.items);
        } catch (error) {
            console.error("Failed to load items", error);
        } finally {
            setLoadingItems(false);
        }
    };

    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    const onSearchChange = (val: string) => {
        if (searchTimeout) clearTimeout(searchTimeout);
        const timeout = setTimeout(() => {
            loadItems(val);
        }, 300);
        setSearchTimeout(timeout);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.inventory_item_id) {
            showError("Tactical error: Asset selection required for circulation.");
            return;
        }
        try {
            setSubmitting(true);
            await createBorrowing(formData);
            showSuccess("System protocol updated: Asset circulation initiated.");
            onSuccess();
            onClose();
        } catch (error: any) {
            showError(error.message || "Failed to initiate borrowing protocol.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container/30">
                    <div>
                        <h2 className="text-xl font-black tracking-tight text-on-surface">Circulation Protocol</h2>
                        <p className="text-[10px] uppercase tracking-widest text-outline font-bold">New Asset Borrowing</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-container-highest flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-outline">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <SearchableSelect
                            label="Select Asset"
                            options={items.map(item => ({
                                id: item.id,
                                label: item.item_name,
                                subLabel: `[${item.code}] Available: ${item.quantity}`,
                                searchValue: `${item.item_name} ${item.code}`
                            }))}
                            value={formData.inventory_item_id}
                            onChange={(val) => setFormData({ ...formData, inventory_item_id: val.toString() })}
                            onSearchChange={onSearchChange}
                            loading={loadingItems}
                            placeholder="Search and select an available item"
                            required
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-outline uppercase tracking-widest">Borrower Name</label>
                                <input
                                    type="text"
                                    value={formData.borrower_name}
                                    onChange={(e) => setFormData({ ...formData, borrower_name: e.target.value })}
                                    placeholder="Enter full name"
                                    required
                                    className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-outline uppercase tracking-widest">Contact Info</label>
                                <input
                                    type="text"
                                    value={formData.contact}
                                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                    placeholder="Phone or Email"
                                    required
                                    className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-outline uppercase tracking-widest">Borrow Date</label>
                                <input
                                    type="date"
                                    value={formData.borrow_date}
                                    onChange={(e) => setFormData({ ...formData, borrow_date: e.target.value })}
                                    required
                                    className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-outline uppercase tracking-widest">Expected Return</label>
                                <input
                                    type="date"
                                    value={formData.expected_return_date}
                                    onChange={(e) => setFormData({ ...formData, expected_return_date: e.target.value })}
                                    required
                                    className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-outline uppercase tracking-widest">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                required
                                className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-outline-variant text-outline rounded-xl text-xs font-black uppercase tracking-widest hover:bg-surface-container-high transition-all"
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 py-3 bg-primary text-on-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {submitting ? 'Processing...' : 'Authorize Borrowing'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
