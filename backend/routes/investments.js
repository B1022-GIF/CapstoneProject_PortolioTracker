const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  createInvestment,
  getInvestments,
  getInvestment,
  updateInvestment,
  deleteInvestment,
} = require('../controllers/investmentController');

const router = express.Router();

const investmentValidation = [
  body('assetName').trim().notEmpty().withMessage('Asset name is required'),
  body('assetType')
    .isIn(['Equity', 'Debt', 'Mutual Fund', 'Crypto', 'ETF', 'Bonds', 'Other'])
    .withMessage('Invalid asset type'),
  body('purchaseDate').isISO8601().withMessage('Valid purchase date is required'),
  body('purchasePrice')
    .isFloat({ min: 0 })
    .withMessage('Purchase price must be a positive number'),
  body('quantity')
    .isFloat({ min: 0.0001 })
    .withMessage('Quantity must be greater than 0'),
];

router.use(auth);

router.route('/')
  .get(getInvestments)
  .post(investmentValidation, createInvestment);

router.route('/:id')
  .get(getInvestment)
  .put(investmentValidation, updateInvestment)
  .delete(deleteInvestment);

module.exports = router;
