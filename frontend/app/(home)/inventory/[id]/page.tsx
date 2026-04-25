"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { InventoryItem, getInventoryItem, deleteInventoryItem } from '@/services/InventoryService';
import { Borrowing, getBorrowingsByItem } from '@/services/BorrowingService';
import { showError, showSuccess, confirmAction } from '@/lib/alert';
import PageLoading from '@/components/PageLoading';
import { TableLoading } from '@/components/TableLoading';
import { TableEmpty } from '@/components/TableEmpty';
import PageButton from '@/components/PageButton';

export default function InventoryViewPage() {
    const params = useParams();
    const router = useRouter();
    const [item, setItem] = useState<InventoryItem | null>(null);
    const [loading, setLoading] = useState(true);

    const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
    const [borrowMeta, setBorrowMeta] = useState<any>(null);
    const [borrowPage, setBorrowPage] = useState(1);
    const [borrowLoading, setBorrowLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            loadItem(parseInt(params.id as string));
        }
    }, [params.id]);

    useEffect(() => {
        if (params.id) {
            loadBorrowings(parseInt(params.id as string));
        }
    }, [params.id, borrowPage]);

    const loadItem = async (id: number) => {
        try {
            setLoading(true);
            const data = await getInventoryItem(id);
            setItem(data);
        } catch (error: any) {
            showError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const loadBorrowings = async (id: number) => {
        try {
            setBorrowLoading(true);
            const res = await getBorrowingsByItem(id, borrowPage);
            setBorrowings(res.items);
            setBorrowMeta(res.meta);
        } catch (error: any) {
            console.error("Failed to load borrowing history:", error);
        } finally {
            setBorrowLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!item) return;
        const confirmed = await confirmAction("Delete Item?", "This item will be permanently removed from inventory.");
        if (!confirmed) return;

        try {
            await deleteInventoryItem(item.id);
            showSuccess("Item deleted successfully");
            router.push('/inventory');
        } catch (error: any) {
            showError(error.message);
        }
    };

    const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
        'In-Store': { label: 'In Store', color: 'bg-primary/10 text-primary border-primary/20', icon: 'inventory_2' },
        'Borrowed': { label: 'Borrowed', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: 'sync_alt' },
        'Damaged': { label: 'Damaged', color: 'bg-orange-400/10 text-orange-400 border-orange-400/20', icon: 'warning' },
        'Missing': { label: 'Missing', color: 'bg-error/10 text-error border-error/20', icon: 'error' },
    };

    const borrowStatusColor: Record<string, string> = {
        'Borrowed': 'bg-warning/10 text-warning border-warning/20',
        'Returned': 'bg-primary/10 text-primary border-primary/20',
        'Overdue': 'bg-error/10 text-error border-error/20',
    };

    if (loading) return <PageLoading />;
    if (!item) return <div className="p-20 text-center text-outline">Item not found.</div>;

    const status = statusConfig[item.status] || { label: item.status, color: 'bg-outline/10 text-outline border-outline/20', icon: 'help' };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-end mb-8">
                <Breadcrumb
                    pageTitle={item.item_name}
                    items={[
                        { label: "Inventory", href: "/inventory" },
                        { label: "Item Details", active: true }
                    ]}
                />

                <div className="flex items-center gap-3">
                    <Link
                        href={`/inventory/${item.id}/edit`}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border border-outline-variant/50 hover:bg-surface-container-high transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined text-lg">edit</span>
                        Edit
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border border-error/30 text-error hover:bg-error/10 transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined text-lg">delete</span>
                        Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">

                {/* Image — reduced size */}
                <div>
                    <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl overflow-hidden shadow-xl">
                        <div className="aspect-[4/3] bg-surface-container-high flex items-center justify-center">
                            {item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.item_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-3 text-outline">
                                    <span className="material-symbols-outlined text-5xl">category</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Item Information — with status inside header */}
                <div className="lg:col-span-2">
                    <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl shadow-xl overflow-hidden">
                        <div className="px-xl py-lg border-b border-outline-variant/20 bg-surface-container/30 flex items-center justify-between">
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-outline">Item Information</h2>
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider ${status.color}`}>
                                <span className="material-symbols-outlined text-sm">{status.icon}</span>
                                {status.label}
                            </div>
                        </div>
                        <div className="p-xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
                                <DetailField label="Item Name" value={item.item_name} icon="label" />
                                <DetailField label="Unique Code" value={item.code} icon="qr_code" mono />
                                <DetailField label="Serial Number" value={item.serial_number || '—'} icon="pin" mono />
                                <DetailField label="Quantity" value={item.quantity.toString()} icon="inventory" />
                                <DetailField label="Storage Location" value={item.place?.name || 'Not assigned'} icon="location_on" />
                                <DetailField label="Description" value={item.description || '—'} icon="description" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Borrowing History */}
            <div className="mt-lg">
                <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-xl py-lg border-b border-outline-variant/20 bg-surface-container/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-outline text-lg">history</span>
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-outline">Borrowing History</h2>
                        </div>
                        {borrowMeta && (
                            <span className="text-[10px] font-black text-outline uppercase tracking-widest">
                                {borrowMeta.total} Records
                            </span>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-surface-container-high/40 border-b border-outline-variant/20">
                                    <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest">Borrower</th>
                                    <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest">Contact</th>
                                    <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest">Qty</th>
                                    <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest">Borrow Date</th>
                                    <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest">Expected Return</th>
                                    <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10">
                                {borrowLoading ? (
                                    <TableLoading colSpan={6} />
                                ) : borrowings.length > 0 ? (
                                    borrowings.map((b) => (
                                        <tr key={b.id} className="hover:bg-surface-bright/30 transition-colors group">
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 rounded-full bg-surface-container-highest border border-outline-variant/50 flex items-center justify-center text-primary font-black text-[10px]">
                                                        {b.borrower_name.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-on-surface text-sm">{b.borrower_name}</span>
                                                </div>
                                            </td>
                                            <td className="p-5 text-xs text-on-surface-variant">{b.contact || '—'}</td>
                                            <td className="p-5 font-bold text-sm">{b.quantity}</td>
                                            <td className="p-5 text-xs text-on-surface-variant font-bold">{b.borrow_date}</td>
                                            <td className="p-5 text-xs text-on-surface-variant font-bold">{b.expected_return_date || '—'}</td>
                                            <td className="p-5">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${borrowStatusColor[b.status] || 'bg-outline/10 text-outline border-outline/20'}`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <TableEmpty colSpan={6} />
                                )}
                            </tbody>
                        </table>
                    </div>

                    {borrowMeta && borrowMeta.last_page > 1 && (
                        <div className="p-6 border-t border-outline-variant/20 flex items-center justify-between bg-surface-container/30">
                            <p className="text-xs text-outline font-bold">
                                Page {borrowMeta.current_page} of {borrowMeta.last_page}
                            </p>
                            <div className="flex gap-2">
                                <PageButton
                                    icon="chevron_left"
                                    disabled={borrowMeta.current_page === 1}
                                    onClick={() => setBorrowPage(borrowPage - 1)}
                                />
                                <PageButton
                                    icon="chevron_right"
                                    disabled={borrowMeta.current_page === borrowMeta.last_page}
                                    onClick={() => setBorrowPage(borrowPage + 1)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function DetailField({ label, value, icon, mono }: {
    label: string;
    value: string;
    icon: string;
    mono?: boolean;
}) {
    return (
        <div className="group">
            <div className="flex items-center gap-2 mb-1.5">
                <span className="material-symbols-outlined text-outline text-sm group-hover:text-primary transition-colors">{icon}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-outline">{label}</span>
            </div>
            <p className={`text-on-surface font-bold text-sm pl-6 ${mono ? 'font-mono' : ''}`}>
                {value}
            </p>
        </div>
    );
}
