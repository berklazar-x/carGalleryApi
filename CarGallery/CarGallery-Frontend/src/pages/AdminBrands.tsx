import React, { useState, useEffect } from 'react';
import { brandService } from '../services/brandService';
import { Brand, AddBrandDto, UpdateBrandDto } from '../types';
import './Admin.css';

const AdminBrands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ brandName: '' });

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const data = await brandService.getAll();
      setBrands(data);
    } catch (error) {
      console.error('Error loading brands:', error);
      alert('Error loading brands');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newBrand: AddBrandDto = { brandName: formData.brandName };
      await brandService.create(newBrand);
      setShowAddForm(false);
      setFormData({ brandName: '' });
      loadBrands();
    } catch (error) {
      console.error('Error adding brand:', error);
      alert('Error adding brand');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand) return;

    try {
      const updateData: UpdateBrandDto = {
        id: editingBrand.id,
        brandName: formData.brandName,
      };
      await brandService.update(updateData);
      setEditingBrand(null);
      setFormData({ brandName: '' });
      loadBrands();
    } catch (error) {
      console.error('Error updating brand:', error);
      alert('Error updating brand');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;

    try {
      await brandService.delete(id);
      loadBrands();
    } catch (error) {
      console.error('Error deleting brand:', error);
      alert('Error deleting brand');
    }
  };

  const startEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({ brandName: brand.brandName });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingBrand(null);
    setShowAddForm(false);
    setFormData({ brandName: '' });
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
        <h2>Brand Management</h2>
        <button
          className="primary"
          onClick={() => {
            setShowAddForm(true);
            setEditingBrand(null);
            setFormData({ brandName: '' });
          }}
        >
          + Add New Brand
        </button>
      </div>

      {(showAddForm || editingBrand) && (
        <div className="card form-card">
          <h3>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</h3>
          <form onSubmit={editingBrand ? handleUpdate : handleAdd}>
            <div className="form-group">
              <label>Brand Name</label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ brandName: e.target.value })}
                placeholder="Enter brand name"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="success">
                {editingBrand ? 'Update' : 'Add'}
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
              <th>Brand Name</th>
              <th>Created Date</th>
              <th>Updated Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id}>
                <td>{brand.id}</td>
                <td>{brand.brandName}</td>
                <td>{new Date(brand.createdDate).toLocaleDateString('en-US')}</td>
                <td>
                  {brand.updateDate
                    ? new Date(brand.updateDate).toLocaleDateString('en-US')
                    : '-'}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="secondary"
                      onClick={() => startEdit(brand)}
                    >
                      Edit
                    </button>
                    <button
                      className="danger"
                      onClick={() => handleDelete(brand.id)}
                    >
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

export default AdminBrands;
