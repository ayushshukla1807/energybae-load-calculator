import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("EnergyBae AI Audit");

    // --- Styling Constants ---
    const headerFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0F172A' } };
    const fontWhite: Partial<ExcelJS.Font> = { color: { argb: 'FFFFFF' }, bold: true, name: 'Arial', size: 12 };
    const fontGold: Partial<ExcelJS.Font> = { color: { argb: 'EAB308' }, bold: true };

    // --- Setup Columns ---
    worksheet.columns = [
      { header: "PARAMETER", key: "param", width: 25 },
      { header: "EXTRACTED DATA / ANALYSIS", key: "value", width: 45 },
    ];

    // --- Header Style ---
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = fontWhite;
    });

    // --- Inject Core Data ---
    worksheet.addRows([
      { param: "CONSUMER NAME", value: data.consumerName || "N/A" },
      { param: "CONSUMER NUMBER", value: data.consumerNo || "N/A" },
      { param: "BILLING UNIT (BU)", value: data.billingUnit || "N/A" },
      { param: "SANCTIONED LOAD", value: `${data.sanctionedLoad || 0} KW` },
      { param: "CONNECTION TYPE", value: data.connectionType || "N/A" },
      { param: "TOTAL BILL AMOUNT", value: `₹${data.billAmount || 0}` },
    ]);

    // --- Add AI Insights ---
    worksheet.addRow([]);
    worksheet.addRow({ param: "NEURAL INSIGHTS", value: "" });
    worksheet.getRow(worksheet.rowCount).eachCell(c => c.font = fontGold);
    
    worksheet.addRows([
      { param: "LOAD EFFICIENCY", value: data.aiInsights?.loadEfficiency || "Analyzed" },
      { param: "SEASONALITY INDEX", value: `${data.aiInsights?.seasonalityIndex || 1.0}x` },
      { param: "AI CONFIDENCE", value: `${(data.aiInsights?.confidence || 0.98) * 100}%` },
    ]);

    // --- Billing History Section ---
    worksheet.addRow([]);
    const historyHeader = worksheet.addRow({ param: "MONTHLY CONSUMPTION HISTORY", value: "" });
    historyHeader.eachCell(c => c.font = fontGold);

    if (data.billingHistory && Array.isArray(data.billingHistory)) {
      data.billingHistory.forEach((h: any) => {
        worksheet.addRow({ param: h.month, value: `${h.units} Units` });
      });
    }

    // --- Final Formatting ---
    worksheet.eachRow((row) => {
      row.getCell(1).font = { bold: true };
      row.alignment = { vertical: 'middle', horizontal: 'left' };
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Disposition": `attachment; filename=EnergyBae_AI_Audit_${Date.now()}.xlsx`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });

  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
