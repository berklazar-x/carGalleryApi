import React, { useState, useEffect } from 'react';
import { favoriteService } from '../services/favoriteService';
import { Car } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './Catalog.css';

const Favorites: React.FC = () => {
  const [favoriteCars, setFavoriteCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFavorites = async () => {
    if (!user) return;
    try {
      console.log('Loading favorites for user:', user.id);
      const favorites = await favoriteService.getUserFavorites(user.id);
      console.log('Favorites loaded:', favorites);
      setFavoriteCars(favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (carId: number) => {
    if (!user) return;
    try {
      await favoriteService.removeFromFavorites(user.id, carId);
      setFavoriteCars(favoriteCars.filter((car) => car.id !== carId));
    } catch (error) {
      console.error('Error removing from favorites:', error);
      alert('An error occurred while removing from favorites');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="catalog-page">
      <header className="catalog-header">
        <div className="header-content">
          <h1>My Favorites</h1>
          <div className="header-actions">
            {user && (
              <>
                <span className="welcome-text">Welcome, {user.username}</span>
                <Link to="/catalog" className="admin-link">
                  Catalog
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin/cars" className="admin-link">
                    Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="secondary">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="catalog-main">
        <div className="catalog-container">
          {favoriteCars.length === 0 ? (
            <div className="empty-favorites" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              color: 'white',
              fontSize: '24px',
              fontWeight: '500'
            }}>
              <h2 style={{ color: 'white', marginBottom: '20px' }}>Favorites are empty</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '30px' }}>You can add your favorite cars from the catalog</p>
              <Link to="/catalog" className="button primary" style={{
                background: 'white',
                color: '#333',
                padding: '12px 30px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Go to Catalog
              </Link>
            </div>
          ) : (
            <>
              <div className="catalog-header-info">
                <h2>{favoriteCars.length} Favorite Car{favoriteCars.length !== 1 ? 's' : ''}</h2>
              </div>

              <div className="cars-grid">
                {favoriteCars.map((car) => {
                  console.log('Car data:', {
                    id: car.id,
                    model: car.model,
                    currentPrice: car.price,
                    addedPrice: car.addedPrice,
                    priceChange: car.addedPrice ? car.price - car.addedPrice : 0
                  });
                  
                  const priceChange = car.addedPrice ? car.price - car.addedPrice : 0;
                  const priceChangePercent = car.addedPrice ? ((priceChange / car.addedPrice) * 100).toFixed(1) : 0;
                  const hasPriceChange = Math.abs(priceChange) > 0.01;
                  
                  return (
                  <div key={car.id} className="car-card" style={{ position: 'relative' }}>
                    <button
                      onClick={() => handleRemoveFromFavorites(car.id)}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        zIndex: 10,
                      }}
                      title="Remove from favorites"
                    >
                      ❤️
                    </button>
                    <Link 
                      to={`/car/${car.id}`} 
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div className="car-image">
                        {(car.imageUrls && car.imageUrls.length > 0) ? (
                          <img 
                            src={car.imageUrls[0].startsWith('http') ? car.imageUrls[0] : `http://localhost:5000${car.imageUrls[0]}`} 
                            alt={`${car.brandName} ${car.model}`} 
                          />
                        ) : car.imageUrl ? (
                          <img 
                            src={car.imageUrl.startsWith('http') ? car.imageUrl : `http://localhost:5000${car.imageUrl}`} 
                            alt={`${car.brandName} ${car.model}`} 
                          />
                        ) : (
                          <div className="car-placeholder">
                            <span className="car-icon">CAR</span>
                          </div>
                        )}
                        <div className="car-year-badge">{car.year}</div>
                      </div>
                      <div className="car-details">
                        <h3 className="car-brand">{car.brandName}</h3>
                        <p className="car-model">{car.model}</p>
                        <div className="car-info">
                          <span className="car-year">{car.year}</span>
                        </div>
                        {car.stock <= 0 ? (
                          <div className="car-out-of-stock">OUT OF STOCK</div>
                        ) : (
                          <>
                            <div className="car-price">
                              {car.price.toLocaleString('en-US')} ₺
                            </div>
                            {hasPriceChange && (
                              <div style={{
                                fontSize: '13px',
                                marginTop: '5px',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                background: priceChange > 0 ? '#ffebee' : '#e8f5e9',
                                color: priceChange > 0 ? '#c62828' : '#2e7d32',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}>
                                <span>{priceChange > 0 ? '📈' : '📉'} {priceChange > 0 ? 'Price increased' : 'Price decreased'}</span>
                                <span>{priceChange > 0 ? '+' : ''}{priceChange.toLocaleString('en-US')} ₺ ({priceChangePercent}%)</span>
                              </div>
                            )}
                            {hasPriceChange && (
                              <div style={{
                                fontSize: '12px',
                                color: '#666',
                                marginTop: '3px',
                              }}>
                                Added at: {car.addedPrice?.toLocaleString('en-US')} ₺
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </Link>
                  </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Favorites;
