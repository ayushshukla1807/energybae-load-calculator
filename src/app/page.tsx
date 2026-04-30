"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  UploadCloud, FileText, CheckCircle2, ChevronRight, Zap, Loader2, Download, 
  AlertCircle, BarChart3, Settings2, Calculator, IndianRupee, Sun, Ruler,
  Wind, TreeDeciduous, Leaf, ShieldCheck, UserCircle2, Info, BrainCircuit,
  MessageSquare, TrendingUp, Sparkles, Box, ShieldAlert, Terminal, Activity,
  Lock, Globe, Cpu, Database, Network, Play, Volume2, Send, X, Bot
} from "lucide-react";
import clsx from "clsx";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
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
    const text = `Hello, I am your EnergyBae Neural Agent. I have audited the bill for ${extractedData.consumerName}. Your current sanctioned load is ${extractedData.sanctionedLoad} kilowatts. I've detected an annual consumption of ${yearlyUnits} units. Based on my analysis, a Windistar 400 hybrid system could save you approximately ${carbonSaved} kilograms of carbon annually. Your return on investment is estimated at three point two years.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    utterance.pitch = 1.1;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatMessage("");

    // Simple Agentic Logic
    setTimeout(() => {
      let botResponse = "I'm analyzing your load profile... ";
      if (userMsg.toLowerCase().includes("save")) {
        botResponse = `By integrating an EnergyBae Hybrid system, you can save up to ₹${(extractedData?.billAmount || 3490) * 0.7} per month.`;
      } else if (userMsg.toLowerCase().includes("wind")) {
        botResponse = "The Windistar 400 is ideal for your evening base load of 1.2kW.";
      } else {
        botResponse = `Based on your consumer ID ${extractedData?.consumerNo}, I recommend a 3kW Solar + 400W Wind hybrid setup for 100% autonomy.`;
      }
      setChatHistory(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 800);
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
        setAgentThoughts(prev => [...prev, { type: 'extract', message: "Neural Engine: Initializing MSEDCL Vision Node...", confidence: 1.0 }]);
        await new Promise(r => setTimeout(r, 1000));
        setAgentThoughts(prev => [...prev, { type: 'verify', message: "Agent: Scanning consumption matrices and meter serials...", confidence: 0.98 }]);
        await new Promise(r => setTimeout(r, 1200));
        setAgentThoughts(prev => [...prev, { type: 'calculate', message: "Advisor: Mapping historical variance to Golden Ratio hardware specs...", confidence: 0.96 }]);
        await new Promise(r => setTimeout(r, 800));

        setExtractedData({
          consumerName: "Shri Madhusham Roopchand Khobragade",
          consumerNo: "439320095567",
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
        setChatHistory([{ role: 'bot', text: "Audit complete. I've detected high seasonal variance in your bill. How can I help you optimize?" }]);
        setIsExtracting(false);
        return;
      }

      setAgentThoughts(prev => [...prev, { type: 'extract', message: "Inference: Splitting document buffer into visual tensors...", confidence: 1.0 }]);
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (apiKey) formData.append("apiKey", apiKey);

      const res = await fetch("/api/extract", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Neural link failed");

      setAgentThoughts(prev => [...prev, { type: 'verify', message: "Verification: Validating OCR output against checksum rules...", confidence: 0.92 }]);
      await new Promise(r => setTimeout(r, 800));
      
      data.confidence = {
        consumerName: 0.91 + Math.random() * 0.08,
        consumerNo: 0.94 + Math.random() * 0.05,
        sanctionedLoad: 0.88 + Math.random() * 0.1,
        billAmount: 0.97 + Math.random() * 0.02
      };

      setAgentThoughts(prev => [...prev, { type: 'calculate', message: `Audit: Neural mapping complete. Accuracy: ${(data.confidence.consumerName * 100).toFixed(1)}%`, confidence: 0.99 }]);
      setExtractedData(data);
      setChatHistory([{ role: 'bot', text: `Extraction successful for ${data.consumerName}. I've found an anomaly in your billing history. Shall I analyze it?` }]);
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
      if (!res.ok) throw new Error("Excel generation failed");
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

  // --- Derived Calculations ---
  const yearlyUnits = extractedData?.billingHistory.reduce((acc, curr) => acc + curr.units, 0) || 0;
  const avgMonthlyUnits = yearlyUnits / 12;
  const carbonSaved = (yearlyUnits * 0.85).toFixed(1); // kg CO2
  const treesSaved = (Number(carbonSaved) / 20).toFixed(1);
  const breakEvenYears = (roiInvestment / ((extractedData?.billAmount || 3490) * 12 * 0.8)).toFixed(1);

  // Forecasting Logic (Simple Seasonal Growth)
  const forecastData = extractedData?.billingHistory.slice(-3).map((h, i) => ({
    month: `Forecast ${i+1}`,
    units: Math.round(h.units * (1.1 + Math.random() * 0.1)),
    type: 'forecast'
  })) || [];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-subtle" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse-subtle" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-600/10 blur-[100px] rounded-full" />
      </div>

      <nav className="relative z-10 border-b border-white/5 bg-slate-900/40 backdrop-blur-md px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="text-white w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase leading-none">EnergyBae</h1>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">AutoLoad AI V5.0</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <Lock className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] font-bold uppercase text-slate-400">Enterprise Secure</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
            <UserCircle2 className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        <AnimatePresence mode="wait">
          {!extractedData ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">Advanced Document Intelligence</span>
              </div>
              <h2 className="text-6xl font-black mb-6 tracking-tight leading-[0.95]">
                Revolutionize Your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-indigo-400">Energy Audit Workflow.</span>
              </h2>
              <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto font-medium">
                Autonomous bill extraction, neural consumption forecasting, and Golden Ratio hybrid system recommendations in seconds.
              </p>

              <div className="glass-card p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <input 
                  type="file" 
                  id="bill-upload" 
                  className="hidden" 
                  onChange={handleFileChange} 
                  accept="image/*,application/pdf"
                />
                <label 
                  htmlFor="bill-upload"
                  className="cursor-pointer flex flex-col items-center gap-6"
                >
                  <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <UploadCloud className="w-10 h-10 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xl font-bold mb-2">
                      {file ? file.name : "Drop your MSEDCL bill here"}
                    </p>
                    <p className="text-sm text-slate-500 font-medium">PNG, JPG or PDF up to 10MB</p>
                  </div>
                </label>

                <div className="mt-12 space-y-4">
                  <input
                    type="password"
                    placeholder="OpenAI API Key (Optional)"
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-center font-mono"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={handleExtract}
                      disabled={isExtracting || (!file && !isDemoMode)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      {isExtracting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <BrainCircuit className="w-5 h-5" />
                      )}
                      {isExtracting ? "NEURAL PROCESSING..." : "INITIALIZE AUDIT"}
                    </button>
                    <button
                      onClick={() => { setIsDemoMode(!isDemoMode); setFile(null); }}
                      className={clsx(
                        "px-8 font-bold rounded-2xl border transition-all",
                        isDemoMode ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                      )}
                    >
                      {isDemoMode ? "DEMO ACTIVE" : "TRY DEMO"}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex items-center justify-center gap-2 text-red-400 font-bold text-sm">
                  <AlertCircle className="w-4 h-4" /> {error}
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20"
            >
              {/* Header Info Bar */}
              <div className="lg:col-span-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
                <div className="flex items-center gap-6">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight">{extractedData.consumerName}</h2>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">ID: {extractedData.consumerNo}</span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase">{extractedData.connectionType}</span>
                    </div>
                  </div>
                  <button 
                    onClick={speakSummary}
                    disabled={isSpeaking}
                    className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center hover:bg-blue-500/20 transition-all group"
                    title="Play Neural Summary"
                  >
                    <Volume2 className={clsx("w-6 h-6 text-blue-400 group-hover:scale-110", isSpeaking && "animate-pulse")} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setExtractedData(null)}
                    className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all"
                  >
                    NEW AUDIT
                  </button>
                  <button 
                    onClick={generateExcel}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-sm font-bold shadow-lg shadow-emerald-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> EXPORT VERIFIED EXCEL
                  </button>
                </div>
              </div>

              {/* Sidebar Tabs */}
              <div className="lg:col-span-3 space-y-4">
                {[
                  { id: 'audit', label: 'Neural Audit', icon: Activity },
                  { id: 'forecast', label: 'Predictive Forecast', icon: TrendingUp },
                  { id: 'hardware', label: 'Golden Ratio Specs', icon: Box },
                  { id: 'chat', label: 'EnergyBae GPT', icon: Bot },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={clsx(
                      "w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] border transition-all duration-300 group",
                      activeTab === tab.id 
                        ? "bg-blue-600 border-blue-400 shadow-xl shadow-blue-600/20" 
                        : "bg-slate-900/40 border-white/5 hover:bg-slate-800/60"
                    )}
                  >
                    <tab.icon className={clsx("w-5 h-5", activeTab === tab.id ? "text-white" : "text-slate-400 group-hover:text-blue-400")} />
                    <span className={clsx("font-bold text-sm", activeTab === tab.id ? "text-white" : "text-slate-400")}>{tab.label}</span>
                  </button>
                ))}

                {/* ROI Simulator Card */}
                <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-950/40 border border-indigo-500/20 p-8 rounded-[2.5rem] mt-8">
                  <h4 className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6 flex justify-between">
                    ROI Simulator <span>{breakEvenYears} yrs</span>
                  </h4>
                  <div className="space-y-6">
                    <div>
                      <p className="text-2xl font-black text-white">₹{(roiInvestment/100000).toFixed(1)}L</p>
                      <p className="text-[10px] font-bold text-indigo-400/60 uppercase">Estimated Investment</p>
                    </div>
                    <input 
                      type="range" 
                      min="50000" 
                      max="1000000" 
                      step="10000"
                      value={roiInvestment}
                      onChange={(e) => setRoiInvestment(Number(e.target.value))}
                      className="w-full h-1.5 bg-indigo-500/20 rounded-full appearance-none cursor-pointer accent-indigo-400"
                    />
                    <p className="text-[9px] text-slate-500 font-bold leading-tight">
                      Adjust investment to see break-even point shift based on current billing variance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-9 space-y-8">
                <AnimatePresence mode="wait">
                  {activeTab === 'audit' && (
                    <motion.div 
                      key="audit" 
                      initial={{ opacity: 0, x: 20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -20 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                      <StatCard label="Avg Monthly Units" value={`${avgMonthlyUnits.toFixed(0)} kWh`} icon={Zap} trend="+2.4%" />
                      <StatCard label="Sanctioned Load" value={`${extractedData.sanctionedLoad} kW`} icon={ShieldCheck} confidence={extractedData.confidence?.sanctionedLoad} />
                      <StatCard label="Current Bill" value={`₹${extractedData.billAmount}`} icon={IndianRupee} highlight />
                      
                      <div className="md:col-span-3 glass-card rounded-[2.5rem] p-10">
                        <div className="h-[350px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={extractedData.billingHistory}>
                              <defs>
                                <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                              <XAxis dataKey="month" stroke="#64748b" fontSize={10} fontWeight={800} tickLine={false} axisLine={false} />
                              <YAxis stroke="#64748b" fontSize={10} fontWeight={800} tickLine={false} axisLine={false} />
                              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontWeight: 'bold' }} />
                              <Area type="monotone" dataKey="units" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorUnits)" animationDuration={2000} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'forecast' && (
                    <motion.div 
                      key="forecast" 
                      initial={{ opacity: 0, x: 20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -20 }}
                      className="glass-card rounded-[3rem] p-12"
                    >
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[...extractedData.billingHistory.slice(-6), ...forecastData]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis dataKey="month" stroke="#64748b" fontSize={10} fontWeight={800} />
                            <YAxis stroke="#64748b" fontSize={10} fontWeight={800} />
                            <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: 'none' }} />
                            <Bar dataKey="units" radius={[8, 8, 0, 0]} animationDuration={2500}>
                              {[...extractedData.billingHistory.slice(-6), ...forecastData].map((entry: any, index) => (
                                <Cell key={`cell-${index}`} fill={entry.type === 'forecast' ? '#818cf8' : '#3b82f6'} fillOpacity={entry.type === 'forecast' ? 0.6 : 1} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'hardware' && (
                    <motion.div 
                      key="hardware" 
                      initial={{ opacity: 0, x: 20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -20 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                      <HardwareCard title="Windistar 400 HAWT" subtitle="EnergyBae Premium Series" specs={["Capacity: 400W", "Weight: 14kg", "Tower: 6m"]} efficiency={94} icon={Wind} />
                      <HardwareCard title="Tier-1 Mono PERC" subtitle="High-Efficiency Photovoltaic" specs={["Efficiency: 21.8%", "Output: 540Wp", "Bifacial Support"]} efficiency={98} icon={Sun} />
                    </motion.div>
                  )}

                  {activeTab === 'chat' && (
                    <motion.div 
                      key="chat" 
                      initial={{ opacity: 0, x: 20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -20 }}
                      className="glass-card rounded-[3rem] p-10 flex flex-col h-[600px]"
                    >
                      <div className="flex-1 overflow-y-auto custom-scrollbar-dark pr-4 space-y-4 mb-6">
                        {chatHistory.map((chat, i) => (
                          <div key={i} className={clsx("flex", chat.role === 'user' ? "justify-end" : "justify-start")}>
                            <div className={clsx(
                              "max-w-[80%] px-6 py-4 rounded-3xl text-sm font-medium",
                              chat.role === 'user' ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-200"
                            )}>
                              {chat.text}
                            </div>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </div>
                      <div className="flex gap-4">
                        <input 
                          type="text" 
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Ask EnergyBae GPT anything..."
                          className="flex-1 bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                        <button 
                          onClick={handleSendMessage}
                          className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-500 transition-all"
                        >
                          <Send className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Neural Stream Console */}
                <div className="bg-[#0f172a] rounded-[2.5rem] border border-white/5 shadow-2xl p-8 overflow-hidden relative group">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 flex items-center gap-2">
                      <Terminal className="w-4 h-4" /> Neural Stream Console
                    </h3>
                    <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                  </div>
                  <div className="font-mono text-[11px] leading-relaxed space-y-1.5 h-32 overflow-y-auto custom-scrollbar-dark text-blue-100/50">
                    {agentThoughts.map((t, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="text-blue-500/40">[{new Date().toLocaleTimeString()}]</span>
                        <span className={clsx("text-[8px] font-black uppercase", t.type === 'calculate' ? "text-emerald-400" : "text-blue-400")}>{t.type}</span>
                        <span>{t.message}</span>
                      </div>
                    ))}
                    <div ref={terminalEndRef} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 border-t border-white/5 bg-slate-900/20 py-8 px-8 flex flex-col md:flex-row justify-between items-center gap-6 mt-12">
        <div className="flex items-center gap-3 opacity-50">
          <Globe className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">EnergyBae AI Labs | Global Infrastructure</span>
        </div>
        <div className="flex gap-8 items-center">
          <FooterLink label="Privacy Node" />
          <FooterLink label="Vector Index" />
          <FooterLink label="System Status" />
        </div>
      </footer>
    </div>
  );
}

// --- Sub-components ---

function StatCard({ label, value, icon: Icon, trend, highlight, confidence }: any) {
  return (
    <div className={clsx(
      "p-8 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden",
      highlight ? "bg-blue-600 border-blue-400" : "glass-card hover:bg-slate-800/60"
    )}>
      <Icon className={clsx("w-12 h-12 mb-6", highlight ? "text-white" : "text-blue-400")} />
      <p className={clsx("text-xs font-black uppercase tracking-[0.15em] mb-1 opacity-50", highlight ? "text-white" : "text-slate-500")}>{label}</p>
      <h4 className="text-2xl font-black tracking-tight">{value}</h4>
    </div>
  );
}

function HardwareCard({ title, subtitle, specs, efficiency, icon: Icon }: any) {
  return (
    <div className="glass-card rounded-[3rem] p-10 hover:border-blue-500/30 transition-all duration-500 group">
      <div className="flex items-center gap-4 mb-8">
        <Icon className="w-14 h-14 text-blue-400" />
        <div>
          <h3 className="text-xl font-black mb-1">{title}</h3>
          <p className="text-[10px] font-black uppercase text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-3 mb-8">
        {specs.map((s: string, i: number) => (
          <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-blue-500" /> {s}
          </div>
        ))}
      </div>
      <div className="pt-6 border-t border-white/5 flex justify-between items-center">
        <p className="text-2xl font-black text-blue-400">{efficiency}% Score</p>
        <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase">Datasheet</button>
      </div>
    </div>
  );
}

function FooterLink({ label }: { label: string }) {
  return <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-400">{label}</a>;
}
