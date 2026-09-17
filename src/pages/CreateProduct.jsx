import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function CreateProduct() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('You must be logged in to create a product');

      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          category,
          image: image.trim() || undefined,
          stock: Number(stock) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create product');

      setSuccess('Product created successfully!');
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setImage('');
      setStock('');

      setTimeout(() => navigate('/my-products'), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: 650 }}>
      <h2>Create Product</h2>

      {success && <p style={{ color: 'green', textAlign: 'center', marginBottom: 12 }}>{success}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter product name"
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            placeholder="e.g. Electronics, Clothing..."
          />
        </div>

        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label>Price ($) *</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label>Stock *</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              min="0"
              placeholder="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter a detailed description of the product..."
            rows={4}
            style={{ width: '100%' }}
          />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Product'}
        </button>

        <Link to="/my-products" className="auth-link" style={{ display: 'block', textAlign: 'center', marginTop: 16 }}>
          Cancel
        </Link>
      </form>
    </div>
  );
}

export default CreateProduct;