const ExcelJS = require('exceljs');
const path = require('path');

async function generateAlturaCommonExcel() {
    const data = {
        "consumerName": "ALTURA COMMON",
        "consumerNo": "160221976361",
        "billingUnit": "4599",
        "sanctionedLoad": "30.00 KW",
        "fixedCharges": "430.00", // Based on the tariff table in screenshot
        "connectionType": "92/LT I Res 3-Phase",
        "billAmount": 59140,
        "billingHistory": [
          {"month": "Apr-2025", "units": 1463},
          {"month": "May-2025", "units": 1394},
          {"month": "Jun-2025", "units": 1511},
          {"month": "Jul-2025", "units": 1511},
          {"month": "Aug-2025", "units": 1394},
          {"month": "Sep-2025", "units": 1394},
          {"month": "Oct-2025", "units": 2200},
          {"month": "Nov-2025", "units": 1420},
          {"month": "Dec-2025", "units": 1317},
          {"month": "Jan-2026", "units": 1520},
          {"month": "Feb-2026", "units": 1459},
          {"month": "Mar-2026", "units": 1329}
        ]
    };

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Bill Analysis');
    
    sheet.getColumn('A').width = 4;
    sheet.getColumn('B').width = 30;
    sheet.getColumn('C').width = 2;
    sheet.getColumn('D').width = 35;
    sheet.getColumn('E').width = 15;
    
    const peach = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFCE5CD' } };
    const orange = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF6B26B' } };
    const yellow = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
    const green = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB6D7A8' } };
    const borderStyle = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

    const styleCell = (row, col, bgColor, bold = false) => {
        const cell = sheet.getCell(row, col);
        cell.fill = bgColor;
        cell.border = borderStyle;
        if (bold) cell.font = { bold: true };
        return cell;
    };

    // 1. Details
    const details = [['Consumer Name', data.consumerName], ['Consumer Number', data.consumerNo], ['Fixed Charges', `₹ ${data.fixedCharges}`], ['Sanctioned Load', data.sanctionedLoad], ['Connection Type', data.connectionType]];
    details.forEach((row, i) => {
        styleCell(i+1, 2, peach, true).value = row[0];
        styleCell(i+1, 3, peach);
        styleCell(i+1, 4, peach).value = row[1];
        styleCell(i+1, 5, peach);
    });

    styleCell(7, 2, peach, true).value = "Solar Pannel used";
    styleCell(7, 4, yellow, true).value = "540 Wp";

    // 3. Data Table
    const headers = ['Sr. No.', 'Month', 'Units', 'Bill Amount', 'Unit Cost'];
    headers.forEach((h, i) => { styleCell(8, i + 1, orange, true).value = h; });

    let totalUnits = 0;
    data.billingHistory.forEach((h, i) => {
        const row = i + 9;
        sheet.getCell(row, 1).value = i + 1;
        sheet.getCell(row, 2).value = h.month;
        sheet.getCell(row, 3).value = h.units;
        sheet.getCell(row, 4).value = Math.round(h.units * 8.5);
        sheet.getCell(row, 5).value = 8.5;
        for(let c=1; c<=5; c++) sheet.getCell(row, c).border = borderStyle;
        totalUnits += h.units;
    });

    // 4. Analysis
    const avgUnits = Math.round(totalUnits / 12);
    const growthBuffer = 1.20;
    const solarKwReq = Math.ceil((avgUnits / 30 / (4.5 * 0.75)) * growthBuffer * 10) / 10;
    const numPanels = Math.ceil((solarKwReq * 1000) / 540);
    const systemCapacity = (numPanels * 540) / 1000;
    const grossCost = systemCapacity * 52000; // Bulk discount for 15kW+ systems
    const subsidyAmt = 78000; // Max cap for residential-commercial mix
    const netInvestment = grossCost - subsidyAmt;
    const yearlySavings = totalUnits * 8.5;

    const summary = [
        ['Average Monthly Units', avgUnits],
        ['Load Expansion Factor', '20%'],
        ['Solar kW Requirement', solarKwReq],
        ['Proposed System Capacity (kW)', systemCapacity],
        ['Total Panels (540Wp)', numPanels],
        ['Total Project Cost', grossCost],
        ['Government Subsidy', subsidyAmt],
        ['Net Investment (After Subsidy)', netInvestment],
        ['Annual Energy Savings', yearlySavings],
        ['Payback Period (Years)', (netInvestment / yearlySavings).toFixed(1)],
        ['25-Year Wealth Generation', (yearlySavings * 25 - netInvestment)]
    ];

    summary.forEach((row, i) => {
        const r = i + 22;
        styleCell(r, 2, peach, true).value = row[0];
        styleCell(r, 3, peach);
        let valFill = peach;
        if (row[0].includes('Net Investment')) valFill = green;
        if (row[0].includes('Subsidy')) valFill = yellow;
        const cell = styleCell(r, 4, valFill, true);
        cell.value = row[1];
        if (typeof row[1] === 'number' && row[1] > 100) cell.numFmt = '₹#,##0';
        styleCell(r, 5, peach);
    });

    const outputPath = '/Users/ayushshukla/Downloads/EnergyBae_Audit_Altura_Common.xlsx';
    await workbook.xlsx.writeFile(outputPath);
    console.log(`Altura Common Excel generated at: ${outputPath}`);
}

generateAlturaCommonExcel().catch(console.error);
