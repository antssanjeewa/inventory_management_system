"use client";

import { useEffect, useState } from 'react';
import { createUser, updateUser, User } from "@/services/userService";
import { showError, showSuccess } from '@/lib/alert';

interface UserFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: User | null;
}

export default function UserForm({ isOpen, onClose, onSuccess, initialData }: UserFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "staff"
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                email: initialData.email,
                password: "",
                role: initialData.role
            });
        } else {
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "staff"
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (initialData) {
                await updateUser(initialData.id, formData);
                showSuccess("User updated successfully");
            } else {
                await createUser(formData);
                showSuccess("User created successfully");
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

            <div className="relative bg-surface-container-low border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-800 flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight text-on-surface">
                            {initialData ? "Edit User Account" : "Create New User"}
                        </h3>
                        <p className="text-xs text-on-surface-variant">
                            {initialData ? "Update existing credentials and authority." : "Register a new operator in the database."}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter Your Name"
                                className="w-full bg-surface-container-lowest border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-500 transition-all text-on-surface"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Enter Your Email Address"
                                className="w-full bg-surface-container-lowest border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-500 transition-all text-on-surface"
                            />
                        </div>

                        {initialData ? null : (
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    Initial Password
                                </label>
                                <input
                                    type="password"
                                    required={!initialData}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full bg-surface-container-lowest border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-500 transition-all text-on-surface"
                                />
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Role Authority</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full bg-surface-container-lowest border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-500 text-on-surface appearance-none"
                            >
                                <option value="staff">Staff Member</option>
                                <option value="admin">System Administrator</option>
                            </select>
                        </div>
                    </div>

                    <div className="p-4 bg-surface-container/50 border-t border-slate-800 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-surface-container-high transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-sky-500 text-slate-950 px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20 active:scale-95 disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-lg">save</span>
                            {loading ? "Processing..." : (initialData ? "Update User" : "Save User")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
