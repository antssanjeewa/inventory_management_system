"use client";
import React, { useEffect, useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import { Borrowing, getBorrowings, updateBorrowingStatus } from '@/services/BorrowingService';
import { TableLoading } from '@/components/TableLoading';
import { TableEmpty } from '@/components/TableEmpty';
import PageButton from '@/components/PageButton';
import { confirmAction, showError, showSuccess } from '@/lib/alert';
import BorrowingForm from './components/BorrowingForm';

export default function BorrowingPage() {
    const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadBorrowings();
    }, [page]);

    const loadBorrowings = async () => {
        try {
            setLoading(true);
            const res = await getBorrowings(page);
            setBorrowings(res.items);
            setMeta(res.meta);
        } catch (error: any) {
            showError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (id: number) => {
        const confirmed = await confirmAction(
            "Initiate Return Protocol?",
            "Are you sure this asset has been returned according to protocol requirements?"
        );
        
        if (!confirmed) return;
        
        try {
            await updateBorrowingStatus(id, 'Returned');
            showSuccess("Registry Updated: Asset successfully returned to stock.");
            loadBorrowings();
        } catch (error: any) {
            showError(error.message);
        }
    };

    return (
        <div className="space-y-xl animate-in fade-in duration-500">
            <div className="flex justify-between items-end mb-8">
                <Breadcrumb
                    pageTitle="Circulation Intelligence"
                    items={[
                        { label: "Active Registry", active: true }
                    ]}
                />

                <button 
                    onClick={() => setShowForm(true)}
                    className="bg-primary hover:bg-primary-container px-6 py-2.5 rounded-xl text-sm font-bold tracking-wider flex items-center gap-2 transition-all active:scale-95 text-on-primary shadow-lg shadow-primary/20"
                >
                    <span className="material-symbols-outlined text-lg">sync_alt</span>
                    Initiate Borrowing
                </button>
            </div>

            <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-container-high/40 border-b border-outline-variant/20 font-bold uppercase tracking-widest text-[10px] text-outline">
                                <th className="p-5">Borrower</th>
                                <th className="p-5">Asset Details</th>
                                <th className="p-5">Outbound Date</th>
                                <th className="p-5">Target Return</th>
                                <th className="p-5">Protocol Status</th>
                                <th className="p-5 text-center">Protocol Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            {loading ? (
                                <TableLoading colSpan={6} />
                            ) : borrowings.length > 0 ? (
                                borrowings.map((b) => (
                                    <tr key={b.id} className="hover:bg-surface-bright/30 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant/50 flex items-center justify-center text-primary font-black text-[10px]">
                                                    {b.borrower_name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-on-surface tracking-tight">{b.borrower_name}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="font-bold text-on-surface tracking-tight">{b.inventory_item?.item_name || 'Item Removed'}</div>
                                            <div className="text-[10px] font-mono text-outline uppercase">{b.inventory_item?.code || 'N/A'}</div>
                                        </td>
                                        <td className="p-5 text-xs text-on-surface-variant font-bold">{b.borrow_date}</td>
                                        <td className="p-5 text-xs text-on-surface-variant font-bold">{b.expected_return_date}</td>
                                        <td className="p-5">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border ${b.status === 'Borrowed' ? 'bg-warning/10 text-warning border-warning/20' :
                                                    b.status === 'Returned' ? 'bg-primary/10 text-primary border-primary/20' :
                                                        'bg-error/10 text-error border-error/20'
                                                }`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex justify-center gap-2">
                                                {b.status === 'Borrowed' && (
                                                    <button
                                                        onClick={() => handleReturn(b.id)}
                                                        className="px-4 py-1.5 bg-surface-container-high hover:bg-primary hover:text-on-primary transition-all rounded-lg text-[10px] font-black uppercase tracking-[0.15em] border border-outline-variant/50 active:scale-95"
                                                    >
                                                        Confirm Return
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <TableEmpty colSpan={6} />
                            )}
                        </tbody>
                    </table>
                </div>

                {meta && meta.last_page > 1 && (
                    <div className="p-6 border-t border-outline-variant/20 flex items-center justify-between bg-surface-container/30">
                        <p className="text-xs text-outline font-bold">
                            Total Records: <span className="text-on-surface">{meta.total}</span>
                        </p>
                        <div className="flex gap-2">
                            <PageButton
                                icon="chevron_left"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            />
                            <span className="self-center text-[10px] font-black px-4 uppercase tracking-[0.2em]">
                                Page {page} / {meta.last_page}
                            </span>
                            <PageButton
                                icon="chevron_right"
                                disabled={page === meta.last_page}
                                onClick={() => setPage(page + 1)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {showForm && (
                <BorrowingForm 
                    onClose={() => setShowForm(false)} 
                    onSuccess={loadBorrowings} 
                />
            )}
        </div>
    );
}
