const ExcelJS = require('exceljs');
const path = require('path');

async function generateFinalUpgradedExcel() {
    const data = {
        "consumerName": "RANJANA MADHUSHAM KHOBRAGADE",
        "consumerNo": "439322232375",
        "billingUnit": "4393",
        "sanctionedLoad": "1.00 KW",
        "fixedCharges": "128.00",
        "connectionType": "90/LT I Res 1-Phase",
        "billAmount": 1420,
        "billingHistory": [
          {"month": "Feb-2024", "units": 27},
          {"month": "Mar-2024", "units": 152},
          {"month": "Apr-2024", "units": 105},
          {"month": "May-2024", "units": 198},
          {"month": "Jun-2024", "units": 364},
          {"month": "Jul-2024", "units": 371},
          {"month": "Aug-2024", "units": 229},
          {"month": "Sep-2024", "units": 183},
          {"month": "Oct-2024", "units": 0},
          {"month": "Nov-2024", "units": 157},
          {"month": "Dec-2024", "units": 35},
          {"month": "Jan-2025", "units": 82}
        ]
    };

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Bill Analysis');
    
    // Set Column Widths
    sheet.getColumn('A').width = 4;
    sheet.getColumn('B').width = 30;
    sheet.getColumn('C').width = 2;
    sheet.getColumn('D').width = 35;
    sheet.getColumn('E').width = 15;
    sheet.getColumn('F').width = 6;
    sheet.getColumn('G').width = 25;
    sheet.getColumn('H').width = 30;
    sheet.getColumn('I').width = 15;

    const peach = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFCE5CD' } };
    const orange = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF6B26B' } };
    const yellow = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
    const green = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB6D7A8' } };
    
    const borderStyle = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };

    const styleCell = (row, col, bgColor, bold = false) => {
        const cell = sheet.getCell(row, col);
        cell.fill = bgColor;
        cell.border = borderStyle;
        if (bold) cell.font = { bold: true };
        return cell;
    };

    // 1. Consumer Details
    const details = [
        ['Consumer Name', data.consumerName],
        ['Consumer Number', data.consumerNo],
        ['Fixed Charges', `₹ ${data.fixedCharges}`],
        ['Sanctioned Load', data.sanctionedLoad],
        ['Connection Type', data.connectionType]
    ];
    
    details.forEach((row, i) => {
        styleCell(i+1, 2, peach, true).value = row[0];
        styleCell(i+1, 3, peach);
        styleCell(i+1, 4, peach).value = row[1];
        styleCell(i+1, 5, peach);
    });

    // 2. Solar Input
    styleCell(7, 2, peach, true).value = "Solar Pannel used";
    styleCell(7, 3, peach);
    styleCell(7, 4, yellow, true).value = "540 Wp";
    styleCell(7, 5, peach);

    // 3. Headers
    const headers = ['Sr. No.', 'Month', 'Units', 'Bill Amount', 'Unit Cost'];
    headers.forEach((h, i) => {
        const cell = sheet.getCell(8, i + 1);
        cell.value = h;
        cell.fill = orange;
        cell.border = borderStyle;
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center' };
    });

    // 4. Data
    let totalUnits = 0;
    data.billingHistory.forEach((h, i) => {
        const row = i + 9;
        sheet.getCell(row, 1).value = i + 1;
        sheet.getCell(row, 2).value = h.month;
        sheet.getCell(row, 3).value = h.units;
        sheet.getCell(row, 4).value = Math.round(h.units * 7.5);
        sheet.getCell(row, 5).value = 7.5;
        for(let c=1; c<=5; c++) sheet.getCell(row, c).border = borderStyle;
        totalUnits += h.units;
    });

    // 5. UPGRADED CALCULATIONS (Solar.io + Expert Logic)
    const avgUnits = Math.round(totalUnits / 12);
    const dailyAvg = avgUnits / 30;
    const growthBuffer = 1.20; // 20% expansion
    const solarKwReq = Math.ceil((dailyAvg / (4.5 * 0.75)) * growthBuffer * 10) / 10;
    const numPanels = Math.ceil((solarKwReq * 1000) / 540);
    const systemCapacity = (numPanels * 540) / 1000;
    const grossCost = systemCapacity * 55000;
    
    const getSubsidy = (size) => {
        if (size <= 2) return size * 30000;
        if (size <= 3) return (2 * 30000) + ((size - 2) * 18000);
        return 78000;
    };
    const subsidyAmt = getSubsidy(systemCapacity);
    const netInvestment = grossCost - subsidyAmt;
    const yearlySavings = avgUnits * 12 * 8.5;

    const summary = [
        ['Average Monthly Units', avgUnits],
        ['Load Growth Buffer', '20%'],
        ['Recommended Size (kW)', solarKwReq],
        ['System Capacity (kW)', systemCapacity],
        ['Number of Panels (540Wp)', numPanels],
        ['Total Project Cost', grossCost],
        ['PM-Surya Ghar Subsidy', subsidyAmt],
        ['Net Investment Required', netInvestment],
        ['Payback Period (Years)', (netInvestment / yearlySavings).toFixed(1)],
        ['25-Year Net Wealth Gain', (yearlySavings * 25 - netInvestment)]
    ];

    summary.forEach((row, i) => {
        const r = i + 22;
        styleCell(r, 2, peach, true).value = row[0];
        styleCell(r, 3, peach);
        
        let valFill = peach;
        if (row[0] === 'Net Investment Required') valFill = green;
        if (row[0].includes('Subsidy')) valFill = yellow;
        
        const cell = styleCell(r, 4, valFill, true);
        cell.value = row[1];
        if (typeof row[1] === 'number' && row[1] > 100) cell.numFmt = '₹#,##0';
        
        styleCell(r, 5, peach);
    });

    const outputPath = '/Users/ayushshukla/Downloads/EnergyBae_Pro_Audit_Ranjana.xlsx';
    await workbook.xlsx.writeFile(outputPath);
    console.log(`Final Upgraded Excel generated at: ${outputPath}`);
}

generateFinalUpgradedExcel().catch(console.error);
