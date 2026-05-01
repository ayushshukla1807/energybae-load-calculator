const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// The correct target string in page.tsx
const target = '<p className="text-[10px] font-black text-indigo-400 font-bold uppercase tracking-[0.2em] tracking-widest">';
const replacement = target + '\n                           <button onClick={(e) => { e.preventDefault(); loadDemo(); }} className="mt-2 text-[8px] font-black text-indigo-500/50 hover:text-indigo-500 uppercase tracking-widest transition-colors underline decoration-dotted block">Bypass for Showcase (Demo Mode)</button>';

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/app/page.tsx', content);
  console.log('Button added successfully');
} else {
  console.log('Target string not found');
}
