const ExcelJS = require('exceljs');
const path = require('path');

async function test() {
  const workbook = new ExcelJS.Workbook();
  const templatePath = path.join(process.cwd(), 'public', 'template.xlsx');
  await workbook.xlsx.readFile(templatePath);
  const sheet = workbook.worksheets[0];

  sheet.getCell('D1').value = "TEST CONSUMER";
  sheet.getCell('D2').value = "1234567890";
  sheet.getCell('D3').value = 150;
  sheet.getCell('D4').value = "5KW";
  sheet.getCell('D5').value = "Residential";

  for(let i=0; i<12; i++) {
    sheet.getCell(`C${9+i}`).value = "May 2024";
    sheet.getCell(`D${9+i}`).value = 100 + i;
  }
  
  // Try to remove data for Consumer 2 just to see if it causes issues, 
  // or maybe we should leave it. Actually if we leave Consumer 2, 
  // it means we are returning an Excel with 1 updated consumer and 1 old consumer.
  
  workbook.calcProperties.fullCalcOnLoad = true;
  await workbook.xlsx.writeFile('test_output.xlsx');
  console.log("Generated test_output.xlsx");
}
test().catch(console.error);
