import api from './api';
import { Car, AddFavoriteDto } from '../types';

export const favoriteService = {
  // Kullanıcının favori araçlarını getir
  getUserFavorites: async (userId: number): Promise<Car[]> => {
    const response = await api.get(`/favorites/user/${userId}`);
    return response.data;
  },

  // Favoriye ekle
  addToFavorites: async (dto: AddFavoriteDto): Promise<void> => {
    await api.post('/favorites', dto);
  },

  // Favorilerden çıkar
  removeFromFavorites: async (userId: number, carId: number): Promise<void> => {
    await api.delete(`/favorites/user/${userId}/car/${carId}`);
  },

  // Bir aracın favorilerde olup olmadığını kontrol et
  checkIsFavorite: async (userId: number, carId: number): Promise<boolean> => {
    const response = await api.get(`/favorites/user/${userId}/car/${carId}/check`);
    return response.data.isFavorite;
  },
};
