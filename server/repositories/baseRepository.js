class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        return this.model.create(data);
    }

    async getAll(options = {}) {
        return this.model.findAll(options);
    }

    async getById(id, options = {}) {
        return this.model.findByPk(id, options);
    }

    async update(id, data) {
        const item = await this.model.findByPk(id);
        if (!item) return null;
        return item.update(data);
    }

    async delete(id) {
        const item = await this.model.findByPk(id);
        if (!item) return false;
        await item.destroy();
        return true;
    }

    async count(options = {}) {
        return this.model.count(options);
    }
}

module.exports = BaseRepository;
