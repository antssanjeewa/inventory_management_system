"use client";
import React from 'react';
import Breadcrumb from '@/components/Breadcrumb';

export default function DashboardPage() {
    const stats = [
        { label: "Total Assets", value: "1,284", icon: "inventory_2", trend: "+12.5%", trendColor: "text-emerald-500", color: "bg-primary-container" },
        { label: "Active Borrowings", value: "42", icon: "sync_alt", trend: "0.2%", trendColor: "text-outline", color: "bg-secondary-container" },
        { label: "Low Stock Alert", value: "08", icon: "warning", trend: "-5.0%", trendColor: "text-error", color: "bg-error-container/20" },
        { label: "Storage Capacity", value: "68%", icon: "warehouse", trend: "Steady", trendColor: "text-outline", color: "bg-surface-container-highest" },
    ];

    const activities = [
        { user: "Elena Vance", action: "borrowed", item: "MacBook Pro 16\"", time: "2m ago", icon: "person" },
        { user: "System", action: "logged", item: "New Audit Entry", time: "15m ago", icon: "terminal" },
        { user: "Inventory Robot", action: "updated", item: "Ceyntics IT Stock", time: "1h ago", icon: "smart_toy" },
        { user: "Admin", action: "revoked", item: "Access Key 88", time: "3h ago", icon: "key" },
    ];

    return (
        <div className="space-y-xl animate-in fade-in duration-500">
            <div className="mb-8">
                <Breadcrumb
                    pageTitle="Command Center"
                    items={[
                        { label: "Dashboard Overview", active: true }
                    ]}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-lg shadow-xl hover:shadow-primary/5 transition-all group">
                        <div className="flex justify-between items-start mb-md">
                            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-on-surface group-hover:scale-110 transition-transform`}>
                                <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${stat.trendColor}`}>{stat.trend}</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-outline">{stat.label}</p>
                            <p className="text-h2 font-black text-on-surface">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
                <div className="lg:col-span-2 bg-surface-container-low border border-outline-variant/30 rounded-2xl p-xl shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-xl">
                        <h3 className="font-h3 text-on-surface">Operations Flux</h3>
                        <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-1 text-primary"><span className="w-2 h-2 rounded-full bg-primary"></span>Inbound</span>
                            <span className="flex items-center gap-1 text-outline"><span className="w-2 h-2 rounded-full bg-outline"></span>Outbound</span>
                        </div>
                    </div>

                    <div className="h-64 flex items-end gap-2 px-2">
                        {[40, 70, 45, 90, 65, 80, 55, 30, 85, 60, 75, 50].map((h, i) => (
                            <div key={i} className="flex-1 space-y-2 group">
                                <div className="relative h-full flex flex-col justify-end">
                                    <div
                                        className="w-full bg-primary/20 hover:bg-primary transition-all rounded-t-lg cursor-pointer"
                                        style={{ height: `${h}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-bright p-1 rounded border border-outline-variant text-[10px] opacity-0 group-hover:opacity-100 transition-opacity z-10 antialiased">
                                            {h}%
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[8px] text-outline text-center font-bold">M{i + 1}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-xl shadow-2xl">
                    <h3 className="font-h3 text-on-surface mb-xl">Recent Activity</h3>
                    <div className="space-y-lg">
                        {activities.map((act, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center border border-outline-variant/30 text-outline group-hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">{act.icon}</span>
                                </div>
                                <div className="flex-1 space-y-0.5">
                                    <p className="text-sm font-bold text-on-surface">
                                        <span className="text-primary-fixed-dim">{act.user}</span> {act.action} <span className="text-on-surface-variant font-medium">{act.item}</span>
                                    </p>
                                    <p className="text-[10px] text-outline font-black uppercase tracking-widest">{act.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-xl py-3 border border-outline-variant/50 rounded-xl text-xs font-bold uppercase tracking-widest text-outline hover:text-on-surface hover:bg-surface-container-high transition-all">
                        View Complete Logs
                    </button>
                </div>
            </div>
        </div>
    );
}