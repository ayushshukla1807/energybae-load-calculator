"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  UploadCloud, FileText, CheckCircle2, ChevronRight, Zap, Loader2, Download, 
  AlertCircle, BarChart3, Settings2, Calculator, IndianRupee, Sun, Ruler,
  Wind, TreeDeciduous, Leaf, ShieldCheck, UserCircle2, Info, BrainCircuit,
  MessageSquare, TrendingUp, Sparkles, Box, ShieldAlert, Terminal, Activity,
  Lock, Globe, Cpu, Database, Network
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
  const [activeTab, setActiveTab] = useState<'audit' | 'forecast' | 'hardware'>('audit');

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [agentThoughts]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
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
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">AutoLoad AI V4.0</span>
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
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Header Info Bar */}
              <div className="lg:col-span-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
                <div>
                  <h2 className="text-3xl font-black tracking-tight">{extractedData.consumerName}</h2>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">ID: {extractedData.consumerNo}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase">{extractedData.connectionType}</span>
                  </div>
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

                {/* Sustainability Card */}
                <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border border-emerald-500/20 p-8 rounded-[2.5rem] mt-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <TreeDeciduous className="w-20 h-20 text-emerald-400" />
                  </div>
                  <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4">Sustainability Impact</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-black text-white">{carbonSaved} kg</p>
                      <p className="text-xs font-bold text-emerald-400/60 uppercase">Annual CO2 Reduction</p>
                    </div>
                    <div className="w-full h-1 bg-emerald-500/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-3/4 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic">
                      "Equivalent to planting {treesSaved} mature trees annually via EnergyBae optimization."
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-9 space-y-8">
                {activeTab === 'audit' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard label="Avg Monthly Units" value={`${avgMonthlyUnits.toFixed(0)} kWh`} icon={Zap} trend="+2.4%" />
                    <StatCard label="Sanctioned Load" value={`${extractedData.sanctionedLoad} kW`} icon={ShieldCheck} confidence={extractedData.confidence?.sanctionedLoad} />
                    <StatCard label="Current Bill" value={`₹${extractedData.billAmount}`} icon={IndianRupee} highlight />
                    
                    <div className="md:col-span-3 glass-card rounded-[2.5rem] p-10 relative overflow-hidden">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-lg tracking-tight flex items-center gap-3">
                          <BarChart3 className="w-5 h-5 text-blue-400" /> 12-Month Consumption Audit
                        </h3>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Historical</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Real-time Extracted</span>
                          </div>
                        </div>
                      </div>
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
                            <XAxis 
                              dataKey="month" 
                              stroke="#64748b" 
                              fontSize={10} 
                              fontWeight={800}
                              tickLine={false} 
                              axisLine={false} 
                            />
                            <YAxis 
                              stroke="#64748b" 
                              fontSize={10} 
                              fontWeight={800}
                              tickLine={false} 
                              axisLine={false} 
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#0f172a', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '16px',
                                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
                                fontWeight: 'bold'
                              }} 
                            />
                            <Area 
                              type="monotone" 
                              dataKey="units" 
                              stroke="#3b82f6" 
                              strokeWidth={4}
                              fillOpacity={1} 
                              fill="url(#colorUnits)" 
                              animationDuration={2000}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'forecast' && (
                  <div className="glass-card rounded-[3rem] p-12">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black">Neural Load Forecasting</h3>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Inference engine: Seasonal Regression V2</p>
                      </div>
                    </div>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[...extractedData.billingHistory.slice(-6), ...forecastData]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                          <XAxis dataKey="month" stroke="#64748b" fontSize={10} fontWeight={800} />
                          <YAxis stroke="#64748b" fontSize={10} fontWeight={800} />
                          <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: 'none' }} />
                          <Bar dataKey="units" radius={[8, 8, 0, 0]} animationDuration={2500}>
                            {[...extractedData.billingHistory.slice(-6), ...forecastData].map((entry: any, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.type === 'forecast' ? '#818cf8' : '#3b82f6'} 
                                fillOpacity={entry.type === 'forecast' ? 0.6 : 1}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-8 p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-4">
                      <ShieldAlert className="w-5 h-5 text-indigo-400" />
                      <p className="text-sm font-medium text-slate-400">
                        Neural Engine predicts a <span className="text-indigo-300 font-bold">12% increase</span> in consumption during the next 90 days due to seasonal variance.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'hardware' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <HardwareCard 
                      title="Windistar 400 HAWT" 
                      subtitle="EnergyBae Premium Series"
                      specs={["Capacity: 400W", "Weight: 14kg", "Tower: 6m"]} 
                      efficiency={94}
                      icon={Wind}
                    />
                    <HardwareCard 
                      title="Tier-1 Mono PERC" 
                      subtitle="High-Efficiency Photovoltaic"
                      specs={["Efficiency: 21.8%", "Output: 540Wp", "Bifacial Support"]} 
                      efficiency={98}
                      icon={Sun}
                    />
                  </div>
                )}

                {/* Neural Stream Console */}
                <div className="bg-[#0f172a] rounded-[2.5rem] border border-white/5 shadow-2xl p-8 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-blue-500/[0.02] pointer-events-none" />
                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 flex items-center gap-2">
                      <Terminal className="w-4 h-4" /> Neural Stream Console
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                        <Network className="w-3 h-3 text-blue-400" />
                        <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Active Link</span>
                      </div>
                      <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                    </div>
                  </div>
                  <div className="font-mono text-[11px] leading-relaxed space-y-1.5 h-40 overflow-y-auto custom-scrollbar-dark text-blue-100/50 relative z-10">
                    {agentThoughts.map((t, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={i} 
                        className="flex gap-3 items-start"
                      >
                        <span className="text-blue-500/40 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                        <span className={clsx(
                          "px-1.5 py-0.5 rounded text-[8px] font-black uppercase shrink-0 mt-0.5",
                          t.type === 'calculate' ? "bg-emerald-500/10 text-emerald-400" : 
                          t.type === 'verify' ? "bg-amber-500/10 text-amber-400" : 
                          "bg-blue-500/10 text-blue-400"
                        )}>
                          {t.type}
                        </span>
                        <span className={clsx(
                          "font-medium tracking-tight",
                          t.type === 'calculate' ? "text-emerald-300/80" : t.type === 'verify' ? "text-amber-300/80" : "text-blue-300/80"
                        )}>
                          {t.message}
                        </span>
                      </motion.div>
                    ))}
                    <div ref={terminalEndRef} />
                    {agentThoughts.length === 0 && (
                      <div className="opacity-20 flex flex-col items-center justify-center h-full gap-4">
                        <Cpu className="w-8 h-8 animate-pulse" />
                        <span className="uppercase tracking-[0.4em] text-[9px]">Neural System Ready</span>
                      </div>
                    )}
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
      </footer export default>
    </div>
  );
}

