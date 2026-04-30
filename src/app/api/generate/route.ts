import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Audit Analysis");

    // --- Style Definitions ---
    const orangeHeader: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F4B084' } }; // Orange/Peach
    const yellowFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } }; // Yellow
    const greenFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '92D050' } }; // Green
    const boldFont = { bold: true, name: 'Calibri', size: 11 };
    const borderStyle: Partial<ExcelJS.Borders> = {
      top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
    };

    // --- Column Setup ---
    worksheet.getColumn('B').width = 25;
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('D').width = 20;
    worksheet.getColumn('E').width = 15;
    worksheet.getColumn('F').width = 15;

    // --- Header Section (B1:B5 Labels, D1:D5 Values) ---
    const labels = [
      ["Consumer Name", data.consumerName],
      ["Consumer No", data.consumerNo],
      ["Fixed Charges", data.fixedCharges],
      ["Sanct. Load (kW)", data.sanctionedLoad],
      ["Connection Type", data.connectionType]
    ];

    labels.forEach((row, i) => {
      const cellB = worksheet.getCell(`B${i + 1}`);
      const cellD = worksheet.getCell(`D${i + 1}`);
      cellB.value = row[0];
      cellD.value = row[1];
      cellB.font = boldFont;
      cellB.border = borderStyle;
      cellD.border = borderStyle;
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
    solarRowVal.value = 600; // Standard 600W panel as per ref
    solarRowVal.border = borderStyle;

    // --- Consumption Table Headers (Row 8) ---
    const headers = ["Sr.No", "Month", "Units", "Bill Amount", "Unit Cost"];
    headers.forEach((h, i) => {
      const cell = worksheet.getCell(8, i + 2); // Start from B8
      cell.value = h;
      cell.fill = orangeHeader;
      cell.font = boldFont;
      cell.border = borderStyle;
      cell.alignment = { horizontal: 'center' };
    });

    // --- Consumption Data (Rows 9-20) ---
    const history = data.billingHistory || [];
    for (let i = 0; i < 12; i++) {
      const rowIdx = 9 + i;
      const h = history[i] || { month: "N/A", units: 0 };
      
      worksheet.getCell(`B${rowIdx}`).value = i + 1;
      worksheet.getCell(`C${rowIdx}`).value = h.month;
      worksheet.getCell(`D${rowIdx}`).value = Number(h.units) || 0;
      worksheet.getCell(`E${rowIdx}`).value = ""; // Bill Amount usually not per month in basic extract
      worksheet.getCell(`F${rowIdx}`).value = ""; // Unit Cost
      
      // Apply borders to the data row
      ["B", "C", "D", "E", "F"].forEach(col => {
        worksheet.getCell(`${col}${rowIdx}`).border = borderStyle;
      });
    }

    // --- Solar Intelligence Calculations (Row 21-25) ---
    const units = history.map((h: any) => h.units).filter((u: any) => u != null);
    const avgUnits = units.length > 0 ? units.reduce((a: number, b: number) => a + b, 0) / units.length : 0;
    const requiredKW = avgUnits / 106.06; // Standard industry conversion factor
    const panelCount = requiredKW / 0.6; // 600W = 0.6kW

    const calcRows = [
      { label: "Average", val: avgUnits.toFixed(2), fill: null },
      { label: "kW", val: requiredKW.toFixed(2), fill: null },
      { label: "Solar Panels", val: panelCount.toFixed(2), fill: null },
      { label: "Solar capacity", val: (Math.ceil(requiredKW * 10) / 10).toFixed(1), fill: greenFill },
      { label: "Number of Panels", val: Math.ceil(panelCount), fill: greenFill }
    ];

    calcRows.forEach((row, i) => {
      const rowIdx = 21 + i;
      const cellB = worksheet.getCell(`B${rowIdx}`);
      const cellD = worksheet.getCell(`D${rowIdx}`);
      
      cellB.value = row.label;
      cellD.value = row.val;
      
      cellB.font = boldFont;
      cellB.border = borderStyle;
      cellD.border = borderStyle;
      
      if (row.fill) {
        cellB.fill = row.fill;
        cellD.fill = row.fill;
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Disposition": `attachment; filename=EnergyBae_Audit_Analysis.xlsx`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });

  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
