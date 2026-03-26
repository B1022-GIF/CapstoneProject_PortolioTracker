const express = require('express');
const auth = require('../middleware/auth');
const {
  downloadPDF,
  downloadCSV,
  emailPDF,
  emailCSV,
} = require('../controllers/exportController');

const router = express.Router();

router.use(auth);

router.get('/pdf', downloadPDF);
router.get('/csv', downloadCSV);
router.post('/email/pdf', emailPDF);
router.post('/email/csv', emailCSV);

module.exports = router;
