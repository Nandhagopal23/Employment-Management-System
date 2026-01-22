const departmentRepository = require('../repositories/departmentRepository');

class DepartmentService {
    async createDepartment(data) {
        const existing = await departmentRepository.findByName(data.name);
        if (existing) {
            throw new Error('Department with this name already exists');
        }
        return departmentRepository.create(data);
    }

    async getAllDepartments() {
        return departmentRepository.getAll();
    }

    async getDepartmentById(id) {
        const dept = await departmentRepository.getById(id);
        if (!dept) {
            throw new Error('Department not found');
        }
        return dept;
    }

    async updateDepartment(id, data) {
        const updated = await departmentRepository.update(id, data);
        if (!updated) {
            throw new Error('Department not found');
        }
        return updated;
    }

    async deleteDepartment(id) {
        const deleted = await departmentRepository.delete(id);
        if (!deleted) {
            throw new Error('Department not found');
        }
        return { message: 'Department deleted successfully' };
    }
}

module.exports = new DepartmentService();
