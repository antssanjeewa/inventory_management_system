"use client";
import React from 'react';

const storageLocations = [
  { id: 1, name: "Main Warehouse", type: "Warehouse", capacity: "85%", status: "Active", items: 450 },
  { id: 2, name: "Server Room B", type: "Controlled", capacity: "40%", status: "Active", items: 24 },
  { id: 3, name: "Cupboard A-12", type: "Storage Unit", capacity: "95%", status: "Full", items: 42 },
  { id: 4, name: "Cupboard B-04", type: "Storage Unit", capacity: "20%", status: "Warning", items: 12 },
  { id: 5, name: "Maintenance Dock", type: "Open Area", capacity: "10%", status: "Inactive", items: 5 },
  { id: 6, name: "Cupboard C-01", type: "Storage Unit", capacity: "65%", status: "Active", items: 156 },
];

export default function StoragePage() {
  return (
    <div className="space-y-xl">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <nav className="flex items-center gap-2 text-outline text-[10px] tracking-widest uppercase font-bold">
            <span>Home</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-primary-fixed-dim">Storage Locations</span>
          </nav>
          <h2 className="text-h1 font-h1 tracking-tight">System Storage</h2>
          <p className="text-body-sm text-outline">Monitor capacity and status across all physical storage zones.</p>
        </div>

        <button className="bg-primary-container hover:bg-primary px-6 py-2.5 rounded-xl text-sm font-bold tracking-wider flex items-center gap-2 transition-all active:scale-95 text-on-primary">
          <span className="material-symbols-outlined text-lg">add_location</span>
          New Location
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {storageLocations.map((loc) => (
          <div key={loc.id} className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-lg shadow-xl hover:shadow-primary/5 transition-all group overflow-hidden relative">
            <div className="flex justify-between items-start mb-lg">
              <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 border border-outline-variant/50">
                <span className="material-symbols-outlined text-[24px]">
                  {loc.type === 'Warehouse' ? 'warehouse' : loc.type === 'Controlled' ? 'ac_unit' : 'kitchen'}
                </span>
              </div>
              <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border ${
                loc.status === 'Active' ? 'bg-primary/10 text-primary-fixed-dim border-primary/20' :
                loc.status === 'Full' ? 'bg-error-container/20 text-error border-error/30' :
                loc.status === 'Warning' ? 'bg-tertiary-container/10 text-tertiary border-tertiary/20' :
                'bg-surface-container-highest text-outline border-outline-variant'
              }`}>
                {loc.status}
              </div>
            </div>

            <div className="space-y-unit mb-lg">
              <h3 className="font-h3 text-on-surface">{loc.name}</h3>
              <p className="text-xs text-outline font-bold uppercase tracking-wider">{loc.type}</p>
            </div>

            <div className="space-y-sm">
              <div className="flex justify-between text-xs font-bold text-outline">
                <span>Capacity Usage</span>
                <span className="text-on-surface">{loc.capacity}</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    parseInt(loc.capacity) > 90 ? 'bg-error' : 
                    parseInt(loc.capacity) > 70 ? 'bg-tertiary' : 'bg-primary'
                  }`}
                  style={{ width: loc.capacity }}
                ></div>
              </div>
              <div className="flex justify-between items-center pt-md">
                <div className="flex items-center gap-2 text-on-surface-variant font-bold">
                  <span className="material-symbols-outlined text-sm">inventory</span>
                  <span className="text-sm">{loc.items} <span className="text-outline font-normal">assets logged</span></span>
                </div>
                <button className="p-2 text-outline hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>

            <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none transform group-hover:scale-110 transition-transform duration-500">
               <span className="material-symbols-outlined text-[100px]">
                  {loc.type === 'Warehouse' ? 'warehouse' : loc.type === 'Controlled' ? 'ac_unit' : 'kitchen'}
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
