import jwt from 'jsonwebtoken';

// JWT secret key 
const JWT_SECRET = process.env.JWT_SECRET || '931079ede9061896e77a0516ba2351c0a6680fa90e117cc3b3e355b7c12c7efc1893159a2ef2e0c4811e785bb69ee262b40c0686ed185eb6d49a293701c99049';

// Middleware to authenticate token
export const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Received token:', token); 

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token and extract the decoded payload
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded Token:', decoded);
    req.user = decoded; // Attach the decoded user data to the request object
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};




