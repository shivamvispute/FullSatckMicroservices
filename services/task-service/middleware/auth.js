const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const SERVICE_TOKEN = process.env.SERVICE_TOKEN;

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ✅ Allow internal services using a shared SERVICE_TOKEN
  const serviceToken = req.headers['x-service-token'];
  if (serviceToken && serviceToken === SERVICE_TOKEN) {
    req.user = { id: 'internal-service', role: 'admin' };
    console.log('👤 Authenticated user:', req.user);
    return next();
  }

  // ✅ Normal user token flow
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = { authenticateToken };
