const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// Replace Yellow Hex codes in charts
content = content.replace(/#eab308/g, '#4f46e5'); // Indigo 600
content = content.replace(/rgba\(234,179,8,0.2\)/g, 'rgba(79,70,229,0.1)'); // Indigo 600 with opacity

// Update Tooltip background for dark mode consistency
content = content.replace(/backgroundColor: '#020617'/g, "backgroundColor: 'var(--card)'");

fs.writeFileSync('src/app/page.tsx', content);
