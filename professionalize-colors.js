const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// 1. Replace Icons
content = content.replace(/Hexagon/g, 'Zap');
content = content.replace(/Microscope/g, 'FileCheck2');
content = content.replace(/ScanFace/g, 'ClipboardList');

// 2. Replace Colors (Yellow/Amber -> Indigo/Slate)
content = content.replace(/yellow-500\/10/g, 'indigo-500/5');
content = content.replace(/yellow-500\/20/g, 'indigo-500/10');
content = content.replace(/yellow-500\/30/g, 'indigo-500/20');
content = content.replace(/yellow-500\/40/g, 'indigo-500/30');
content = content.replace(/yellow-500\/5/g, 'slate-500/5');
content = content.replace(/yellow-500/g, 'indigo-600');
content = content.replace(/yellow-400/g, 'indigo-500');
content = content.replace(/amber-600/g, 'indigo-700');
content = content.replace(/amber-500/g, 'indigo-600');
content = content.replace(/orange-600/g, 'blue-600');

// 3. Replace Classes
content = content.replace(/glass-card/g, 'enterprise-card');

// 4. Gradient Overhaul (Hacker -> Professional)
content = content.replace(/from-yellow-400 via-amber-500 to-orange-600/g, 'from-slate-900 via-indigo-800 to-indigo-900 dark:from-white dark:via-indigo-200 dark:to-indigo-300');
content = content.replace(/from-yellow-500 to-amber-600/g, 'from-indigo-600 to-indigo-800');
content = content.replace(/from-yellow-500\/10 to-transparent/g, 'from-indigo-500\/5 to-transparent');

// 5. Text tweaks
content = content.replace(/text-transparent bg-clip-text/g, 'text-foreground'); // Less flashy
content = content.replace(/text-9xl/g, 'text-8xl'); // Slightly smaller, more grounded
content = content.replace(/tracking-tighter/g, 'tracking-tight'); // Less aggressive

// 6. Removing AI tells from messages
content = content.replace(/Neural Extraction Complete/g, 'Analysis Complete');
content = content.replace(/Technical Audit Complete/g, 'Report Generated');

fs.writeFileSync('src/app/page.tsx', content);
