import mongoose from 'mongoose';
import Product from '../models/Product.js';

const populateCart = async (user) => {
  await user.populate('cart.items.product');
  const items = user.cart.items
    .filter((item) => item.product)
    .map((item) => ({
      productId: item.product._id,
      title: item.product.title,
      price: item.product.price,
      imageUrl: item.product.imageUrl,
      quantity: item.quantity
    }));
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { items, subtotal };
};

const ensureProductExists = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const err = new Error('Invalid product id');
    err.statusCode = 400;
    throw err;
  }
  const product = await Product.findById(productId);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await populateCart(req.user);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const addCartItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId || quantity <= 0) {
      const err = new Error('Product id and positive quantity are required');
      err.statusCode = 400;
      throw err;
    }

    await ensureProductExists(productId);

    const user = req.user;
    const existing = user.cart.items.find((item) => item.product.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      user.cart.items.push({ product: productId, quantity });
    }

    await user.save();
    const cart = await populateCart(user);
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number') {
      const err = new Error('Quantity is required');
      err.statusCode = 400;
      throw err;
    }

    await ensureProductExists(productId);

    const user = req.user;
    const existing = user.cart.items.find((item) => item.product.toString() === productId);

    if (!existing) {
      const err = new Error('Item not found in cart');
      err.statusCode = 404;
      throw err;
    }

    if (quantity <= 0) {
      user.cart.items = user.cart.items.filter((item) => item.product.toString() !== productId);
    } else {
      existing.quantity = quantity;
    }

    await user.save();
    const cart = await populateCart(user);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = req.user;
    user.cart.items = user.cart.items.filter((item) => item.product.toString() !== productId);
    await user.save();
    const cart = await populateCart(user);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (user) => {
  user.cart.items = [];
  await user.save();
};
