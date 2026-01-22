const authService = require('../services/authService');

class AuthController {
    async register(req, res, next) {
        try {
            const { username, password, role } = req.body;
            const user = await authService.register(username, password, role);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            const result = await authService.login(username, password);
            res.json(result);
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
}

module.exports = new AuthController();
