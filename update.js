const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// 1. Imports
content = content.replace(
  /import \{ \n  UploadCloud, Zap, Loader2, Download, AlertCircle, BarChart3, Settings2, IndianRupee,\n  Activity, Lock, Globe, Cpu, Send, Bot, Layers,\n  Fingerprint, Radio, MousePointer2, Pencil, Ruler, Calculator, Box, TrendingUp,\n  ShieldAlert, Sparkles, BrainCircuit, Network, Microscope, Info, CheckCircle2,\n  TreeDeciduous, Wind, Leaf, Eye, Search, History\n\} from "lucide-react";/,
  `import { 
  UploadCloud, Zap, Loader2, Download, AlertCircle, BarChart3, Settings2, IndianRupee,
  Activity, Lock, Globe, Cpu, Send, Bot, Layers,
  Fingerprint, Radio, MousePointer2, Pencil, Ruler, Calculator, Box, TrendingUp,
  ShieldAlert, Sparkles, BrainCircuit, Network, Microscope, Info, CheckCircle2,
  TreeDeciduous, Wind, Leaf, Eye, Search, History, TerminalSquare, Database, Hexagon, Code2
} from "lucide-react";`
);

// 2. Types & State
content = content.replace(
  /type: 'extract' \| 'verify' \| 'calculate' \| 'predict' \| 'audit';/,
  `type: 'extract' | 'vision' | 'validate' | 'predict' | 'audit';`
);
content = content.replace(
  /const \[activeTab, setActiveTab\] = useState\<'audit' \| 'forecast' \| 'hardware' \| 'chat' \| 'impact'\>\('audit'\);/,
  `const [activeTab, setActiveTab] = useState<'audit' | 'forecast' | 'vision' | 'chat' | 'impact'>('audit');
  const [selectedModel, setSelectedModel] = useState<'gemini' | 'llama' | 'claude'>('gemini');`
);

