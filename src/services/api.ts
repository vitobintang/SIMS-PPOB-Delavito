import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (email: string, first_name: string, last_name: string, password: string) => {
  return api.post('/registration', { email, first_name, last_name, password });
};

export const login = async (email: string, password: string) => {
  return api.post('/login', { email, password });
};

export const getProfile = async () => {
  return api.get('/profile');
};

export const updateProfile = async (first_name: string, last_name: string) => {
  return api.put('/profile/update', { first_name, last_name });
};

export const updateProfileImage = async (image: File) => {
  const formData = new FormData();
  formData.append('file', image);
  return api.put('/profile/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getBalance = async () => {
  return api.get('/balance');
};

export const getServices = async () => {
  return api.get('/services');
};

export const getBanners = async () => {
  return api.get('/banner');
};

export const topUp = async (amount: number) => {
  return api.post('/topup', { top_up_amount: amount });
};

export const makeTransaction = async (serviceCode: string) => {
  return api.post('/transaction', { service_code: serviceCode });
};

export const getTransactionHistory = async (offset: number = 0, limit: number = 5) => {
  return api.get(`/transaction/history?offset=${offset}&limit=${limit}`);
};