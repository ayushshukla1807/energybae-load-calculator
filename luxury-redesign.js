const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// 1. Luxury Animations & Gradients
content = content.replace(/enterprise-card/g, 'luxury-card');
content = content.replace(/bg-indigo-600/g, 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600');
content = content.replace(/hover:bg-indigo-500/g, 'hover:scale-[1.02] hover:gold-glow');

// 2. Multicolor Heading
content = content.replace(/<h2 className="text-8xl font-black tracking-tight text-foreground mb-12">/, '<h2 className="text-8xl font-black tracking-tight luxury-gradient-text mb-12">');

// 3. Luxury Audit Trail
content = content.replace(/bg-indigo-500\/5/g, 'bg-gradient-to-br from-indigo-500/10 to-purple-500/5');

// 4. Staggered Entrance (Simulated with Delay in loop)
content = content.replace(/\{editableData\.billingHistory\?\.map\(\(item: any, idx: number\) => \(/g, '{editableData.billingHistory?.map((item: any, idx: number) => (\n                                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}');
// Closing the motion.div (this regex might need care)
content = content.replace(/<\/div>\n                                   \)\)\}/, '</motion.div>\n                                   ))}\n');

// 5. Luxury Typography (Body)
content = content.replace(/font-sans/g, 'font-body tracking-tight');

// 6. Navigation Logo Luxury
content = content.replace(/from-indigo-600 to-indigo-800/g, 'from-indigo-500 via-purple-500 to-pink-500');

fs.writeFileSync('src/app/page.tsx', content);
