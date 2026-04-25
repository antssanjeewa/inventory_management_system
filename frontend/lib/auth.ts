import api from './api';
import Cookies from 'js-cookie';

export const auth = {
    login: async (credentials: object) => {
        const response = await api.post('/login', credentials);
        
        if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.data));
            Cookies.set('user_role', response.data.data.role, { expires: 7 });
            Cookies.set('auth_token', response.data.data.access_token, { expires: 7 });
        }
        return response.data;
    },

    logout: async () => {
        try {
            await api.post('/logout');
        } catch {}
        localStorage.removeItem('user');
        window.location.href = '/';
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
};