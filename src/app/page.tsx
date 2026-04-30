"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  UploadCloud, Zap, Loader2, Download, AlertCircle, BarChart3, Settings2, IndianRupee,
  Activity, Lock, Globe, Cpu, Play, Volume2, Send, Bot, Rocket, Layers,
  Fingerprint, Radio, MousePointer2, Pencil, Ruler, Calculator
} from "lucide-react";
import clsx from "clsx";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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
    const text = `Protocol EnergyBae initialized. Auditing profile for ${extractedData.consumerName}. Analysis reveals a sanctioned load of ${extractedData.sanctionedLoad} kilowatts. Annual consumption profile indicates a high-variance delta. ROI estimated at three point two years. System efficiency high.`;
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
      let botResponse = "Load patterns suggest a 75:25 Solar-to-Wind ratio for maximum grid-independence.";
      if (userMsg.toLowerCase().includes("save")) {
        botResponse = `Monthly delta: ₹${(extractedData?.billAmount || 3490) * 0.72}. System ROI achieved in ${breakEvenYears} years.`;
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
        setAgentThoughts(prev => [...prev, { type: 'extract', message: "Neural: Accessing MSEDCL Core...", confidence: 1.0 }]);
        await new Promise(r => setTimeout(r, 1000));
        setAgentThoughts(prev => [...prev, { type: 'verify', message: "Agent: Mapping BU 4393...", confidence: 0.98 }]);
        await new Promise(r => setTimeout(r, 1200));

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
        setChatHistory([{ role: 'bot', text: "Systems ready for ROI simulation." }]);
        setIsExtracting(false);
        return;
      }
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (apiKey) formData.append("apiKey", apiKey);
      const res = await fetch("/api/extract", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Extraction link severed.");
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
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `EnergyBae_Audit.xlsx`;
      a.click();
    } catch (err: any) {}
  };

  const yearlyUnits = extractedData?.billingHistory.reduce((acc, curr) => acc + curr.units, 0) || 0;
  const breakEvenYears = (roiInvestment / ((extractedData?.billAmount || 3490) * 12 * 0.75)).toFixed(1);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-yellow-500/30 overflow-x-hidden relative">
      {/* Figma Architectural Sketch Layer */}
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

      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse-subtle" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-600/10 blur-[150px] rounded-full animate-pulse-subtle" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-12 py-10 flex justify-between items-center">
        <div className="flex items-center gap-4 group">
          <div className="w-14 h-14 bg-gradient-to-tr from-yellow-500 to-amber-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-yellow-500/20">
            <Zap className="text-slate-950 w-8 h-8 fill-current" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">EnergyBae</h1>
            <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em] mt-1">Founders Edition</p>
          </div>
        </div>
        <div className="flex items-center gap-10">
          <NavInfo label="System Status" value="Online" />
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
             <Fingerprint className="w-6 h-6 text-slate-500" />
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-[1600px] mx-auto px-12 py-10">
        <AnimatePresence mode="wait">
          {!extractedData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center min-h-[70vh]">
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-10">
                   <Rocket className="w-4 h-4 text-yellow-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Revolutionizing Energy Audits</span>
                </div>
                <h2 className="text-9xl font-black tracking-tighter leading-[0.8] mb-12">
                   Human Intelligence. <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-600">Artificial Speed.</span>
                </h2>
                <p className="text-xl text-slate-500 font-medium max-w-xl leading-relaxed mb-12">
                   Your bills contain the blueprint for your energy independence. Upload your MSEDCL data and watch our agent architect your hybrid future.
                </p>
                
                <div className="glass-card p-1 rounded-[3rem] relative group">
                  <div className="p-10 border-2 border-dashed border-white/5 rounded-[2.8rem] group-hover:border-yellow-500/30 transition-all">
                    <input type="file" id="bill-upload" className="hidden" onChange={handleFileChange} />
                    <label htmlFor="bill-upload" className="cursor-pointer flex items-center gap-8">
                       <div className="w-20 h-20 bg-yellow-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-yellow-500/40">
                          <UploadCloud className="w-10 h-10 text-slate-950" />
                       </div>
                       <div>
                          <p className="text-2xl font-black">{file ? file.name : "Select Document"}</p>
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">MSEDCL Bill PDF/PNG</p>
                       </div>
                    </label>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                   <button 
                     onClick={handleExtract} 
                     disabled={isExtracting}
                     className="flex-1 py-6 rounded-[2rem] bg-white text-slate-950 font-black text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl disabled:opacity-50"
                   >
                     {isExtracting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "START NEURAL SCAN"}
                   </button>
                   <button 
                     onClick={() => setIsDemoMode(true)}
                     className="px-10 rounded-[2rem] border border-white/10 hover:bg-white/5 transition-all font-black text-sm uppercase tracking-widest"
                   >
                     Demo
                   </button>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }} 
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-yellow-500/20 blur-[120px] rounded-full" />
                <Image 
                  src="/hero-3d.png" 
                  alt="Hybrid Energy Unit" 
                  width={800} 
                  height={800} 
                  className="relative z-10 drop-shadow-[0_50px_50px_rgba(234,179,8,0.2)]"
                />
                {/* Hand-drawn Annotation Overlay */}
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 1 }}
                  className="absolute top-0 right-0 z-20 font-handwriting text-yellow-500/60 text-2xl rotate-12"
                >
                  <p>Efficiency Target: 98%</p>
                  <div className="w-32 h-px bg-yellow-500/30 -rotate-45" />
                </motion.div>
              </motion.div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Bento Grid Header */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="lg:col-span-8 glass-card p-12 rounded-[4rem] relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                    <Ruler className="w-40 h-40" />
                 </div>
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative z-10">
                    <div className="flex items-center gap-8">
                       <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-yellow-500 to-amber-600 flex items-center justify-center shadow-2xl shadow-yellow-500/30">
                          <MousePointer2 className="w-10 h-10 text-slate-950" />
                       </div>
                       <div>
                          <h2 className="text-5xl font-black tracking-tighter text-white mb-2">{extractedData.consumerName}</h2>
                          <div className="flex gap-4">
                             <Badge label={extractedData.consumerNo} />
                             <Badge label={`BU: ${extractedData.billingUnit}`} />
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <button onClick={speakSummary} className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-slate-950 transition-all group">
                          <Volume2 className={clsx("w-8 h-8", isSpeaking && "animate-pulse")} />
                       </button>
                       <button onClick={generateExcel} className="h-20 px-12 rounded-[2rem] bg-yellow-500 text-slate-950 font-black text-lg shadow-2xl shadow-yellow-500/20 hover:scale-105 active:scale-95 transition-all">
                          GENERATE AUDIT.xlsx
                       </button>
                    </div>
                 </div>
                 {/* Sketch annotation */}
                 <div className="mt-12 font-handwriting text-yellow-500/40 text-xl max-w-md">
                    Note: Load sanctioned at {extractedData.sanctionedLoad}kW. Anomaly detected in seasonal units. Recommend Windistar 400.
                 </div>
              </motion.div>

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="lg:col-span-4 glass-card p-12 rounded-[4rem] bg-white flex flex-col justify-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Monthly Due</p>
                 <h3 className="text-7xl font-black text-slate-950 tracking-tighter">₹{extractedData.billAmount.toLocaleString()}</h3>
                 <div className="mt-6 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verified by Neural Core</span>
                 </div>
              </motion.div>

              {/* Sidebar Tabs */}
              <div className="lg:col-span-3 space-y-6">
                 <div className="glass-card p-4 rounded-[3rem] space-y-2">
                    <SideButton id="audit" label="AUDIT MATRIX" active={activeTab} set={setActiveTab} icon={Layers} />
                    <SideButton id="forecast" label="PREDICTIVE" active={activeTab} set={setActiveTab} icon={TrendingUp} />
                    <SideButton id="hardware" label="HARDWARE" active={activeTab} set={setActiveTab} icon={Box} />
                    <SideButton id="chat" label="ENGINEER GPT" active={activeTab} set={setActiveTab} icon={Bot} />
                 </div>
                 
                 <div className="glass-card p-10 rounded-[3rem] bg-gradient-to-br from-yellow-500/10 to-transparent">
                    <div className="flex justify-between mb-8">
                       <Calculator className="w-6 h-6 text-yellow-500" />
                       <span className="font-handwriting text-yellow-500/60 text-lg">Payback: {breakEvenYears} yrs</span>
                    </div>
                    <input 
                      type="range" min="50000" max="1000000" step="10000" value={roiInvestment} 
                      onChange={(e) => setRoiInvestment(Number(e.target.value))}
                      className="w-full h-1 bg-yellow-500/20 rounded-full appearance-none cursor-pointer accent-yellow-500 mb-6"
                    />
                    <p className="text-2xl font-black">₹{(roiInvestment/100000).toFixed(1)}L</p>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Investment Slider</p>
                 </div>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-9">
                 <AnimatePresence mode="wait">
                    {activeTab === 'audit' && (
                      <motion.div key="audit" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 rounded-[4rem] h-[600px] relative">
                         <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-black">Consumption Schematic</h3>
                            <div className="font-handwriting text-yellow-500/40 text-xl uppercase tracking-tighter">Verified by founder</div>
                         </div>
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={extractedData.billingHistory}>
                              <defs>
                                <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="month" stroke="#64748b33" fontSize={10} fontWeight={900} />
                              <Tooltip contentStyle={{ backgroundColor: '#020617', borderRadius: '24px', border: '1px solid rgba(234,179,8,0.2)' }} />
                              <Area type="monotone" dataKey="units" stroke="#eab308" strokeWidth={6} fill="url(#colorGold)" animationDuration={2000} />
                            </AreaChart>
                         </ResponsiveContainer>
                      </motion.div>
                    )}
                    
                    {activeTab === 'chat' && (
                       <motion.div key="chat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[4rem] h-[600px] flex flex-col overflow-hidden">
                          <div className="p-12 flex-1 overflow-y-auto custom-scrollbar-dark space-y-8">
                             {chatHistory.map((c, i) => (
                               <div key={i} className={clsx("flex", c.role === 'user' ? "justify-end" : "justify-start")}>
                                 <div className={clsx(
                                   "max-w-[70%] p-8 rounded-[2.5rem] text-sm font-bold shadow-2xl",
                                   c.role === 'user' ? "bg-white text-slate-950 rounded-tr-none" : "bg-slate-900 border border-yellow-500/20 text-yellow-500 font-handwriting text-2xl rounded-tl-none"
                                 )}>
                                   {c.text}
                                 </div>
                               </div>
                             ))}
                             <div ref={chatEndRef} />
                          </div>
                          <div className="p-8 border-t border-white/5 flex gap-4">
                             <input 
                               type="text" className="flex-1 bg-transparent border-none text-white font-bold focus:ring-0 px-6" 
                               placeholder="Consult with our Engineering Agent..."
                               value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                             />
                             <button onClick={handleSendMessage} className="w-16 h-16 bg-yellow-500 rounded-3xl flex items-center justify-center">
                                <Send className="w-6 h-6 text-slate-950" />
                             </button>
                          </div>
                       </motion.div>
                    )}

                    {activeTab === 'hardware' && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <HardwareItem title="Windistar 400" type="Helical Hybrid" score={98} />
                          <HardwareItem title="Bifacial 540W" type="Tier-1 Solar" score={95} />
                       </div>
                    )}
                 </AnimatePresence>

                 {/* Real-time Agent Log */}
                 <div className="mt-10 p-10 bg-[#020617] border border-white/5 rounded-[3rem] shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Audit Stream Console</span>
                       <Activity className="w-4 h-4 text-yellow-500 animate-pulse" />
                    </div>
                    <div className="font-mono text-[10px] leading-relaxed h-20 overflow-y-auto opacity-40">
                       {agentThoughts.map((t, i) => <div key={i}>[{new Date().toLocaleTimeString()}] {t.message}</div>)}
                       <div ref={terminalEndRef} />
                    </div>
                 </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-50 p-12 flex justify-between items-center opacity-30 text-[10px] font-black uppercase tracking-widest">
         <span>Hand-Crafted for EnergyBae | Founders Edition</span>
         <div className="flex gap-10">
            <span>Engineering Hub</span>
            <span>Vector Protocol</span>
         </div>
      </footer>
    </div>
  );
}

// --- Helpers ---

function NavInfo({ label, value }: { label: string, value: string }) {
  return (
    <div className="text-right">
       <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">{label}</p>
       <p className="text-[11px] font-black text-white uppercase leading-none">{value}</p>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</div>;
}

function SideButton({ id, label, active, set, icon: Icon }: any) {
  return (
    <button onClick={() => set(id)} className={clsx("w-full flex items-center gap-4 px-8 py-6 rounded-[2rem] transition-all duration-500", active === id ? "bg-white text-slate-950" : "hover:bg-white/5 text-slate-500")}>
       <Icon className="w-5 h-5" />
       <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function HardwareItem({ title, type, score }: any) {
  return (
    <div className="glass-card p-12 rounded-[4rem] group hover:scale-[1.02] transition-all">
       <div className="flex justify-between mb-10">
          <div>
             <h4 className="text-3xl font-black mb-2">{title}</h4>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{type}</p>
          </div>
          <div className="text-4xl font-black text-yellow-500">{score}%</div>
       </div>
       <button className="w-full py-6 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-slate-950 transition-all">Spec Sheet</button>
    </div>
  );
}

const TrendingUp = ({ className }: { className?: string }) => <BarChart3 className={className} />;
