import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { createOrder } from '../api/orders.js';

const Checkout = () => {
  const { cartItems, subtotal, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({ name: '', address: '' });
  const [status, setStatus] = useState({ loading: false, error: '' });

  if (!user) {
    return (
      <section className="panel">
        <h2>Login required</h2>
        <p>You need an account to place an order.</p>
        <Link to="/login" className="primary-btn">
          Go to Login
        </Link>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="panel">
        <h2>Your cart is empty</h2>
        <Link to="/" className="primary-btn">
          Shop products
        </Link>
      </section>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: '' });
    try {
      const order = await createOrder({ customer });
      await refreshCart();
      navigate(`/success/${order._id}`);
    } catch (error) {
      setStatus({ loading: false, error: error.message || 'Unable to place order' });
    }
  };

  return (
    <section className="grid" style={{ gap: '1.5rem' }}>
      <form className="panel checkout-form" onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <label>
          Full name
          <input
            className="input"
            value={customer.name}
            onChange={(event) => setCustomer((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
        </label>
        <label>
          Address
          <textarea
            className="input"
            rows="3"
            value={customer.address}
            onChange={(event) => setCustomer((prev) => ({ ...prev, address: event.target.value }))}
            required
          />
        </label>
        {status.error && <p style={{ color: 'crimson' }}>{status.error}</p>}
        <button type="submit" className="primary-btn" disabled={status.loading}>
          {status.loading ? 'Placing order...' : 'Place order'}
        </button>
      </form>
      <div className="panel">
        <h3>Order summary</h3>
        <p>Items: {cartItems.length}</p>
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p className="muted">Orders use your saved cart, so changes update automatically.</p>
      </div>
    </section>
  );
};

export default Checkout;
