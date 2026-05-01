const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// Fix units to be numbers
content = content.replace(/"units":"(\d+)"/g, '"units":$1');

fs.writeFileSync('src/app/page.tsx', content);
