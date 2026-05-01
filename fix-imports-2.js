const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

content = content.replace(
  /UploadCloud, Zap, Loader2, Download, AlertCircle, BarChart3, Settings2, IndianRupee, ShieldCheck, RefreshCcw, FileSpreadsheet,/,
  'UploadCloud, Zap, Loader2, Download, AlertCircle, BarChart3, Settings2, IndianRupee, ShieldCheck, RefreshCcw, FileSpreadsheet, ClipboardList,'
);

content = content.replace(/TerminalSquare, Database, Zap, Code2/, 'TerminalSquare, Database, Code2');

fs.writeFileSync('src/app/page.tsx', content);
