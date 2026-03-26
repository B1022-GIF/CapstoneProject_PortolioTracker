// Mock market data service
// In production, replace with a real API like Alpha Vantage, Yahoo Finance, etc.

const mockPrices = {
  // Stocks
  'Reliance Industries': 2450.75,
  'TCS': 3820.50,
  'Infosys': 1580.25,
  'HDFC Bank': 1620.00,
  'ICICI Bank': 1095.30,
  'Wipro': 485.60,
  'Bharti Airtel': 1350.80,
  'ITC': 465.20,
  'SBI': 625.40,
  'HUL': 2580.90,
  'Apple': 185.50,
  'Google': 142.30,
  'Microsoft': 378.90,
  'Amazon': 178.25,
  'Tesla': 245.60,
  'Meta': 505.75,
  'Netflix': 628.40,
  'NVIDIA': 875.30,

  // Mutual Funds
  'Axis Bluechip Fund': 48.52,
  'HDFC Mid-Cap Fund': 125.30,
  'SBI Small Cap Fund': 142.85,
  'Mirae Asset Large Cap': 85.60,
  'Parag Parikh Flexi Cap': 62.40,
  'ICICI Pru Value Discovery': 320.15,

  // Crypto
  'Bitcoin': 67250.00,
  'Ethereum': 3450.80,
  'Solana': 145.20,
  'Cardano': 0.65,
  'Polygon': 0.85,
  'Dogecoin': 0.12,

  // ETFs
  'Nifty 50 ETF': 245.80,
  'Nifty Bank ETF': 485.60,
  'Gold ETF': 58.20,

  // Bonds
  'Govt Bond 10Y': 102.50,
  'Corporate Bond AAA': 105.30,
};

function getPrice(assetName) {
  // Check exact match first
  if (mockPrices[assetName] !== undefined) {
    return mockPrices[assetName];
  }

  // Check case-insensitive partial match
  const lowerName = assetName.toLowerCase();
  for (const [key, value] of Object.entries(mockPrices)) {
    if (key.toLowerCase().includes(lowerName) || lowerName.includes(key.toLowerCase())) {
      return value;
    }
  }

  // Return a random realistic price for unknown assets
  return parseFloat((Math.random() * 500 + 10).toFixed(2));
}

function getHistoricalData(assetName, days = 30) {
  const currentPrice = getPrice(assetName);
  const data = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Simulate price fluctuation (random walk)
    const volatility = 0.02;
    const change = 1 + (Math.random() - 0.48) * volatility;
    const historicalPrice = currentPrice * (1 - (i / days) * 0.1) * change;

    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(historicalPrice.toFixed(2)),
    });
  }

  return data;
}

function getBulkPrices(assetNames) {
  const prices = {};
  for (const name of assetNames) {
    prices[name] = getPrice(name);
  }
  return prices;
}

module.exports = { getPrice, getHistoricalData, getBulkPrices };
