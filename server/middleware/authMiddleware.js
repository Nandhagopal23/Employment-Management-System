const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Bearer TOKEN
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
};

const authorizeRole = (roles) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.id) return res.sendStatus(401);

            const user = await User.findByPk(req.user.id, {
                include: [Role]
            });

            if (!user || !user.Role) return res.sendStatus(403);

            if (roles.includes(user.Role.name) || user.Role.name === 'Admin') { // Admin always has access
                next();
            } else {
                res.status(403).json({ message: 'Access denied: Insufficient privileges' });
            }
        } catch (error) {
            next(error);
        }
    };
};

module.exports = { authenticateToken, authorizeRole };
