const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loan.controller');
// const authMiddleware = require('../middlewares/auth'); // nếu cần xác thực

// router.post('/create-many', authMiddleware, loanController.createLoans);
router.post('/create-many', loanController.createLoans);

module.exports = router;
