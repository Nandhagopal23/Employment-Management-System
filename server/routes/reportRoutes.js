const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// All reports require authentication
router.get('/salary-stats', authenticateToken, authorizeRole(['Admin', 'HR']), reportController.getSalaryStats);
router.get('/export-csv', authenticateToken, authorizeRole(['Admin', 'HR']), reportController.exportEmployeesCSV);
router.get('/audit-logs', authenticateToken, authorizeRole(['Admin']), reportController.getAuditLogs);

module.exports = router;
