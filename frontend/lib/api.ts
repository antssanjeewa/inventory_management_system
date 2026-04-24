import axios from "axios";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links?: {
      next: string | null;
      prev: string | null;
    };
  };
};

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Accept': 'application/json',
    },
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");
  const token = user ? JSON.parse(user).access_token : null

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("user");
            window.location.href = '/';
        }

        if (error.response?.data?.message) {
            error.message = error.response.data.message;
        }

        return Promise.reject(error);
    }
);

export default api;