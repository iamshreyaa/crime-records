const jwt = require('jsonwebtoken');
const secret = 'shreya123';
const dotenv = require('dotenv').config();

const authenticateToken = (req,res,next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({error : 'unauthorized'});

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user) => {
        if (err) return res.status(403).json({error : 'forbidden'});
        req.user = user;
        next();
    });
};
// Middleware to restrict access based on roles
const authorizeRole = (role) => (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
  
  module.exports = { authenticateToken, authorizeRole };