const ExcelJS = require('exceljs');
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
    sheet.getColumn('B').width = 25;
    sheet.getColumn('C').width = 2;
    sheet.getColumn('D').width = 30;
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

    // Helper to style cells
    const styleCell = (row, col, bgColor, bold = false) => {
        const cell = sheet.getCell(row, col);
        cell.fill = bgColor;
        cell.border = borderStyle;
        if (bold) cell.font = { bold: true };
    };

    // 1. Consumer Details (Rows 1-5)
    const detailLabels = ['Consumer Name', 'Consumer Number', 'Fixed Charges', 'Sanctioned Load', 'Connection Type'];
    const detailValues = [data.consumerName, data.consumerNo, data.fixedCharges, data.sanctionedLoad, data.connectionType];
    
    detailLabels.forEach((label, i) => {
        const row = i + 1;
        sheet.getCell(row, 2).value = label;
        sheet.getCell(row, 4).value = detailValues[i];
        styleCell(row, 2, peach, true);
        styleCell(row, 4, peach);
        styleCell(row, 3, peach);
        styleCell(row, 5, peach);
    });

    // 2. Solar Panel used (Row 7)
    sheet.getCell(7, 2).value = "Solar Pannel used";
    sheet.getCell(7, 4).value = "540 Wp";
    styleCell(7, 2, peach, true);
    styleCell(7, 4, yellow, true);
    styleCell(7, 3, peach);
    styleCell(7, 5, peach);

    // 3. Table Headers (Row 8)
    const headers = ['Sr. No.', 'Month', 'Units', 'Bill Amount', 'Unit Cost'];
    headers.forEach((h, i) => {
        const cell = sheet.getCell(8, i + 1);
        cell.value = h;
        cell.fill = orange;
        cell.border = borderStyle;
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center' };
    });

    // 4. Monthly Usage (Rows 9-20)
    let totalUnits = 0;
    data.billingHistory.forEach((h, i) => {
        const row = i + 9;
        sheet.getCell(row, 1).value = i + 1;
        sheet.getCell(row, 2).value = h.month;
        sheet.getCell(row, 3).value = h.units;
        sheet.getCell(row, 4).value = Math.round(h.units * 7.5); // Approx bill
        sheet.getCell(row, 5).value = 7.5;
        
        for(let c=1; c<=5; c++) sheet.getCell(row, c).border = borderStyle;
        totalUnits += h.units;
    });

    // 5. Technical Summary (Rows 22-26)
    const avgUnits = Math.round(totalUnits / 12);
    const kwReq = Math.ceil((avgUnits / 30 / 4) * 10) / 10;
    const panels = Math.ceil((kwReq * 1000) / 540);

    const summaryLabels = ['Average Units', 'Solar kW Requirement', 'Solar capacity (Wp)', 'Number of Panels', 'System Total Capacity (kW)'];
    const summaryValues = [avgUnits, kwReq, 540, panels, (panels * 540 / 1000)];

    summaryLabels.forEach((label, i) => {
        const row = i + 22;
        sheet.getCell(row, 2).value = label;
        sheet.getCell(row, 4).value = summaryValues[i];
        styleCell(row, 2, peach, true);
        
        if (label === 'Solar capacity (Wp)') styleCell(row, 4, yellow, true);
        else if (label === 'Number of Panels') styleCell(row, 4, green, true);
        else styleCell(row, 4, peach);
        
        styleCell(row, 3, peach);
        styleCell(row, 5, peach);
    });

    // Mirroring side-by-side analysis (G-J) - Leaving empty for now as per template look
    for(let r=1; r<=30; r++) {
        for(let c=7; c<=9; c++) {
            // sheet.getCell(r, c).border = borderStyle;
        }
    }

    const outputPath = '/Users/ayushshukla/Downloads/Bill_Audit_Report.xlsx';
    await workbook.xlsx.writeFile(outputPath);
    console.log(`Excel file generated in EXACT FORMAT at: ${outputPath}`);
}

generateRecruiterExcel().catch(console.error);
