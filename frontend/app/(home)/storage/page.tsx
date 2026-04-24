"use client";
import React, { useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';

// Sample Data
const cupboardsData = [
  { id: 'CPB-001', name: 'Main Warehouse A', places: 12, status: 'IN USE', statusColor: 'text-primary' },
  { id: 'CPB-002', name: 'Electronics Storage', places: 8, status: 'IN USE', statusColor: 'text-primary' },
  { id: 'CPB-003', name: 'Overflow Locker B', places: 4, status: 'EMPTY', statusColor: 'text-outline' },
  { id: 'CPB-004', name: 'Hazardous Materials', places: 6, status: 'RESTRICTED', statusColor: 'text-tertiary' },
];

export default function StoragePage() {
  const [selectedCupboard, setSelectedCupboard] = useState(cupboardsData[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="p-margin bg-background min-h-screen text-on-surface">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Breadcrumb
            pageTitle="Hierarchical Storage Units"
            items={[
              { label: "Storage Management", active: true }
            ]}
          />
          <div className="flex gap-3">
            <button className="bg-surface-container-high border border-outline-variant px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">filter_list</span> Filter View
            </button>
            <button onClick={() => setIsModalOpen(true)} className="bg-primary text-on-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-lg">add</span> Add Cupboard
            </button>
          </div>
        </div>

        <div className="flex gap-4 h-[calc(100vh-180px)]">

          {/* --- Left Side: Cupboards List --- */}
          <div className="w-80 bg-surface-container-low border border-outline-variant/30 rounded-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-outline">door_back</span>
                <span className="font-bold text-sm tracking-tight">Cupboards</span>
              </div>
              <span className="text-[10px] bg-surface-container-highest px-2 py-0.5 rounded text-outline font-black">{cupboardsData.length} UNITS</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {cupboardsData.map((cpb) => (
                <button
                  key={cpb.id}
                  onClick={() => setSelectedCupboard(cpb)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${selectedCupboard.id === cpb.id
                    ? 'bg-primary/5 border-primary/20'
                    : 'border-transparent hover:bg-surface-container-high'
                    }`}
                >
                  <p className="text-[10px] font-mono text-outline mb-1">{cpb.id}</p>
                  <h4 className={`font-bold text-sm mb-1 ${selectedCupboard.id === cpb.id ? 'text-primary' : 'text-on-surface'}`}>{cpb.name}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-outline flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">grid_view</span> {cpb.places} Places
                    </span>
                    <span className={`text-[10px] font-black tracking-tighter ${cpb.statusColor}`}>{cpb.status}</span>
                  </div>
                </button>
              ))}
            </div>

            <button className="m-3 p-3 border border-dashed border-outline-variant rounded-xl text-xs font-bold text-outline hover:text-on-surface hover:border-outline transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">add_circle</span> New Quick Cupboard
            </button>
          </div>


          <div className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-2xl flex flex-col overflow-hidden">


            <div className="p-6 border-b border-outline-variant/20 bg-surface-container/20">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-surface-container-highest rounded-2xl flex items-center justify-center border border-outline-variant/50 text-primary">
                    <span className="material-symbols-outlined text-3xl">warehouse</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">{selectedCupboard.name}</h3>
                    <p className="text-body-sm text-outline leading-snug">Primary storage for heavy machinery components and raw materials located in Sector 4.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-2 py-1 text-outline hover:bg-surface-bright rounded-lg border border-outline-variant/50"><span className="material-symbols-outlined">edit</span></button>
                  <button className="px-2 py-1 text-outline hover:bg-surface-bright rounded-lg border border-outline-variant/50"><span className="material-symbols-outlined">delete</span></button>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container/10">
                <h5 className="text-[11px] font-black text-outline uppercase tracking-widest">Storage Places (Locations)</h5>
                <button className="text-primary text-[11px] font-bold flex items-center gap-1 hover:underline">
                  <span className="material-symbols-outlined text-sm">add</span> Add New Place
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-surface-container-low/95 backdrop-blur-sm z-10">
                    <tr className="border-b border-outline-variant/20">
                      <th className="px-6 py-4 text-[10px] font-black text-outline uppercase tracking-widest">Location Tag</th>
                      <th className="px-6 py-4 text-[10px] font-black text-outline uppercase tracking-widest">Descriptor</th>
                      <th className="px-6 py-4 text-[10px] font-black text-outline uppercase tracking-widest">Stock Items</th>
                      <th className="px-6 py-4 text-[10px] font-black text-outline uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black text-outline uppercase tracking-widest text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 text-sm">
                    <PlaceRow tag="SHLF-A-01" desc="Top Shelf, Left Corner" qty="24 units" status="In-Store" statusClass="bg-primary/10 text-primary border-primary/20" />
                    <PlaceRow tag="SHLF-A-02" desc="Top Shelf, Mid Section" qty="15 units" status="In-Store" statusClass="bg-primary/10 text-primary border-primary/20" />
                    <PlaceRow tag="DRW-01" desc="Small Components Drawer" qty="0 units" status="Empty" statusClass="bg-surface-container-highest text-outline border-outline-variant/50" />
                    <PlaceRow tag="DRW-02" desc="Fasteners & Bolts Drawer" qty="120 units" status="Low Stock" statusClass="bg-tertiary-container/20 text-tertiary border-tertiary/20" />
                    <PlaceRow tag="BIN-C-09" desc="Bulk Storage Bin, Bottom" qty="--" status="Maintenance" statusClass="bg-error-container/20 text-error border-error/20" />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop - පිටුපස අඳුරු කරන කොටස */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Dialog Box */}
          <div className="relative  bg-surface-container-low border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

            {/* Header */}
            <div className="p-6 border-b border-outline-variant/20 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black tracking-tight text-on-surface">Add Cupboard</h3>
                <p className="text-xs text-outline">Register a new physical storage unit within the warehouse.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-surface-container-high rounded-lg text-outline transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-5">
              {/* Cupboard Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-outline uppercase tracking-widest">Cupboard Name</label>
                <input
                  type="text"
                  placeholder="e.g., Cupboard A-05"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all text-on-surface"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-outline uppercase tracking-widest">Description</label>
                <textarea
                  rows={3}
                  placeholder="Specify storage purpose and physical characteristics..."
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all text-on-surface resize-none"
                />
              </div>

              {/* Row for Zone and Security */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-outline uppercase tracking-widest">Location/Zone</label>
                  <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary text-on-surface">
                    <option>Select Zone</option>
                    <option>Sector 1</option>
                    <option>Sector 2</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-black text-outline uppercase tracking-widest">Security Level</label>
                    <span className="text-[9px] bg-surface-container-highest px-1 rounded text-outline">OPTIONAL</span>
                  </div>
                  <div className="relative">
                    <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary text-on-surface appearance-none">
                      <option>Level 1 (Standard)</option>
                      <option>Level 2 (High)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-lg">lock</span>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex gap-3">
                <span className="material-symbols-outlined text-primary text-lg">info</span>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Physical labels for the cupboard will be generated automatically once registered in the system.
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-surface-container/50 border-t border-outline-variant/20 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 rounded-xl text-sm font-bold text-outline hover:bg-surface-container-high transition-all"
              >
                Cancel
              </button>
              <button className="bg-on-surface text-background px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg active:scale-95">
                <span className="material-symbols-outlined text-lg">save</span>
                Save Cupboard
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

/* --- Helper Components --- */

function MetaItem({ label, value }: any) {
  return (
    <div>
      <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-bold text-on-surface">{value}</p>
    </div>
  );
}

function PlaceRow({ tag, desc, qty, status, statusClass }: any) {
  return (
    <tr className="hover:bg-surface-bright/30 transition-colors group">
      <td className="px-6 py-4 font-mono text-xs text-primary underline underline-offset-4 decoration-primary/30 cursor-pointer">{tag}</td>
      <td className="px-6 py-4 text-on-surface-variant font-medium">{desc}</td>
      <td className="px-6 py-4 font-bold">{qty}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${statusClass}`}>{status}</span>
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 text-outline hover:text-primary transition-all"><span className="material-symbols-outlined text-lg">edit</span></button>
          <button className="p-2 text-outline hover:text-error transition-all"><span className="material-symbols-outlined text-lg">delete</span></button>
        </div>
      </td>
    </tr>
  );
}

function SmallStat({ icon, label, value, color = "text-on-surface" }: any) {
  return (
    <div className="flex items-center gap-3 bg-surface-container-lowest/40 p-3 rounded-xl border border-outline-variant/10">
      <div className="w-8 h-8 bg-surface-container rounded-lg flex items-center justify-center text-outline shadow-sm">
        <span className="material-symbols-outlined text-lg">{icon}</span>
      </div>
      <div>
        <p className="text-[9px] font-black text-outline uppercase tracking-tighter">{label}</p>
        <p className={`text-sm font-black tracking-tight ${color}`}>{value}</p>
      </div>
    </div>
  );
}