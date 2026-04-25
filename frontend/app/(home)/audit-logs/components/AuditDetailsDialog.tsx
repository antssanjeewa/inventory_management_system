"use client";

import { ActivityLog } from "@/services/ActivityService";

interface AuditDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    log: ActivityLog | null;
}

export default function AuditDetailsDialog({ isOpen, onClose, log }: AuditDetailsDialogProps) {
    if (!isOpen || !log) return null;

    const renderValues = (values: any) => {
        if (!values || typeof values !== 'object') return <span className="text-outline italic">No data</span>;

        return (
            <div className="space-y-2">
                {Object.entries(values).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-[120px_1fr] gap-4 items-start border-b border-outline-variant/10 pb-2 last:border-0 last:pb-0">
                        <span className="text-[10px] font-black text-outline uppercase tracking-wider py-1 truncate" title={key}>
                            {key.replace(/_/g, ' ')}
                        </span>
                        <div className="text-sm font-mono break-all py-1 text-on-surface">
                            {value === null ? (
                                <span className="text-outline/50 italic text-[10px]">null</span>
                            ) : typeof value === 'object' ? (
                                JSON.stringify(value)
                            ) : (
                                String(value)
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative bg-surface-container-low border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-6xl w-full max-h-[85vh] flex flex-col">
                <div className="p-6 border-b border-outline-variant/20 flex justify-between items-start shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                {log.action}
                            </span>
                            <h3 className="text-xl font-bold tracking-tight text-on-surface">
                                Change Details
                            </h3>
                        </div>
                        <p className="text-xs text-outline">
                            {log.entity_type.split('\\').pop()} • ID: {log.entity_id} • {new Date(log.created_at).toLocaleString()}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-surface-container-high rounded-xl text-on-surface-variant transition-colors group"
                    >
                        <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">close</span>
                    </button>
                </div>


                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 border-b border-outline-variant/30">
                                <span className="material-symbols-outlined text-outline text-lg">history</span>
                                <h4 className="text-xs font-black text-outline uppercase tracking-widest">Original Data</h4>
                            </div>
                            <div className="bg-surface-container/30 rounded-xl p-4 border border-outline-variant/10">
                                {renderValues(log.old_values)}
                            </div>
                        </div>


                        <div className="space-y-2">
                            <div className="flex items-center gap-2 border-b border-primary/30">
                                <span className="material-symbols-outlined text-primary text-lg">edit_note</span>
                                <h4 className="text-xs font-black text-primary uppercase tracking-widest">Updated Data</h4>
                            </div>
                            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                                {renderValues(log.new_values)}
                            </div>
                        </div>
                    </div>
                </div>


                <div className="p-4 bg-surface-container/30 border-t border-outline-variant/20 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2 text-xs text-outline">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-black text-primary">
                            {log.user?.name.charAt(0)}
                        </div>
                        Performed by <span className="font-bold text-on-surface">{log.user?.name}</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-xl text-sm font-bold bg-surface-container-high text-on-surface hover:bg-outline-variant/20 transition-all border border-outline-variant/20"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
}
