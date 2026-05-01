const fs = require('fs');
let content = fs.readFileSync('src/app/layout.tsx', 'utf-8');

content = content.replace(/import { Outfit, JetBrains_Mono, Caveat } from "next\/font\/google";/, 'import { Outfit, Inter, JetBrains_Mono, Caveat } from "next/font/google";');
content = content.replace(/const outfit = Outfit\(\{/, 'const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });\nconst outfit = Outfit({');
content = content.replace(/\$\{outfit\.variable\} \$\{jetbrains\.variable\} \$\{caveat\.variable\}/, '${inter.variable} ${outfit.variable} ${jetbrains.variable} ${caveat.variable}');
content = content.replace(/selection:bg-yellow-500\/30/, 'selection:bg-indigo-500/30');

fs.writeFileSync('src/app/layout.tsx', content);
