import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const apiKey = formData.get("apiKey") as string;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const keyToUse = apiKey || process.env.OPENAI_API_KEY;
    
    if (keyToUse === "DEMO") {
      return NextResponse.json({
        consumerName: "Shri Madhusham Roopchand Khobragade",
        consumerNo: "439320095567",
        billingUnit: "4393",
        fixedCharges: 130,
        sanctionedLoad: 3.30,
        connectionType: "90/LT I Res 1-Phase",
        billAmount: 3490,
        billingHistory: [
          { month: "2025-02", units: 99 },
          { month: "2025-03", units: 151 },
          { month: "2025-04", units: 258 },
          { month: "2025-05", units: 208 },
          { month: "2025-06", units: 262 },
          { month: "2025-07", units: 96 },
          { month: "2025-08", units: 86 },
          { month: "2025-09", units: 157 },
          { month: "2025-10", units: 380 },
          { month: "2025-11", units: 146 },
          { month: "2025-12", units: 121 },
          { month: "2026-01", units: 25 }
        ]
      });
    }

    if (!keyToUse) {
      return NextResponse.json({ error: "OpenAI API key missing" }, { status: 401 });
    }

    const openai = new OpenAI({ apiKey: keyToUse });
    const arrayBuffer = await file.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert Energy Audit AI specializing in Maharashtra MSEDCL electricity bills. 
              Extract the following fields as JSON from the provided bill:
              - consumerName (string)
              - consumerNo (string, 12 digits usually)
              - billingUnit (string, the 'BU' code, usually 4 digits)
              - fixedCharges (number)
              - sanctionedLoad (number, in kW. If in HP, convert: 1 HP = 0.746 kW. Output ONLY the number)
              - connectionType (string, e.g., '90/LT I Res 1-Phase')
              - billAmount (number)
              - billingHistory (array of exactly 12 objects with 'month' (YYYY-MM) and 'units' (number)). 
              
              Note: Look specifically for the consumption table or bar chart usually found on the second page or the right sidebar of MSEDCL bills.
              Reply with ONLY the raw JSON object, no markdown formatting.
              `
            },
            {
              type: "image_url",
              image_url: { url: `data:${file.type};base64,${base64Image}` },
            },
          ],
        },
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No content from OpenAI");

    return NextResponse.json(JSON.parse(content));

  } catch (error: any) {
    console.error("Extraction error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
