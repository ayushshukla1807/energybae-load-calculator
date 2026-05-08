const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

async function generateRecruiterExcel() {
    const data = {
        "consumerName": "RANJANA MADHUSHAM KHOBRAGADE",
        "consumerNo": "439322232375",
        "billingUnit": "4393",
        "sanctionedLoad": "1.00 KW",
        "fixedCharges": "128.00",
        "connectionType": "90/LT I Res 1-Phase",
        "billAmount": 1420,
        "billingHistory": [
          {"month": "Jan-2025", "units": 82},
          {"month": "Feb-2025", "units": 27},
          {"month": "Mar-2025", "units": 152},
          {"month": "Apr-2025", "units": 105},
          {"month": "May-2025", "units": 198},
          {"month": "Jun-2025", "units": 364},
          {"month": "Jul-2025", "units": 371},
          {"month": "Aug-2025", "units": 229},
          {"month": "Sep-2025", "units": 183},
          {"month": "Oct-2025", "units": 0},
          {"month": "Nov-2025", "units": 157},
          {"month": "Dec-2025", "units": 35}
        ]
    };

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'EnergyBae AI Audit';
    
    const sheet1 = workbook.addWorksheet('Extracted Bill Data');
    sheet1.columns = [{ width: 25 }, { width: 35 }, { width: 10 }, { width: 15 }, { width: 15 }];
    
    const headerStyle = {
        font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1B5E20' } },
        alignment: { vertical: 'middle', horizontal: 'center' }
    };
    
    sheet1.mergeCells('A1:B1');
    sheet1.getCell('A1').value = 'CONSUMER DETAILS';
    sheet1.getCell('A1').style = headerStyle;
    
    const details = [
        ['Consumer Name', data.consumerName],
        ['Consumer Number', data.consumerNo],
        ['Billing Unit', data.billingUnit],
        ['Sanctioned Load', data.sanctionedLoad],
        ['Fixed Charges', `₹ ${data.fixedCharges}`],
        ['Connection Type', data.connectionType],
        ['Total Bill Amount', `₹ ${data.billAmount}`]
    ];
    
    details.forEach((row, i) => {
        sheet1.getCell(`A${i+2}`).value = row[0];
        sheet1.getCell(`A${i+2}`).font = { bold: true };
        sheet1.getCell(`B${i+2}`).value = row[1];
    });
    
    sheet1.mergeCells('D1:E1');
    sheet1.getCell('D1').value = 'CONSUMPTION HISTORY';
    sheet1.getCell('D1').style = headerStyle;
    sheet1.getCell('D2').value = 'Month';
    sheet1.getCell('E2').value = 'Units';
    
    let totalUnits = 0;
    data.billingHistory.forEach((h, i) => {
        sheet1.getCell(`D${i+3}`).value = h.month;
        sheet1.getCell(`E${i+3}`).value = h.units;
        totalUnits += h.units;
    });
    
    const avg = Math.round(totalUnits / 12);
    sheet1.getCell(`D15`).value = 'Average';
    sheet1.getCell(`D15`).font = { bold: true };
    sheet1.getCell(`E15`).value = avg;
    
    const sheet2 = workbook.addWorksheet('Solar Calculation');
    sheet2.columns = [{ width: 35 }, { width: 25 }, { width: 20 }];
    sheet2.mergeCells('A1:C1');
    sheet2.getCell('A1').value = 'SOLAR ROI & IMPACT';
    sheet2.getCell('A1').style = headerStyle;
    
    const sysSize = Math.ceil((avg / 30 / (4.5 * 0.75)) * 10) / 10;
    const cost = sysSize * 50000;
    const savings = avg * 12 * 8.5;
    
    const solarRows = [
        ['Avg Monthly Units', avg, 'kWh'],
        ['Recommended System Size', sysSize, 'kW'],
        ['Estimated Investment', cost, '₹'],
        ['Annual Savings', savings, '₹'],
        ['Payback Period', (cost / savings).toFixed(1), 'Years'],
        ['25-Year Net Wealth', (savings * 25 - cost), '₹']
    ];
    
    solarRows.forEach((row, i) => {
        sheet2.getCell(`A${i+2}`).value = row[0];
        sheet2.getCell(`A${i+2}`).font = { bold: true };
        sheet2.getCell(`B${i+2}`).value = row[1];
        sheet2.getCell(`C${i+2}`).value = row[2];
    });

    const outputPath = path.join(__dirname, 'EnergyBae_Audit_Ranjana_Khobragade.xlsx');
    await workbook.xlsx.writeFile(outputPath);
    console.log(`Excel file generated at: ${outputPath}`);
}

generateRecruiterExcel();
