const reportService = require('../services/reportService');
const auditService = require('../services/auditService');

class ReportController {
    async getSalaryStats(req, res, next) {
        try {
            const stats = await reportService.getSalaryStats();
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }

    async exportEmployeesCSV(req, res, next) {
        try {
            const csv = await reportService.generateEmployeeCSV();
            res.header('Content-Type', 'text/csv');
            res.header('Content-Disposition', 'attachment; filename="employees.csv"');
            res.send(csv);
        } catch (error) {
            next(error);
        }
    }

    async getAuditLogs(req, res, next) {
        try {
            const logs = await auditService.getLogs();
            res.json(logs);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReportController();
