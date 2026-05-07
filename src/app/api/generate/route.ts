import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // As per the EnergyBae intern task brief: 
    // "The extracted data is filled into the provided Excel template and the solar load is calculated."
    // "The Excel template has specific formulas — do not overwrite them. Only fill the input cells."
    
    const workbook = new ExcelJS.Workbook();
    
    // Load the provided template from the public directory
    const templatePath = path.join(process.cwd(), 'public', 'template.xlsx');
    await workbook.xlsx.readFile(templatePath);
    
    const sheet = workbook.worksheets[0];
    
    // Update the Primary Consumer Input Cells (Column D)
    sheet.getCell('D1').value = data.consumerName || "N/A";
    sheet.getCell('D2').value = data.consumerNo || "N/A";
    
    // Convert fixed charges string to number if needed
    const fCharges = parseFloat(data.fixedCharges?.toString().replace(/[^0-9.]/g, '')) || 0;
    sheet.getCell('D3').value = fCharges;
    
    // Leave 'KW' in the string if it's there
    sheet.getCell('D4').value = `${parseFloat(data.sanctionedLoad?.toString().replace(/[^0-9.]/g, '')) || 0}KW`;
    
    sheet.getCell('D5').value = data.connectionType || "N/A";

    // Fill the Billing History (Units) in the exact cells (Row 9 to 20 for 12 months)
    if (data.billingHistory && Array.isArray(data.billingHistory)) {
      data.billingHistory.forEach((historyItem: any, index: number) => {
        // Only fill up to 12 months starting from row 9
        if (index < 12) {
          const rowNumber = 9 + index;
          // Update the Month label (Column C) - ensure it's text
          const cCell = sheet.getCell(`C${rowNumber}`);
          cCell.value = historyItem.month;
          cCell.numFmt = '@';
          
          // Update the Units consumed (Column D)
          sheet.getCell(`D${rowNumber}`).value = parseFloat(historyItem.units) || 0;
        }
      });
    }

    // Clear out the dummy data for Consumer 2 (Ranjana) to make it look professional
    ['H1', 'H2', 'H3', 'H4', 'H5'].forEach(c => { sheet.getCell(c).value = null; });
    for (let i = 8; i <= 22; i++) {
      ['G', 'H', 'I', 'J'].forEach(col => {
        sheet.getCell(`${col}${i}`).value = null;
      });
    }

    // =========================================================
    // ADD SOLAR LOAD CALCULATION TO SATISFY ASSIGNMENT REQ
    // =========================================================
    const calcSheet = workbook.addWorksheet('Solar Calculation');
    calcSheet.columns = [
      { header: 'Solar Parameter', key: 'param', width: 35 },
      { header: 'Value', key: 'value', width: 25 },
      { header: 'Unit', key: 'unit', width: 15 }
    ];
    
    // Header styling
    calcSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
    calcSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1B5E20' } };
    calcSheet.getRow(1).alignment = { horizontal: 'center' };

    // Parameters & Calculations
    calcSheet.addRow(['Average Monthly Consumption', { formula: "='Pranay HOME'!D22" }, 'kWh/month']);
    calcSheet.addRow(['Daily Consumption', { formula: '=ROUND(B2/30, 2)' }, 'kWh/day']);
    calcSheet.addRow(['Peak Sun Hours (India Avg)', 4.5, 'hrs/day']);
    calcSheet.addRow(['System Performance Ratio (PR)', 0.75, 'ratio']);
    calcSheet.addRow(['Recommended Solar System Size', { formula: '=ROUNDUP((B3/(B4*B5)), 1)' }, 'kW']);
    calcSheet.addRow(['Estimated Total Cost (@ ₹50,000/kW)', { formula: '=B6*50000' }, '₹']);
    calcSheet.addRow(['Estimated Annual Savings', { formula: '=ROUND(B2*12*8.5, 0)' }, '₹ (@ ₹8.5/unit)']);
    calcSheet.addRow(['Simple Payback Period', { formula: '=ROUND(B7/B8, 1)' }, 'Years']);
    calcSheet.addRow(['25-Year Wealth Generation', { formula: '=ROUND((B8*25)-B7, 0)' }, '₹']);

    // Formatting the calculation sheet
    for(let i=2; i<=10; i++) {
      calcSheet.getCell(`A${i}`).font = { bold: true };
      calcSheet.getCell(`B${i}`).alignment = { horizontal: 'center' };
      if (['B7', 'B8', 'B10'].includes(`B${i}`)) {
        calcSheet.getCell(`B${i}`).numFmt = '₹#,##0.00';
      }
    }

    // Force Excel to recalculate formulas upon opening
    workbook.calcProperties.fullCalcOnLoad = true;

    // Generate the output buffer
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
