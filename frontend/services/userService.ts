import api, { ApiResponse } from '@/lib/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "staff";
}

export interface UserResponse {
  data: User[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
      next: string | null;
      prev: string | null;
    };
  };
}

// GET all users
export const getUsers = async (page: number = 1) => {
  const res = await api.get<ApiResponse<User[]>>(`/users?page=${page}`);
   if (!res.data.success) {
    throw new Error(res.data.message);
  }

  return {
    users: res.data.data,
    meta: res.data.meta,
  };
};

// GET single user
export const getUser = async (id: number): Promise<User> => {
  const res = await api.get(`/users/${id}`);
  return res.data.data;
};

// CREATE user
export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const res = await api.post("/users", data);
  return res.data.data;
};

// UPDATE user
export const updateUser = async (
  id: number,
  data: Partial<{
    name: string;
    email: string;
    password: string;
    role: string;
  }>
) => {
  const res = await api.put(`/users/${id}`, data);
  return res.data.data;
};

// DELETE user
export const deleteUser = async (id: number) => {
  const res = await api.delete(`/users/${id}`);

  if (!res.data.success) {
    throw new Error(res.data.message || "Delete failed");
  }
  
  return res.data.data;
};