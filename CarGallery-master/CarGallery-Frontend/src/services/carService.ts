import api from './api';
import { Car, AddCarDto, UpdateCarDto } from '../types';

export const carService = {
  getAll: async (): Promise<Car[]> => {
    const response = await api.get('/Cars/Get All');
    return response.data;
  },

  getById: async (id: number): Promise<Car> => {
    const response = await api.get(`/Cars/Get by id?id=${id}`);
    return response.data;
  },

  create: async (data: AddCarDto): Promise<Car> => {
    const response = await api.post('/Cars/Post', data);
    return response.data;
  },

  update: async (data: UpdateCarDto): Promise<void> => {
    await api.put('/Cars/Update', data);
  },

  updateImages: async (id: number, imageUrls: string[]): Promise<void> => {
    await api.put(`/Cars/UpdateImages/${id}`, imageUrls);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/Cars/Delete?id=${id}`);
  },
};
