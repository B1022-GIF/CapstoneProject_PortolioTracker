const { Parser } = require('json2csv');

function generatePortfolioCSV(investments) {
  const data = investments.map((inv) => ({
    'Asset Name': inv.assetName,
    'Asset Type': inv.assetType,
    'Purchase Date': new Date(inv.purchaseDate).toLocaleDateString(),
    'Purchase Price': inv.purchasePrice,
    'Quantity': inv.quantity,
    'Invested Amount': (inv.purchasePrice * inv.quantity).toFixed(2),
    'Current Price': inv.currentPrice,
    'Current Value': (inv.currentPrice * inv.quantity).toFixed(2),
    'Gain/Loss': ((inv.currentPrice - inv.purchasePrice) * inv.quantity).toFixed(2),
    'Gain/Loss %': inv.purchasePrice > 0
      ? (((inv.currentPrice - inv.purchasePrice) / inv.purchasePrice) * 100).toFixed(2)
      : '0.00',
  }));

  const fields = [
    'Asset Name', 'Asset Type', 'Purchase Date', 'Purchase Price',
    'Quantity', 'Invested Amount', 'Current Price', 'Current Value',
    'Gain/Loss', 'Gain/Loss %',
  ];

  const parser = new Parser({ fields });
  return parser.parse(data);
}

module.exports = { generatePortfolioCSV };
