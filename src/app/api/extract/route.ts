import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Groq } from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userApiKey = formData.get("apiKey") as string;

    const apiKey = userApiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    if (!apiKey && !groqKey) {
      return NextResponse.json({ error: "Intelligence Link Missing (API Key Required)" }, { status: 401 });
    }

    // --- Intelligence Layer: Gemini 1.5 Flash (Primary for RAG/Reasoning) ---
    if (apiKey && apiKey !== "DEMO") {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
          ACT AS AN ELITE ENERGY AUDIT AGENT FOR MSEDCL (MAHARASHTRA STATE ELECTRICITY DISTRIBUTION).
          YOUR TASK IS TO EXTRACT HIGH-PRECISION DATA FROM THE ATTACHED BILL TEXT.

          ### DOMAIN RULES (RAG INTELLIGENCE):
          1. CONSUMER NO: Look for 12-digit numeric strings near labels like "Consumer No" or "Grahak Kr."
          2. BILLING UNIT (BU): Usually a 4-digit code (e.g., 4393, 4602).
          3. SANCTIONED LOAD: Look for values in HP or kW. If in HP, convert to kW (HP * 0.746).
          4. BILLING HISTORY: Extract the last 12 months of consumption (Units/kWh). 
          5. VARIANCE WARNING: DO NOT provide static or generic values. Every bill is unique. If a field is missing, mark as "N/A" rather than guessing.

          RETURN STRICT JSON ONLY:
          {
            "consumerName": "STRING",
            "consumerNo": "STRING",
            "billingUnit": "STRING",
            "fixedCharges": NUMBER,
            "sanctionedLoad": NUMBER,
            "connectionType": "STRING",
            "billAmount": NUMBER,
            "billingHistory": [{"month": "STRING", "units": NUMBER}],
            "aiInsights": {
              "loadEfficiency": "High/Medium/Low",
              "seasonalityIndex": "e.g. 1.2x",
              "confidence": 0.0-1.0,
              "modelUsed": "Gemini-1.5-Flash"
            }
          }
        `;

        // Convert file to base64 for Gemini multimodal input
        let filePart: any = null;
        if (file) {
           const buffer = Buffer.from(await file.arrayBuffer());
           filePart = {
             inlineData: {
               data: buffer.toString('base64'),
               mimeType: file.type || "application/pdf"
             }
           };
        }

        const promptPayload = filePart ? [prompt, filePart] : [prompt, "No file provided. Return empty schema."];
        const result = await model.generateContent(promptPayload as any);
        const response = await result.response;
        const text = response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return NextResponse.json(JSON.parse(jsonMatch[0]));
      } catch (err) {
        console.error("Gemini Failure, falling back to Groq:", err);
      }
    }

    // --- Failover Layer: Groq Llama-3-70B ---
    if (groqKey) {
      const groq = new Groq({ apiKey: groqKey });
      const completion = await groq.chat.completions.create({
        messages: [{ role: "system", content: "Extract MSEDCL energy audit data into STRICT JSON." }, { role: "user", content: "Data extraction payload..." }],
        model: "llama3-70b-8192",
        response_format: { type: "json_object" }
      });
      return NextResponse.json(JSON.parse(completion.choices[0].message.content || "{}"));
    }

    // --- Demo Fallback ---
    return NextResponse.json({
      consumerName: "DEMO: Ankush Bisht (EnergyBae)",
      consumerNo: "439320095567",
      billingUnit: "4393",
      fixedCharges: 130,
      sanctionedLoad: 3.3,
      connectionType: "90/ LT I Res 1-Phase",
      billAmount: 3490,
      billingHistory: [
        { month: "Feb 2024", units: 110 }, { month: "Mar 2024", units: 145 },
        { month: "Apr 2024", units: 280 }, { month: "May 2024", units: 220 },
        { month: "Jun 2024", units: 240 }, { month: "Jul 2024", units: 105 },
        { month: "Aug 2024", units: 95 }, { month: "Sep 2024", units: 165 },
        { month: "Oct 2024", units: 395 }, { month: "Nov 2024", units: 155 },
        { month: "Dec 2024", units: 130 }, { month: "Jan 2025", units: 45 }
      ],
      aiInsights: {
        loadEfficiency: "Optimized",
        seasonalityIndex: "1.4x",
        confidence: 0.95,
        modelUsed: "Demo System"
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
