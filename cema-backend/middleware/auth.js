const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from Authorization header

  // Check if the token is provided
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user data (e.g., userId) to the request object
    req.user = decoded;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Handle token verification errors
    console.error('Token verification error:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
