const Investment = require('../models/Investment');
const { getPrice } = require('../services/marketData');
const { generatePortfolioPDF } = require('../services/pdfService');
const { generatePortfolioCSV } = require('../services/csvService');
const { sendEmail } = require('../services/emailService');

async function getPortfolioData(userId) {
  let investments = await Investment.find({ user: userId });

  investments = investments.map((inv) => {
    inv.currentPrice = getPrice(inv.assetName);
    return inv;
  });

  let totalInvested = 0;
  let totalCurrentValue = 0;

  investments.forEach((inv) => {
    totalInvested += inv.purchasePrice * inv.quantity;
    totalCurrentValue += inv.currentPrice * inv.quantity;
  });

  const diversificationMap = {};
  for (const inv of investments) {
    const current = inv.currentPrice * inv.quantity;
    if (!diversificationMap[inv.assetType]) {
      diversificationMap[inv.assetType] = { totalValue: 0, count: 0 };
    }
    diversificationMap[inv.assetType].totalValue += current;
    diversificationMap[inv.assetType].count += 1;
  }

  const diversification = Object.entries(diversificationMap).map(([type, data]) => ({
    _id: type,
    totalValue: data.totalValue,
    count: data.count,
    percentage: totalCurrentValue > 0 ? (data.totalValue / totalCurrentValue) * 100 : 0,
  }));

  return {
    summary: {
      totalInvested,
      totalCurrentValue,
      totalAssets: investments.length,
    },
    investments,
    diversification,
  };
}

exports.downloadPDF = async (req, res) => {
  try {
    const portfolioData = await getPortfolioData(req.user._id);
    const pdfBuffer = await generatePortfolioPDF(portfolioData, req.user.name);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=portfolio-summary.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF download error:', error.message);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};

exports.downloadCSV = async (req, res) => {
  try {
    const portfolioData = await getPortfolioData(req.user._id);
    const csv = generatePortfolioCSV(portfolioData.investments);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=portfolio-summary.csv');
    res.send(csv);
  } catch (error) {
    console.error('CSV download error:', error.message);
    res.status(500).json({ message: 'Error generating CSV' });
  }
};

exports.emailPDF = async (req, res) => {
  try {
    const { email } = req.body;
    const targetEmail = email || req.user.email;

    const portfolioData = await getPortfolioData(req.user._id);
    const pdfBuffer = await generatePortfolioPDF(portfolioData, req.user.name);

    await sendEmail({
      to: targetEmail,
      subject: 'Your Portfolio Summary - Investment Portfolio Tracker',
      text: 'Please find your portfolio summary attached.',
      html: '<h2>Portfolio Summary</h2><p>Please find your portfolio summary attached as a PDF.</p>',
      attachments: [
        {
          filename: 'portfolio-summary.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    res.json({ message: `Portfolio summary sent to ${targetEmail}` });
  } catch (error) {
    console.error('Email PDF error:', error.message);
    res.status(500).json({ message: 'Error sending email. Please check email configuration.' });
  }
};

exports.emailCSV = async (req, res) => {
  try {
    const { email } = req.body;
    const targetEmail = email || req.user.email;

    const portfolioData = await getPortfolioData(req.user._id);
    const csv = generatePortfolioCSV(portfolioData.investments);

    await sendEmail({
      to: targetEmail,
      subject: 'Your Portfolio Summary (CSV) - Investment Portfolio Tracker',
      text: 'Please find your portfolio summary attached.',
      html: '<h2>Portfolio Summary</h2><p>Please find your portfolio summary attached as a CSV file.</p>',
      attachments: [
        {
          filename: 'portfolio-summary.csv',
          content: csv,
          contentType: 'text/csv',
        },
      ],
    });

    res.json({ message: `Portfolio summary (CSV) sent to ${targetEmail}` });
  } catch (error) {
    console.error('Email CSV error:', error.message);
    res.status(500).json({ message: 'Error sending email. Please check email configuration.' });
  }
};
