import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('You are not logged in. Please log in again');

        const res = await fetch(`${API_URL}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load product');

        setName(data.name || '');
        setCategory(data.category || '');
        setPrice(data.price ?? '');
        setStock(data.stock ?? '');
        setDescription(data.description || '');
        setImage(data.image || '');
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('You are not logged in');

      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          category,
          price: Number(price),
          stock: Number(stock),
          description,
          image: image.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update product');

      navigate('/my-products');
    } catch (err) {
      setError(err.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="products-loading">Loading product...</div>;

  return (
    <div className="auth-container" style={{ maxWidth: 650 }}>
      <h2>Edit Product</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>

        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label>Price ($) *</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" />
          </div>
          <div className="form-group">
            <label>Stock *</label>
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required min="0" />
          </div>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} style={{ width: '100%' }} />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input type="url" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/image.jpg" />
        </div>

        <button type="submit" className="auth-btn" disabled={saving}>
          {saving ? 'Saving...' : 'Update Product'}
        </button>

        <Link to="/my-products" className="auth-link" style={{ display: 'block', textAlign: 'center', marginTop: 16 }}>
          Cancel
        </Link>
      </form>
    </div>
  );
}

export default EditProduct;