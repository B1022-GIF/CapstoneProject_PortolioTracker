const PDFDocument = require('pdfkit');

function generatePortfolioPDF(portfolioData, userName) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Title
      doc.fontSize(22).font('Helvetica-Bold').text('Investment Portfolio Summary', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica').text(`Prepared for: ${userName}`, { align: 'center' });
      doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
      doc.moveDown(1);

      // Summary section
      doc.fontSize(16).font('Helvetica-Bold').text('Portfolio Overview');
      doc.moveDown(0.3);
      doc.fontSize(11).font('Helvetica');

      const { summary } = portfolioData;
      doc.text(`Total Invested: $${summary.totalInvested.toFixed(2)}`);
      doc.text(`Current Value:  $${summary.totalCurrentValue.toFixed(2)}`);
      const gainLoss = summary.totalCurrentValue - summary.totalInvested;
      const gainLossPercent = summary.totalInvested > 0
        ? ((gainLoss / summary.totalInvested) * 100).toFixed(2)
        : '0.00';
      doc.text(`Total Gain/Loss: $${gainLoss.toFixed(2)} (${gainLossPercent}%)`);
      doc.text(`Total Assets: ${summary.totalAssets}`);
      doc.moveDown(1);

      // Diversification
      if (portfolioData.diversification && portfolioData.diversification.length > 0) {
        doc.fontSize(16).font('Helvetica-Bold').text('Diversification Breakdown');
        doc.moveDown(0.3);
        doc.fontSize(11).font('Helvetica');
        for (const item of portfolioData.diversification) {
          doc.text(`  ${item._id}: $${item.totalValue.toFixed(2)} (${item.percentage.toFixed(1)}%)`);
        }
        doc.moveDown(1);
      }

      // Investment details table
      doc.fontSize(16).font('Helvetica-Bold').text('Investment Details');
      doc.moveDown(0.5);

      const investments = portfolioData.investments || [];
      if (investments.length > 0) {
        // Table header
        const tableTop = doc.y;
        const colWidths = [120, 70, 65, 55, 70, 70, 55];
        const headers = ['Asset', 'Type', 'Purchased', 'Qty', 'Invested', 'Current', 'G/L %'];

        doc.fontSize(9).font('Helvetica-Bold');
        let x = 50;
        headers.forEach((header, i) => {
          doc.text(header, x, tableTop, { width: colWidths[i], align: 'left' });
          x += colWidths[i];
        });

        doc.moveTo(50, tableTop + 14).lineTo(555, tableTop + 14).stroke();
        doc.moveDown(0.5);

        // Table rows
        doc.font('Helvetica').fontSize(8);
        let rowY = tableTop + 18;

        for (const inv of investments) {
          if (rowY > 720) {
            doc.addPage();
            rowY = 50;
          }

          const invested = inv.purchasePrice * inv.quantity;
          const current = inv.currentPrice * inv.quantity;
          const glPercent = invested > 0 ? (((current - invested) / invested) * 100).toFixed(1) : '0.0';

          x = 50;
          const rowData = [
            inv.assetName.substring(0, 18),
            inv.assetType,
            new Date(inv.purchaseDate).toLocaleDateString(),
            inv.quantity.toString(),
            `$${invested.toFixed(0)}`,
            `$${current.toFixed(0)}`,
            `${glPercent}%`,
          ];

          rowData.forEach((cell, i) => {
            doc.text(cell, x, rowY, { width: colWidths[i], align: 'left' });
            x += colWidths[i];
          });

          rowY += 14;
        }
      } else {
        doc.fontSize(11).font('Helvetica').text('No investments found.');
      }

      // Footer
      doc.moveDown(2);
      doc.fontSize(8).font('Helvetica').fillColor('gray')
        .text('This report is generated from the Portfolio Tracker application.', 50, 750, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generatePortfolioPDF };
