"use client";

import { useEffect, useState } from 'react';
import { showError } from '@/lib/alert';
import { ActivityLog, getActivityLogs } from '@/services/ActivityService';

import Breadcrumb from '@/components/Breadcrumb';
import PageButton from '@/components/PageButton';
import { TableLoading } from '@/components/TableLoading';
import { TableEmpty } from '@/components/TableEmpty';
import AuditDetailsDialog from './components/AuditDetailsDialog';

export default function AuditLogsPage() {

    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        loadLogs();
    }, [page]);

    const loadLogs = async () => {
        try {
            setLoading(true);
            const res = await getActivityLogs(page);
            setLogs(res.items);
            setMeta(res.meta);
        } catch (error: any) {
            showError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatEntityName = (type: string) => {
        return type.split('\\').pop()?.replace(/([A-Z])/g, ' $1').trim() || type;
    };

    const handleViewDetails = (log: ActivityLog) => {
        setSelectedLog(log);
        setIsDialogOpen(true);
    };


    return (
        <div className="bg-background font-body-md text-on-surface">
            <div className="mb-8">
                <Breadcrumb
                    pageTitle="System Audit Logs"
                    items={[
                        { label: "Audit Logs", active: true }
                    ]}
                />
            </div>

            <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-container-high/40 border-b border-outline-variant/20">
                                <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest">Timestamp</th>
                                <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest">Operator</th>
                                <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest">Action</th>
                                <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest">Target Entity</th>
                                <th className="p-5 text-[10px] font-black text-outline uppercase tracking-widest text-end">Change Summary</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10 font-body-md">
                            {loading ? (
                                <TableLoading colSpan={5} />
                            ) : logs.length > 0 ? (
                                logs.map(log => (
                                    <tr key={log.id} className="hover:bg-surface-bright/30 transition-colors group">
                                        <td className="px-4 py-3 text-xs text-outline font-mono">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-black text-primary border border-primary/20 capitalize">
                                                    {log.user?.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-sm tracking-tight">{log.user?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {log.action}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-outline uppercase tracking-widest">
                                                    {formatEntityName(log.entity_type)}
                                                </span>
                                                <span className="text-xs font-mono text-primary/70">ID: {log.entity_id}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 max-w-xs">
                                            <button
                                                onClick={() => handleViewDetails(log)}
                                                className="flex items-center justify-end gap-4 w-full text-left group/btn"
                                            >
                                                <span className="material-symbols-outlined text-[18px] text-primary/40 group-hover/btn:text-primary group-hover/btn:scale-110 transition-all">
                                                    open_in_new
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <TableEmpty colSpan={5} />
                            )}
                        </tbody>
                    </table>
                </div>

                {meta && meta.last_page > 1 && (
                    <div className="p-6 border-t border-outline-variant/20 flex items-center justify-between bg-surface-container/30">
                        <p className="text-xs text-outline">
                            Showing <span className="font-bold text-on-surface">{logs.length}</span> entries
                        </p>
                        <div className="flex gap-2">
                            <PageButton
                                icon="chevron_left"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            />
                            <span className="self-center text-[10px] font-black px-4 uppercase tracking-widest">
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

            <AuditDetailsDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                log={selectedLog}
            />
        </div>

    );
}
