import api from '@/lib/api';

export interface ActivityLog {
    id: number;
    user_id: number;
    action: string;
    entity_type: string;
    entity_id: number;
    old_values: any;
    new_values: any;
    created_at: string;
    user?: {
        name: string;
    };
}

export const getActivityLogs = async (page: number = 1) => {
    const res = await api.get(`/activity-logs?page=${page}`);
    if (!res.data.success) {
        throw new Error(res.data.message);
    }
    return {
        items: res.data.data as ActivityLog[],
        meta: res.data.meta
    };
};
