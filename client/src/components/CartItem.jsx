const CartItem = ({ item, onUpdateQty, onRemove, disabled = false }) => {
  return (
    <div className="cart-card">
      <div className="cart-item">
        <div>
          <strong>{item.title}</strong>
          <div className="muted">${item.price.toFixed(2)} each</div>
        </div>
        <div className="cart-item-controls">
          <button
            className="secondary-btn"
            onClick={() => onUpdateQty(item.productId, item.quantity - 1)}
            disabled={disabled}
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            className="secondary-btn"
            onClick={() => onUpdateQty(item.productId, item.quantity + 1)}
            disabled={disabled}
          >
            +
          </button>
          <button className="secondary-btn" onClick={() => onRemove(item.productId)} disabled={disabled}>
            Remove
          </button>
        </div>
      </div>
      <div className="muted">Line total: ${(item.price * item.quantity).toFixed(2)}</div>
    </div>
  );
};

export default CartItem;
