"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { auth } from '@/lib/auth';

const menuItems = [
  { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { name: 'Storage', icon: 'inventory_2', path: '/storage' },
  { name: 'Inventory', icon: 'package_2', path: '/inventory' },
  { name: 'Borrowing', icon: 'sync_alt', path: '/borrowing' },
  { name: 'Audit Logs', icon: 'history_edu', path: '/audit-logs', adminOnly: true },
  { name: 'User Management', icon: 'manage_accounts', path: '/users', adminOnly: true },
];

import { useState, useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userResult = auth.getCurrentUser();
    setIsAdmin(userResult?.role === 'admin');
  }, []);

  const handleLogout = () => {
    if (confirm("Are you sure you want to initialize logout protocol?")) {
      auth.logout();
    }
  };

  const filteredItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <aside className="w-64 border-r border-outline-variant/40 bg-surface-container-low h-screen fixed left-0 top-0 flex flex-col py-6 z-50">
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary text-lg">inventory_2</span>
        </div>
        <div>
          <h1 className="text-lg font-black text-on-surface leading-tight">Ceyntics ERP</h1>
          <p className="text-[10px] uppercase tracking-wider text-outline font-bold">Internal Operations</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center px-3 py-2 rounded-xl text-xs font-bold transition-all group ${isActive
                ? 'bg-primary/10 border-r-2 border-primary/50'
                : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
            >
              <span className={`material-symbols-outlined mr-3 transition-transform group-hover:scale-110 ${isActive ? '' : 'text-outline'}`}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pt-4 border-t border-outline-variant/30 space-y-1">
        <button className="w-full flex items-center px-3 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container-high text-sm font-bold transition-all group">
          <span className="material-symbols-outlined mr-3 text-lg text-outline group-hover:text-primary transition-colors">help</span>
          Support
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2.5 rounded-xl text-error hover:bg-error-container/10 text-sm font-bold transition-all group"
        >
          <span className="material-symbols-outlined mr-3 text-lg transition-transform group-hover:rotate-12">logout</span>
          Logout Protocol
        </button>
      </div>
    </aside>
  );
}