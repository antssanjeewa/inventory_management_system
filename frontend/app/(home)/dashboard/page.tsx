"use client";

import { useEffect, useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import { DashboardData, getDashboardData } from '@/services/DashboardService';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import PageLoading from '@/components/PageLoading';

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const userResult = auth.getCurrentUser();
        setIsAdmin(userResult?.role === 'admin');
    }, []);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const dashboardData = await getDashboardData();
                setData(dashboardData);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, []);

    const statsConfig = [
        { label: "Total Assets", key: "total_items" as const, icon: "inventory_2", color: "bg-primary-container" },
        { label: "Active Borrowings", key: "active_borrowings" as const, icon: "sync_alt", color: "bg-secondary-container" },
        { label: "Missing/Damaged Assets", key: "missing_count" as const, icon: "warning", color: "bg-error-container/20" },
        { label: "Storage Places", key: "total_places" as const, icon: "warehouse", color: "bg-surface-container-highest" },
    ];

    if (loading) {
        return (
            <PageLoading />
        );
    }

    return (
        <div className="space-y-xl animate-in fade-in duration-500">
            <div className="mb-8">
                <Breadcrumb
                    pageTitle="Console Overview"
                    items={[
                        { label: "Operations Registry", active: true }
                    ]}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
                {statsConfig.map((stat) => (
                    <div key={stat.label} className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-lg shadow-xl hover:shadow-primary/5 transition-all group">
                        <div className="flex justify-between items-start mb-md">
                            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-on-surface group-hover:scale-110 transition-transform`}>
                                <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-outline">{stat.label}</p>
                            <p className="text-h2 font-black text-on-surface">
                                {data?.stats[stat.key] || 0}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {isAdmin ?
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
                    <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-xl shadow-2xl">
                        <div className="flex justify-between items-center mb-xl">
                            <h3 className="font-h3 text-on-surface">Recent Activity</h3>
                        </div>
                        <div className="space-y-lg">
                            {data?.latest_activities.map((act, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center border border-outline-variant/30 text-outline group-hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">
                                            {act.action === 'created' ? 'add_circle' : act.action === 'updated' ? 'edit' : 'history'}
                                        </span>
                                    </div>
                                    <div className="flex-1 space-y-0.5">
                                        <p className="text-sm font-bold text-on-surface">
                                            <span className="text-primary-fixed-dim">{act.user?.name}</span> {act.action} <span className="text-on-surface-variant font-medium">record #{act.entity_id}</span>
                                        </p>
                                        <p className="text-[10px] text-outline font-black uppercase tracking-widest">
                                            {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link href="/audit-logs" className="block text-center w-full mt-xl py-3 border border-outline-variant/50 rounded-xl text-xs font-bold uppercase tracking-widest text-outline hover:text-on-surface hover:bg-surface-container-high transition-all">
                            Open Command Logs
                        </Link>
                    </div>
                </div>
                : null}
        </div>
    );
}