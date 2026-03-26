function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function calcGainLoss(purchasePrice, currentPrice, quantity) {
  const invested = purchasePrice * quantity;
  const current = currentPrice * quantity;
  return {
    invested,
    current,
    gainLoss: current - invested,
    gainLossPercent: invested > 0 ? ((current - invested) / invested) * 100 : 0,
  };
}

module.exports = { formatCurrency, calcGainLoss };
