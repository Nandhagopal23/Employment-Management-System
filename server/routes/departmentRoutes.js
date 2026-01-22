const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, authorizeRole(['Admin']), departmentController.create);
router.get('/', authenticateToken, departmentController.getAll);
router.get('/:id', authenticateToken, departmentController.getById);
router.put('/:id', authenticateToken, authorizeRole(['Admin']), departmentController.update);
router.delete('/:id', authenticateToken, authorizeRole(['Admin']), departmentController.delete);

module.exports = router;
