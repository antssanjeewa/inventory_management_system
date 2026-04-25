import api from '@/lib/api';

export interface Borrowing {
    id: number;
    inventory_item_id: number;
    inventory_item?: {
        id: number;
        item_name: string;
        code: string;
    };
    borrower_name: string;
    contact: string;
    borrow_date: string;
    expected_return_date: string;
    quantity: number;
    status: 'Borrowed' | 'Returned' | 'Overdue';
}

export const getBorrowings = async (page: number = 1) => {
    const res = await api.get(`/borrowings?page=${page}`);
    if (!res.data.success) {
        throw new Error(res.data.message);
    }
    return {
        items: res.data.data as Borrowing[],
        meta: res.data.meta
    };
};

export const updateBorrowingStatus = async (id: number, status: string) => {
    const res = await api.put(`/borrowings/${id}`, { status });
    if (!res.data.success) {
        throw new Error(res.data.message);
    }
    return res.data;
};

export const createBorrowing = async (data: any) => {
    const res = await api.post('/borrowings', data);
    if (!res.data.success) {
        throw new Error(res.data.message);
    }
    return res.data;
};
