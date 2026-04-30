const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// 1. Remove Model Selector and ThemeToggle wrapper
content = content.replace(
  /<div className="flex items-center gap-4">\n           <ThemeToggle \/>\n           <div className="hidden md:flex items-center gap-2 p-1 bg-card border border-border rounded-full">\n              <button onClick=\{.*?<\/button>\n              <button onClick=\{.*?<\/button>\n              <button onClick=\{.*?<\/button>\n           <\/div>\n        <\/div>/s,
  '<ThemeToggle />'
);

// 2. Titles and Subtitles
content = content.replaceAll('Enterprise AI Suite V19.0', 'Solar Audit Automation Tool');
content = content.replaceAll('Global Array Cluster', 'Audit Workspace');
content = content.replaceAll('Live AI Telemetry', 'System Status');
content = content.replaceAll('Vision Parsing Map...', 'Processing Document...');
content = content.replaceAll('Agent Orchestration Graph Building...', 'Extracting electricity bill fields...');

// 3. Processing steps in trail
content = content.replaceAll('Agent Orchestration Trail', 'Processing Pipeline');
content = content.replaceAll('1. VISION PARSER', '1. DOCUMENT SCAN');
content = content.replaceAll('2. RAG GROUNDING', '2. DATA PARSING');
content = content.replaceAll('3. MATH AGENT', '3. CALCULATIONS');
content = content.replaceAll('4. ML FORECAST', '4. EXCEL GEN');
content = content.replaceAll('Engine: {selectedModel.toUpperCase()}', 'Engine: OCR Core');
content = content.replaceAll('Model: XGBoost', 'Model: Template Mapper');

// 4. Extraction Logic Messages
content = content.replace(/message: \`Initializing Computer Vision Module \[\$\{selectedModel\.toUpperCase\(\)\}\]\.\.\.\`/, 'message: `Initializing document processor...`');
content = content.replaceAll('OCR Engine: Parsing Document Entropy & Bounding Boxes...', 'Parsing document text regions...');
content = content.replaceAll('RAG Agent: Cross-referencing BU Code 4393 with MSEDCL Database...', 'Validating MSEDCL structures...');
content = content.replaceAll('Machine Learning: Generating 12-Month Time-Series Forecast...', 'Generating output file...');

// 5. Chat & Vision Tabs
content = content.replaceAll('Deep Vision Heatmap (Simulated)', 'Document Extraction Analysis');
content = content.replaceAll('Engineer GPT', 'EnergyBae Assistant');
content = content.replaceAll('Neural Extraction Complete. I am your Engineer GPT. I have mapped the MSEDCL tariff structures to the anomaly vectors. How can I assist you with the technical audit today?', 'Document processed successfully. The Excel sheet is ready for download. Do you have any questions about the extracted data?');
content = content.replaceAll('Ask the AI Engineer for technical optimization strategies...', 'Ask questions about the audit...');
content = content.replaceAll('Agent Online', 'Online');
content = content.replaceAll('AI Engineer', 'System');
content = content.replaceAll('AI Engineer Prototype V19.0', 'EnergyBae Internal Tooling');
content = content.replaceAll('Orchestration: Neural Multi-Agent', 'v1.0.0-beta');
content = content.replaceAll('Enterprise AI Suite', 'Developed by Ayush Shukla');

// 6. Fix K-Means text
content = content.replace(/Running K-Means clustering on the load profile\.\.\. Analysis indicates a 1\.4x variance threshold breach during summer months\. Recommend immediate integration of Hybrid VAWT \(Vertical Axis Wind Turbines\) to flatten the peak curve\. Estimated efficiency gain: 18\.4\%\./g, 'Based on the extracted data, the summer months show a higher load consumption. A 3.6kW system is recommended for optimal savings.');
content = content.replace(/Predictive Machine Learning model \(XGBoost Regressor\) projects an annual savings of ₹\$\{\(extractedData\?.billAmount \|\| 3490\) \* 12 \* 0\.72\} with a 94\.2\% confidence interval if the 3\.6kW solar array is deployed\./g, 'Calculations project an estimated annual savings of ₹${Math.round((extractedData?.billAmount || 3490) * 12 * 0.72)} if the recommended solar array is deployed.');

fs.writeFileSync('src/app/page.tsx', content);
