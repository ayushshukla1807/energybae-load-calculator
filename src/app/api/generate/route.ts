import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'EnergyBae AI Audit';
    const sheet = workbook.addWorksheet('Bill Analysis');

    // Set Column Widths based on the template
    sheet.getColumn('A').width = 4;
    sheet.getColumn('B').width = 25;
    sheet.getColumn('C').width = 2;
    sheet.getColumn('D').width = 30;
    sheet.getColumn('E').width = 15;
    sheet.getColumn('F').width = 6;
    sheet.getColumn('G').width = 25;
    sheet.getColumn('H').width = 30;
    sheet.getColumn('I').width = 15;

    // Define Colors from the template
    const peachFill = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFFCE5CD' } };
    const orangeFill = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFF6B26B' } };
    const yellowFill = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFFFFF00' } };
    const greenFill = { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFB6D7A8' } };
    
    const borderStyle = {
      top: { style: 'thin' as const },
      left: { style: 'thin' as const },
      bottom: { style: 'thin' as const },
      right: { style: 'thin' as const }
    };

    const styleCell = (row: number, col: number, fill: any, bold = false) => {
      const cell = sheet.getCell(row, col);
      cell.fill = fill;
      cell.border = borderStyle;
      if (bold) cell.font = { bold: true };
      return cell;
    };

    // 1. Consumer Details Section (Rows 1-5)
    const consumerDetails = [
      ['Consumer Name', data.consumerName || 'N/A'],
      ['Consumer Number', data.consumerNo || 'N/A'],
      ['Fixed Charges', `₹ ${parseFloat(data.fixedCharges?.toString().replace(/[^0-9.]/g, '')) || 0}`],
      ['Sanctioned Load', `${data.sanctionedLoad || '0'} KW`],
      ['Connection Type', data.connectionType || 'N/A']
    ];

    consumerDetails.forEach((row, idx) => {
      const rowIndex = idx + 1;
      styleCell(rowIndex, 2, peachFill, true).value = row[0];
      styleCell(rowIndex, 3, peachFill);
      styleCell(rowIndex, 4, peachFill).value = row[1];
      styleCell(rowIndex, 5, peachFill);
    });

    // 2. Solar Panel Specification (Row 7)
    styleCell(7, 2, peachFill, true).value = "Solar Pannel used";
    styleCell(7, 3, peachFill);
    styleCell(7, 4, yellowFill, true).value = "540 Wp";
    styleCell(7, 5, peachFill);

    // 3. Table Headers (Row 8)
    const headers = ['Sr. No.', 'Month', 'Units', 'Bill Amount', 'Unit Cost'];
    headers.forEach((h, idx) => {
      const cell = sheet.getCell(8, idx + 1);
      cell.value = h;
      cell.fill = orangeFill;
      cell.border = borderStyle;
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center' };
    });

    // 4. Monthly Usage Data (Rows 9-20)
    let totalUnits = 0;
    const history = data.billingHistory || [];
    
    // Ensure we show 12 rows even if data is missing
    for (let i = 0; i < 12; i++) {
      const row = i + 9;
      const h = history[i] || { month: '-', units: 0 };
      const units = parseFloat(h.units) || 0;
      totalUnits += units;

      styleCell(row, 1, { type: 'pattern', pattern: 'none' }).value = i + 1;
      styleCell(row, 2, { type: 'pattern', pattern: 'none' }).value = h.month;
      styleCell(row, 3, { type: 'pattern', pattern: 'none' }).value = units;
      styleCell(row, 4, { type: 'pattern', pattern: 'none' }).value = Math.round(units * 7.5); // Approx calc
      styleCell(row, 5, { type: 'pattern', pattern: 'none' }).value = 7.5;
      
      sheet.getRow(row).alignment = { horizontal: 'center' };
    }

    // 5. Technical Calculations (Rows 22-26)
    const avgMonthlyUnits = Math.round(totalUnits / 12);
    const solarKwReq = Math.ceil((avgMonthlyUnits / 30 / (4.5 * 0.75)) * 10) / 10;
    const numPanels = Math.ceil((solarKwReq * 1000) / 540);
    const actualCapacity = (numPanels * 540) / 1000;

    const summaryData = [
      ['Average Units', avgMonthlyUnits],
      ['Solar kW Requirement', solarKwReq],
      ['Solar capacity (Wp)', 540],
      ['Number of Panels', numPanels],
      ['System Total Capacity (kW)', actualCapacity]
    ];

    summaryData.forEach((row, idx) => {
      const rowIndex = idx + 22;
      styleCell(rowIndex, 2, peachFill, true).value = row[0];
      styleCell(rowIndex, 3, peachFill);
      
      let valFill = peachFill;
      if (row[0] === 'Solar capacity (Wp)') valFill = yellowFill;
      if (row[0] === 'Number of Panels') valFill = greenFill;
      
      styleCell(rowIndex, 4, valFill, true).value = row[1];
      styleCell(rowIndex, 5, peachFill);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Disposition": `attachment; filename="EnergyBae_Audit_${(data.consumerName || 'Report').replace(/[^a-zA-Z0-9]/g, '_')}.xlsx"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Excel generation error:", error);
    return NextResponse.json({ error: "Failed to generate Excel file" }, { status: 500 });
  }
}
