const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// Add missing AIInsights properties
content = content.replace(
  /"aiInsights":\{"modelUsed":"Gemini 2.0 Flash \(Primary\)"\}/,
  '"aiInsights":{"modelUsed":"Gemini 2.0 Flash (Primary)","loadEfficiency":0.92,"seasonalityIndex":1.15,"confidence":0.99}'
);

fs.writeFileSync('src/app/page.tsx', content);
