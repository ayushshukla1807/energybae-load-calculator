const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// Fix the Generate Final Report button to be high-contrast luxury gradient
content = content.replace(
  /className="h-20 px-12 rounded-\[2rem\] bg-white text-background font-black text-lg shadow-2xl hover:scale-105 transition-all"/,
  'className="h-20 px-12 rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-lg shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:scale-[1.05] transition-all"'
);

fs.writeFileSync('src/app/page.tsx', content);
