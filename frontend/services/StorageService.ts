import api, { ApiResponse } from '@/lib/api';

export interface Cupboard {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
    places_count?: number;
}

export interface Place {
    id: number;
    cupboard_id: number;
    name: string;
    items_count?: number;
    created_at?: string;
    updated_at?: string;
}

export const getCupboards = async (page: number = 1) => {
    const res = await api.get<ApiResponse<Cupboard[]>>(`/cupboards?page=${page}`);
    if (!res.data.success) {
        throw new Error(res.data.message);
    }
    return {
      items: res.data.data,
      meta: res.data.meta,
    };
};

export const createCupboard = async (data: { name: string }) => {
    const res = await api.post<ApiResponse<Cupboard>>("/cupboards", data);
    if (!res.data.success) {
        throw new Error(res.data.message);
    }
    return res.data.data;
};

export const updateCupboard = async (id: number, data: { name: string }) => {
    const res = await api.put<ApiResponse<Cupboard>>(`/cupboards/${id}`, data);
    if (!res.data.success) {
        throw new Error(res.data.message);
    }
    return res.data.data;
};

export const deleteCupboard = async (id: number) => {
    const res = await api.delete<ApiResponse<null>>(`/cupboards/${id}`);
    if (!res.data.success) {
        throw new Error(res.data.message);
    }
    return res.data.data;
};


export const getPlaces = async (cupboardId?: number, page: number = 1) => {
    const url = cupboardId ? `/places?cupboard_id=${cupboardId}&page=${page}` : `/places?page=${page}`;
    const res = await api.get<ApiResponse<Place[]>>(url);
    if (!res.data.success) {
        throw new Error(res.data.message);
    }
    return {
      items: res.data.data,
      meta: res.data.meta,
    };
};

export const createPlace = async (data: { cupboard_id: number; name: string; description?: string }) => {
    const res = await api.post<ApiResponse<Place>>("/places", data);
    if (!res.data.success) {
        throw new Error(res.data.message);
    }
    return res.data.data;
};

export const updatePlace = async (id: number, data: Partial<{ name: string; description: string }>) => {
    const res = await api.put<ApiResponse<Place>>(`/places/${id}`, data);
    if (!res.data.success) {
        throw new Error(res.data.message);
    }
    return res.data.data;
};

export const deletePlace = async (id: number) => {
    const res = await api.delete<ApiResponse<null>>(`/places/${id}`);
    if (!res.data.success) {
        throw new Error(res.data.message);
    }
    return res.data.data;
};