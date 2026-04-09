import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const templatePath = path.join(process.cwd(), "public", "template.xlsx");
    if (!fs.existsSync(templatePath)) {
      throw new Error("Template file not found at " + templatePath);
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) throw new Error("Worksheet not found");

    // Populate D column based on extracted data
    worksheet.getCell("D1").value = data.consumerName || "";
    worksheet.getCell("D2").value = Number(data.consumerNo) || 0;
    worksheet.getCell("D3").value = Number(data.fixedCharges) || 0;
    worksheet.getCell("D4").value = data.sanctionedLoad ? `${data.sanctionedLoad}KW` : "";
    worksheet.getCell("D5").value = data.connectionType || "";

    if (data.billingHistory && Array.isArray(data.billingHistory)) {
      // Loop from D9 to D20
      for (let i = 0; i < 12; i++) {
        if (data.billingHistory[i] && data.billingHistory[i].units !== undefined) {
          worksheet.getCell(`D${9 + i}`).value = Number(data.billingHistory[i].units);
        }
      }
    }

    worksheet.getCell("E20").value = Number(data.billAmount) || 0;

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Disposition": "attachment; filename=EnergyBae_Load_Calc.xlsx",
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });

  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
