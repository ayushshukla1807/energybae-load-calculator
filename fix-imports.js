const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

content = content.replace(
  /UploadCloud, Zap, Loader2, Download, AlertCircle, BarChart3, Settings2, IndianRupee,/,
  'UploadCloud, Zap, Loader2, Download, AlertCircle, BarChart3, Settings2, IndianRupee, ShieldCheck, RefreshCcw, FileSpreadsheet,'
);

fs.writeFileSync('src/app/page.tsx', content);
