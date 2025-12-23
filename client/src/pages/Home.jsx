import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import { fetchProducts } from '../api/products.js';
import { useCart } from '../context/CartContext.jsx';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState({ search: '', category: '' });
  const [searchInput, setSearchInput] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { addToCart } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts(query);
        setProducts(data);
        if (!query.search && !query.category) {
          const uniqueCategories = Array.from(new Set(data.map((item) => item.category)));
          setCategories(uniqueCategories);
        }
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [query]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setQuery((prev) => ({ ...prev, search: searchInput.trim() }));
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setCategoryFilter(value);
    setQuery((prev) => ({ ...prev, category: value === 'all' ? '' : value }));
  };

  return (
    <section>
      <div className="filters">
        <form onSubmit={handleSearchSubmit}>
          <input
            className="input"
            placeholder="Search products"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <button type="submit" className="primary-btn">
            Search
          </button>
        </form>
        <select value={categoryFilter} onChange={handleCategoryChange} className="input">
          <option value="all">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      {!loading && !error && products.length === 0 && <p>No products match your filters.</p>}

      <div className="grid product-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} onAddToCart={addToCart} />
        ))}
      </div>
    </section>
  );
};

export default Home;
