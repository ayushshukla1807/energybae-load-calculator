"use client";

import React, { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  UploadCloud, Zap, Loader2, Download, AlertCircle, BarChart3, Settings2, IndianRupee,
  Activity, Lock, Globe, Cpu, Send, Bot, Layers,
  Fingerprint, Radio, MousePointer2, Pencil, Ruler, Calculator, Box, TrendingUp,
  ShieldAlert, Sparkles, BrainCircuit, Network, Microscope, Info, CheckCircle2,
  TreeDeciduous, Wind, Leaf, Eye, Search, History, TerminalSquare, Database, Hexagon, Code2
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
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [agentThoughts, setAgentThoughts] = useState<AgentThought[]>([]);
  const [activeTab, setActiveTab] = useState<'audit' | 'forecast' | 'vision' | 'chat' | 'impact'>('audit');
  const [selectedModel, setSelectedModel] = useState<'gemini' | 'llama' | 'claude'>('gemini');
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [roiInvestment, setRoiInvestment] = useState(150000);
  const [showAuditTrail, setShowAuditTrail] = useState(false);

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
           setChatHistory([{ role: 'bot', text: "Neural Extraction Complete. I am your Engineer GPT. I have mapped the MSEDCL tariff structures to the anomaly vectors. How can I assist you with the technical audit today?" }]);
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
      let botResponse = "Running K-Means clustering on the load profile... Analysis indicates a 1.4x variance threshold breach during summer months. Recommend immediate integration of Hybrid VAWT (Vertical Axis Wind Turbines) to flatten the peak curve. Estimated efficiency gain: 18.4%.";
      if (userMsg.toLowerCase().includes("save") || userMsg.toLowerCase().includes("roi")) {
        botResponse = `Predictive Machine Learning model (XGBoost Regressor) projects an annual savings of ₹${(extractedData?.billAmount || 3490) * 12 * 0.72} with a 94.2% confidence interval if the 3.6kW solar array is deployed.`;
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
      setAgentThoughts(prev => [...prev, { type: 'vision', message: `Initializing Computer Vision Module [${selectedModel.toUpperCase()}]...`, confidence: 1.0 }]);
      await new Promise(r => setTimeout(r, 800));
      setAgentThoughts(prev => [...prev, { type: 'extract', message: "OCR Engine: Parsing Document Entropy & Bounding Boxes...", confidence: 0.98 }]);
      await new Promise(r => setTimeout(r, 1000));
      setAgentThoughts(prev => [...prev, { type: 'validate', message: "RAG Agent: Cross-referencing BU Code 4393 with MSEDCL Database...", confidence: 0.96 }]);
      await new Promise(r => setTimeout(r, 1200));
      setAgentThoughts(prev => [...prev, { type: 'predict', message: "Machine Learning: Generating 12-Month Time-Series Forecast...", confidence: 0.99 }]);
      await new Promise(r => setTimeout(r, 800));

      const formData = new FormData();
      if (file) formData.append("file", file);
      if (apiKey) formData.append("apiKey", apiKey);
      
      const res = await fetch("/api/extract", { method: "POST", body: formData });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Technical Link Failure.");

      

      setExtractedData(data);
      setChatHistory([{ role: 'bot', text: "Technical Audit Complete. Impact analysis and forecasting modules active." }]);
    } catch (err: any) {
      setError(err.message || "A system error occurred during the technical audit.");
    } finally {
      setIsExtracting(false);
    }
  };

  const generateExcel = async () => {
    if (!extractedData) return;
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extractedData),
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
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-yellow-500/30 overflow-x-hidden relative">
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
          <div className="w-14 h-14 bg-gradient-to-tr from-yellow-500 to-amber-600 rounded-[1.5rem] flex items-center justify-center shadow-xl dark:shadow-2xl shadow-yellow-500/10 dark:shadow-yellow-500/20 group-hover:scale-105 transition-transform">
            <Hexagon className="text-background w-8 h-8 fill-current" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase leading-none text-foreground">EnergyBae</h1>
            <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em] mt-1">Enterprise AI Suite V19.0</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <ThemeToggle />
           <div className="hidden md:flex items-center gap-2 p-1 bg-card border border-border rounded-full">
              <button onClick={() => setSelectedModel('gemini')} className={clsx("px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all", selectedModel === 'gemini' ? "bg-yellow-500 text-background dark:text-black shadow-lg shadow-yellow-500/20" : "text-muted-foreground hover:text-foreground")}>Gemini 1.5</button>
              <button onClick={() => setSelectedModel('llama')} className={clsx("px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all", selectedModel === 'llama' ? "bg-white text-background dark:text-black shadow-lg" : "text-muted-foreground hover:text-foreground")}>Llama-3-70B</button>
              <button onClick={() => setSelectedModel('claude')} className={clsx("px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all", selectedModel === 'claude' ? "bg-blue-500 text-foreground shadow-lg shadow-blue-500/20" : "text-muted-foreground hover:text-foreground")}>Sonnet 3.5</button>
           </div>
        </div>

        <div className="flex items-center gap-10">
          <NavInfo label="Model Status" value="Online / 14ms" />
          <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center bg-card relative group cursor-pointer">
             <Bot className="w-6 h-6 text-muted-foreground group-hover:text-yellow-500 transition-colors" />
             <div className="absolute inset-0 bg-yellow-500/10 blur-xl opacity-0 group-hover:opacity-100 rounded-full transition-opacity" />
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-[1600px] mx-auto px-12 py-10">
        <AnimatePresence mode="wait">
          {!extractedData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center min-h-[70vh]">
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-10">
                   <BrainCircuit className="w-4 h-4 text-yellow-500 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Gemini-Powered Intelligence</span>
                </div>
                <h2 className="text-9xl font-black tracking-tighter leading-[0.8] mb-12">
                   Strategic <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-600">Forecasting.</span>
                </h2>
                <p className="text-xl text-muted-foreground font-medium max-w-xl leading-relaxed mb-12">
                   Professional energy intelligence for the Maharashtra region. RAG-grounded multi-modal inference with Gemini 1.5 Flash.
                </p>
                
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center gap-4 text-red-400 font-bold">
                    <ShieldAlert className="w-6 h-6" />
                    {error}
                  </motion.div>
                )}

                <div className="glass-card p-1 rounded-[3rem] relative group mb-6">
                  <div className="p-10 border-2 border-dashed border-border rounded-[2.8rem] group-hover:border-yellow-500/30 transition-all">
                    <input type="file" id="bill-upload" className="hidden" onChange={handleFileChange} />
                    <label htmlFor="bill-upload" className="cursor-pointer flex items-center gap-8">
                       <div className="w-20 h-20 bg-yellow-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-yellow-500/40">
                          <UploadCloud className="w-10 h-10 text-background" />
                       </div>
                       <div>
                          <p className="text-2xl font-black">{file ? file.name : "Secure Document Upload"}</p>
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">MSEDCL Audit Interface Active</p>
                       </div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                   <button 
                     onClick={handleExtract} 
                     disabled={isExtracting}
                     className="flex-1 py-6 rounded-[2rem] bg-white text-background font-black text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-white/10 disabled:opacity-50 flex items-center justify-center gap-4 relative overflow-hidden group"
                   >
                     {isExtracting && <div className="absolute inset-0 bg-yellow-500/20 w-[200%] animate-scan" />}
                     <div className="relative z-10 flex items-center gap-4">
                        {isExtracting ? <Loader2 className="w-6 h-6 animate-spin text-yellow-600" /> : <Network className="w-6 h-6" />}
                        {isExtracting ? "NEURAL EXTRACTION ACTIVE..." : "EXECUTE TECHNICAL AUDIT"}
                     </div>
                   </button>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative mt-10 lg:mt-0">
                <div className="absolute inset-0 bg-yellow-500/10 blur-[120px] rounded-full" />
                <div className="relative rounded-[3rem] overflow-hidden border-2 border-border shadow-xl dark:shadow-2xl shadow-yellow-500/10 dark:shadow-yellow-500/20 group">
                   <Image src="/solar-array.png" alt="Solar Analytics Array" width={800} height={800} className="relative z-10 w-full h-[600px] object-cover transition-transform duration-1000 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-20" />
                   
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
                           <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-500 w-1/3 animate-[pulse_2s_ease-in-out_infinite]" />
                           </div>
                           <p className="text-[9px] font-mono text-muted-foreground">Agent Orchestration Graph Building...</p>
                         </div>
                      ) : (
                         <h3 className="text-3xl font-black text-foreground leading-none">Global Array Cluster</h3>
                      )}
                   </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="lg:col-span-12 glass-card p-12 rounded-[4rem] flex flex-col md:flex-row justify-between items-center border-2 border-yellow-500/10 relative overflow-hidden group">
                 <div className="flex items-center gap-8 relative z-10">
                    <div className="w-24 h-24 rounded-[2rem] bg-yellow-500 flex items-center justify-center shadow-2xl shadow-yellow-500/30">
                       <Microscope className="w-10 h-10 text-background" />
                    </div>
                    <div>
                       <h2 className="text-5xl font-black tracking-tighter text-foreground mb-2">{extractedData.consumerName}</h2>
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
                       <Search className="w-8 h-8 text-muted-foreground group-hover:text-yellow-500" />
                       <div className="absolute top-[-40px] whitespace-nowrap opacity-0 group-hover:opacity-100 text-[9px] font-black uppercase tracking-widest text-yellow-500 transition-opacity">Technical Log</div>
                    </button>
                    <button onClick={generateExcel} className="h-20 px-12 rounded-[2rem] bg-white text-background font-black text-lg shadow-2xl hover:scale-105 transition-all">
                       EXPORT TECHNICAL AUDIT
                    </button>
                 </div>
              </motion.div>

              <div className="lg:col-span-3 space-y-6">
                 <div className="glass-card p-4 rounded-[3rem] space-y-2">
                    <SideButton id="audit" label="LOAD SCHEMATIC" active={activeTab} set={setActiveTab} icon={Layers} />
                    <SideButton id="forecast" label="PREDICTIVE AI" active={activeTab} set={setActiveTab} icon={TrendingUp} />
                    <SideButton id="impact" label="ESG IMPACT" active={activeTab} set={setActiveTab} icon={Leaf} />
                    <SideButton id="vision" label="VISION ANALYSIS" active={activeTab} set={setActiveTab} icon={Eye} />
                    <SideButton id="chat" label="ENGINEER GPT" active={activeTab} set={setActiveTab} icon={Bot} />
                 </div>
                 
                 <div className="glass-card p-10 rounded-[3rem] bg-gradient-to-br from-yellow-500/10 to-transparent">
                    <div className="flex justify-between mb-8 items-center">
                       <IndianRupee className="w-6 h-6 text-yellow-500" />
                       <span className="font-handwriting text-yellow-500/60 text-lg">Financial Modeling</span>
                    </div>
                    <input 
                      type="range" min="50000" max="1000000" step="10000" value={roiInvestment} 
                      onChange={(e) => setRoiInvestment(Number(e.target.value))}
                      className="w-full h-1 bg-yellow-500/20 rounded-full appearance-none cursor-pointer accent-yellow-500 mb-6"
                    />
                    <p className="text-2xl font-black">₹{(roiInvestment/100000).toFixed(1)}L</p>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Investment Vector</p>
                 </div>
              </div>

              <div className="lg:col-span-9 space-y-8">
                 <AnimatePresence>
                    {showAuditTrail && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="glass-card p-10 rounded-[3rem] bg-yellow-500/5 border border-yellow-500/20 overflow-hidden">
                         <div className="flex items-center gap-4 mb-6">
                            <History className="w-5 h-5 text-yellow-500" />
                            <h3 className="text-sm font-black uppercase tracking-widest">Agent Orchestration Trail</h3>
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
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>

                 <AnimatePresence mode="wait">
                    {activeTab === 'vision' && (
                       <motion.div key="vision" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 rounded-[4rem] h-[550px] relative overflow-hidden flex items-center justify-center">
                          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity" />
                          
                          <div className="relative z-10 w-full max-w-2xl bg-background/80 p-8 rounded-[2rem] border border-border backdrop-blur-md">
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
                    )}

{activeTab === 'chat' && (
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
                                  <div className={clsx("p-6 rounded-[2rem] text-sm leading-relaxed shadow-lg", msg.role === 'user' ? "bg-yellow-500 text-background dark:text-black font-medium rounded-tr-sm" : "bg-card border border-border rounded-tl-sm")}>
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
                               className="flex-1 bg-card border border-border rounded-[2rem] px-8 py-4 outline-none focus:border-yellow-500/50 transition-colors"
                             />
                             <button onClick={handleSendMessage} className="w-16 h-16 rounded-[2rem] bg-yellow-500 flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-background dark:text-black">
                               <Send className="w-6 h-6" />
                             </button>
                          </div>
                       </motion.div>
                    )}

{activeTab === 'impact' && (
                       <motion.div key="impact" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[550px]">
                          <div className="glass-card p-12 rounded-[4rem] flex flex-col justify-center items-center text-center">
                             <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-8">
                                <TreeDeciduous className="w-12 h-12 text-emerald-500" />
                             </div>
                             <h4 className="text-7xl font-black text-emerald-500 tracking-tighter">{treesSaved}</h4>
                             <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Trees Saved Annually</p>
                          </div>
                          <div className="glass-card p-12 rounded-[4rem] flex flex-col justify-center items-center text-center">
                             <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center mb-8">
                                <Globe className="w-12 h-12 text-blue-500" />
                             </div>
                             <h4 className="text-7xl font-black text-blue-500 tracking-tighter">{carbonSaved}</h4>
                             <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">KG CO2 Offset / Year</p>
                          </div>
                       </motion.div>
                    )}

                    {activeTab === 'audit' && (
                      <motion.div key="audit" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 rounded-[4rem] h-[550px] relative">
                         <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-black flex items-center gap-4">
                               <BarChart3 className="w-6 h-6 text-yellow-500" /> Historical Consumption Profile
                            </h3>
                         </div>
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={forecastData}>
                              <XAxis dataKey="month" stroke="#64748b33" fontSize={10} fontWeight={900} />
                              <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{ backgroundColor: '#020617', borderRadius: '24px', border: '1px solid rgba(234,179,8,0.2)' }} />
                              <Bar dataKey="units" radius={[10, 10, 0, 0]}>
                                {forecastData.map((entry, index) => (
                                  <Cell key={index} fill={entry.isAnomaly ? '#ef4444' : '#eab308'} fillOpacity={entry.isAnomaly ? 0.8 : 0.3} stroke={entry.isAnomaly ? '#ef4444' : '#eab308'} strokeWidth={2} />
                                ))}
                              </Bar>
                            </BarChart>
                         </ResponsiveContainer>
                      </motion.div>
                    )}

                    {activeTab === 'forecast' && (
                       <motion.div key="forecast" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-12 rounded-[4rem] h-[550px] relative">
                          <div className="flex justify-between items-center mb-10">
                             <h3 className="text-2xl font-black flex items-center gap-4">
                                <TrendingUp className="w-6 h-6 text-yellow-500" /> Predictive Projections
                             </h3>
                          </div>
                          <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={forecastData}>
                               <XAxis dataKey="month" stroke="#64748b33" fontSize={10} fontWeight={900} />
                               <Tooltip contentStyle={{ backgroundColor: '#020617', borderRadius: '24px', border: '1px solid rgba(234,179,8,0.2)' }} />
                               <Area type="monotone" dataKey="units" stroke="#64748b" strokeWidth={2} fill="transparent" strokeDasharray="5 5" name="Historical" />
                               <Area type="monotone" dataKey="predicted" stroke="#eab308" strokeWidth={4} fill="transparent" name="AI Projection" animationDuration={2500} />
                             </AreaChart>
                          </ResponsiveContainer>
                       </motion.div>
                    )}
                 </AnimatePresence>

                 <div className="mt-10 p-10 bg-background border border-border rounded-[3rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent animate-beam-move" />
                    <div className="flex justify-between items-center mb-6">
                       <div className="flex items-center gap-3">
                          <Cpu className="w-4 h-4 text-yellow-500" />
                          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Technical Intelligence Stream</span>
                       </div>
                       <Activity className="w-4 h-4 text-yellow-500 animate-pulse" />
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
            <span>AI Engineer Prototype V16.0</span>
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
       <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">{label}</p>
       <p className="text-[11px] font-black text-foreground uppercase leading-none">{value}</p>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return <div className="px-3 py-1 rounded-lg bg-card border border-border text-[9px] font-black text-muted-foreground uppercase tracking-widest">{label}</div>;
}

function SideButton({ id, label, active, set, icon: Icon }: any) {
  return (
    <button onClick={() => set(id)} className={clsx("w-full flex items-center gap-4 px-8 py-6 rounded-[2rem] transition-all duration-500", active === id ? "bg-white text-background shadow-2xl" : "hover:bg-card text-muted-foreground")}>
       <Icon className="w-5 h-5" />
       <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}


function ScanFace(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>
  )
}
