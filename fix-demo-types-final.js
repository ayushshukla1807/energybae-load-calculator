const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

const demoData = {
  consumerName: "SHRI MADHUSHAM ROOPCHAND KHOBRAGADE",
  consumerNo: "439320095567",
  billingUnit: "2020",
  fixedCharges: 125,
  sanctionedLoad: 3.3,
  connectionType: "90/LT I Res 1-Phase",
  billAmount: 1460,
  billingHistory: [
    { month: "FEB 2024", units: 99 },
    { month: "MAR 2024", units: 151 },
    { month: "APR 2024", units: 258 },
    { month: "MAY 2024", units: 208 },
    { month: "JUN 2024", units: 262 },
    { month: "JUL 2024", units: 95 },
    { month: "AUG 2024", units: 86 },
    { month: "SEP 2024", units: 157 },
    { month: "OCT 2024", units: 146 },
    { month: "NOV 2024", units: 121 },
    { month: "DEC 2024", units: 100 },
    { month: "JAN 2025", units: 25 }
  ],
  aiInsights: { 
    modelUsed: "Gemini 2.0 Flash (Primary)",
    loadEfficiency: "92%",
    seasonalityIndex: "1.15",
    confidence: 0.99 
  }
};

// Use a placeholder replacement to avoid double-escaping issues
content = content.replace(/const loadDemo = \(\) => \{[\s\S]*?toast\.success\("Industrial Demo Environment Loaded"\);\s+\};/, 
  `const loadDemo = () => {
    setExtractedData(${JSON.stringify(demoData)});
    setEditableData(${JSON.stringify(demoData)});
    setActiveTab('verify');
  };`
);

fs.writeFileSync('src/app/page.tsx', content);
