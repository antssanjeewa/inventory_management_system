import api from './api';

export const auth = {
    login: async (credentials: object) => {
        const response = await api.post('/login', credentials);
        
        if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('user');
        window.location.href = '/';
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
};