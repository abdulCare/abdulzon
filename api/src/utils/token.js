import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const TOKEN_COOKIE_NAME = 'abdulzon_token';

export const generateToken = (userId) =>
  jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const verifyToken = (token) => jwt.verify(token, env.jwtSecret);

const baseCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: env.cookieSecure
};

export const attachAuthCookie = (res, token) => {
  res.cookie(TOKEN_COOKIE_NAME, token, {
    ...baseCookieOptions,
    maxAge: 1000 * 60 * 60 * 24 * 7 // fallback expiry; JWT controls auth lifetime
  });
};

export const clearAuthCookie = (res) => {
  res.cookie(TOKEN_COOKIE_NAME, '', {
    ...baseCookieOptions,
    maxAge: 0
  });
};
