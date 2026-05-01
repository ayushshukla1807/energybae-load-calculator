const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// Fix the Export Technical Audit button styling
// It was likely something like: bg-gradient-to-r from-white to-slate-100 text-black
// We need to make it pop with the luxury gradient
content = content.replace(
  /className="flex-1 py-6 rounded-\[2rem\] bg-gradient-to-r from-white to-slate-100 text-black shadow-2xl gold-glow"/,
  'className="flex-1 py-6 rounded-[2rem] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-xl shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:scale-[1.02] transition-all"'
);

// Also check for the "EXPORT TECHNICAL AUDIT" text button in the top panel
content = content.replace(
  /EXPORT TECHNICAL AUDIT/g,
  'GENERATE FINAL REPORT'
);

// Force Dark Mode again just in case
content = content.replace(/defaultTheme="system"/, 'defaultTheme="dark"');
content = content.replace(/enableSystem/, 'enableSystem={false}');

fs.writeFileSync('src/app/page.tsx', content);
