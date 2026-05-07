import React, { useState, useEffect } from 'react';
import { carService } from '../services/carService';
import { brandService } from '../services/brandService';
import { fileUploadService } from '../services/fileUploadService';
import { Car, Brand, AddCarDto, UpdateCarDto } from '../types';
import { useAuthStore } from '../store/authStore';
import './Admin.css';

const AdminCars: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const user = useAuthStore((state) => state.user);
  
  const [formData, setFormData] = useState({
    brandId: 0,
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    imageUrl: '',
    color: '',
    stock: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [carsData, brandsData] = await Promise.all([
        carService.getAll(),
        brandService.getAll(),
      ]);
      setCars(carsData);
      setBrands(brandsData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newCar: AddCarDto = {
        ...formData,
        createUserId: user?.id || 1,
      };
      await carService.create(newCar);
      setShowAddForm(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error adding car:', error);
      alert('Error adding car');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar) return;

    try {
      const updateData: UpdateCarDto = {
        id: editingCar.id,
        ...formData,
      };
      await carService.update(updateData);
      setEditingCar(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error updating car:', error);
      alert('Error updating car');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this car?')) return;

    try {
      await carService.delete(id);
      loadData();
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Error deleting car');
    }
  };

  const startEdit = (car: Car) => {
    const brand = brands.find(b => b.brandName === car.brandName);
    setEditingCar(car);
    setFormData({
      brandId: brand?.id || 0,
      model: car.model,
      year: car.year,
      price: car.price,
      imageUrl: car.imageUrl || '',
      color: car.color || '',
      stock: car.stock || 0,
    });
    setShowAddForm(false);
  };

  const resetForm = () => {
    setFormData({
      brandId: 0,
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      imageUrl: '',
      color: '',
      stock: 0,
    });
  };

  const cancelEdit = () => {
    setEditingCar(null);
    setShowAddForm(false);
    resetForm();
  };
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File size check (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // File type check
    if (!file.type.startsWith('image/')) {
      alert('Only image files can be uploaded');
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await fileUploadService.uploadImage(file);
      setFormData({ ...formData, imageUrl });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(error.response?.data?.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="admin-header">
        <h2>Car Management</h2>
        <button
          className="primary"
          onClick={() => {
            setShowAddForm(true);
            setEditingCar(null);
            resetForm();
          }}
        >
          + Add New Car
        </button>
      </div>

      {(showAddForm || editingCar) && (
        <div className="card form-card">
          <h3>{editingCar ? 'Edit Car' : 'Add New Car'}</h3>
          <form onSubmit={editingCar ? handleUpdate : handleAdd}>
            <div className="form-group">
              <label>Brand</label>
              <select
                value={formData.brandId}
                onChange={(e) =>
                  setFormData({ ...formData, brandId: Number(e.target.value) })
                }
                required
              >
                <option value={0}>Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.brandName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                placeholder="Enter model name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: Number(e.target.value) })
                  }
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>

              <div className="form-group">
                <label>Price (₺)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Color</label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  placeholder="E.g: White, Black, Red"
                />
              </div>

              <div className="form-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: Number(e.target.value) })
                  }
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && <span style={{ color: '#667eea', marginLeft: '10px' }}>Uploading...</span>}
              {formData.imageUrl && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={formData.imageUrl.startsWith('http') ? formData.imageUrl : `http://localhost:5000${formData.imageUrl}`}
                    alt="Preview"
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="success">
                {editingCar ? 'Update' : 'Add'}
              </button>
              <button type="button" className="secondary" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Year</th>
              <th>Color</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id}>
                <td>{car.id}</td>
                <td>{car.brandName}</td>
                <td>{car.model}</td>
                <td>{car.year}</td>
                <td>{car.color || '-'}</td>
                <td>
                  <span className={car.stock > 0 ? 'stock-badge in-stock' : 'stock-badge out-of-stock'}>
                    {car.stock > 0 ? `${car.stock} unit${car.stock > 1 ? 's' : ''}` : 'Out of Stock'}
                  </span>
                </td>
                <td>{car.price.toLocaleString('en-US')} ₺</td>
                <td>
                  <div className="action-buttons">
                    <button className="secondary" onClick={() => startEdit(car)}>
                      Edit
                    </button>
                    <button className="danger" onClick={() => handleDelete(car.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCars;
