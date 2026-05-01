const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// Replace standard input classes with glass-input
content = content.replace(/className="bg-background border border-border rounded-xl px-4 py-3 text-sm font-bold focus:border-indigo-600 outline-none transition-colors"/g, 'className="glass-input"');
content = content.replace(/className="bg-transparent text-sm font-bold outline-none focus:text-indigo-600"/g, 'className="bg-transparent text-sm font-bold outline-none focus:text-indigo-400"');

// Ensure the sidebar active button is extremely visible
content = content.replace(/active === id \? "bg-white text-background shadow-2xl" : "hover:bg-card text-muted-foreground"/g, 'active === id ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_30px_rgba(79,70,229,0.3)]" : "hover:bg-white/5 text-muted-foreground"');

// Brighten the luxury text for dark mode
content = content.replace(/luxury-gradient-text/g, 'bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-200');

fs.writeFileSync('src/app/page.tsx', content);
