const express = require('express');
const auth = require('../middleware/auth');
const { getDashboard } = require('../controllers/portfolioController');

const router = express.Router();

router.use(auth);
router.get('/dashboard', getDashboard);

module.exports = router;
