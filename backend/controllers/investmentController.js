const { validationResult } = require('express-validator');
const Investment = require('../models/Investment');
const { getPrice } = require('../services/marketData');

exports.createInvestment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { assetName, assetType, purchaseDate, purchasePrice, quantity, notes } = req.body;

    const currentPrice = getPrice(assetName);

    const investment = await Investment.create({
      user: req.user._id,
      assetName,
      assetType,
      purchaseDate,
      purchasePrice,
      quantity,
      currentPrice,
      notes,
    });

    res.status(201).json(investment);
  } catch (error) {
    console.error('Create investment error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getInvestments = async (req, res) => {
  try {
    const { assetType, sortBy, order, search } = req.query;

    const filter = { user: req.user._id };
    if (assetType && assetType !== 'All') {
      filter.assetType = assetType;
    }
    if (search) {
      filter.assetName = { $regex: search, $options: 'i' };
    }

    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }

    const investments = await Investment.find(filter).sort(sortOptions);

    // Update current prices
    const updated = investments.map((inv) => {
      inv.currentPrice = getPrice(inv.assetName);
      return inv;
    });

    res.json(updated);
  } catch (error) {
    console.error('Get investments error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    investment.currentPrice = getPrice(investment.assetName);
    res.json(investment);
  } catch (error) {
    console.error('Get investment error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateInvestment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { assetName, assetType, purchaseDate, purchasePrice, quantity, notes } = req.body;

    const investment = await Investment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    if (assetName !== undefined) investment.assetName = assetName;
    if (assetType !== undefined) investment.assetType = assetType;
    if (purchaseDate !== undefined) investment.purchaseDate = purchaseDate;
    if (purchasePrice !== undefined) investment.purchasePrice = purchasePrice;
    if (quantity !== undefined) investment.quantity = quantity;
    if (notes !== undefined) investment.notes = notes;

    investment.currentPrice = getPrice(investment.assetName);
    await investment.save();

    res.json(investment);
  } catch (error) {
    console.error('Update investment error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    res.json({ message: 'Investment deleted successfully' });
  } catch (error) {
    console.error('Delete investment error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
