"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { auth } from '@/lib/auth';

const menuSections = [
  {
    label: '',
    items: [
      { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
      { name: 'Storage', icon: 'inventory_2', path: '/storage' },
      { name: 'Inventory', icon: 'package_2', path: '/inventory' },
      { name: 'Borrowing', icon: 'sync_alt', path: '/borrowing' },
    ]
  },
  {
    label: 'Management',
    adminOnly: true,
    items: [
      { name: 'User Management', icon: 'manage_accounts', path: '/users', adminOnly: true },
      { name: 'Audit Logs', icon: 'history_edu', path: '/audit-logs', adminOnly: true },
    ]
  }
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

  return (
    <aside className="w-64 border-r border-outline-variant/40 bg-surface-container-low h-screen fixed left-0 top-0 flex flex-col py-6 z-50">
      <div className="pl-6 mb-10 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary text-lg">inventory_2</span>
        </div>
        <div>
          <h1 className="text-lg font-black text-on-surface leading-tight">Ceyntics Systems</h1>
          <p className="text-[10px] uppercase tracking-wider text-outline font-bold">Operations Console</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 px-3 overflow-y-auto">
        {menuSections.map((section, idx) => {
          if (section.adminOnly && !isAdmin) return null;

          return (
            <div key={section.label} className="space-y-1">
              <div className="px-3 mb-2 flex items-center justify-between">
                <span className="text-[10px] font-black text-outline uppercase tracking-[0.2em]">
                  {section.label}
                </span>
                {idx > 0 && <div className="h-[1px] flex-1 ml-4 bg-outline-variant/20" />}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
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
              </div>
            </div>
          );
        })}
      </nav>

      <div className="px-3 pt-4 border-t border-outline-variant/30 space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2.5 rounded-xl text-error hover:bg-error-container/10 text-sm font-bold transition-all group"
        >
          <span className="material-symbols-outlined mr-3 text-lg transition-transform group-hover:rotate-12">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}