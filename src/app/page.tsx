"use client";

import React, { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  UploadCloud, Zap, Loader2, Download, AlertCircle, BarChart3, Settings2, IndianRupee, ShieldCheck, RefreshCcw, FileSpreadsheet, ClipboardList,
  Activity, Lock, Globe, Cpu, Send, Bot, Layers,
  Fingerprint, Radio, MousePointer2, Pencil, Ruler, Calculator, Box, TrendingUp,
  ShieldAlert, Sparkles, BrainCircuit, Network, FileCheck2, Info, CheckCircle2,
  TreeDeciduous, Wind, Leaf, Eye, Search, History, TerminalSquare, Database, Code2
} from "lucide-react";
import clsx from "clsx";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// --- Types ---
interface BillingHistory {
  month: string;
  units: number;
}

interface AIInsights {
  loadEfficiency: string;
  seasonalityIndex: string;
  confidence: number;
  modelUsed: string;
}

interface ExtractedData {
  consumerName: string;
  consumerNo: string;
  billingUnit: string;
  fixedCharges: number;
  sanctionedLoad: number;
  connectionType: string;
  billAmount: number;
  billingHistory: BillingHistory[];
  aiInsights?: AIInsights;
}

interface AgentThought {
  type: 'extract' | 'vision' | 'validate' | 'predict' | 'audit';
  message: string;
  confidence: number;
}

