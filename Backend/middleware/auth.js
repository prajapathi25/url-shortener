// middleware/auth.js

import jwt from 'jsonwebtoken';

/**
 * @desc Verifies the JWT sent by the client.
 * If the token is valid, attaches the decoded user payload to req.user.
 * If no token is present, returns 401 Unauthorized.
 * If a token is present but invalid, returns 401 Unauthorized.
 */
const auth = (req, res, next) => {
  // Get the token from the request header
  const token = req.header('x-auth-token');

  // No token = unauthorized
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No authentication token provided',
    });
  }

  try {
    // Verify and decode the JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // JWT contains { id: userId }
    req.user = decoded;

    // Continue to the next middleware/route
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);

    return res.status(401).json({
      success: false,
      error: 'Token is not valid',
    });
  }
};

export default auth;