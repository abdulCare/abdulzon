import User from '../models/User.js';
import { verifyToken, TOKEN_COOKIE_NAME } from '../utils/token.js';

export const authRequired = async (req, res, next) => {
  try {
    const token = req.cookies[TOKEN_COOKIE_NAME];
    if (!token) {
      const err = new Error('Authentication required');
      err.statusCode = 401;
      throw err;
    }

    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 401;
      throw err;
    }

    req.user = user;
    next();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 401;
      error.message = 'Invalid or expired token';
    }
    next(error);
  }
};
