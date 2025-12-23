import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const { register, error, setError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState({ loading: false });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true });
    try {
      await register(form);
      navigate('/');
    } catch (_err) {
      setStatus({ loading: false });
    }
  };

  return (
    <section className="panel">
      <h2>Create account</h2>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input className="input" name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input className="input" name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input
            className="input"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <button type="submit" className="primary-btn" disabled={status.loading}>
          {status.loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="muted">
        Already have an account?{' '}
        <Link to="/login" onClick={() => setError('')}>
          Login
        </Link>
      </p>
    </section>
  );
};

export default Register;
