import Cookies from 'js-cookie';
import api from './api';

export const auth = {
    login: async (credentials: object) => {
        const response = await api.post('/login', credentials);
        
        if (response.data.status && response.data.token) {
            // Token එක Cookie එකක සුරැකීම (දින 7කට)
            Cookies.set('token', response.data.token, { expires: 7, secure: true });
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        Cookies.remove('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    },

    getToken: () => {
        return Cookies.get('token');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
};