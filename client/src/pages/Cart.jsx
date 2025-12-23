import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, subtotal, loading, mode, error } = useCart();
  const { user } = useAuth();

  if (loading) {
    return (
      <section className="panel">
        <p>Loading cart...</p>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="panel">
        <h2>Your cart is empty</h2>
        {!user && <p className="muted">Sign in to save your cart across devices.</p>}
        <Link to="/" className="primary-btn">
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section className="grid" style={{ gap: '1.5rem' }}>
      <div>
        <h2>Shopping Cart</h2>
        {mode === 'guest' && <p className="muted">Guest cart – log in to sync across sessions.</p>}
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <div className="cart-items">
          {cartItems.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              onUpdateQty={updateQuantity}
              onRemove={removeFromCart}
              disabled={loading}
            />
          ))}
        </div>
      </div>
      <div className="panel">
        <h3>Summary</h3>
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <Link to="/checkout" className="primary-btn">
          Proceed to Checkout
        </Link>
      </div>
    </section>
  );
};

export default Cart;
