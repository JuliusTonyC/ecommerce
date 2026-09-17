import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Products.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchMyProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view your products');
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/products/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load your products');

      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to load your products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete product');

      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete product');
    }
  };

  if (loading) return <div className="products-loading">Loading your products...</div>;
  if (error) return <div className="products-loading" style={{ color: '#dc2626' }}>Error: {error}</div>;

  return (
    <div className="products-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>My Products</h2>
        <button className="auth-btn" onClick={() => navigate('/create-product')} style={{ width: 'auto', padding: '10px 20px' }}>
          + New Product
        </button>
      </div>

      {products.length === 0 ? (
        <p className="no-products">You haven't created any products yet.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-desc">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">${product.price}</span>
                  <span className="product-stock">{product.stock} in stock</span>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button
                    className="action-btn"
                    onClick={() => navigate(`/edit-product/${product._id}`)}
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(product._id)}
                    style={{ flex: 1 }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProducts;