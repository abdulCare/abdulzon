import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../api/products.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { addToCart } = useCart();
  const { isLiked, toggleLike } = useAuth();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await fetchProductById(id);
        setProduct(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Unable to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (error) return <p style={{ color: 'crimson' }}>{error}</p>;
  if (!product) return null;

  const liked = isLiked(product._id);

  const handleLike = async () => {
    try {
      await toggleLike(product._id);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="panel">
      <h2>{product.title}</h2>
      <p className="muted">Category: {product.category}</p>
      <p>{product.description}</p>
      <h3>${product.price.toFixed(2)}</h3>
      <div className="product-actions">
        <button type="button" onClick={() => addToCart(product)}>
          Add to Cart
        </button>
        <button
          type="button"
          className={`like-button${liked ? ' liked' : ''}`}
          onClick={handleLike}
        >
          {liked ? '♥ Liked' : '♡ Like'}
        </button>
      </div>
    </section>
  );
};

export default ProductDetails;
