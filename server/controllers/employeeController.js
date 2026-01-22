const employeeService = require('../services/employeeService');
const auditService = require('../services/auditService');

class EmployeeController {
    async create(req, res, next) {
        try {
            const employee = await employeeService.createEmployee(req.body);
            await auditService.log('CREATE', 'Employee', employee.id, req.user.id, { email: employee.email });
            res.status(201).json(employee);
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const employees = await employeeService.getAllEmployees();
            res.json(employees);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const employee = await employeeService.getEmployeeById(req.params.id);
            res.json(employee);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const updated = await employeeService.updateEmployee(req.params.id, req.body);
            await auditService.log('UPDATE', 'Employee', req.params.id, req.user.id, { updates: req.body });
            res.json(updated);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const result = await employeeService.deleteEmployee(req.params.id);
            await auditService.log('DELETE', 'Employee', req.params.id, req.user.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async search(req, res, next) {
        try {
            const results = await employeeService.searchEmployees(req.query);
            res.json(results);
        } catch (error) {
            next(error);
        }
    }
    async updateProfile(req, res, next) {
        try {
            // Find employee linked to the logged-in user
            // req.user.id is the User ID. We need to find the employee with this user_id
            // This logic should ideally be in service, but for brevity:
            const { Employee } = require('../models');
            const employee = await Employee.findOne({ where: { user_id: req.user.id } });

            if (!employee) {
                return res.status(404).json({ error: 'Employee profile not found' });
            }

            // Update allowed fields only (Phone, maybe address if we had it. Not Salary/Designation)
            const allowedUpdates = {
                phone: req.body.phone,
                first_name: req.body.first_name,
                last_name: req.body.last_name
            };

            const updated = await employeeService.updateEmployee(employee.id, allowedUpdates);
            await auditService.log('UPDATE', 'Employee', employee.id, req.user.id, { updates: allowedUpdates });
            res.json(updated);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new EmployeeController();
