const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// Fix Mode Switcher Colors
content = content.replace(/bg-indigo-600 text-white/g, 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl gold-glow');

// Add a "Luxury" Glow to the main Action Button
content = content.replace(/className="flex-1 py-6 rounded-\[2rem\] bg-white text-background/, 'className="flex-1 py-6 rounded-[2rem] bg-gradient-to-r from-white to-slate-100 text-black shadow-2xl gold-glow');

// Update NavInfo for luxury look
content = content.replace(/text-slate-600 uppercase/g, 'text-indigo-400 font-bold uppercase tracking-[0.2em]');

fs.writeFileSync('src/app/page.tsx', content);
