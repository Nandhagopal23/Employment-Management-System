const BaseRepository = require('./baseRepository');
const { Employee, Department, User, Role, sequelize } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

class EmployeeRepository extends BaseRepository {
    constructor() {
        super(Employee);
    }

    async create(data) {
        const transaction = await sequelize.transaction();
        try {
            let userId = null;

            // If login creation is requested
            if (data.create_login && data.username && data.password) {
                // Find or create 'Employee' role
                let role = await Role.findOne({ where: { name: 'Employee' } }, { transaction });
                if (!role) {
                    role = await Role.create({ name: 'Employee', permissions: [] }, { transaction });
                }

                const passwordHash = await bcrypt.hash(data.password, 10);
                const user = await User.create({
                    username: data.username,
                    password_hash: passwordHash,
                    role_id: role.id
                }, { transaction });

                userId = user.id;
            }

            const employee = await this.model.create({
                ...data,
                user_id: userId
            }, { transaction });

            await transaction.commit();
            return employee;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async update(id, data) {
        const transaction = await sequelize.transaction();
        try {
            const employee = await this.model.findByPk(id, { transaction });
            if (!employee) {
                await transaction.rollback();
                return null;
            }

            // Update Employee fields
            await employee.update(data, { transaction });

            // Handle Credential Updates
            if (data.create_login && data.username && data.password) {
                const passwordHash = await bcrypt.hash(data.password, 10);

                if (employee.user_id) {
                    // Update existing user
                    await User.update({
                        username: data.username,
                        password_hash: passwordHash
                    }, { where: { id: employee.user_id }, transaction });
                } else {
                    // Create new user similar to create()
                    let role = await Role.findOne({ where: { name: 'Employee' } }, { transaction });
                    if (!role) {
                        role = await Role.create({ name: 'Employee', permissions: [] }, { transaction });
                    }
                    const user = await User.create({
                        username: data.username,
                        password_hash: passwordHash,
                        role_id: role.id
                    }, { transaction });

                    await employee.update({ user_id: user.id }, { transaction });
                }
            }

            await transaction.commit();
            return employee;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async findAllWithDetails(options = {}) {
        // Merge provided options with default relation inclusion
        const defaultOptions = {
            include: [
                { model: Department, attributes: ['id', 'name'] },
                { model: User, as: 'Creator', attributes: ['id', 'username'] },
                { model: User, as: 'Account', attributes: ['id', 'username'] }
            ],
            ...options
        };
        return this.model.findAll(defaultOptions);
    }

    async findByEmail(email) {
        return this.model.findOne({ where: { email } });
    }

    async search(query, filters = {}, pagination = {}, sorting = {}) {
        const where = { ...filters };

        if (query) {
            where[Op.or] = [
                { first_name: { [Op.like]: `%${query}%` } },
                { last_name: { [Op.like]: `%${query}%` } },
                { email: { [Op.like]: `%${query}%` } },
                { designation: { [Op.like]: `%${query}%` } }
            ];
        }

        const { limit, offset } = pagination;
        const { sortBy = 'createdAt', sortOrder = 'DESC' } = sorting;

        const order = [];
        if (sortBy === 'department') {
            order.push([Department, 'name', sortOrder]);
        } else {
            order.push([sortBy, sortOrder]);
        }

        return this.model.findAndCountAll({
            where,
            limit,
            offset,
            include: [{ model: Department, attributes: ['name'] }],
            order
        });
    }
}

module.exports = new EmployeeRepository();
