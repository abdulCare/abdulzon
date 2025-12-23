import mongoose from 'mongoose';
import Product from '../models/Product.js';

const ensureProduct = async (productId) => {
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

const formatLikes = (products) =>
  products.map((product) => ({
    id: product._id,
    title: product.title,
    price: product.price,
    imageUrl: product.imageUrl,
    category: product.category
  }));

export const getLikes = async (req, res, next) => {
  try {
    await req.user.populate('likes');
    res.json({ likes: formatLikes(req.user.likes) });
  } catch (error) {
    next(error);
  }
};

export const likeProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    await ensureProduct(productId);

    const user = req.user;
    const alreadyLiked = user.likes.some((id) => id.toString() === productId);
    if (!alreadyLiked) {
      user.likes.push(productId);
      await user.save();
    }

    await user.populate('likes');
    res.status(201).json({ likes: formatLikes(user.likes) });
  } catch (error) {
    next(error);
  }
};

export const unlikeProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = req.user;
    user.likes = user.likes.filter((id) => id.toString() !== productId);
    await user.save();
    await user.populate('likes');
    res.json({ likes: formatLikes(user.likes) });
  } catch (error) {
    next(error);
  }
};
