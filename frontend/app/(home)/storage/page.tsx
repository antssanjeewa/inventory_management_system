"use client";

import { useEffect, useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import PageButton from '@/components/PageButton';
import StorageForm from './components/StorageForm';
import PlaceForm from './components/PlaceForm';
import { Cupboard, Place, deleteCupboard, getCupboards, getPlaces, deletePlace } from '@/services/StorageService';
import { confirmAction, showError, showSuccess } from '@/lib/alert';
import { TableLoading } from '@/components/TableLoading';
import { TableEmpty } from '@/components/TableEmpty';

export default function StoragePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [cupboards, setCupboards] = useState<Cupboard[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [placesMeta, setPlacesMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [selectedCupboard, setSelectedCupboard] = useState<Cupboard | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  useEffect(() => {
    loadCupboards();
  }, []);

  const loadCupboards = async (page: number = 1) => {
    try {
      setLoading(true);
      const res = await getCupboards(page);

      setCupboards(res.items);
      setMeta(res.meta);
      if (res.items.length > 0 && !selectedCupboard) {
        setSelectedCupboard(res.items[0]);
      }
    } catch (error: any) {
      showError(error.message);
    }
    finally {
      setLoading(false);
    }
  };

  const loadPlaces = async (cupboardId: number, page: number = 1) => {
    try {
      setPlacesLoading(true);
      const res = await getPlaces(cupboardId, page);
      setPlaces(res.items);
      setPlacesMeta(res.meta);
    } catch (error: any) {
      showError(error.message);
    } finally {
      setPlacesLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCupboard) {
      loadPlaces(selectedCupboard.id);
    }
  }, [selectedCupboard]);

  const handlePageChange = (page: number) => {
    if (page < 1 || (meta && page > meta.last_page)) return;
    loadCupboards(page);
  };

  const handlePlacePageChange = (page: number) => {
    if (page < 1 || (placesMeta && page > placesMeta.last_page) || !selectedCupboard) return;
    loadPlaces(selectedCupboard.id, page);
  };

  const handleDelete = async (id: number) => {
    const isConfirmed = await confirmAction("Delete Cupboard?", "This cupboard will be permanently removed.");
    if (!isConfirmed) return;

    try {
      await deleteCupboard(id);
      showSuccess("Cupboard deleted successfully");
      loadCupboards();

    } catch (error: any) {
      showError(error.message);
    }
  };

  const handleEdit = (cupboard: Cupboard) => {
    setSelectedCupboard(cupboard);
    setIsModalOpen(true);
  };

  const handleDeletePlace = async (id: number) => {
    const isConfirmed = await confirmAction("Delete Storage Place?", "This location will be removed from the cupboard.");
    if (!isConfirmed) return;

    try {
      await deletePlace(id);
      showSuccess("Storage place deleted successfully");
      if (selectedCupboard) loadPlaces(selectedCupboard.id);
    } catch (error: any) {
      showError(error.message);
    }
  };

  return (
    <div className="p-margin bg-background min-h-screen text-on-surface">
      <div className="flex justify-between items-center mb-8">
        <Breadcrumb
          pageTitle="Hierarchical Storage Units"
          items={[
            { label: "Storage Management", active: true }
          ]}
        />
        <div className="flex gap-3">
          <button onClick={() => { setSelectedCupboard(null); setIsModalOpen(true) }} className="bg-primary text-on-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-lg">add</span> Add Cupboard
          </button>
        </div>
      </div>

      <div className="flex gap-4 h-[calc(100vh-180px)]">


        <div className="w-80 bg-surface-container-low border border-outline-variant/30 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-outline">door_back</span>
              <span className="font-bold text-sm tracking-tight">Cupboard List</span>
            </div>
            <span className="text-[10px] bg-surface-container-highest px-2 py-0.5 rounded text-outline font-black">{cupboards.length} UNITS</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {loading && <div className="text-center py-4">Loading...</div>}
            {!loading && cupboards.length === 0 && <div className="text-center py-4">No Data found</div>}
            {!loading && cupboards.map((cpb) => (
              <button
                key={cpb.id}
                onClick={() => setSelectedCupboard(cpb)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${selectedCupboard?.id === cpb.id
                  ? 'bg-primary/5 border-primary/20'
                  : 'border-transparent hover:bg-surface-container-high'
                  }`}
              >
                <p className="text-[10px] font-mono text-outline mb-1">CPD-{cpb.id}</p>
                <h4 className={`font-bold text-sm mb-1 ${selectedCupboard?.id === cpb.id ? 'text-primary' : 'text-on-surface'}`}>{cpb.name}</h4>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-outline flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">grid_view</span> {cpb.places_count || 0} Places
                  </span>
                </div>
              </button>
            ))}
          </div>

          {meta && meta.last_page > 1 && (
            <div className="p-4 border-t border-outline-variant/10 flex justify-center gap-2 bg-surface-container/10">
              <PageButton
                onClick={() => handlePageChange(meta.current_page - 1)}
                disabled={meta.current_page === 1}
                icon="chevron_left"
              />
              <span className="text-[10px] font-black self-center px-4">
                PAGE {meta.current_page} OF {meta.last_page}
              </span>
              <PageButton
                onClick={() => handlePageChange(meta.current_page + 1)}
                disabled={meta.current_page === meta.last_page}
                icon="chevron_right"
              />
            </div>
          )}
        </div>

        {selectedCupboard ?
          <div className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-outline-variant/20 bg-surface-container/20">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-surface-container-highest rounded-2xl flex items-center justify-center border border-outline-variant/50 text-primary">
                    <span className="material-symbols-outlined text-3xl">warehouse</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">{selectedCupboard.name}</h3>
                    <p className="text-body-sm text-outline leading-snug">Storage metrics and configuration for {selectedCupboard.name}.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(selectedCupboard)} className="px-2 py-1 text-outline hover:bg-surface-bright rounded-lg border border-outline-variant/50"><span className="material-symbols-outlined">edit</span></button>
                  <button onClick={() => handleDelete(selectedCupboard.id)} className="px-2 py-1 text-outline hover:bg-surface-bright rounded-lg border border-outline-variant/50"><span className="material-symbols-outlined text-error">delete</span></button>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-6 py-2 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container/10">
                <h5 className="text-[11px] font-black text-outline uppercase tracking-widest">Storage Places (Locations)</h5>
                <button onClick={() => { setSelectedPlace(null); setIsPlaceModalOpen(true); }} className="text-primary text-[11px] font-bold flex items-center gap-1 hover:bg-primary/10 px-3 py-2 rounded">
                  <span className="material-symbols-outlined text-sm">add</span> Add New Place
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-surface-container-low/95 backdrop-blur-sm z-10">
                    <tr className="border-b border-outline-variant/20">
                      <th className="px-6 py-4 text-[10px] font-black text-outline uppercase tracking-widest">ID</th>
                      <th className="px-6 py-4 text-[10px] font-black text-outline uppercase tracking-widest">Name</th>
                      <th className="px-6 py-4 text-[10px] font-black text-outline uppercase tracking-widest">Stock Items</th>
                      <th className="px-6 py-4 text-[10px] font-black text-outline uppercase tracking-widest text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 text-sm">
                    {placesLoading ? (
                      <TableLoading colSpan={4} />
                    ) : places.length === 0 ? (
                      <TableEmpty colSpan={4} />
                    ) : (
                      places.map((place) => (
                        <tr key={place.id} className="hover:bg-surface-bright/30 transition-colors group">
                          <td className="px-6 py-4">
                            LOC-{place.id.toString().padStart(3, '0')}
                          </td>
                          <td className="px-6 py-4 text-on-surface-variant font-medium">
                            <div>
                              <p className="font-bold text-on-surface">{place.name}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold">{place.items_count ?? 0}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-1 opacity-30 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setSelectedPlace(place); setIsPlaceModalOpen(true); }} className="p-2 text-outline hover:text-primary transition-all"><span className="material-symbols-outlined text-lg">edit</span></button>
                              <button onClick={() => handleDeletePlace(place.id)} className="p-2 text-outline hover:text-error transition-all"><span className="material-symbols-outlined text-lg">delete</span></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>


              <div className="px-6 py-3 border-t border-outline-variant/10 flex justify-between items-center bg-surface-container/5">
                <span className="text-[10px] font-black text-outline uppercase tracking-widest">
                  Showing {places.length} of {placesMeta.total} locations
                </span>
                <div className="flex gap-2">
                  <PageButton
                    icon="chevron_left"
                    disabled={!placesMeta || placesMeta.current_page === 1}
                    onClick={() => handlePageChange(placesMeta.current_page - 1)}
                  />
                  {placesMeta && [...Array(placesMeta.last_page)].map((_, i) => (
                    <PageButton
                      key={i + 1}
                      label={i + 1}
                      active={placesMeta.current_page === i + 1}
                      onClick={() => handlePageChange(i + 1)}
                    />
                  ))}
                  <PageButton
                    icon="chevron_right"
                    disabled={!placesMeta || placesMeta.current_page === placesMeta.last_page}
                    onClick={() => handlePageChange(placesMeta.current_page + 1)}
                  />
                </div>
              </div>

            </div>
          </div>
          : null}
      </div>

      <StorageForm
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedCupboard(cupboards[0]); }}
        onSuccess={loadCupboards}
        initialData={selectedCupboard}
      />

      {selectedCupboard && (
        <PlaceForm
          isOpen={isPlaceModalOpen}
          onClose={() => { setIsPlaceModalOpen(false); setSelectedPlace(null); }}
          onSuccess={() => loadPlaces(selectedCupboard.id)}
          cupboard={selectedCupboard}
          initialData={selectedPlace}
        />
      )}

    </div>
  );
}