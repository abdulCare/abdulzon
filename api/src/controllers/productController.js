import Product from '../models/Product.js';

export const getProducts = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }

    res.json(product);
  } catch (error) {
    if (error.name === 'CastError') {
      error.statusCode = 404;
      error.message = 'Product not found';
    }
    next(error);
  }
};
