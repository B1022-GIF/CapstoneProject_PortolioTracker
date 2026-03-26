const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    assetName: {
      type: String,
      required: [true, 'Asset name is required'],
      trim: true,
      maxlength: 200,
    },
    assetType: {
      type: String,
      required: [true, 'Asset type is required'],
      enum: ['Equity', 'Debt', 'Mutual Fund', 'Crypto', 'ETF', 'Bonds', 'Other'],
    },
    purchaseDate: {
      type: Date,
      required: [true, 'Purchase date is required'],
    },
    purchasePrice: {
      type: Number,
      required: [true, 'Purchase price is required'],
      min: 0,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: 0.0001,
    },
    currentPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

investmentSchema.virtual('investedAmount').get(function () {
  return this.purchasePrice * this.quantity;
});

investmentSchema.virtual('currentValue').get(function () {
  return this.currentPrice * this.quantity;
});

investmentSchema.virtual('gainLoss').get(function () {
  return this.currentValue - this.investedAmount;
});

investmentSchema.virtual('gainLossPercent').get(function () {
  if (this.investedAmount === 0) return 0;
  return ((this.gainLoss / this.investedAmount) * 100);
});

module.exports = mongoose.model('Investment', investmentSchema);