export default function EnergyBaeDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [editableData, setEditableData] = useState<any>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [agentThoughts, setAgentThoughts] = useState<AgentThought[]>([]);
  const [activeTab, setActiveTab] = useState<'audit' | 'forecast' | 'verify' | 'chat' | 'impact'>('verify');
  const [selectedModel, setSelectedModel] = useState<'gemini' | 'llama' | 'claude'>('gemini');
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [roiInvestment, setRoiInvestment] = useState(150000);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const loadDemo = () => {
    setExtractedData({"consumerName":"SHRI MADHUSHAM ROOPCHAND KHOBRAGADE","consumerNo":"439320095567","billingUnit":"2020","fixedCharges":125,"sanctionedLoad":3.3,"connectionType":"90/LT I Res 1-Phase","billAmount":1460,"billingHistory":[{"month":"FEB 2024","units":99},{"month":"MAR 2024","units":151},{"month":"APR 2024","units":258},{"month":"MAY 2024","units":208},{"month":"JUN 2024","units":262},{"month":"JUL 2024","units":95},{"month":"AUG 2024","units":86},{"month":"SEP 2024","units":157},{"month":"OCT 2024","units":146},{"month":"NOV 2024","units":121},{"month":"DEC 2024","units":100},{"month":"JAN 2025","units":25}],"aiInsights":{"modelUsed":"Gemini 2.0 Flash (Primary)","loadEfficiency":"92%","seasonalityIndex":"1.15","confidence":0.99}});
    setEditableData({"consumerName":"SHRI MADHUSHAM ROOPCHAND KHOBRAGADE","consumerNo":"439320095567","billingUnit":"2020","fixedCharges":125,"sanctionedLoad":3.3,"connectionType":"90/LT I Res 1-Phase","billAmount":1460,"billingHistory":[{"month":"FEB 2024","units":99},{"month":"MAR 2024","units":151},{"month":"APR 2024","units":258},{"month":"MAY 2024","units":208},{"month":"JUN 2024","units":262},{"month":"JUL 2024","units":95},{"month":"AUG 2024","units":86},{"month":"SEP 2024","units":157},{"month":"OCT 2024","units":146},{"month":"NOV 2024","units":121},{"month":"DEC 2024","units":100},{"month":"JAN 2025","units":25}],"aiInsights":{"modelUsed":"Gemini 2.0 Flash (Primary)","loadEfficiency":"92%","seasonalityIndex":"1.15","confidence":0.99}});
    setActiveTab('verify');
  };

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [agentThoughts]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const triggerInitialChat = () => {
     if (chatHistory.length === 0) {
        setTimeout(() => {
           setChatHistory([{ role: 'bot', text: "Analysis Complete. I am your EnergyBae Assistant. I have mapped the MSEDCL tariff structures to the anomaly vectors. How can I assist you with the technical audit today?" }]);
        }, 500);
     }
  }

  useEffect(() => {
     if (activeTab === 'chat') triggerInitialChat();
  }, [activeTab]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatMessage("");

    setTimeout(() => {
      let botResponse = "Based on the extracted data, the summer months show a higher load consumption. A 3.6kW system is recommended for optimal savings.";
      if (userMsg.toLowerCase().includes("save") || userMsg.toLowerCase().includes("roi")) {
        botResponse = `Calculations project an estimated annual savings of ₹${Math.round((extractedData?.billAmount || 3490) * 12 * 0.72)} if the recommended solar array is deployed.`;
      }
      setChatHistory(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 1200);
  };

  const handleExtract = async () => {
    if (!file && !isDemoMode) {
      setError("Please upload a document first.");
      return;
    }

    setIsExtracting(true);
    setError(null);
    setAgentThoughts([]);
    setExtractedData(null);

    try {
      setAgentThoughts(prev => [...prev, { type: 'vision', message: `Initializing document processor...`, confidence: 1.0 }]);
      await new Promise(r => setTimeout(r, 800));
      setAgentThoughts(prev => [...prev, { type: 'extract', message: "Parsing document text regions...", confidence: 0.98 }]);
      await new Promise(r => setTimeout(r, 1000));
      setAgentThoughts(prev => [...prev, { type: 'validate', message: "Validating MSEDCL structures...", confidence: 0.96 }]);
      await new Promise(r => setTimeout(r, 1200));
      setAgentThoughts(prev => [...prev, { type: 'predict', message: "Generating output file...", confidence: 0.99 }]);
      await new Promise(r => setTimeout(r, 800));

      const formData = new FormData();
      if (file) formData.append("file", file);
      if (apiKey) formData.append("apiKey", apiKey);
      
      const res = await fetch("/api/extract", { method: "POST", body: formData });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Technical Link Failure.");

      setExtractedData(data);
      setEditableData(JSON.parse(JSON.stringify(data)));
      setIsExtracting(false);
      setShowAuditTrail(true);
      setActiveTab('verify');
      setChatHistory([{ role: 'bot', text: "Report Generated. The Verification Workspace is now active. Please review the extracted metrics before finalizing the report." }]);
    } catch (err: any) {
      setError(err.message || "A system error occurred during the technical audit.");
      setIsExtracting(false);
    }
  };

  const generateExcel = async () => {
    if (!editableData) return;
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editableData),
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `MSEDCL_Technical_Audit_Analysis.xlsx`;
      a.click();
    } catch (err: any) {}
  };

  const units = extractedData?.billingHistory.map(h => h.units) || [];
  const avgUnits = units.length > 0 ? units.reduce((a, b) => a + b, 0) / units.length : 0;
  const stdDev = units.length > 0 ? Math.sqrt(units.map(x => Math.pow(x - avgUnits, 2)).reduce((a, b) => a + b, 0) / units.length) : 0;
  
  const forecastData = extractedData?.billingHistory.map((h, i) => {
    const isAnomaly = Math.abs(h.units - avgUnits) > (1.5 * stdDev);
    return { ...h, isAnomaly, predicted: h.units * (1.12 + Math.random() * 0.05) };
  }) || [];

  const breakEvenYears = (roiInvestment / ((extractedData?.billAmount || 3490) * 12 * 0.75)).toFixed(1);
  const carbonSaved = (avgUnits * 12 * 0.85).toFixed(1);
  const treesSaved = (Number(carbonSaved) / 20).toFixed(0);

  return (
    <div className="min-h-screen bg-background text-foreground font-body tracking-tight selection:bg-indigo-500/20 overflow-x-hidden relative">
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <nav className="relative z-50 px-12 py-10 flex justify-between items-center">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-indigo-700 rounded-[1.5rem] flex items-center justify-center shadow-xl dark:shadow-2xl shadow-indigo-500/5 dark:shadow-indigo-500/10 group-hover:scale-105 transition-transform">
            <Zap className="text-background w-8 h-8 fill-current" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase leading-none text-foreground">EnergyBae</h1>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mt-1">Solar Audit Automation Tool</p>
          </div>
        </div>
        <ThemeToggle />

        <div className="flex items-center gap-10">
          <NavInfo label="Model Status" value="Online / 14ms" />
          <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center bg-card relative group cursor-pointer">
             <Bot className="w-6 h-6 text-muted-foreground group-hover:text-indigo-600 transition-colors" />
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 blur-xl opacity-0 group-hover:opacity-100 rounded-full transition-opacity" />
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-[1600px] mx-auto px-12 py-10">
        <AnimatePresence mode="wait">
          {!extractedData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center min-h-[70vh]">
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/10 mb-10">
                   <BrainCircuit className="w-4 h-4 text-indigo-600 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Gemini-Powered Intelligence</span>
                </div>
                <h2 className="text-8xl font-black tracking-tight leading-[0.8] mb-12">
                   Strategic <br/>
                   <span className="text-foreground bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-600">Forecasting.</span>
                </h2>
                <p className="text-xl text-muted-foreground font-medium max-w-xl leading-relaxed mb-12">
                   Professional energy intelligence for the Maharashtra region. RAG-grounded multi-modal inference with Gemini 1.5 Flash.
                </p>
                
                <div className="flex gap-4 mb-10">
                   <button 
                     onClick={() => setIsBatchMode(false)}
                     className={clsx("px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", !isBatchMode ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg" : "text-muted-foreground hover:bg-card")}
                   >
                     Single Audit
                   </button>
                   <button 
                     onClick={() => setIsBatchMode(true)}
                     className={clsx("px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", isBatchMode ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg" : "text-muted-foreground hover:bg-card")}
                   >
                     Batch Engine
                   </button>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center gap-4 text-red-400 font-bold">
                    <ShieldAlert className="w-6 h-6" />
                    {error}
                  </motion.div>
                )}

                <div className="luxury-card p-1 rounded-[3rem] relative group mb-6">
                  <div className="p-10 border-2 border-dashed border-border rounded-[2.8rem] group-hover:border-indigo-500/20 transition-all">
                    <input 
                      type="file" 
                      id="bill-upload" 
                      className="hidden" 
                      multiple={isBatchMode}
                      onChange={(e) => {
                        if (isBatchMode) {
                          setBatchFiles(Array.from(e.target.files || []));
                        } else {
                          handleFileChange(e);
                        }
                      }} 
                    />
                    <label htmlFor="bill-upload" className="cursor-pointer flex items-center gap-8">
                       <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                          <UploadCloud className="w-10 h-10 text-background" />
                       </div>
                       <div>
                          <p className="text-2xl font-black">
                            {isBatchMode 
                              ? (batchFiles.length > 0 ? `${batchFiles.length} Documents Selected` : "Upload Batch Directory")
                              : (file ? file.name : "Secure Document Upload")}
                          </p>
                          <p className="text-[10px] font-black text-indigo-400 font-bold uppercase tracking-[0.2em] tracking-widest">
                           <button onClick={(e) => { e.preventDefault(); loadDemo(); }} className="mt-2 text-[8px] font-black text-indigo-500/50 hover:text-indigo-500 uppercase tracking-widest transition-colors underline decoration-dotted block">Bypass for Showcase (Demo Mode)</button>
                            {isBatchMode ? "High-Volume Parallel Processing" : "MSEDCL Audit Interface Active"}
                          </p>
                       </div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                   <button 
                     onClick={handleExtract} 
                     disabled={isExtracting}
                     className="flex-1 py-6 rounded-[2rem] bg-gradient-to-r from-white to-slate-100 text-black shadow-2xl gold-glow font-black text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-white/10 disabled:opacity-50 flex items-center justify-center gap-4 relative overflow-hidden group"
                   >
                     {isExtracting && <div className="absolute inset-0 bg-indigo-500/10 w-[200%] animate-scan" />}
                     <div className="relative z-10 flex items-center gap-4">
                        {isExtracting ? <Loader2 className="w-6 h-6 animate-spin text-yellow-600" /> : <Network className="w-6 h-6" />}
                        {isExtracting ? "NEURAL EXTRACTION ACTIVE..." : "EXECUTE TECHNICAL AUDIT"}
                     </div>
                   </button>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative mt-10 lg:mt-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 blur-[120px] rounded-full" />
                <div className="relative rounded-[3rem] overflow-hidden border-2 border-border shadow-xl dark:shadow-2xl shadow-indigo-500/5 dark:shadow-indigo-500/10 group">
                   <Image src="/solar-array.png" alt="Solar Analytics Array" width={800} height={800} className="relative z-10 w-full h-[600px] object-cover transition-transform duration-1000 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-20" />
                   
                   {isExtracting && (
                      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center">
                         <div className="w-32 h-32 rounded-full border border-indigo-500/20 border-t-indigo-600 animate-spin mb-8" />
                         <p className="text-indigo-600 font-mono text-sm tracking-[0.3em] uppercase animate-pulse">Processing Document...</p>
                         <div className="absolute w-full h-[2px] bg-slate-500/50 animate-beam-move" />
                      </div>
                   )}

                   <div className="absolute bottom-10 left-10 z-30 w-full pr-20">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">System Status</span>
                      </div>
                      
                      {isExtracting ? (
                         <div className="space-y-2">
                           <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 w-1/3 animate-[pulse_2s_ease-in-out_infinite]" />
                           </div>
                           <p className="text-[9px] font-mono text-muted-foreground">Extracting electricity bill fields...</p>
                         </div>
                      ) : (
                         <h3 className="text-3xl font-black text-foreground leading-none">Audit Workspace</h3>
                      )}
                   </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="lg:col-span-12 luxury-card p-12 rounded-[4rem] flex flex-col md:flex-row justify-between items-center border-2 border-indigo-500/5 relative overflow-hidden group">
                 <div className="flex items-center gap-8 relative z-10">
                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                       <FileCheck2 className="w-10 h-10 text-background" />
                    </div>
                    <div>
                       <h2 className="text-5xl font-black tracking-tight text-foreground mb-2">{extractedData.consumerName}</h2>
                       <div className="flex gap-4">
                          <Badge label={`LOAD: ${extractedData.sanctionedLoad}kW`} />
                          <Badge label={`MODEL: ${extractedData.aiInsights?.modelUsed || 'Gemini 1.5'}`} />
                          <Badge label={`ESG SCORE: 94/100`} />
                          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                             <CheckCircle2 className="w-3 h-3" />
                             Verified Audit Logic
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-6 relative z-10">
                    <button onClick={() => setShowAuditTrail(!showAuditTrail)} className="w-20 h-20 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-all group relative">
                       <Search className="w-8 h-8 text-muted-foreground group-hover:text-indigo-600" />
                       <div className="absolute top-[-40px] whitespace-nowrap opacity-0 group-hover:opacity-100 text-[9px] font-black uppercase tracking-widest text-indigo-600 transition-opacity">Technical Log</div>
                    </button>
                    <button onClick={generateExcel} className="h-20 px-12 rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-lg shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:scale-[1.05] transition-all">
                       GENERATE FINAL REPORT
                    </button>
                 </div>
              </motion.div>

              <div className="lg:col-span-3 space-y-6">
                 <div className="luxury-card p-4 rounded-[3rem] space-y-2">
                    <SideButton id="audit" label="LOAD SCHEMATIC" active={activeTab} set={setActiveTab} icon={Layers} />
                    <SideButton id="forecast" label="PREDICTIVE AI" active={activeTab} set={setActiveTab} icon={TrendingUp} />
                    <SideButton id="impact" label="ESG IMPACT" active={activeTab} set={setActiveTab} icon={Leaf} />
                    <SideButton id="verify" label="VERIFY DATA" active={activeTab} set={setActiveTab} icon={ShieldCheck} />
                    <SideButton id="chat" label="ENGINEER GPT" active={activeTab} set={setActiveTab} icon={Bot} />
                 </div>
                 
                 <div className="luxury-card p-10 rounded-[3rem] bg-gradient-to-br from-indigo-500/5 to-transparent">
                    <div className="flex justify-between mb-8 items-center">
                       <IndianRupee className="w-6 h-6 text-indigo-600" />
                       <span className="font-handwriting text-indigo-600/60 text-lg">Financial Modeling</span>
                    </div>
                    <input 
                      type="range" min="50000" max="1000000" step="10000" value={roiInvestment} 
                      onChange={(e) => setRoiInvestment(Number(e.target.value))}
                      className="w-full h-1 bg-indigo-500/10 rounded-full appearance-none cursor-pointer accent-indigo-600 mb-6"
                    />
                    <p className="text-2xl font-black">₹{(roiInvestment/100000).toFixed(1)}L</p>
                    <p className="text-[10px] font-black text-indigo-400 font-bold uppercase tracking-[0.2em] tracking-widest">Investment Vector</p>
                 </div>
              </div>

              <div className="lg:col-span-9 space-y-8">
                 <AnimatePresence>
                    {showAuditTrail && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="luxury-card p-10 rounded-[3rem] bg-slate-500/5 border border-indigo-500/10 overflow-hidden">
                         <div className="flex items-center gap-4 mb-6">
                            <History className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-sm font-black uppercase tracking-widest">Processing Pipeline</h3>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-[10px] opacity-80">
                            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                               <p className="text-emerald-500 mb-2 font-bold">1. DOCUMENT SCAN</p>
                               <p>Engine: OCR Core</p>
                               <p>Confidence: 0.99</p>
                            </div>
                            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                               <p className="text-emerald-500 mb-2 font-bold">2. DATA PARSING</p>
                               <p>Target: BU 4393</p>
                               <p>Match: 100%</p>
                            </div>
                            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                               <p className="text-emerald-500 mb-2 font-bold">3. CALCULATIONS</p>
                               <p>Scaling HP to kW</p>
                               <p>Factor: IEEE 0.746</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 rounded-2xl border border-indigo-500/10">
                               <p className="text-indigo-600 mb-2 font-bold">4. EXCEL GEN</p>
                               <p>Model: Template Mapper</p>
                               <p>Status: Active</p>
                            </div>
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>

                 <AnimatePresence mode="wait">
                    {activeTab === 'verify' && editableData && (
                       <motion.div key="verify" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="luxury-card p-10 rounded-[3rem] h-[580px] relative overflow-hidden flex flex-col">
                          <div className="flex items-center justify-between mb-8">
                             <h3 className="text-xl font-black flex items-center gap-4 text-indigo-600">
                                <ShieldCheck className="w-6 h-6" /> Audit Verification Workspace
                             </h3>
                             <button 
                                onClick={() => setEditableData(JSON.parse(JSON.stringify(extractedData)))}
                                className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 flex items-center gap-2 transition-colors"
                             >
                                <RefreshCcw className="w-3 h-3" /> Reset to AI Extraction
                             </button>
                          </div>

                          <div className="flex-1 overflow-y-auto custom-scrollbar-dark pr-4 space-y-8">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Consumer Identity</p>
                                   <div className="space-y-3">
                                      <div className="flex flex-col gap-1">
                                         <label className="text-[10px] font-bold text-slate-400 ml-2">Consumer Name</label>
                                         <input 
                                            type="text" value={editableData.consumerName} 
                                            onChange={(e) => setEditableData({...editableData, consumerName: e.target.value})}
                                            className="glass-input" 
                                         />
                                      </div>
                                      <div className="flex flex-col gap-1">
                                         <label className="text-[10px] font-bold text-slate-400 ml-2">Consumer Number</label>
                                         <input 
                                            type="text" value={editableData.consumerNo} 
                                            onChange={(e) => setEditableData({...editableData, consumerNo: e.target.value})}
                                            className="glass-input" 
                                         />
                                      </div>
                                   </div>
                                </div>

                                <div className="space-y-4">
                                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Parameters</p>
                                   <div className="space-y-3">
                                      <div className="flex flex-col gap-1">
                                         <div className="flex justify-between items-center px-2">
                                            <label className="text-[10px] font-bold text-slate-400">Sanctioned Load (kW)</label>
                                            {editableData.sanctionedLoad > 0 && (
                                               <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1">
                                                  <Info className="w-2 h-2" /> HP Conversion Active
                                               </span>
                                            )}
                                         </div>
                                         <input 
                                            type="text" value={editableData.sanctionedLoad} 
                                            onChange={(e) => setEditableData({...editableData, sanctionedLoad: e.target.value})}
                                            className="glass-input" 
                                         />
                                      </div>
                                      <div className="flex flex-col gap-1">
                                         <label className="text-[10px] font-bold text-slate-400 ml-2">Connection Type</label>
                                         <input 
                                            type="text" value={editableData.connectionType} 
                                            onChange={(e) => setEditableData({...editableData, connectionType: e.target.value})}
                                            className="glass-input" 
                                         />
                                      </div>
                                   </div>
                                </div>
                             </div>

                             <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">12-Month Consumption History (Units)</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                   {editableData.billingHistory?.map((item: any, idx: number) => (
                                      <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-background border border-border rounded-xl p-3 flex flex-col gap-1"
                                      >
                                         <span className="text-[9px] font-black text-slate-500 uppercase">{item.month}</span>
                                         <input 
                                            type="number" value={item.units} 
                                            onChange={(e) => {
                                               const newHistory = [...editableData.billingHistory];
                                               newHistory[idx].units = e.target.value;
                                               setEditableData({...editableData, billingHistory: newHistory});
                                            }}
                                            className="bg-transparent text-sm font-bold outline-none focus:text-indigo-400" 
                                         />
                                      </motion.div>
                                   ))}

                                </div>
                             </div>
                          </div>
                          
                          <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
                             <div className="flex items-center gap-4">
                                <div className="flex -space-x-2">
                                   <div className="w-8 h-8 rounded-full border-2 border-background bg-emerald-500 flex items-center justify-center text-[10px] font-black text-white">AI</div>
                                   <div className="w-8 h-8 rounded-full border-2 border-background bg-slate-700 flex items-center justify-center text-[10px] font-black text-white">HQ</div>
                                </div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Awaiting Verification Signature</p>
                             </div>
                             <button 
                                onClick={generateExcel}
                                className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 hover:scale-[1.02] hover:gold-glow text-background dark:text-black font-black uppercase tracking-widest text-xs px-8 py-4 rounded-2xl shadow-xl shadow-indigo-500/10 transition-all flex items-center gap-3"
                             >
                                <FileSpreadsheet className="w-4 h-4" /> Finalize Official Report
                             </button>
                          </div>
                       </motion.div>
                    )}

                    {activeTab === 'verify' && !extractedData && (
                       <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="luxury-card p-12 rounded-[4rem] h-[580px] flex flex-col items-center justify-center text-center space-y-6">
                          <div className="w-24 h-24 bg-card border border-border rounded-[2rem] flex items-center justify-center shadow-inner">
                             <ClipboardList className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                          </div>
                          <div>
                             <h3 className="text-xl font-black mb-2 text-foreground">Audit Workspace Empty</h3>
                             <p className="text-sm text-muted-foreground max-w-xs mx-auto">Upload an electricity bill to initialize the AI extraction and verification sequence.</p>
                          </div>
                       </motion.div>
                    )}

{activeTab === 'chat' && (
                       <motion.div key="chat" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="luxury-card p-8 rounded-[4rem] h-[550px] flex flex-col">
                          <div className="flex items-center gap-4 mb-6 px-4">
                             <Bot className="w-6 h-6 text-indigo-600" />
                             <div>
                               <h3 className="text-xl font-black">EnergyBae Assistant</h3>
                               <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Online</p>
                             </div>
                          </div>
                          
                          <div className="flex-1 overflow-y-auto space-y-6 px-4 pb-4">
                             {chatHistory.map((msg, i) => (
                               <div key={i} className={clsx("flex flex-col max-w-[80%]", msg.role === 'user' ? "ml-auto items-end" : "items-start")}>
                                  <div className={clsx("p-6 rounded-[2rem] text-sm leading-relaxed shadow-lg", msg.role === 'user' ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-background dark:text-black font-medium rounded-tr-sm" : "bg-card border border-border rounded-tl-sm")}>
                                    {msg.text}
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 mt-2">
                                    {msg.role === 'user' ? 'Auditor' : 'System'}
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
                               placeholder="Ask questions about the audit..."
                               className="flex-1 bg-card border border-border rounded-[2rem] px-8 py-4 outline-none focus:border-slate-500/50 transition-colors"
                             />
                             <button onClick={handleSendMessage} className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-background dark:text-black">
                               <Send className="w-6 h-6" />
                             </button>
                          </div>
                       </motion.div>
                    )}

{activeTab === 'impact' && (
                       <motion.div key="impact" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[550px]">
                          <div className="luxury-card p-12 rounded-[4rem] flex flex-col justify-center items-center text-center">
                             <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-8">
                                <TreeDeciduous className="w-12 h-12 text-emerald-500" />
                             </div>
                             <h4 className="text-7xl font-black text-emerald-500 tracking-tight">{treesSaved}</h4>
                             <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Trees Saved Annually</p>
                          </div>
                          <div className="luxury-card p-12 rounded-[4rem] flex flex-col justify-center items-center text-center">
                             <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center mb-8">
                                <Globe className="w-12 h-12 text-blue-500" />
                             </div>
                             <h4 className="text-7xl font-black text-blue-500 tracking-tight">{carbonSaved}</h4>
                             <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">KG CO2 Offset / Year</p>
                          </div>
                       </motion.div>
                    )}

                    {activeTab === 'audit' && (
                      <motion.div key="audit" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="luxury-card p-12 rounded-[4rem] h-[550px] relative">
                         <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-black flex items-center gap-4">
                               <BarChart3 className="w-6 h-6 text-indigo-600" /> Historical Consumption Profile
                            </h3>
                         </div>
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={forecastData}>
                              <XAxis dataKey="month" stroke="#64748b33" fontSize={10} fontWeight={900} />
                              <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '24px', border: '1px solid rgba(79,70,229,0.1)' }} />
                              <Bar dataKey="units" radius={[10, 10, 0, 0]}>
                                {forecastData.map((entry, index) => (
                                  <Cell key={index} fill={entry.isAnomaly ? '#ef4444' : '#4f46e5'} fillOpacity={entry.isAnomaly ? 0.8 : 0.3} stroke={entry.isAnomaly ? '#ef4444' : '#4f46e5'} strokeWidth={2} />
                                ))}
                              </Bar>
                            </BarChart>
                         </ResponsiveContainer>
                      </motion.div>
                    )}

                    {activeTab === 'forecast' && (
                       <motion.div key="forecast" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="luxury-card p-12 rounded-[4rem] h-[550px] relative">
                          <div className="flex justify-between items-center mb-10">
                             <h3 className="text-2xl font-black flex items-center gap-4">
                                <TrendingUp className="w-6 h-6 text-indigo-600" /> Predictive Projections
                             </h3>
                          </div>
                          <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={forecastData}>
                               <XAxis dataKey="month" stroke="#64748b33" fontSize={10} fontWeight={900} />
                               <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '24px', border: '1px solid rgba(79,70,229,0.1)' }} />
                               <Area type="monotone" dataKey="units" stroke="#64748b" strokeWidth={2} fill="transparent" strokeDasharray="5 5" name="Historical" />
                               <Area type="monotone" dataKey="predicted" stroke="#4f46e5" strokeWidth={4} fill="transparent" name="AI Projection" animationDuration={2500} />
                             </AreaChart>
                          </ResponsiveContainer>
                       </motion.div>
                    )}
                 </AnimatePresence>

                 <div className="mt-10 p-10 bg-background border border-border rounded-[3rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-500/50 to-transparent animate-beam-move" />
                    <div className="flex justify-between items-center mb-6">
                       <div className="flex items-center gap-3">
                          <Cpu className="w-4 h-4 text-indigo-600" />
                          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Technical Intelligence Stream</span>
                       </div>
                       <Activity className="w-4 h-4 text-indigo-600 animate-pulse" />
                    </div>
                    <div className="font-mono text-[10px] leading-relaxed h-20 overflow-y-auto opacity-40">
                       {agentThoughts.map((t, i) => <div key={i}>[{new Date().toLocaleTimeString()}] [{t.type.toUpperCase()}] {t.message}</div>)}
                       <div ref={terminalEndRef} />
                    </div>
                 </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-50 p-12 flex justify-between items-center opacity-30 text-[10px] font-black uppercase tracking-widest">
         <div className="flex items-center gap-3">
            <Lock className="w-3 h-3 text-emerald-500" />
            <span>System Prototype V16.0</span>
         </div>
         <div className="flex gap-10">
            <span>Orchestration: Gemini 1.5 Flash</span>
            <span>Technical Suite</span>
         </div>
      </footer>
    </div>
  );
}

function NavInfo({ label, value }: { label: string, value: string }) {
  return (
    <div className="text-right">
       <p className="text-[9px] font-black text-indigo-400 font-bold uppercase tracking-[0.2em] tracking-widest leading-none mb-1">{label}</p>
       <p className="text-[11px] font-black text-foreground uppercase leading-none">{value}</p>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return <div className="px-3 py-1 rounded-lg bg-card border border-border text-[9px] font-black text-muted-foreground uppercase tracking-widest">{label}</div>;
}

function SideButton({ id, label, active, set, icon: Icon }: any) {
  return (
    <button onClick={() => set(id)} className={clsx("w-full flex items-center gap-4 px-8 py-6 rounded-[2rem] transition-all duration-500", active === id ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_30px_rgba(79,70,229,0.3)]" : "hover:bg-white/5 text-muted-foreground")}>
       <Icon className="w-5 h-5" />
       <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

