import api from '@/lib/api';

export interface InventoryItem {
    id: number;
    item_name: string;
    code: string;
    quantity: number;
    serial_number?: string;
    image?: string;
    description?: string;
    place_id: number;
    status: string;
    place?: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
}

export interface InventoryFilters {
    search?: string;
    place_id?: string;
    status?: string;
    page?: number;
}

export const getInventoryItems = async (filters: InventoryFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.place_id) params.append('place_id', filters.place_id);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());

    const res = await api.get(`/inventory-items?${params.toString()}`);
    if (!res.data.success) {
        throw new Error(res.data.message);
    }
    return {
        items: res.data.data as InventoryItem[],
        meta: res.data.meta
    };
};

export const deleteInventoryItem = async (id: number) => {
    const res = await api.delete(`/inventory-items/${id}`);
    if (!res.data.success) {
        throw new Error(res.data.message);
    }
    return res.data;
};

export const getInventoryItem = async (id: number) => {
    const res = await api.get(`/inventory-items/${id}`);
    if (!res.data.success) {
        throw new Error(res.data.message);
    }
    return res.data.data as InventoryItem;
};

export const createInventoryItem = async (data: any) => {
    const res = await api.post('/inventory-items', data);
    if (!res.data.success) {
        throw new Error(res.data.message);
    }
    return res.data.data;
};

export const updateInventoryItem = async (id: number, data: any) => {
    data.append('_method', 'PUT');
    const res = await api.post(`/inventory-items/${id}`, data, {
        headers: {'Content-Type': 'multipart/form-data'},
    });
    if (!res.data.success) {
        throw new Error(res.data.message);
    }
    return res.data.data;
};
