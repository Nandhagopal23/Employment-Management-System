const departmentService = require('../services/departmentService');
const auditService = require('../services/auditService');

class DepartmentController {
    async create(req, res, next) {
        try {
            const department = await departmentService.createDepartment(req.body);
            await auditService.log('CREATE', 'Department', department.id, req.user.id, { name: department.name });
            res.status(201).json(department);
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const departments = await departmentService.getAllDepartments();
            res.json(departments);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const department = await departmentService.getDepartmentById(req.params.id);
            res.json(department);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const updated = await departmentService.updateDepartment(req.params.id, req.body);
            await auditService.log('UPDATE', 'Department', req.params.id, req.user.id, { updates: req.body });
            res.json(updated);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const result = await departmentService.deleteDepartment(req.params.id);
            await auditService.log('DELETE', 'Department', req.params.id, req.user.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new DepartmentController();
