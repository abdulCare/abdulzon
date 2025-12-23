import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProductCard = ({ product, onAddToCart }) => {
  const { isLiked, toggleLike } = useAuth();
  const liked = isLiked(product._id);

  const handleLike = async (event) => {
    event.preventDefault();
    try {
      await toggleLike(product._id);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <img src={product.imageUrl} alt={product.title} />
      </Link>
      <h3>{product.title}</h3>
      <p>${product.price.toFixed(2)}</p>
      <p className="muted">{product.category}</p>
      <div className="product-actions">
        <button
          type="button"
          className={`like-button${liked ? ' liked' : ''}`}
          onClick={handleLike}
          aria-label="Toggle like"
        >
          {liked ? '♥' : '♡'}
        </button>
        <button type="button" onClick={() => onAddToCart(product)}>
          Add to Cart
        </button>
        <Link className="secondary-btn" to={`/product/${product._id}`}>
          View
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
