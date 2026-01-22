const { AuditLog } = require('../models');

class AuditService {
    async log(action, entityType, entityId, performedBy, details = null) {
        try {
            await AuditLog.create({
                action,
                entity_type: entityType,
                entity_id: entityId,
                performed_by: performedBy,
                details: details ? details : {}
            });
        } catch (error) {
            console.error('Audit Log Failed:', error);
            // Don't throw, we don't want to fail the request just because logging failed
        }
    }

    async getLogs() {
        return AuditLog.findAll({
            order: [['createdAt', 'DESC']],
            include: ['Actor'] // Assuming association alias
        });
    }
}

module.exports = new AuditService();
