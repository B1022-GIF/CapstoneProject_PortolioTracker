const Investment = require('../models/Investment');
const { getPrice, getHistoricalData } = require('../services/marketData');

exports.getDashboard = async (req, res) => {
  try {
    const { timeRange, assetType, filter: gainFilter } = req.query;

    const query = { user: req.user._id };
    if (assetType && assetType !== 'All') {
      query.assetType = assetType;
    }

    // Time range filter
    if (timeRange) {
      const now = new Date();
      let startDate;
      switch (timeRange) {
        case '1M': startDate = new Date(now.setMonth(now.getMonth() - 1)); break;
        case '3M': startDate = new Date(now.setMonth(now.getMonth() - 3)); break;
        case '6M': startDate = new Date(now.setMonth(now.getMonth() - 6)); break;
        case '1Y': startDate = new Date(now.setFullYear(now.getFullYear() - 1)); break;
        case 'ALL': default: startDate = null;
      }
      if (startDate) {
        query.purchaseDate = { $gte: startDate };
      }
    }

    let investments = await Investment.find(query);

    // Update current prices
    investments = investments.map((inv) => {
      inv.currentPrice = getPrice(inv.assetName);
      return inv;
    });

    // Calculate summary
    let totalInvested = 0;
    let totalCurrentValue = 0;

    const investmentData = investments.map((inv) => {
      const invested = inv.purchasePrice * inv.quantity;
      const current = inv.currentPrice * inv.quantity;
      totalInvested += invested;
      totalCurrentValue += current;
      return {
        ...inv.toObject(),
        investedAmount: invested,
        currentValue: current,
        gainLoss: current - invested,
        gainLossPercent: invested > 0 ? ((current - invested) / invested) * 100 : 0,
      };
    });

    // Filter gainers/losers
    let filteredData = investmentData;
    if (gainFilter === 'gainers') {
      filteredData = investmentData.filter((inv) => inv.gainLoss > 0);
    } else if (gainFilter === 'losers') {
      filteredData = investmentData.filter((inv) => inv.gainLoss < 0);
    }

    // Diversification breakdown
    const diversificationMap = {};
    for (const inv of investmentData) {
      if (!diversificationMap[inv.assetType]) {
        diversificationMap[inv.assetType] = { totalValue: 0, count: 0 };
      }
      diversificationMap[inv.assetType].totalValue += inv.currentValue;
      diversificationMap[inv.assetType].count += 1;
    }

    const diversification = Object.entries(diversificationMap).map(([type, data]) => ({
      _id: type,
      totalValue: data.totalValue,
      count: data.count,
      percentage: totalCurrentValue > 0 ? (data.totalValue / totalCurrentValue) * 100 : 0,
    }));

    // Historical performance data (aggregate mock data)
    const historicalData = getHistoricalData('Portfolio', 30);

    // Scale historical data based on portfolio value
    const scaledHistorical = historicalData.map((point) => ({
      date: point.date,
      value: totalCurrentValue > 0
        ? parseFloat((point.price / historicalData[historicalData.length - 1].price * totalCurrentValue).toFixed(2))
        : 0,
    }));

    res.json({
      summary: {
        totalInvested,
        totalCurrentValue,
        totalGainLoss: totalCurrentValue - totalInvested,
        totalGainLossPercent: totalInvested > 0
          ? ((totalCurrentValue - totalInvested) / totalInvested) * 100
          : 0,
        totalAssets: investments.length,
      },
      investments: filteredData,
      diversification,
      historicalPerformance: scaledHistorical,
    });
  } catch (error) {
    console.error('Dashboard error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
