import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Products.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load products');
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    // Confirm before deleting
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete product');

      // Remove deleted product from the list immediately
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="products-loading">Loading Products...</div>;
  if (error) return <div className="products-loading" style={{ color: '#dc2626' }}>Error: {error}</div>;

  return (
    <div className="products-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>All Products</h2>
        <button className="auth-btn" onClick={() => navigate('/create-product')} style={{ width: 'auto', padding: '10px 20px' }}>
          + Create Product
        </button>
      </div>

      {products.length === 0 ? (
        <p className="no-products">No products yet.</p>
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
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;