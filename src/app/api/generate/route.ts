import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Create a pristine new workbook from scratch instead of using the messy template
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'EnergyBae AI Audit';
    workbook.created = new Date();

    // ==========================================
    // SHEET 1: EXTRACTED BILL DATA
    // ==========================================
    const sheet1 = workbook.addWorksheet('Extracted Bill Data');
    
    // Set column widths
    sheet1.columns = [
      { width: 25 }, // A: Parameter
      { width: 35 }, // B: Value
      { width: 10 }, // C: Spacer
      { width: 15 }, // D: Month
      { width: 15 }, // E: Units
    ];

    // Header Styles
    const headerStyle = {
      font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 },
      fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FF1B5E20' } },
      alignment: { vertical: 'middle' as const, horizontal: 'center' as const }
    };

    const labelStyle = {
      font: { bold: true, color: { argb: 'FF333333' } },
      fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFF5F5F5' } },
      border: { bottom: { style: 'thin' as const, color: { argb: 'FFDDDDDD' } } },
      alignment: { vertical: 'middle' as const }
    };

    const valueStyle = {
      border: { bottom: { style: 'thin' as const, color: { argb: 'FFDDDDDD' } } },
      alignment: { vertical: 'middle' as const, horizontal: 'left' as const }
    };

    // Consumer Details Section
    sheet1.mergeCells('A1:B1');
    sheet1.getCell('A1').value = 'CONSUMER DETAILS';
    sheet1.getCell('A1').style = headerStyle;

    const consumerDetails = [
      ['Consumer Name', data.consumerName || 'N/A'],
      ['Consumer Number', data.consumerNo || 'N/A'],
      ['Billing Unit', data.billingUnit || 'N/A'],
      ['Sanctioned Load', `${parseFloat(data.sanctionedLoad?.toString().replace(/[^0-9.]/g, '')) || 0} KW`],
      ['Fixed Charges', `₹ ${parseFloat(data.fixedCharges?.toString().replace(/[^0-9.]/g, '')) || 0}`],
      ['Connection Type', data.connectionType || 'N/A'],
      ['Total Bill Amount', `₹ ${data.billAmount || 0}`]
    ];

    consumerDetails.forEach((row, idx) => {
      const rowIndex = idx + 2;
      sheet1.getCell(`A${rowIndex}`).value = row[0];
      sheet1.getCell(`A${rowIndex}`).style = labelStyle;
      sheet1.getCell(`B${rowIndex}`).value = row[1];
      sheet1.getCell(`B${rowIndex}`).style = valueStyle;
    });

    // Billing History Section
    sheet1.mergeCells('D1:E1');
    sheet1.getCell('D1').value = '12-MONTH CONSUMPTION HISTORY';
    sheet1.getCell('D1').style = headerStyle;

    sheet1.getCell('D2').value = 'Month';
    sheet1.getCell('D2').style = labelStyle;
    sheet1.getCell('D2').alignment = { horizontal: 'center' };
    
    sheet1.getCell('E2').value = 'Units (kWh)';
    sheet1.getCell('E2').style = labelStyle;
    sheet1.getCell('E2').alignment = { horizontal: 'center' };

    let totalUnits = 0;
    let monthsCount = 0;

    if (data.billingHistory && Array.isArray(data.billingHistory)) {
      data.billingHistory.forEach((historyItem: any, index: number) => {
        if (index < 12) {
          const r = index + 3;
          sheet1.getCell(`D${r}`).value = historyItem.month;
          sheet1.getCell(`D${r}`).alignment = { horizontal: 'center' };
          sheet1.getCell(`D${r}`).border = { bottom: { style: 'thin', color: { argb: 'FFEEEEEE' } } };
          
          const units = parseFloat(historyItem.units) || 0;
          sheet1.getCell(`E${r}`).value = units;
          sheet1.getCell(`E${r}`).alignment = { horizontal: 'center' };
          sheet1.getCell(`E${r}`).border = { bottom: { style: 'thin', color: { argb: 'FFEEEEEE' } } };
          
          totalUnits += units;
          monthsCount++;
        }
      });
    }

    const avgMonthlyUnits = monthsCount > 0 ? Math.round(totalUnits / monthsCount) : 0;
    const lastHistoryRow = Math.max(3 + monthsCount, 3);
    
    sheet1.getCell(`D${lastHistoryRow}`).value = 'Monthly Average';
    sheet1.getCell(`D${lastHistoryRow}`).style = { font: { bold: true }, alignment: { horizontal: 'center' }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF3E0' } } };
    
    sheet1.getCell(`E${lastHistoryRow}`).value = avgMonthlyUnits;
    sheet1.getCell(`E${lastHistoryRow}`).style = { font: { bold: true }, alignment: { horizontal: 'center' }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF3E0' } } };


    // ==========================================
    // SHEET 2: SOLAR CALCULATION
    // ==========================================
    const sheet2 = workbook.addWorksheet('Solar Calculation');
    
    sheet2.columns = [
      { width: 35 }, // A: Parameter
      { width: 25 }, // B: Value
      { width: 20 }, // C: Unit/Note
    ];

    sheet2.mergeCells('A1:C1');
    sheet2.getCell('A1').value = 'SOLAR SYSTEM RECOMMENDATION & ROI';
    sheet2.getCell('A1').style = headerStyle;

    const dailyConsumption = Number((avgMonthlyUnits / 30).toFixed(2));
    const peakSunHours = 4.5;
    const pr = 0.75;
    // System Size = Daily Consumption / (Peak Sun Hours * PR)
    const rawSystemSize = dailyConsumption / (peakSunHours * pr);
    const recommendedSize = Math.ceil(rawSystemSize * 10) / 10; // Round up to 1 decimal place
    const systemCost = recommendedSize * 50000;
    const avgTariff = 8.5; // Assume ₹8.5 per unit
    const annualSavings = avgMonthlyUnits * 12 * avgTariff;
    const payback = annualSavings > 0 ? Number((systemCost / annualSavings).toFixed(1)) : 0;
    const wealth25y = (annualSavings * 25) - systemCost;

    const solarData = [
      ['Average Monthly Consumption', avgMonthlyUnits, 'kWh / month'],
      ['Average Daily Consumption', dailyConsumption, 'kWh / day'],
      ['Peak Sun Hours (India Avg)', peakSunHours, 'hours / day'],
      ['System Performance Ratio', pr, 'efficiency ratio'],
      ['Recommended Solar System Size', recommendedSize, 'kW'],
      ['Estimated Total Cost', systemCost, '₹ (@ ₹50,000/kW)'],
      ['Estimated Annual Savings', annualSavings, `₹ (@ ₹${avgTariff}/unit)`],
      ['Simple Payback Period', payback, 'Years'],
      ['25-Year Wealth Generation', wealth25y, '₹ (Net Profit)']
    ];

    solarData.forEach((row, idx) => {
      const rowIndex = idx + 2;
      sheet2.getCell(`A${rowIndex}`).value = row[0];
      sheet2.getCell(`A${rowIndex}`).style = labelStyle;
      
      sheet2.getCell(`B${rowIndex}`).value = row[1];
      sheet2.getCell(`B${rowIndex}`).style = valueStyle;
      sheet2.getCell(`B${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };
      
      // Format currency
      if ([5, 6, 8].includes(idx)) {
        sheet2.getCell(`B${rowIndex}`).numFmt = '₹#,##0';
      }

      sheet2.getCell(`C${rowIndex}`).value = row[2];
      sheet2.getCell(`C${rowIndex}`).style = { font: { italic: true, color: { argb: 'FF888888' } }, alignment: { vertical: 'middle' } };
    });

    // Highlight the final output rows
    ['A6', 'B6', 'C6', 'A8', 'B8', 'C8', 'A10', 'B10', 'C10'].forEach(cell => {
      sheet2.getCell(cell).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } };
      sheet2.getCell(cell).font = { bold: true, color: { argb: 'FF1B5E20' } };
    });

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
