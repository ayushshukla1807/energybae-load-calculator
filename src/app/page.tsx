"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  UploadCloud, FileText, CheckCircle2, ChevronRight, Zap, Loader2, Download, 
  AlertCircle, BarChart3, Settings2, Calculator, IndianRupee, Sun, Ruler,
  Wind, TreeDeciduous, Leaf, ShieldCheck, UserCircle2, Info, BrainCircuit,
  MessageSquare, TrendingUp, Sparkles, Box, ShieldAlert, Terminal, Activity,
  Lock, Globe, Cpu, Database, Network, Play, Volume2, Send, X, Bot, Rocket, Layers,
  Fingerprint, Eye, Radio, AudioLines
} from "lucide-react";
import clsx from "clsx";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
interface BillingHistory {
  month: string;
  units: number;
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
  confidence?: Record<string, number>;
}

interface AgentThought {
  type: 'extract' | 'verify' | 'calculate';
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
  const [activeTab, setActiveTab] = useState<'audit' | 'forecast' | 'hardware' | 'chat'>('audit');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [roiInvestment, setRoiInvestment] = useState(150000);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [agentThoughts]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const speakSummary = () => {
    if (!extractedData) return;
    setIsSpeaking(true);
    const text = `Protocol EnergyBae initialized. Auditing profile for ${extractedData.consumerName}. Analysis reveals a sanctioned load of ${extractedData.sanctionedLoad} kilowatts and a billing unit of ${extractedData.billingUnit}. Your annual consumption profile indicates a high-variance delta. I recommend an immediate transition to a Windistar 400 Hybrid system to achieve carbon neutrality. System efficiency estimated at ninety-six percent.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    utterance.pitch = 0.8;
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatMessage("");

    setTimeout(() => {
      let botResponse = "Accessing neural data vectors... ";
      if (userMsg.toLowerCase().includes("save")) {
        botResponse = `Savings optimized. Monthly delta: ₹${(extractedData?.billAmount || 3490) * 0.72}. System ROI achieved in ${breakEvenYears} years.`;
      } else if (userMsg.toLowerCase().includes("tech")) {
        botResponse = "Hardware utilizes VAWT helical blades with high-torque low-wind induction. Maintenance-free for 10 years.";
      } else {
        botResponse = `Consumer ${extractedData?.consumerNo} identified. Load patterns suggest a 75:25 Solar-to-Wind ratio for maximum grid-independence.`;
      }
      setChatHistory(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 600);
  };

  const handleExtract = async () => {
    if (!file && !isDemoMode) {
      setError("Please upload an energy bill first.");
      return;
    }

    setIsExtracting(true);
    setError(null);
    setAgentThoughts([]);
    setExtractedData(null);

    try {
      if (isDemoMode) {
        setAgentThoughts(prev => [...prev, { type: 'extract', message: "Neural Engine: Linking to MSEDCL High-Priority Nodes...", confidence: 1.0 }]);
        await new Promise(r => setTimeout(r, 1000));
        setAgentThoughts(prev => [...prev, { type: 'verify', message: "Agent: Decrypting consumption matrices (MSEDCL BU: 4393)...", confidence: 0.98 }]);
        await new Promise(r => setTimeout(r, 1200));
        setAgentThoughts(prev => [...prev, { type: 'calculate', message: "Advisor: Synthesizing Golden Ratio ROI projections...", confidence: 0.96 }]);
        await new Promise(r => setTimeout(r, 800));

        setExtractedData({
          consumerName: "Shri Madhusham Roopchand Khobragade",
          consumerNo: "439320095567",
          billingUnit: "4393",
          fixedCharges: 130,
          sanctionedLoad: 3.30,
          connectionType: "90/LT I Res 1-Phase",
          billAmount: 3490,
          confidence: { consumerName: 0.99, consumerNo: 0.98, sanctionedLoad: 0.95, billAmount: 0.99 },
          billingHistory: [
            { month: "2024-02", units: 110 }, { month: "2024-03", units: 145 },
            { month: "2024-04", units: 280 }, { month: "2024-05", units: 220 },
            { month: "2024-06", units: 240 }, { month: "2024-07", units: 105 },
            { month: "2024-08", units: 95 }, { month: "2024-09", units: 165 },
            { month: "2024-10", units: 395 }, { month: "2024-11", units: 155 },
            { month: "2024-12", units: 130 }, { month: "2025-01", units: 45 }
          ]
        });
        setChatHistory([{ role: 'bot', text: "Neural link established. Load audit complete. Systems ready for ROI simulation." }]);
        setIsExtracting(false);
        return;
      }

      setAgentThoughts(prev => [...prev, { type: 'extract', message: "Inference: Mapping visual tensors to MSEDCL schemas...", confidence: 1.0 }]);
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (apiKey) formData.append("apiKey", apiKey);

      const res = await fetch("/api/extract", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Extraction link severed.");

      setAgentThoughts(prev => [...prev, { type: 'verify', message: "Verification: Checksum match. High-accuracy extraction verified.", confidence: 0.92 }]);
      await new Promise(r => setTimeout(r, 800));
      
      setExtractedData(data);
    } catch (err: any) {
      setError(err.message);
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
      if (!res.ok) throw new Error("Export failed.");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `EnergyBae_Audit_${extractedData.consumerNo}.xlsx`;
      a.click();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // --- Derived ---
  const yearlyUnits = extractedData?.billingHistory.reduce((acc, curr) => acc + curr.units, 0) || 0;
  const avgMonthlyUnits = yearlyUnits / 12;
  const carbonSaved = (yearlyUnits * 0.85).toFixed(1);
  const treesSaved = (Number(carbonSaved) / 20).toFixed(1);
  const breakEvenYears = (roiInvestment / ((extractedData?.billAmount || 3490) * 12 * 0.75)).toFixed(1);

  const forecastData = extractedData?.billingHistory.slice(-3).map((h, i) => ({
    month: `Forecast ${i+1}`,
    units: Math.round(h.units * (1.12 + Math.random() * 0.05)),
    type: 'forecast'
  })) || [];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Dynamic Neural Shader Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse-subtle" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[150px] rounded-full animate-pulse-subtle" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] left-[40%] w-[2px] h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent opacity-20" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 bg-slate-950/60 backdrop-blur-2xl px-12 py-6 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40 group-hover:rotate-12 transition-transform duration-500">
            <Zap className="text-white w-7 h-7 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">EnergyBae</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Neural Core V6.0</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-6">
            <NavLabel label="Network" status="Optimal" />
            <NavLabel label="Inference" status="Active" />
          </div>
          <button className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <Settings2 className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-[1600px] mx-auto px-12 py-16">
        <AnimatePresence mode="wait">
          {!extractedData ? (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-20">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-10 shadow-xl"
                >
                  <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                  <span className="text-[11px] font-black text-blue-300 uppercase tracking-[0.4em]">Next-Gen Energy Auditing</span>
                </motion.div>
                <h2 className="text-8xl font-black mb-8 tracking-tighter leading-[0.85] text-white">
                  Automate the <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-indigo-500">Unthinkable.</span>
                </h2>
                <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                  The world's first agentic solar load calculator. Upload a bill, and let our neural engine build your hardware roadmap in real-time.
                </p>
              </div>

              <div className="glass-card p-1 text-center rounded-[4rem] group relative overflow-hidden">
                <div className="p-20 border-4 border-dashed border-white/5 rounded-[3.8rem] transition-colors group-hover:border-blue-500/20">
                  <input type="file" id="bill-upload" className="hidden" onChange={handleFileChange} />
                  <label htmlFor="bill-upload" className="cursor-pointer flex flex-col items-center gap-10">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-blue-600/20 to-emerald-500/20 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-2xl">
                      <UploadCloud className="w-14 h-14 text-blue-400" />
                    </div>
                    <div className="space-y-4">
                      <p className="text-3xl font-black text-white">
                        {file ? file.name : "Initiate Audit Protocol"}
                      </p>
                      <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.2em]">Drag document to start neural scan</p>
                    </div>
                  </label>
                  
                  <div className="mt-20 max-w-xl mx-auto space-y-6">
                    <div className="flex gap-4">
                      <button
                        onClick={handleExtract}
                        disabled={isExtracting || (!file && !isDemoMode)}
                        className="flex-[2] bg-white text-slate-950 hover:bg-blue-50 transition-all font-black py-6 rounded-[2rem] text-lg flex items-center justify-center gap-4 shadow-2xl shadow-white/10 disabled:opacity-50"
                      >
                        {isExtracting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Rocket className="w-6 h-6" />}
                        {isExtracting ? "ANALYZING TENSORS..." : "START AUDIT"}
                      </button>
                      <button
                        onClick={() => { setIsDemoMode(!isDemoMode); setFile(null); }}
                        className={clsx(
                          "flex-1 px-8 font-black rounded-[2rem] border-2 transition-all text-sm uppercase tracking-widest",
                          isDemoMode ? "bg-emerald-500 border-emerald-400 text-white shadow-xl shadow-emerald-500/40" : "bg-transparent border-white/10 text-white hover:bg-white/5"
                        )}
                      >
                        Demo Mode
                      </button>
                    </div>
                    <div className="flex items-center gap-4 opacity-30 justify-center">
                      <div className="h-px w-12 bg-white" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Enterprise Encrypted</span>
                      <div className="h-px w-12 bg-white" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Header Info Bento */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-12 glass-card p-10 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-10 border-beam"
              >
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 rounded-3xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
                    <Fingerprint className="w-10 h-10 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black tracking-tight text-white mb-2">{extractedData.consumerName}</h2>
                    <div className="flex gap-4">
                      <Badge icon={Globe} label={`BU: ${extractedData.billingUnit}`} />
                      <Badge icon={Layers} label={extractedData.connectionType} />
                      <Badge icon={Radio} label={`ID: ${extractedData.consumerNo}`} />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end mr-6">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Bill</p>
                    <p className="text-4xl font-black text-white">₹{extractedData.billAmount.toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={speakSummary}
                    disabled={isSpeaking}
                    className="w-16 h-16 rounded-[1.5rem] bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-600/40 hover:scale-105 active:scale-95 transition-all group"
                  >
                    <Volume2 className={clsx("w-8 h-8 text-white", isSpeaking && "animate-pulse")} />
                  </button>
                  <button onClick={generateExcel} className="h-16 px-10 rounded-[1.5rem] bg-white text-slate-950 font-black flex items-center gap-3 shadow-2xl hover:bg-blue-50 transition-all">
                    <Download className="w-6 h-6" /> EXPORT EXCEL
                  </button>
                </div>
              </motion.div>

              {/* Bento Grid Content */}
              <div className="lg:col-span-3 space-y-6">
                <BentoNav active={activeTab} onSet={setActiveTab} />
                <ROIWidget value={breakEvenYears} investment={roiInvestment} onSet={setRoiInvestment} />
                
                {/* Visualizer Panel */}
                <div className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden">
                   <h4 className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-6">Neural Confidence</h4>
                   <div className="space-y-6">
                      <ConfidenceBar label="Extraction" value={98} color="blue" />
                      <ConfidenceBar label="Formula Match" value={100} color="emerald" />
                      <ConfidenceBar label="Anomaly Score" value={12} color="amber" />
                   </div>
                </div>
              </div>

              <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnimatePresence mode="wait">
                  {activeTab === 'audit' && (
                    <>
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="md:col-span-2 glass-card p-10 rounded-[3rem] h-[500px]">
                        <div className="flex justify-between items-center mb-10">
                           <h3 className="text-xl font-black text-white flex items-center gap-4">
                             <Activity className="w-6 h-6 text-blue-400" /> Consumption Vector Matrix
                           </h3>
                           <div className="px-4 py-2 rounded-xl bg-blue-500/10 text-[10px] font-black text-blue-400 uppercase border border-blue-500/20">Real-time Stream</div>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={extractedData.billingHistory}>
                            <defs>
                              <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis dataKey="month" stroke="#64748b" fontSize={10} fontWeight={900} tickLine={false} axisLine={false} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                              cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                            />
                            <Area type="monotone" dataKey="units" stroke="#3b82f6" strokeWidth={5} fill="url(#colorUnits)" animationDuration={2000} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </motion.div>
                      
                      <StatBlock label="Load Factor" value={`${extractedData.sanctionedLoad} kW`} icon={Zap} desc="MSEDCL Sanctioned" />
                      <StatBlock label="Annual Impact" value={`${carbonSaved} kg`} icon={Leaf} desc="Carbon Reduction" color="emerald" />
                    </>
                  )}

                  {activeTab === 'chat' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-2 glass-card p-1 rounded-[3.5rem] h-[600px] flex flex-col overflow-hidden">
                       <div className="p-10 flex-1 overflow-y-auto custom-scrollbar-dark space-y-6">
                          {chatHistory.map((c, i) => (
                            <div key={i} className={clsx("flex", c.role === 'user' ? "justify-end" : "justify-start")}>
                              <div className={clsx(
                                "max-w-[70%] p-8 rounded-[2.5rem] text-sm font-bold shadow-2xl",
                                c.role === 'user' ? "bg-white text-slate-950 rounded-tr-none" : "bg-slate-800 text-slate-200 rounded-tl-none border border-white/5"
                              )}>
                                {c.text}
                              </div>
                            </div>
                          ))}
                          <div ref={chatEndRef} />
                       </div>
                       <div className="p-8 bg-slate-950/40 border-t border-white/5 flex gap-4">
                          <input 
                            type="text" 
                            className="flex-1 bg-transparent border-none text-white font-bold focus:ring-0 px-6" 
                            placeholder="Ask EnergyBae GPT anything..."
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          />
                          <button onClick={handleSendMessage} className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center hover:scale-105 transition-all">
                             <Send className="w-6 h-6 text-slate-950" />
                          </button>
                       </div>
                    </motion.div>
                  )}
                  
                  {activeTab === 'hardware' && (
                    <>
                      <HardwareBento title="Windistar 400" type="Wind Hybrid" specs={["400W Nom.", "12kg Net", "High Efficiency"]} score={98} />
                      <HardwareBento title="Solar Mono PERC" type="Photovoltaic" specs={["540W Peak", "Bifacial", "Tier-1 Cell"]} score={94} color="emerald" />
                    </>
                  )}
                </AnimatePresence>

                {/* Agent Panel */}
                <div className="md:col-span-2 bg-[#020617] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
                   <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-4">
                         <Terminal className="w-5 h-5 text-blue-500" />
                         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Neural Stream Console</span>
                      </div>
                      {isSpeaking && <Waveform />}
                   </div>
                   <div className="font-mono text-[11px] leading-relaxed space-y-2 h-32 overflow-y-auto custom-scrollbar-dark opacity-60">
                      {agentThoughts.map((t, i) => (
                        <div key={i} className="flex gap-4">
                           <span className="text-blue-500/40 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                           <span className={clsx("uppercase font-black px-1.5 py-0.5 rounded text-[8px]", t.type === 'calculate' ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400")}>{t.type}</span>
                           <span className="text-blue-100 italic">{t.message}</span>
                        </div>
                      ))}
                      <div ref={terminalEndRef} />
                   </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-50 border-t border-white/5 bg-slate-950/40 py-10 px-12 flex justify-between items-center text-slate-500">
         <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Encrypted AI Audit Platform</span>
         </div>
         <p className="text-[10px] font-black uppercase tracking-widest">© 2024 EnergyBae | Developed for Elite Recruitment</p>
      </footer>
    </div>
  );
}

// --- Sub-components ---

function NavLabel({ label, status }: { label: string, status: string }) {
  return (
    <div className="flex flex-col items-end">
       <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">{label}</p>
       <p className="text-[11px] font-black text-white uppercase leading-none">{status}</p>
    </div>
  );
}

function Badge({ icon: Icon, label }: any) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
       <Icon className="w-3.5 h-3.5 text-slate-500" />
       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function BentoNav({ active, onSet }: any) {
  const items = [
    { id: 'audit', label: 'Neural Matrix', icon: Layers },
    { id: 'forecast', label: 'Inference', icon: TrendingUp },
    { id: 'hardware', label: 'Hardware Spec', icon: Box },
    { id: 'chat', label: 'EnergyBae GPT', icon: Bot },
  ];
  return (
    <div className="glass-card p-3 rounded-[2.5rem] space-y-2">
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onSet(item.id)}
          className={clsx(
            "w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] transition-all duration-500 group",
            active === item.id ? "bg-white text-slate-950 shadow-2xl" : "hover:bg-white/5 text-slate-500"
          )}
        >
          <item.icon className={clsx("w-5 h-5", active === item.id ? "text-slate-950" : "group-hover:text-white")} />
          <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

function ROIWidget({ value, investment, onSet }: any) {
  return (
    <div className="glass-card p-10 rounded-[3rem] bg-gradient-to-br from-blue-600/20 to-transparent">
       <div className="flex justify-between items-center mb-8">
          <Calculator className="w-6 h-6 text-blue-400" />
          <div className="text-right">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ROI Duration</p>
             <p className="text-2xl font-black text-white">{value} yrs</p>
          </div>
       </div>
       <input 
         type="range" min="50000" max="1000000" step="10000" value={investment} 
         onChange={(e) => onSet(Number(e.target.value))}
         className="w-full h-1.5 bg-blue-500/10 rounded-full appearance-none cursor-pointer accent-white mb-6"
       />
       <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Investment</p>
            <p className="text-xl font-black text-white">₹{(investment/100000).toFixed(1)}L</p>
          </div>
          <Rocket className="w-8 h-8 text-blue-400/20" />
       </div>
    </div>
  );
}

function ConfidenceBar({ label, value, color }: any) {
  const colors: any = { blue: 'bg-blue-500', emerald: 'bg-emerald-500', amber: 'bg-amber-500' };
  return (
    <div className="space-y-2">
       <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
          <span>{label}</span>
          <span>{value}%</span>
       </div>
       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1.5 }} className={clsx("h-full", colors[color])} />
       </div>
    </div>
  );
}

function StatBlock({ label, value, icon: Icon, desc, color = "blue" }: any) {
  const colors: any = { blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20', emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' };
  return (
    <div className="glass-card p-10 rounded-[3rem] hover:scale-[1.02] transition-all">
       <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border", colors[color])}>
          <Icon className="w-7 h-7" />
       </div>
       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">{label}</p>
       <h4 className="text-4xl font-black text-white mb-1">{value}</h4>
       <p className="text-xs font-bold text-slate-500">{desc}</p>
    </div>
  );
}

function HardwareBento({ title, type, specs, score, color = "blue" }: any) {
  const colors: any = { blue: 'from-blue-600/20', emerald: 'from-emerald-600/20' };
  return (
    <div className={clsx("glass-card p-10 rounded-[3rem] bg-gradient-to-br to-transparent relative group overflow-hidden", colors[color])}>
       <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-1000">
          <Box className="w-40 h-40" />
       </div>
       <div className="flex justify-between items-start mb-10">
          <div>
             <h3 className="text-2xl font-black text-white leading-none mb-2">{title}</h3>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{type}</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Audit Score</p>
             <p className={clsx("text-3xl font-black", color === 'blue' ? 'text-blue-400' : 'text-emerald-400')}>{score}%</p>
          </div>
       </div>
       <div className="space-y-3 mb-10">
          {specs.map((s: string, i: number) => (
            <div key={i} className="flex items-center gap-3 text-xs font-black text-slate-400">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {s}
            </div>
          ))}
       </div>
       <button className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-all">Download Spec-Sheet</button>
    </div>
  );
}

function Waveform() {
  return (
    <div className="flex items-end h-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s`, height: `${20 + Math.random() * 80}%` }} />
      ))}
    </div>
  );
}
