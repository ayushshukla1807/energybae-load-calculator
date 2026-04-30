const ExcelJS = require('exceljs');

async function run() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('/Users/ayushshukla/Projects/energybae-load-calculator/public/template.xlsx');
  
  const sheet = workbook.worksheets[0];
  console.log("Sheet Name:", sheet.name);
  
  sheet.eachRow((row, rowNumber) => {
    let rowValues = [];
    row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      let val = cell.value;
      if (val && typeof val === 'object' && val.formula) {
        val = 'FORMULA(' + val.formula + ')';
      } else if (val && typeof val === 'object' && val.richText) {
        val = val.richText.map(rt => rt.text).join('');
      }
      rowValues.push(`[${cell.address}]: ${val}`);
    });
    if (rowValues.length > 0) {
      console.log(`Row ${rowNumber}:`, rowValues.join(' | '));
    }
  });
}
run();
