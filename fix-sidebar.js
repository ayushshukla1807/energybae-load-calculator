const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

content = content.replace(
  /<SideButton id="vision" label="VISION ANALYSIS" active=\{activeTab\} set=\{setActiveTab\} icon=\{Eye\} \/>/,
  '<SideButton id="verify" label="VERIFY DATA" active={activeTab} set={setActiveTab} icon={ShieldCheck} />'
);

fs.writeFileSync('src/app/page.tsx', content);
