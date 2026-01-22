const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, authorizeRole(['Admin', 'HR']), employeeController.create);
router.get('/', authenticateToken, employeeController.getAll);
router.get('/search', authenticateToken, employeeController.search);
router.get('/:id', authenticateToken, employeeController.getById);
router.put('/:id', authenticateToken, authorizeRole(['Admin', 'HR']), employeeController.update);
router.delete('/:id', authenticateToken, authorizeRole(['Admin', 'HR']), employeeController.delete);

module.exports = router;
