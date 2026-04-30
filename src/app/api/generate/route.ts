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
          // Update the Month label (Column C)
          sheet.getCell(`C${rowNumber}`).value = historyItem.month;
          // Update the Units consumed (Column D)
          sheet.getCell(`D${rowNumber}`).value = parseFloat(historyItem.units) || 0;
          // Note: Column E (Bill Amount) and F (Unit Cost) are left untouched or kept as formula if they exist.
        }
      });
    }

    // Force Excel to recalculate formulas upon opening
    workbook.calcProperties.fullCalcOnLoad = true;

    // Generate the output buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Disposition": "attachment; filename=EnergyBae_Solar_Load_Calculated.xlsx",
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Excel generation error:", error);
    return NextResponse.json({ error: "Failed to generate Excel file" }, { status: 500 });
  }
}
