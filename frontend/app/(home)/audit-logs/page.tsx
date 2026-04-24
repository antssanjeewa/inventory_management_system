"use client";
import React from 'react';
import Breadcrumb from '@/components/Breadcrumb';

const logs = [
    { id: 1, type: "Access", event: "User login successful", user: "Admin", ip: "192.168.1.1", time: "2024-04-24 10:15:32", severity: "Low" },
    { id: 2, type: "Inventory", event: "Item 'MacBook Pro' quantity decreased", user: "Elena Vance", ip: "192.168.1.42", time: "2024-04-24 10:12:05", severity: "Medium" },
    { id: 3, type: "Security", event: "Multiple failed login attempts", user: "Unknown", ip: "45.12.88.2", time: "2024-04-24 09:45:12", severity: "High" },
    { id: 4, type: "Storage", event: "New location 'Cupboard D' created", user: "Admin", ip: "192.168.1.1", time: "2024-04-24 08:30:00", severity: "Low" },
    { id: 5, type: "System", action: "Database backup completed", user: "Automated Task", ip: "Localhost", time: "2024-04-24 00:00:01", severity: "Low" },
];

export default function AuditLogsPage() {
    return (
        <div className="space-y-xl">
            <div className="flex justify-between items-end mb-8">
                <Breadcrumb
                    pageTitle="System Events"
                    items={[
                        { label: "Audit Logs", active: true }
                    ]}
                />

                <div className="flex gap-2">
                    <button className="p-2.5 border border-outline-variant rounded-xl text-outline hover:text-on-surface hover:bg-surface-bright transition-all">
                        <span className="material-symbols-outlined text-lg">filter_alt</span>
                    </button>
                    <button className="bg-surface-container-high hover:bg-surface-bright px-6 py-2.5 rounded-xl text-sm font-bold tracking-wider flex items-center gap-2 transition-all border border-outline-variant/50">
                        <span className="material-symbols-outlined text-lg">description</span>
                        Export Report
                    </button>
                </div>
            </div>

            <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-container-high/40 border-b border-outline-variant/30 font-bold uppercase tracking-widest text-[9px] text-outline">
                                <th className="p-5">Timestamp</th>
                                <th className="p-5">Identity</th>
                                <th className="p-5">Event Description</th>
                                <th className="p-5">Terminal IP</th>
                                <th className="p-5">Severity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-primary/5 transition-colors group">
                                    <td className="p-5 text-outline group-hover:text-primary transition-colors">{log.time}</td>
                                    <td className="p-5 text-on-surface-variant">
                                        <span className="px-1.5 py-0.5 rounded bg-surface-container-high font-bold border border-outline-variant/50">{log.user}</span>
                                    </td>
                                    <td className="p-5 text-on-surface">
                                        <span className="text-primary-fixed-dim mr-2">[{log.type}]</span>
                                        {log.event}
                                    </td>
                                    <td className="p-5 text-outline/80">{log.ip}</td>
                                    <td className="p-5">
                                        <span className={`font-black uppercase tracking-widest text-[9px] ${log.severity === 'High' ? 'text-error' :
                                                log.severity === 'Medium' ? 'text-tertiary' : 'text-primary'
                                            }`}>
                                            {log.severity}
                                        </span>
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
