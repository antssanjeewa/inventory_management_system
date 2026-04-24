"use client";

import { useEffect, useState } from 'react'
import { showError, showSuccess } from '@/lib/alert';
import { Cupboard, Place, createPlace, updatePlace } from '@/services/StorageService';

interface PlaceFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    cupboard: Cupboard;
    initialData?: Place | null;
}

export default function PlaceForm({ isOpen, onClose, onSuccess, cupboard, initialData }: PlaceFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: ""
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name
            });
        } else {
            setFormData({
                name: ""
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const data = { ...formData, cupboard_id: cupboard.id }

            if (initialData) {
                await updatePlace(initialData.id, data);
                showSuccess("Place updated successfully");
            } else {
                await createPlace(data);
                showSuccess("Place created successfully");
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            showError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative bg-surface-container-low border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-outline-variant/20 flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight text-on-surface">
                            {initialData ? "Edit Storage Location" : "Add New Storage Place"}
                        </h3>
                        <p className="text-xs text-outline">
                            {initialData ? "Update the descriptor for this location." : "Define a specific bin or shelf within the cupboard."}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-surface-container-high rounded-lg text-outline transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-outline uppercase tracking-widest">Cupboard Name</label>
                            <div className="w-full bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5 text-sm font-bold text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">door_back</span>
                                {cupboard.name}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-outline uppercase tracking-widest">Location Name / Tag</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Shelf-A-01"
                                className="w-full bg-surface-container-lowest border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-500 transition-all text-on-surface"
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-surface-container/50 border-t border-outline-variant/20 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-xl text-sm font-bold text-outline hover:bg-surface-container-high transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-on-surface text-background px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-lg">save</span>
                            {loading ? "Processing..." : (initialData ? "Update Place" : "Save Place")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
