import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

const Likes = () => {
  const { user, likes } = useAuth();
  const { addToCart } = useCart();

  if (!user) {
    return (
      <section className="panel">
        <h2>Sign in to view likes</h2>
        <Link to="/login" className="primary-btn">
          Login
        </Link>
      </section>
    );
  }

  if (likes.length === 0) {
    return (
      <section className="panel">
        <h2>No liked products yet</h2>
        <p className="muted">Tap the heart on a product to find it later.</p>
        <Link to="/" className="primary-btn">
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h2>Liked products</h2>
      <div className="likes-grid">
        {likes.map((product) => (
          <ProductCard key={product.id} product={{ ...product, _id: product.id }} onAddToCart={addToCart} />
        ))}
      </div>
    </section>
  );
};

export default Likes;
