const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// 1. Add ThemeToggle to imports
content = content.replace(
  /import \{ \n  UploadCloud/,
  `import { ThemeToggle } from "@/components/theme-toggle";\nimport { \n  UploadCloud`
);

// 2. Add ThemeToggle next to Model Selectors
content = content.replace(
  /<\/div>\n\n        <div className="hidden md:flex items-center gap-2 p-1 bg-white\/5 border border-white\/10 rounded-full">/,
  `</div>\n\n        <div className="flex items-center gap-4">\n           <ThemeToggle />\n           <div className="hidden md:flex items-center gap-2 p-1 bg-card border border-border rounded-full">`
);

// 3. Replace Hardcoded Backgrounds & Borders
content = content.replaceAll('bg-[#020617]', 'bg-background');
content = content.replaceAll('bg-white/5', 'bg-card');
content = content.replaceAll('bg-black/20', 'bg-muted');
content = content.replaceAll('bg-black/50', 'bg-background/80');
content = content.replaceAll('bg-white/10', 'bg-muted');
content = content.replaceAll('border-white/10', 'border-border');
content = content.replaceAll('border-white/5', 'border-border');
content = content.replaceAll('text-white', 'text-foreground');
content = content.replaceAll('text-slate-100', 'text-foreground');
content = content.replaceAll('text-slate-400', 'text-muted-foreground');
content = content.replaceAll('text-slate-500', 'text-muted-foreground');
content = content.replaceAll('text-slate-950', 'text-background');

// 4. Specifically target specific elements that need slightly different light mode adjustments
// The yellow buttons text color:
content = content.replaceAll('text-black', 'text-background dark:text-black');

// For "Enterprise AI Suite V19.0" header:
content = content.replace(/className="text-3xl font-black tracking-tighter uppercase leading-none">/g, 'className="text-3xl font-black tracking-tighter uppercase leading-none text-foreground">');

// 5. Adjust gradients so they don't break in light mode (e.g. shadow-2xl)
content = content.replaceAll('shadow-2xl shadow-yellow-500/20', 'shadow-xl dark:shadow-2xl shadow-yellow-500/10 dark:shadow-yellow-500/20');
content = content.replaceAll('bg-gradient-to-t from-[#020617] via-[#020617]/80', 'bg-gradient-to-t from-background via-background/80');
content = content.replaceAll('bg-gradient-to-t from-[#020617] via-[#020617]/50', 'bg-gradient-to-t from-background via-background/50');

fs.writeFileSync('src/app/page.tsx', content);
