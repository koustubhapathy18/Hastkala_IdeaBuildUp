const jwt = require('jsonwebtoken');

// We can reuse basic auth header verify here or just rely strictly on req.user created by initial auth
const verifyAuthContext = (req, res, next) => {
  const token = req.header('x-auth-token') || (req.header('Authorization') && req.header('Authorization').split(' ')[1]);
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hastkala_secret');
    req.user = decoded; // The payload has id, role, email, status (if we add it, wait, we need 'status')
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

const verifyArtisan = (req, res, next) => {
  // Check if they are an artisan
  if (req.user && req.user.role === 'artisan') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Seller privileges required.' });
  }
};

const verifyActiveStatus = (req, res, next) => {
  // Check if their account has been approved by an admin
  if (req.user && req.user.status === 'active') {
    next();
  } else {
    res.status(403).json({ 
      message: req.user && req.user.status === 'rejected' 
        ? 'Your seller application was rejected. Please contact support.' 
        : 'Your account is pending review by the administration.' 
    });
  }
};

module.exports = {
  verifyAuthContext,
  verifyAdmin,
  verifyArtisan,
  verifyActiveStatus
};
