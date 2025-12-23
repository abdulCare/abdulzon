import Order from '../models/Order.js';
import { clearCart } from './cartController.js';

const validateCustomer = (customer) => {
  if (!customer || !customer.name || !customer.address) {
    const err = new Error('Customer name and address are required');
    err.statusCode = 400;
    throw err;
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const { customer } = req.body;
    validateCustomer(customer);

    await req.user.populate('cart.items.product');
    const cartItems = req.user.cart.items.filter((item) => item.product);

    if (cartItems.length === 0) {
      const err = new Error('Cart is empty');
      err.statusCode = 400;
      throw err;
    }

    const items = cartItems.map((item) => ({
      productId: item.product._id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity
    }));

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.user._id,
      items,
      customer: {
        name: customer.name.trim(),
        address: customer.address.trim()
      },
      subtotal
    });

    await clearCart(req.user);

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }

    if (order.user.toString() !== req.user._id.toString()) {
      const err = new Error('Forbidden');
      err.statusCode = 403;
      throw err;
    }

    res.json(order);
  } catch (error) {
    if (error.name === 'CastError') {
      error.statusCode = 404;
      error.message = 'Order not found';
    }
    next(error);
  }
};
