const BaseRepository = require('./baseRepository');
const { Department } = require('../models');

class DepartmentRepository extends BaseRepository {
    constructor() {
        super(Department);
    }

    async findByName(name) {
        return this.model.findOne({ where: { name } });
    }
}

module.exports = new DepartmentRepository();
