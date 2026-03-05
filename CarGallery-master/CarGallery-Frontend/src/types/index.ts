export interface Brand {
  id: number;
  brandName: string;
  createdDate: string;
  updateDate?: string;
}

export interface Car {
  id: number;
  brandName: string;
  model: string;
  year: number;
  price: number;
  imageUrl?: string;
  color?: string;
  stock: number;
  imageUrls?: string[];
  createdDate: string;
  createUserId?: number;
  updateDate?: string;
  updateUserId?: number;
}

export interface AddBrandDto {
  brandName: string;
}

export interface UpdateBrandDto {
  id: number;
  brandName: string;
}

export interface AddCarDto {
  brandId: number;
  model: string;
  year: number;
  price: number;
  createUserId: number;
  imageUrl?: string;
  color?: string;
  stock: number;
}

export interface UpdateCarDto {
  id: number;
  brandId: number;
  model: string;
  year: number;
  imageUrl?: string;
  price: number;
  color?: string;
  stock: number;
}

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
  createdDate?: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  password: string;
}

export interface UpdateUserRoleDto {
  userId: number;
  role: 'admin' | 'user';
}

