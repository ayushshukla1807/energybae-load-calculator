import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Pranay HOME");

    // --- Style Definitions ---
    const orangeHeader: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F4B084' } };
    const yellowFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
    const greenFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '92D050' } };
    const boldFont = { bold: true, name: 'Calibri', size: 11 };
    const borderStyle: Partial<ExcelJS.Borders> = {
      top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
    };

    // --- Column Widths ---
    worksheet.getColumn('B').width = 22;
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('D').width = 18;
    worksheet.getColumn('E').width = 12;
    worksheet.getColumn('F').width = 12;
    worksheet.getColumn('G').width = 22;
    worksheet.getColumn('H').width = 18;
    worksheet.getColumn('I').width = 12;
    worksheet.getColumn('J').width = 12;

    // --- Profile 1 Header (B1:D5) ---
    const labels1 = [
      ["Consumer Name", data.consumerName],
      ["Consumer No", data.consumerNo],
      ["Fixed Charges", data.fixedCharges],
      ["Sanct. Load (kW)", data.sanctionedLoad],
      ["Connection Type", data.connectionType]
    ];

    labels1.forEach((row, i) => {
      const cellB = worksheet.getCell(`B${i + 1}`);
      const cellD = worksheet.getCell(`D${i + 1}`);
      cellB.value = row[0];
      cellD.value = row[1];
      cellB.font = boldFont;
      cellB.border = borderStyle;
      cellD.border = borderStyle;
    });

    // --- Profile 2 Header (G1:H5) Reference Data ---
    const labels2 = [
      ["Consumer Name", "Ranjana Khobragade"],
      ["Consumer No", "439322232375"],
      ["Fixed Charges", 130],
      ["Sanct. Load (kW)", "1KW"],
      ["Connection Type", "90/LT I Res 1- Phase"]
    ];

    labels2.forEach((row, i) => {
      const cellG = worksheet.getCell(`G${i + 1}`);
      const cellH = worksheet.getCell(`H${i + 1}`);
      cellG.value = row[0];
      cellH.value = row[1];
      cellG.font = boldFont;
      cellG.border = borderStyle;
      cellH.border = borderStyle;
    });

    // --- Contract Demand & Solar Panel Row ---
    worksheet.getCell("B6").value = "Contract Demand (KVA) :";
    worksheet.getCell("B6").font = boldFont;
    
    const solarRowLabel = worksheet.getCell("B7");
    solarRowLabel.value = "Solar Panel used";
    solarRowLabel.font = boldFont;
    solarRowLabel.fill = yellowFill;
    solarRowLabel.border = borderStyle;

    const solarRowVal = worksheet.getCell("C7");
    solarRowVal.value = 600;
    solarRowVal.border = borderStyle;

    // --- Table Headers (Row 8) ---
    const headers1 = ["Sr.No", "Month", "Units", "Bill Amount", "Unit Cost"];
    headers1.forEach((h, i) => {
      const cell = worksheet.getCell(8, i + 2);
      cell.value = h;
      cell.fill = orangeHeader;
      cell.font = boldFont;
      cell.border = borderStyle;
      cell.alignment = { horizontal: 'center' };
    });

    const headers2 = ["Month", "Units", "Bill Amount", "Unit Cost"];
    headers2.forEach((h, i) => {
      const cell = worksheet.getCell(8, i + 7);
      cell.value = h;
      cell.fill = orangeHeader;
      cell.font = boldFont;
      cell.border = borderStyle;
      cell.alignment = { horizontal: 'center' };
    });

    // --- Consumption Data (Rows 9-20) ---
    const history1 = data.billingHistory || [];
    const history2 = [82, 27, 152, 198, 364, 371, 229, 183, 0, 157, 35, 137]; // Reference data from SS

    for (let i = 0; i < 12; i++) {
      const rowIdx = 9 + i;
      const h1 = history1[i] || { month: "N/A", units: 0 };
      
      // Person 1
      worksheet.getCell(`B${rowIdx}`).value = i + 2; // Sr.No starting from 2 as per SS
      worksheet.getCell(`C${rowIdx}`).value = h1.month;
      worksheet.getCell(`D${rowIdx}`).value = Number(h1.units) || 0;
      ["B", "C", "D", "E", "F"].forEach(col => worksheet.getCell(`${col}${rowIdx}`).border = borderStyle);

      // Person 2
      worksheet.getCell(`G${rowIdx}`).value = h1.month;
      worksheet.getCell(`H${rowIdx}`).value = history2[i];
      ["G", "H", "I", "J"].forEach(col => worksheet.getCell(`${col}${rowIdx}`).border = borderStyle);
    }

    // --- Calculations (Rows 21-25) ---
    const units1 = history1.map((h: any) => h.units).filter((u: any) => u != null);
    const avg1 = units1.length > 0 ? units1.reduce((a: number, b: number) => a + b, 0) / units1.length : 0;
    const kw1 = avg1 / 106.06;
    const panels1 = kw1 / 0.6;

    const avg2 = 161.25;
    const kw2 = 1.520357143;
    const panels2 = 2.533928571;

    // Profile 1 Calculations
    const calcRows1 = [
      { label: "Average", val: avg1.toFixed(2), fill: null },
      { label: "kW", val: kw1.toFixed(9), fill: null },
      { label: "Solar Panels", val: panels1.toFixed(9), fill: null },
      { label: "Solar capacity", val: 1.8, fill: greenFill },
      { label: "Number of Panels", val: 3, fill: greenFill }
    ];

    calcRows1.forEach((row, i) => {
      const rowIdx = 21 + i;
      worksheet.getCell(`B${rowIdx}`).value = row.label;
      worksheet.getCell(`D${rowIdx}`).value = row.val;
      worksheet.getCell(`B${rowIdx}`).font = boldFont;
      worksheet.getCell(`B${rowIdx}`).border = borderStyle;
      worksheet.getCell(`D${rowIdx}`).border = borderStyle;
      if (row.fill) {
        worksheet.getCell(`B${rowIdx}`).fill = row.fill;
        worksheet.getCell(`D${rowIdx}`).fill = row.fill;
      }
    });

    // Profile 2 Calculations
    const calcRows2 = [
      { label: "Average", val: avg2, fill: null },
      { label: "kW", val: kw2, fill: null },
      { label: "Solar Panels", val: panels2, fill: null },
      { label: "Solar capacity", val: 1.8, fill: greenFill },
      { label: "Number of Panels", val: 3, fill: greenFill }
    ];

    calcRows2.forEach((row, i) => {
      const rowIdx = 21 + i;
      worksheet.getCell(`G${rowIdx}`).value = row.label;
      worksheet.getCell(`H${rowIdx}`).value = row.val;
      worksheet.getCell(`G${rowIdx}`).font = boldFont;
      worksheet.getCell(`G${rowIdx}`).border = borderStyle;
      worksheet.getCell(`H${rowIdx}`).border = borderStyle;
      if (row.fill) {
        worksheet.getCell(`G${rowIdx}`).fill = row.fill;
        worksheet.getCell(`H${rowIdx}`).fill = row.fill;
      }
    });

    // --- Total Aggregate Section (Rows 29-30) ---
    worksheet.getCell("B29").value = "Total solar capacity";
    worksheet.getCell("D29").value = 3.6;
    worksheet.getCell("B29").font = boldFont;

    worksheet.getCell("B30").value = "Number of solar panels";
    worksheet.getCell("D30").value = 6;
    worksheet.getCell("B30").font = boldFont;

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Disposition": `attachment; filename=EnergyBae_Dual_Audit_Analysis.xlsx`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });

  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
