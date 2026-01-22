const express = require('express');
const router = express.Router();
const departmentRoutes = require('./departmentRoutes');
const employeeRoutes = require('./employeeRoutes');
const authRoutes = require('./authRoutes');
const reportRoutes = require('./reportRoutes');

router.use('/auth', authRoutes);
router.use('/reports', reportRoutes);
router.use('/departments', departmentRoutes);
router.use('/employees', employeeRoutes);

module.exports = router;
