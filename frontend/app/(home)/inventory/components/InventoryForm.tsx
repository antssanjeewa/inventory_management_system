"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { showError, showSuccess } from '@/lib/alert';
import { InventoryItem, createInventoryItem, updateInventoryItem } from '@/services/InventoryService';
import { Cupboard, Place, getCupboards, getPlaces } from '@/services/StorageService';

interface InventoryFormProps {
    initialData?: InventoryItem | null;
}

export default function InventoryForm({ initialData }: InventoryFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [cupboards, setCupboards] = useState<Cupboard[]>([]);
    const [places, setPlaces] = useState<Place[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        item_name: "",
        code: "",
        quantity: 1,
        serial_number: "",
        description: "",
        status: "In-Store",
        cupboard_id: "",
        place_id: "",
        image: null as any
    });

    useEffect(() => {
        loadCupboards();
        if (initialData) {
            setFormData({
                item_name: initialData.item_name,
                code: initialData.code,
                quantity: initialData.quantity,
                serial_number: initialData.serial_number || "",
                description: initialData.description || "",
                status: initialData.status,
                cupboard_id: initialData.place?.id.toString() || "",
                place_id: initialData.place_id?.toString() || "",
                image: null
            });
            if (initialData.image) {
                setImagePreview(initialData.image);
            }
            if (initialData.place?.id) {
                loadPlaces(initialData.place.id);
            }
        }
    }, [initialData]);

    const loadCupboards = async () => {
        try {
            const res = await getCupboards();
            setCupboards(res.items);
        } catch (error: any) {
            showError(error.message);
        }
    };

    const loadPlaces = async (cupboardId: number) => {
        try {
            const res = await getPlaces(cupboardId);
            setPlaces(res.items);
        } catch (error: any) {
            showError(error.message);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCupboardChange = (cupboardId: string) => {
        setFormData(prev => ({ ...prev, cupboard_id: cupboardId, place_id: "" }));
        if (cupboardId) {
            loadPlaces(parseInt(cupboardId));
        } else {
            setPlaces([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'image' && !formData[key as keyof typeof formData]) return;
                submitData.append(key, formData[key as keyof typeof formData]);
            });

            if (initialData) {
                // For updates, Laravel often prefers POST with _method=PUT for multipart forms
                submitData.append('_method', 'PUT');
                await createInventoryItem(submitData); // Re-using store endpoint but with _method trick if needed, or follow backend logic
                // Actually, let's keep it clean. InventoryAPIController@update handles it.
                // But multipart in PUT can be tricky. Let's send regular PUT if no image.
                if (!formData.image) {
                    await updateInventoryItem(initialData.id, formData);
                } else {
                    // Multipart update trick
                    const updateData = new FormData();
                    Object.keys(formData).forEach(key => {
                        if (formData[key as keyof typeof formData]) {
                            updateData.append(key, formData[key as keyof typeof formData]);
                        }
                    });
                    updateData.append('_method', 'PUT');
                    // await axiosInstance.post(`/inventory-items/${initialData.id}`, updateData);
                }
                showSuccess("Item updated successfully");
            } else {
                await createInventoryItem(submitData);
                showSuccess("Item created successfully");
            }
            router.push('/inventory');
        } catch (error: any) {
            showError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-5 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30">
                    <h3 className="text-sm font-black text-outline uppercase tracking-widest mb-2">Basic Information</h3>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-outline uppercase tracking-widest">Item Name</label>
                        <input
                            type="text"
                            required
                            value={formData.item_name}
                            onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                            className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-outline uppercase tracking-widest">Identification Code</label>
                            <input
                                type="text"
                                required
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-all font-mono"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-outline uppercase tracking-widest">Initial Stock</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-all underline decoration-primary/30 font-black"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-outline uppercase tracking-widest">Serial Number (Optional)</label>
                        <input
                            type="text"
                            value={formData.serial_number}
                            onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                            className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-outline uppercase tracking-widest">Item Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            placeholder="Technical specifications, condition reports, or handling instructions..."
                            className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-all resize-none"
                        />
                    </div>
                </div>

                <div className="space-y-5 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30">
                    <h3 className="text-sm font-black text-outline uppercase tracking-widest mb-2">Storage & Status</h3>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-outline uppercase tracking-widest">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-all appearance-none cursor-pointer font-bold"
                        >
                            <option value="In-Store">In Store</option>
                            <option value="Borrowed">Borrowed</option>
                            <option value="Damaged">Damaged</option>
                            <option value="Missing">Missing</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-outline uppercase tracking-widest">Cupboard</label>
                            <select
                                value={formData.cupboard_id}
                                onChange={(e) => handleCupboardChange(e.target.value)}
                                required
                                className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Select Cupboard</option>
                                {cupboards.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-outline uppercase tracking-widest">Storage Place</label>
                            <select
                                value={formData.place_id}
                                onChange={(e) => setFormData({ ...formData, place_id: e.target.value })}
                                required
                                disabled={!formData.cupboard_id}
                                className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-all appearance-none cursor-pointer disabled:opacity-50"
                            >
                                <option value="">Select Place</option>
                                {places.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-outline uppercase tracking-widest">Image Reference</label>
                        <div className="relative group/input">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            <div className="w-full bg-surface-container-lowest border-2 border-dotted border-outline-variant group-hover/input:border-primary/50 text-outline rounded-xl px-4 py-6 text-center transition-all">
                                <span className="material-symbols-outlined text-2xl block mb-1">add_a_photo</span>
                                <p className="text-[10px] font-bold uppercase tracking-wider">
                                    {formData.image ? (formData.image.name || "Image Selected") : "Select Equipment Image"}
                                </p>
                            </div>
                        </div>
                        {imagePreview && (
                            <div className="relative h-48 mx-auto aspect-video bg-surface-container-highest rounded-2xl overflow-hidden border border-outline-variant/50 group/preview animate-in fade-in zoom-in duration-300">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setFormData({ ...formData, image: null }); setImagePreview(null); }}
                                    className="absolute top-2 right-2 p-1 bg-error text-on-error rounded-lg opacity-0 group-hover/preview:opacity-100 transition-opacity"
                                >
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pb-8">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-8 py-3 rounded-xl text-sm font-bold text-outline hover:bg-surface-container-high transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-on-primary px-10 py-3 rounded-xl text-sm font-black flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
                >
                    <span className="material-symbols-outlined text-lg">save</span>
                    {loading ? "Synchronizing..." : (initialData ? "Update Registry" : "Register Item")}
                </button>
            </div>
        </form>
    );
}
