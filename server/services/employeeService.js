const employeeRepository = require('../repositories/employeeRepository');

class EmployeeService {
    async createEmployee(data) {
        const existing = await employeeRepository.findByEmail(data.email);
        if (existing) {
            throw new Error('Employee with this email already exists');
        }
        return employeeRepository.create(data);
    }

    async getAllEmployees() {
        return employeeRepository.findAllWithDetails();
    }

    async getEmployeeById(id) {
        const employee = await employeeRepository.getById(id, { include: ['Department'] }); // include association string or model
        if (!employee) {
            throw new Error('Employee not found');
        }
        return employee;
    }

    async updateEmployee(id, data) {
        const updated = await employeeRepository.update(id, data);
        if (!updated) {
            throw new Error('Employee not found');
        }
        return updated;
    }

    async deleteEmployee(id) {
        const deleted = await employeeRepository.delete(id);
        if (!deleted) {
            throw new Error('Employee not found');
        }
        return { message: 'Employee deleted successfully' };
    }

    async searchEmployees(queryParams) {
        const { q, departmentId, minSalary, maxSalary, page = 1, limit = 10, sortBy, order } = queryParams;

        const filters = {};
        if (departmentId) filters.department_id = departmentId;
        if (minSalary || maxSalary) {
            filters.salary = {};
            if (minSalary) filters.salary[require('sequelize').Op.gte] = minSalary;
            if (maxSalary) filters.salary[require('sequelize').Op.lte] = maxSalary;
        }

        const offset = (page - 1) * limit;

        return employeeRepository.search(q, filters, { limit: parseInt(limit), offset }, { sortBy, sortOrder: order });
    }
}

module.exports = new EmployeeService();
