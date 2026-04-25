'use client'

import { useEffect, useState } from 'react';
import { auth } from '@/lib/auth';

export default function Topbar() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userResult = auth.getCurrentUser();
        setUser(userResult);
    }, []);

    return (
        <header className="h-16 border-b border-outline-variant/40 bg-surface-container/80 backdrop-blur-md sticky top-0 flex items-center justify-between px-8 z-40">
            <div className="max-w-xl w-full">

            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-on-surface leading-none">{user?.name}</p>
                        <p className="text-[10px] text-outline">{user?.role}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-primary-fixed bg-surface-bright flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-lg">person</span>
                    </div>
                </div>
            </div>
        </header>
    );
}