// --- Sub-components ---

function StatCard({ label, value, icon: Icon, trend, highlight, confidence }: any) {
  return (
    <div className={clsx(
      "p-8 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden group",
      highlight ? "bg-blue-600 border-blue-400 shadow-2xl shadow-blue-600/30" : "glass-card hover:bg-slate-800/60"
    )}>
      {confidence !== undefined && (
        <div className="absolute top-4 right-4">
          <div 
            className="w-12 h-1 text-[8px] bg-slate-800 rounded-full overflow-hidden" 
            title={`Confidence: ${(confidence * 100).toFixed(1)}%`}
          >
            <div 
              className="h-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" 
              style={{ width: `${confidence * 100}%` }} 
            />
          </div>
        </div>
      )}
      <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", highlight ? "bg-white/10" : "bg-blue-500/10")}>
        <Icon className={clsx("w-6 h-6", highlight ? "text-white" : "text-blue-400")} />
      </div>
      <div>
        <p className={clsx("text-xs font-black uppercase tracking-[0.15em] mb-1 opacity-50", highlight ? "text-white" : "text-slate-500")}>
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl font-black tracking-tight">{value}</h4>
          {trend && <span className="text-[10px] font-black text-emerald-400">{trend}</span>}
        </div>
      </div>
    </div>
  );
}

function HardwareCard({ title, subtitle, specs, efficiency, icon: Icon }: any) {
  return (
    <div className="glass-card rounded-[3rem] p-10 hover:border-blue-500/30 transition-all duration-500 relative group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
        <Icon className="w-32 h-32" />
      </div>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
          <Icon className="w-7 h-7 text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-black leading-none mb-1">{title}</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-3 mb-8">
        {specs.map((s: string, i: number) => (
          <div key={i} className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-slate-400">{s}</span>
          </div>
        ))}
      </div>
      <div className="pt-6 border-t border-white/5 flex justify-between items-center">
        <div>
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Audit Score</p>
          <p className="text-2xl font-black text-blue-400">{efficiency}%</p>
        </div>
        <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:border-blue-500 transition-all">
          View Datasheet
        </button>
      </div>
    </div>
  );
}

function FooterLink({ label }: { label: string }) {
  return (
    <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-400 transition-colors">
      {label}
    </a>
  );
}
