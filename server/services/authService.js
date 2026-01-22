const { User, Role, Employee } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
    async register(username, password, roleName = 'Employee') {
        // Check if user exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            throw new Error('Username already exists');
        }

        // Find Role
        let role = await Role.findOne({ where: { name: roleName } });
        if (!role) {
            // Create default role if not exists (for dev convenience)
            role = await Role.create({ name: roleName });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await User.create({
            username,
            password_hash: hashedPassword,
            role_id: role.id
        });

        return { id: user.id, username: user.username, role: role.name };
    }

    async login(username, password) {
        const user = await User.findOne({
            where: { username },
            include: [Role]
        });

        if (!user) {
            throw new Error('Invalid username or password');
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            throw new Error('Invalid username or password');
        }

        // Generate Token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.Role.name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        let employeeId = null;
        if (user.Role.name === 'Employee') {
            const employee = await Employee.findOne({ where: { user_id: user.id } });
            if (employee) {
                employeeId = employee.id;
            }
        }

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.Role.name,
                employeeId
            }
        };
    }
}

module.exports = new AuthService();
