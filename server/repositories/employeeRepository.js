const BaseRepository = require('./baseRepository');
const { Employee, Department, User } = require('../models');
const { Op } = require('sequelize');

class EmployeeRepository extends BaseRepository {
    constructor() {
        super(Employee);
    }

    async findAllWithDetails(options = {}) {
        // Merge provided options with default relation inclusion
        const defaultOptions = {
            include: [
                { model: Department, attributes: ['id', 'name'] },
                { model: User, as: 'Creator', attributes: ['id', 'username'] } // Assuming 'created_by' relates to 'Creator'
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
