const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// Fix sanctionedLoad to be a number
content = content.replace(/"sanctionedLoad":"3.3"/g, '"sanctionedLoad":3.3');

fs.writeFileSync('src/app/page.tsx', content);
