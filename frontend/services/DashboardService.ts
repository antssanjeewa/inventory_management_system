import api from '@/lib/api';
import { ActivityLog } from './ActivityService';

export interface DashboardData {
    stats: {
        total_items: number;
        total_places: number;
        active_borrowings: number;
        low_stock_count: number;
    };
    latest_activities: ActivityLog[];
}

export const getDashboardData = async (): Promise<DashboardData> => {
    const res = await api.get('/dashboard');
    if (!res.data.success) {
        throw new Error(res.data.message);
    }
    return res.data.data;
};
