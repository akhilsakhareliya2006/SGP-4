const jwt = require('jsonwebtoken');
const db = require('../database/database');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const user = await db.get('SELECT id, name, email, avatar_url FROM users WHERE id = ?', [decoded.userId]);
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await db.get('SELECT id, name, email, avatar_url FROM users WHERE id = ?', [decoded.userId]);
            if (user) {
                req.user = user;
            }
        } catch (error) {
            // Token invalid, but that's okay for optional auth
        }
    }

    next();
};

module.exports = { authenticateToken, optionalAuth };