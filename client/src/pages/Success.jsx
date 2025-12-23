import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchOrder } from '../api/orders.js';
import { useAuth } from '../context/AuthContext.jsx';

const Success = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setError('Login to view order details.');
      return;
    }
    const loadOrder = async () => {
      try {
        const data = await fetchOrder(orderId);
        setOrder(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Could not retrieve order details');
      }
    };

    loadOrder();
  }, [orderId, user]);

  return (
    <section className="panel success-box">
      <h2>Order placed!</h2>
      <p>Your order id is {orderId}</p>
      {error && <p className="muted">{error}</p>}
      {order && (
        <p>
          {order.items.length} items • Subtotal ${order.subtotal.toFixed(2)}
        </p>
      )}
      <Link to="/" className="primary-btn">
        Continue shopping
      </Link>
    </section>
  );
};

export default Success;
