"use client";
import React from 'react';
import Breadcrumb from '@/components/Breadcrumb';

const borrowings = [
    { id: 1, user: "Elena Vance", item: "MacBook Pro 16\"", code: "CEY-IT-0294", date: "2024-04-20", returnDate: "2024-05-20", status: "Active" },
    { id: 2, user: "Gordon Freeman", item: "Cisco Nexus Switch", code: "CEY-NET-0012", date: "2024-04-18", returnDate: "2024-04-25", status: "Overdue" },
    { id: 3, user: "Alyx Vance", item: "Cat6 Ethernet Spool", code: "CEY-CAB-9921", date: "2024-04-22", returnDate: "2024-04-30", status: "Active" },
    { id: 4, user: "Barney Calhoun", item: "Dell UltraSharp 27\"", code: "CEY-PER-0556", date: "2024-04-15", returnDate: "2024-04-22", status: "Returned" },
];

export default function BorrowingPage() {
    return (
        <div className="space-y-xl">
            <div className="flex justify-between items-end mb-8">
                <Breadcrumb
                    pageTitle="Active Borrowings"
                    items={[
                        { label: "Borrowing Log", active: true }
                    ]}
                />

                <button className="bg-primary-container hover:bg-primary px-6 py-2.5 rounded-xl text-sm font-bold tracking-wider flex items-center gap-2 transition-all active:scale-95 text-on-primary">
                    <span className="material-symbols-outlined text-lg">sync_alt</span>
                    New Borrowing
                </button>
            </div>

            <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-container-high/40 border-b border-outline-variant/20 font-bold uppercase tracking-widest text-[10px] text-outline">
                                <th className="p-5">Borrower</th>
                                <th className="p-5">Item Details</th>
                                <th className="p-5">Allocated</th>
                                <th className="p-5">Expected Return</th>
                                <th className="p-5">Protocol Status</th>
                                <th className="p-5 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            {borrowings.map((b) => (
                                <tr key={b.id} className="hover:bg-surface-bright/30 transition-colors group">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant/50 flex items-center justify-center text-primary">
                                                <span className="material-symbols-outlined text-sm">person</span>
                                            </div>
                                            <span className="font-bold text-on-surface">{b.user}</span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="font-bold text-on-surface">{b.item}</div>
                                        <div className="text-[10px] font-mono text-outline">{b.code}</div>
                                    </td>
                                    <td className="p-5 text-sm text-on-surface-variant font-medium">{b.date}</td>
                                    <td className="p-5 text-sm text-on-surface-variant font-medium">{b.returnDate}</td>
                                    <td className="p-5">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border ${b.status === 'Active' ? 'bg-primary/10 text-primary-fixed-dim border-primary/20' :
                                                b.status === 'Overdue' ? 'bg-error-container/20 text-error border-error/30' :
                                                    'bg-surface-container-highest text-outline border-outline-variant'
                                            }`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex justify-center gap-2">
                                            <button className="px-3 py-1.5 bg-surface-container-high hover:bg-primary hover:text-on-primary transition-all rounded-lg text-[10px] font-black uppercase tracking-widest border border-outline-variant/50">
                                                Return
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
