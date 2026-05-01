const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// Define the sample data for the demo
const demoData = {
  consumerName: "SHRI MADHUSHAM ROOPCHAND KHOBRAGADE",
  consumerNumber: "439320095567",
  sanctionedLoad: "3.3",
  connectionType: "90/LT I Res 1-Phase",
  billingHistory: [
    { month: "FEB 2024", units: "99" },
    { month: "MAR 2024", units: "151" },
    { month: "APR 2024", units: "258" },
    { month: "MAY 2024", units: "208" },
    { month: "JUN 2024", units: "262" },
    { month: "JUL 2024", units: "95" },
    { month: "AUG 2024", units: "86" },
    { month: "SEP 2024", units: "157" },
    { month: "OCT 2024", units: "146" },
    { month: "NOV 2024", units: "121" },
    { month: "DEC 2024", units: "100" },
    { month: "JAN 2025", units: "25" }
  ],
  aiInsights: { modelUsed: "Gemini 2.0 Flash (Primary)" }
};

// Add a function to load demo data
content = content.replace(
  /const \[batchFiles, setBatchFiles\] = useState<File\[\]>\(\[\]\);/,
  `const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const loadDemo = () => {
    setExtractedData(${JSON.stringify(demoData)});
    setEditableData(${JSON.stringify(demoData)});
    setActiveTab('verify');
    toast.success("Industrial Demo Environment Loaded");
  };`
);

// Add the button to the landing page footer or near the execute button
content = content.replace(
  /<p className="text-\[10px\] font-black text-slate-600 uppercase tracking-widest">MSEDCL Audit Interface Active<\/p>/,
  `<p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">MSEDCL Audit Interface Active</p>
   <button onClick={(e) => { e.preventDefault(); loadDemo(); }} className="mt-2 text-[8px] font-black text-indigo-500/50 hover:text-indigo-500 uppercase tracking-widest transition-colors underline decoration-dotted">Bypass for Showcase (Demo Mode)</button>`
);

fs.writeFileSync('src/app/page.tsx', content);
