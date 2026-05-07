const ExcelJS = require('exceljs');
const path = require('path');

async function test() {
  const workbook = new ExcelJS.Workbook();
  const templatePath = path.join(process.cwd(), 'public', 'template.xlsx');
  await workbook.xlsx.readFile(templatePath);
  
  const sheet = workbook.worksheets[0];

  // 1. Fill data
  sheet.getCell('D1').value = "TEST CONSUMER";
  sheet.getCell('D2').value = "1234567890";
  sheet.getCell('D3').value = 150;
  sheet.getCell('D4').value = "5KW";
  sheet.getCell('D5').value = "Residential";

  for(let i=0; i<12; i++) {
    sheet.getCell(`C${9+i}`).value = `Month ${i+1}`;
    sheet.getCell(`D${9+i}`).value = 100 + i;
  }
  
  // Clear out Consumer 2 dummy data to make it clean
  ['H1', 'H2', 'H3', 'H4', 'H5'].forEach(c => sheet.getCell(c).value = null);
  for(let i=8; i<=22; i++) {
    ['G', 'H', 'I', 'J'].forEach(col => sheet.getCell(`${col}${i}`).value = null);
  }

  // 2. Create Solar Calculation Sheet
  const calcSheet = workbook.addWorksheet('Solar Calculation');
  calcSheet.columns = [
    { header: 'Parameter', key: 'param', width: 35 },
    { header: 'Value', key: 'value', width: 25 },
    { header: 'Unit', key: 'unit', width: 15 }
  ];
  
  // Make header bold and nice
  calcSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  calcSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1B5E20' } };

  // Add parameters
  calcSheet.addRow(['Average Monthly Consumption', { formula: "='Pranay HOME'!D22" }, 'kWh/month']);
  calcSheet.addRow(['Daily Consumption', { formula: '=B2/30' }, 'kWh/day']);
  calcSheet.addRow(['Peak Sun Hours', 4.5, 'hrs/day']);
  calcSheet.addRow(['Performance Ratio', 0.75, '']);
  calcSheet.addRow(['Recommended System Size', { formula: '=ROUNDUP((B3/(B4*B5)), 1)' }, 'kW']);
  calcSheet.addRow(['Estimated System Cost', { formula: '=B6*50000' }, '₹']);
  calcSheet.addRow(['Annual Savings', { formula: '=B2*12*8' }, '₹ (assuming ₹8/unit)']);
  calcSheet.addRow(['Payback Period', { formula: '=ROUND(B7/B8, 1)' }, 'Years']);

  // Format the values
  for(let i=2; i<=9; i++) {
    calcSheet.getCell(`A${i}`).font = { bold: true };
    calcSheet.getCell(`B${i}`).alignment = { horizontal: 'center' };
  }

  workbook.calcProperties.fullCalcOnLoad = true;
  await workbook.xlsx.writeFile('test_advanced_output.xlsx');
  console.log("Generated test_advanced_output.xlsx");
}
test().catch(console.error);