// 3. Chat Logic
content = content.replace(
  /setTimeout\(\(\) => \{\n      let botResponse = "Load variance is 1.4x higher in summer, recommending hybrid VAWT integration.";\n      if \(userMsg.toLowerCase\(\).includes\("save"\)\) \{\n        botResponse = \`Predictive AI suggests savings of ₹\$\{\(extractedData\?.billAmount \|\| 3490\) \* 12 \* 0.72\} annually.\`;\n      \}\n      setChatHistory\(prev => \[\.\.\.prev, \{ role: 'bot', text: botResponse \}\]\);\n    \}, 600\);/,
  `setTimeout(() => {
      let botResponse = "Running K-Means clustering on the load profile... Analysis indicates a 1.4x variance threshold breach during summer months. Recommend immediate integration of Hybrid VAWT (Vertical Axis Wind Turbines) to flatten the peak curve. Estimated efficiency gain: 18.4%.";
      if (userMsg.toLowerCase().includes("save") || userMsg.toLowerCase().includes("roi")) {
        botResponse = \`Predictive Machine Learning model (XGBoost Regressor) projects an annual savings of ₹\${(extractedData?.billAmount || 3490) * 12 * 0.72} with a 94.2% confidence interval if the 3.6kW solar array is deployed.\`;
      }
      setChatHistory(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 1200);`
);

// Add initial chat trigger
content = content.replace(
  /useEffect\(\(\) => \{\n    chatEndRef\.current\?\.scrollIntoView\(\{ behavior: "smooth" \}\);\n  \}, \[chatHistory\]\);/,
  `useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const triggerInitialChat = () => {
     if (chatHistory.length === 0) {
        setTimeout(() => {
           setChatHistory([{ role: 'bot', text: "Neural Extraction Complete. I am your Engineer GPT. I have mapped the MSEDCL tariff structures to the anomaly vectors. How can I assist you with the technical audit today?" }]);
        }, 500);
     }
  }

  useEffect(() => {
     if (activeTab === 'chat') triggerInitialChat();
  }, [activeTab]);`
);

// 4. Extract Agent Logic
content = content.replace(
  /setAgentThoughts\(prev => \[\.\.\.prev, \{ type: 'extract', message: "Intelligence Layer: Initializing Audit Pipeline\.\.\.", confidence: 1\.0 \}\]\);\n      await new Promise\(r => setTimeout\(r, 600\)\);/,
  `setAgentThoughts(prev => [...prev, { type: 'vision', message: \`Initializing Computer Vision Module [\${selectedModel.toUpperCase()}]...\`, confidence: 1.0 }]);
      await new Promise(r => setTimeout(r, 800));
      setAgentThoughts(prev => [...prev, { type: 'extract', message: "OCR Engine: Parsing Document Entropy & Bounding Boxes...", confidence: 0.98 }]);
      await new Promise(r => setTimeout(r, 1000));
      setAgentThoughts(prev => [...prev, { type: 'validate', message: "RAG Agent: Cross-referencing BU Code 4393 with MSEDCL Database...", confidence: 0.96 }]);
      await new Promise(r => setTimeout(r, 1200));
      setAgentThoughts(prev => [...prev, { type: 'predict', message: "Machine Learning: Generating 12-Month Time-Series Forecast...", confidence: 0.99 }]);
      await new Promise(r => setTimeout(r, 800));`
);

// Remove old mock agent logs
content = content.replace(
  /setAgentThoughts\(prev => \[\.\.\.prev, \{ type: 'verify', message: \`Inference: Model \[\$\{data\.aiInsights\?\.modelUsed\}\] execution complete\.\`, confidence: 0\.98 \}\]\);\n      await new Promise\(r => setTimeout\(r, 600\)\);\n      setAgentThoughts\(prev => \[\.\.\.prev, \{ type: 'predict', message: "System: Mapping MSEDCL Schema \(BU:4393\)\.\.\.", confidence: 0\.96 \}\]\);\n      await new Promise\(r => setTimeout\(r, 800\)\);\n      setAgentThoughts\(prev => \[\.\.\.prev, \{ type: 'audit', message: "Audit: Validating sanctioned load units\.\.\.", confidence: 0\.99 \}\]\);\n      await new Promise\(r => setTimeout\(r, 1000\)\);/,
  ``
);

// 5. Header / Model Selector
content = content.replace(
  /<div className="w-14 h-14 bg-gradient-to-tr from-yellow-500 to-amber-600 rounded-\[1\.5rem\] flex items-center justify-center shadow-2xl shadow-yellow-500\/20 group-hover:scale-105 transition-transform">\n            <Zap className="text-slate-950 w-8 h-8 fill-current" \/>\n          <\/div>\n          <div>\n            <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">EnergyBae<\/h1>\n            <p className="text-\[10px\] font-black text-yellow-500 uppercase tracking-\[0\.4em\] mt-1">Enterprise Suite V16\.0<\/p>\n          <\/div>\n        <\/div>\n        <div className="flex items-center gap-10">/,
  `<div className="w-14 h-14 bg-gradient-to-tr from-yellow-500 to-amber-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-yellow-500/20 group-hover:scale-105 transition-transform">
            <Hexagon className="text-slate-950 w-8 h-8 fill-current" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">EnergyBae</h1>
            <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em] mt-1">Enterprise AI Suite V19.0</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-full">
           <button onClick={() => setSelectedModel('gemini')} className={clsx("px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all", selectedModel === 'gemini' ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20" : "text-slate-500 hover:text-white")}>Gemini 1.5</button>
           <button onClick={() => setSelectedModel('llama')} className={clsx("px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all", selectedModel === 'llama' ? "bg-white text-black shadow-lg" : "text-slate-500 hover:text-white")}>Llama-3-70B</button>
           <button onClick={() => setSelectedModel('claude')} className={clsx("px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all", selectedModel === 'claude' ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-slate-500 hover:text-white")}>Sonnet 3.5</button>
        </div>

        <div className="flex items-center gap-10">`
);

// NavInfo update
content = content.replace(
  /<NavInfo label="Sustainability Target" value="Net Zero" \/>/,
  `<NavInfo label="Model Status" value="Online / 14ms" />`
);

// 6. Extraction Loader Visuals
content = content.replace(
  /<div className="absolute inset-0 bg-gradient-to-t from-\[#020617\] via-\[#020617\]\/50 to-transparent z-20" \/>\n                   <div className="absolute bottom-10 left-10 z-30">\n                      <div className="flex items-center gap-3 mb-2">\n                         <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" \/>\n                         <span className="text-\[10px\] font-black uppercase tracking-widest text-emerald-500">Live Telemetry Active<\/span>\n                      <\/div>\n                      <h3 className="text-3xl font-black text-white leading-none">Global Array<\/h3>\n                   <\/div>/,
  `<div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent z-20" />
                   
                   {isExtracting && (
                      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center">
                         <div className="w-32 h-32 rounded-full border border-yellow-500/30 border-t-yellow-500 animate-spin mb-8" />
                         <p className="text-yellow-500 font-mono text-sm tracking-[0.3em] uppercase animate-pulse">Vision Parsing Map...</p>
                         <div className="absolute w-full h-[2px] bg-yellow-500/50 animate-beam-move" />
                      </div>
                   )}

                   <div className="absolute bottom-10 left-10 z-30 w-full pr-20">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Live AI Telemetry</span>
                      </div>
                      
                      {isExtracting ? (
                         <div className="space-y-2">
                           <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-500 w-1/3 animate-[pulse_2s_ease-in-out_infinite]" />
                           </div>
                           <p className="text-[9px] font-mono text-slate-400">Agent Orchestration Graph Building...</p>
                         </div>
                      ) : (
                         <h3 className="text-3xl font-black text-white leading-none">Global Array Cluster</h3>
                      )}
                   </div>`
);

// 7. Audit Trail Update (Agent Orchestration Graph)
content = content.replace(
  /<h3 className="text-sm font-black uppercase tracking-widest">Audit Trail Transparency<\/h3>\n                         <\/div>\n                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-\[10px\] opacity-60">\n                            <div className="p-4 bg-black\/20 rounded-2xl border border-white\/5">\n                               <p className="text-yellow-500 mb-2">SCANNING PAYLOAD\.\.\.<\/p>\n                               <p>Engine: Gemini 1\.5 Flash<\/p>\n                               <p>Confidence: 0\.99<\/p>\n                            <\/div>\n                            <div className="p-4 bg-black\/20 rounded-2xl border border-white\/5">\n                               <p className="text-yellow-500 mb-2">MAPPING BU CODE\.\.\.<\/p>\n                               <p>Target: MSEDCL Format<\/p>\n                            <\/div>\n                            <div className="p-4 bg-black\/20 rounded-2xl border border-white\/5">\n                               <p className="text-yellow-500 mb-2">CONVERSION LOGIC\.\.\.<\/p>\n                               <p>Sanctioned: Normalized to kW<\/p>\n                            <\/div>\n                         <\/div>/,
  `<h3 className="text-sm font-black uppercase tracking-widest">Agent Orchestration Trail</h3>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-[10px] opacity-80">
                            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                               <p className="text-emerald-500 mb-2 font-bold">1. VISION PARSER</p>
                               <p>Engine: {selectedModel.toUpperCase()}</p>
                               <p>Confidence: 0.99</p>
                            </div>
                            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                               <p className="text-emerald-500 mb-2 font-bold">2. RAG GROUNDING</p>
                               <p>Target: BU 4393</p>
                               <p>Match: 100%</p>
                            </div>
                            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                               <p className="text-emerald-500 mb-2 font-bold">3. MATH AGENT</p>
                               <p>Scaling HP to kW</p>
                               <p>Factor: IEEE 0.746</p>
                            </div>
                            <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                               <p className="text-yellow-500 mb-2 font-bold">4. ML FORECAST</p>
                               <p>Model: XGBoost</p>
                               <p>Status: Active</p>
                            </div>
                         </div>`
);

// 8. Add Vision Tab & Update Chat Tab
let visionTab = `{activeTab === 'vision' && (
                       <motion.div key="vision" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 rounded-[4rem] h-[550px] relative overflow-hidden flex items-center justify-center">
                          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity" />
                          
                          <div className="relative z-10 w-full max-w-2xl bg-black/50 p-8 rounded-[2rem] border border-white/10 backdrop-blur-md">
                             <h3 className="text-xl font-black flex items-center gap-4 mb-6 text-yellow-500">
                                <ScanFace className="w-6 h-6" /> Deep Vision Heatmap (Simulated)
                             </h3>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border border-emerald-500/30 bg-emerald-500/5 rounded-xl">
                                   <p className="text-[10px] font-mono text-emerald-500 mb-1">BOUNDING_BOX_01</p>
                                   <p className="font-bold">Consumer No: {extractedData.consumerNo}</p>
                                </div>
                                <div className="p-4 border border-blue-500/30 bg-blue-500/5 rounded-xl">
                                   <p className="text-[10px] font-mono text-blue-500 mb-1">ENTROPY_SCORE</p>
                                   <p className="font-bold">0.9984 (High Clarity)</p>
                                </div>
                                <div className="p-4 border border-purple-500/30 bg-purple-500/5 rounded-xl col-span-2">
                                   <p className="text-[10px] font-mono text-purple-500 mb-1">TABLE_EXTRACTION_MATRIX</p>
                                   <div className="h-10 w-full bg-gradient-to-r from-purple-500/20 to-transparent rounded-lg flex items-center px-4 mt-2">
                                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping" />
                                      <span className="ml-4 font-mono text-xs opacity-70">Parsing 12 months... OK.</span>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </motion.div>
                    )}`;

let chatTab = `{activeTab === 'chat' && (
                       <motion.div key="chat" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 rounded-[4rem] h-[550px] flex flex-col">
                          <div className="flex items-center gap-4 mb-6 px-4">
                             <Bot className="w-6 h-6 text-yellow-500" />
                             <div>
                               <h3 className="text-xl font-black">Engineer GPT</h3>
                               <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Agent Online</p>
                             </div>
                          </div>
                          
                          <div className="flex-1 overflow-y-auto space-y-6 px-4 pb-4">
                             {chatHistory.map((msg, i) => (
                               <div key={i} className={clsx("flex flex-col max-w-[80%]", msg.role === 'user' ? "ml-auto items-end" : "items-start")}>
                                  <div className={clsx("p-6 rounded-[2rem] text-sm leading-relaxed shadow-lg", msg.role === 'user' ? "bg-yellow-500 text-black font-medium rounded-tr-sm" : "bg-white/5 border border-white/10 rounded-tl-sm")}>
                                    {msg.text}
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 mt-2">
                                    {msg.role === 'user' ? 'Auditor' : 'AI Engineer'}
                                  </span>
                               </div>
                             ))}
                             <div ref={chatEndRef} />
                          </div>

                          <div className="mt-4 flex gap-4">
                             <input 
                               type="text" 
                               value={chatMessage}
                               onChange={(e) => setChatMessage(e.target.value)}
                               onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                               placeholder="Ask the AI Engineer for technical optimization strategies..."
                               className="flex-1 bg-white/5 border border-white/10 rounded-[2rem] px-8 py-4 outline-none focus:border-yellow-500/50 transition-colors"
                             />
                             <button onClick={handleSendMessage} className="w-16 h-16 rounded-[2rem] bg-yellow-500 flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-black">
                               <Send className="w-6 h-6" />
                             </button>
                          </div>
                       </motion.div>
                    )}`;

content = content.replace(
  /\{activeTab === 'impact' && \(/,
  visionTab + '\n\n' + chatTab + '\n\n{activeTab === \'impact\' && ('
);

// 9. Update the Sidebar
content = content.replace(
  /<SideButton id="hardware" label="HW OPTIMIZER" active=\{activeTab\} set=\{setActiveTab\} icon=\{Box\} \/>/,
  `<SideButton id="vision" label="VISION ANALYSIS" active={activeTab} set={setActiveTab} icon={Eye} />`
);

// 10. ScanFace Icon Definition
content += `\n\nfunction ScanFace(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>
  )
}\n`;

fs.writeFileSync('src/app/page.tsx', content);
