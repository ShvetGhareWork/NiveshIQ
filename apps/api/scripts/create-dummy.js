const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('dummy_statement.pdf'));

// Add CAMS-style Header
doc.fontSize(18).text('CONSOLIDATED ACCOUNT STATEMENT - CAMS', { align: 'center' });
doc.moveDown();
doc.fontSize(12).text('Period: 01-Apr-2023 to 31-Mar-2024');
doc.text('Folio No: 12345678 / PAN: ABCDE1234F');
doc.moveDown(2);

// Add Fake Holdings Data (The AI looks for these patterns)
const holdings = [
  { name: "HDFC Mid-Cap Opportunities Fund - Direct Growth", units: "1,250.50", nav: "145.20", val: "1,81,572.60" },
  { name: "SBI Bluechip Fund - Regular Plan Growth", units: "500.00", nav: "85.10", val: "42,550.00" },
  { name: "Parag Parikh Flexi Cap Fund - Direct Growth", units: "2,100.00", nav: "65.40", val: "1,37,340.00" },
  { name: "ICICI Prudential US Bluechip Equity Fund", units: "450.00", nav: "42.30", val: "19,035.00" }
];

doc.font('Helvetica-Bold').text('Portfolio Summary', { underline: true });
doc.moveDown();

holdings.forEach(fund => {
  doc.font('Helvetica-Bold').text(fund.name);
  doc.font('Helvetica').text(`Units: ${fund.units}   |   NAV: ${fund.nav}   |   Value: INR ${fund.val}`);
  doc.moveDown(0.5);
});

doc.end();
console.log("✅ 'dummy_statement.pdf' created successfully!");
