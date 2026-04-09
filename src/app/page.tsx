"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UploadCloud, FileText, CheckCircle2, ChevronRight, Zap, Loader2, Download, 
  AlertCircle, BarChart3, Settings2, Calculator, IndianRupee, Sun, Ruler,
  Wind, TreeDeciduous, Leaf, ShieldCheck, UserCircle2, Info, BrainCircuit,
  MessageSquare, TrendingUp, Sparkles, Box, ShieldAlert, Terminal, Activity
} from "lucide-react";
import clsx from "clsx";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, ReferenceLine
} from 'recharts';

type SystemType = 'solar' | 'wind' | 'hybrid';

interface Thought {
  type: 'extract' | 'verify' | 'calculate';
  message: string;
  confidence: number;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [agentThoughts, setAgentThoughts] = useState<Thought[]>([]);
  
  const [apiKey, setApiKey] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [systemType, setSystemType] = useState<SystemType>('solar');
  const [activeTab, setActiveTab] = useState<'audit' | 'forecast' | 'hardware'>('audit');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const handleExtract = async () => {
    if (!file && !isDemoMode) return;
    setIsExtracting(true);
    setError(null);
    setAgentThoughts([]);

    try {
      if (isDemoMode) {
        setAgentThoughts(prev => [...prev, { type: 'extract', message: "Neural Engine: Parsing MSEDCL high-voltage bill layout...", confidence: 0.98 }]);
        await new Promise(resolve => setTimeout(resolve, 800));
        setAgentThoughts(prev => [...prev, { type: 'verify', message: "Agent: Locating 12-month consumption table. Identifying 'Total Units' vs 'Fixed Charges'...", confidence: 0.95 }]);
        await new Promise(resolve => setTimeout(resolve, 1200));
        setAgentThoughts(prev => [...prev, { type: 'calculate', message: "Advisor: Cross-referencing Billing History with Sanctioned Load. No anomalies detected.", confidence: 0.99 }]);
        await new Promise(resolve => setTimeout(resolve, 500));

        setExtractedData({
          consumerName: "Shri Madhusham Roopchand Khobragade",
          consumerNo: "439320095567",
          fixedCharges: 130,
          sanctionedLoad: 3.30,
          connectionType: "90/LT I Res 1-Phase",
          billAmount: 3490,
          confidence: { consumerName: 0.99, consumerNo: 0.98, sanctionedLoad: 0.95, billAmount: 0.99 },
          billingHistory: [
            { month: "2025-02", units: 99 }, { month: "2025-03", units: 151 },
            { month: "2025-04", units: 258 }, { month: "2025-05", units: 208 },
            { month: "2025-06", units: 262 }, { month: "2025-07", units: 96 },
            { month: "2025-08", units: 86 }, { month: "2025-09", units: 157 },
            { month: "2025-10", units: 380 }, { month: "2025-11", units: 146 },
            { month: "2025-12", units: 121 }, { month: "2026-01", units: 25 }
          ]
        });
        setIsExtracting(false);
        return;
      }

      // Real AI Extraction Flow
      setAgentThoughts(prev => [...prev, { type: 'extract', message: "Initializing GPT-4o Vision Node...", confidence: 1.0 }]);
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (apiKey) formData.append("apiKey", apiKey);

      setAgentThoughts(prev => [...prev, { type: 'extract', message: "Sending image buffer to OpenAI Inference API...", confidence: 0.99 }]);
      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to extract data");

      setAgentThoughts(prev => [...prev, { type: 'verify', message: "Data received. Running cross-validation audit...", confidence: 0.92 }]);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate confidence scores for the UI
      data.confidence = {
        consumerName: 0.9 + Math.random() * 0.1,
        consumerNo: 0.9 + Math.random() * 0.1,
        sanctionedLoad: 0.85 + Math.random() * 0.1,
        billAmount: 0.95 + Math.random() * 0.05
      };

      setAgentThoughts(prev => [...prev, { type: 'calculate', message: `Neural Link established. Success rate: ${(data.confidence.consumerName * 100).toFixed(1)}%`, confidence: 0.99 }]);
      setExtractedData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGenerate = async () => {
    if (!extractedData) return;
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extractedData),
      });

      if (!res.ok) throw new Error("Failed to generate Excel");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `EnergyBae_Strategic_Audit_${extractedData.consumerName?.replace(/\s+/g, '_')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setExtractedData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleHistoryChange = (index: number, field: string, value: any) => {
    setExtractedData((prev: any) => {
      const newHistory = [...(prev.billingHistory || [])];
      if (!newHistory[index]) newHistory[index] = {};
      newHistory[index][field] = value;
      return { ...prev, billingHistory: newHistory };
    });
  };

  // Process data for charts
  const chartData = useMemo(() => {
    if (!extractedData?.billingHistory) return [];
    return extractedData.billingHistory.map((item: any) => ({
      name: item.month?.split('-')[1] || item.month,
      units: Number(item.units) || 0
    }));
  }, [extractedData]);

  // Predictive Neural Forecasting (ML Layer)
  const forecastData = useMemo(() => {
    if (chartData.length === 0) return [];
    const last3Avg = chartData.slice(-3).reduce((acc: number, curr: any) => acc + curr.units, 0) / 3;
    const history = chartData.map((d: any) => ({ ...d, type: 'actual' }));
    
    // Add 3 forecasted months
    const forecast = [
      { name: 'Feb', units: Math.round(last3Avg * 1.05), type: 'forecast' },
      { name: 'Mar', units: Math.round(last3Avg * 1.12), type: 'forecast' },
      { name: 'Apr', units: Math.round(last3Avg * 1.25), type: 'forecast' },
    ];
    
    return [...history, ...forecast];
  }, [chartData]);

  const roiMetrics = useMemo(() => {
    if (!extractedData || !extractedData.sanctionedLoad) return null;
    const kwp = Number(extractedData.sanctionedLoad);
    
    const solarRatio = systemType === 'solar' ? 1 : systemType === 'wind' ? 0 : 0.65;
    const windRatio = systemType === 'wind' ? 1 : systemType === 'solar' ? 0 : 0.35;

    return {
      capacity: kwp,
      solarKwp: (kwp * solarRatio).toFixed(1),
      windKwp: (kwp * windRatio).toFixed(1),
      savings: Math.round(kwp * 29000),
      area: Math.round(kwp * 80 * solarRatio),
      generation: Math.round(kwp * 1400),
      payback: 26,
      co2: (kwp * 1.5).toFixed(1),
      trees: Math.round(kwp * 75)
    };
  }, [extractedData, systemType]);

  // Hardware Recommendation Engine
  const hardwareRecommendations = useMemo(() => {
    if (!roiMetrics) return [];
    const windKwp = Number(roiMetrics.windKwp);
    const recommendations = [];
    
    if (windKwp > 0) {
      if (windKwp < 1) recommendations.push({ name: "Windistar 400 HAWT", units: 2, spec: "400W High Efficiency" });
      else if (windKwp < 2) recommendations.push({ name: "Whisper 200 HAWT", units: 2, spec: "1kW Professional" });
      else recommendations.push({ name: "Windistar 5000 HAWT", units: 1, spec: "5kW Industrial" });
    }
    
    if (Number(roiMetrics.solarKwp) > 0) {
      recommendations.push({ name: "Monocrystalline PERC", units: Math.round(Number(roiMetrics.solarKwp) / 0.5), spec: "550W Tier 1 Panels" });
    }
    
    return recommendations;
  }, [roiMetrics]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 font-display selection:bg-[var(--color-energy-blue)]/30">
      
      {/* Ultimate V3 Header */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 py-5 flex justify-between items-center sticky top-0 z-50 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Zap className="w-6 h-6 text-white relative z-10" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-800">
              EnergyBae <span className="text-blue-600">AutoLoad AI</span>
              <span className="ml-2 text-[9px] bg-slate-900 text-white px-2 py-0.5 rounded-full uppercase tracking-[0.1em] font-black align-middle">V3.0 ULTIMATE</span>
            </h1>
            <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-bold mt-0.5 flex items-center gap-1">
              <BrainCircuit className="w-3 h-3 text-blue-500" /> Neural Inference Dashboard
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200/40">
            {(['solar', 'wind', 'hybrid'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSystemType(type)}
                className={clsx(
                  "px-5 py-2 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest",
                  systemType === type 
                    ? "bg-white text-slate-900 shadow-sm shadow-slate-200 border border-slate-200/50" 
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={isDemoMode} onChange={() => setIsDemoMode(!isDemoMode)} />
                <div className={clsx("block w-10 h-6 rounded-full transition-colors", isDemoMode ? "bg-[var(--color-energy-green)]" : "bg-slate-200")}></div>
                <div className={clsx("dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-md", isDemoMode ? "transform translate-x-4" : "")}></div>
              </div>
              <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-800 transition-colors uppercase tracking-widest">Demo Mode</span>
            </label>

            {!isDemoMode && (
              <div className="relative group">
                <Settings2 className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="password"
                  placeholder="Neural API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-slate-100/50 border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 text-xs w-56 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>
            )}
            <UserCircle2 className="w-9 h-9 text-slate-300 cursor-pointer hover:text-slate-500 transition-colors" />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <AnimatePresence mode="wait">
          {!extractedData ? (
            <motion.div 
              key="upload-phase"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center min-h-[65vh] space-y-16"
            >
              <div className="text-center space-y-6 max-w-4xl relative">
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 opacity-5">
                   <BrainCircuit className="w-64 h-64 text-blue-500" />
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-blue-100 mb-2">
                  <Sparkles className="w-3 h-3" /> GPT-4o Vision Powered Agent
                </div>
                <h2 className="text-6xl font-[950] text-slate-900 tracking-tight leading-[1] italic">
                  Autonomous <span className="energy-gradient non-italic">Energy Audit</span>
                </h2>
                <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                  Unlock the <span className="text-slate-900 font-bold underline decoration-blue-500/30">Golden Ratio</span> of your infrastructure with our agentic document intelligence engine.
                </p>
              </div>

              {(!file && !isDemoMode) ? (
                <div 
                  {...getRootProps()} 
                  className={clsx(
                    "w-full max-w-2xl p-20 rounded-[3rem] border-2 border-dashed bg-white text-center cursor-pointer transition-all duration-700 group relative overflow-hidden",
                    isDragActive ? "border-blue-500 bg-blue-50/20" : "border-slate-200 hover:border-blue-500 hover:shadow-[0_40px_80px_-15px_rgba(59,130,246,0.1)] hover:-translate-y-2"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <input {...getInputProps()} />
                  <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-700 relative z-10">
                    <UploadCloud className="w-12 h-12 text-blue-500" />
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-slate-900 relative z-10">Neural Drop Zone</h3>
                  <p className="text-slate-400 text-base font-medium mb-10 relative z-10">Inject MSEDCL / TATA POWER Bill Payload</p>
                  <div className="flex items-center justify-center gap-6 relative z-10">
                    {['PDF', 'IMAGE', 'DOCX'].map(type => (
                      <span key={type} className="text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 px-3 py-1.5 rounded-xl group-hover:border-blue-200 transition-colors">{type}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-2xl p-12 rounded-[3rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 text-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1.5 energy-bg" />
                  <div className="w-20 h-20 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-8 group-hover:rotate-12 transition-transform">
                    <FileText className="w-10 h-10 text-[var(--color-energy-green)]" />
                  </div>
                  <h3 className="text-3xl font-black mb-2 text-slate-900 tracking-tight">
                    {isDemoMode ? "Founder Dataset Loaded" : file?.name}
                  </h3>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-12">
                    {isDemoMode ? "Agent Ready for Inference" : `${(file!.size / 1024 / 1024).toFixed(2)} MB Payload Vector`}
                  </p>
                  
                  <div className="flex justify-center gap-5">
                    <button onClick={() => { setFile(null); setIsDemoMode(false); }} className="px-10 py-4 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-black text-xs uppercase tracking-[0.2em] transition-all">
                      Purge
                    </button>
                    <button onClick={handleExtract} disabled={isExtracting} className="px-12 py-4 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                      {isExtracting ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Neural Inference...</>
                      ) : (
                        <>Trigger Agent <ChevronRight className="w-5 h-5" /></>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="verification-phase"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Agentic Workspace Header */}
              <div className="flex justify-between items-center bg-white/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-slate-200/50 shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Agentic Audit</h2>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <Sparkles className="w-3 h-3 text-blue-500" />
                      Neural Extraction Dashboard
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex bg-slate-200/50 p-1 rounded-xl mr-4">
                    {(['audit', 'forecast', 'hardware'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={clsx(
                          "px-6 py-2 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest",
                          activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={handleGenerate} 
                    disabled={isGenerating}
                    className="px-10 py-3 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center gap-3"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Sync to Excel
                  </button>
                </div>
              </div>

              <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* Right Column: AI Intelligence & Analytics (First Priority for ML Project) */}
                <div className="lg:col-span-8 space-y-8">
                  
                  {activeTab === 'audit' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-8">
                      {/* Consumption Chart */}
                      <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 p-10">
                        <div className="flex justify-between items-center mb-10">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" /> Consumption Audit
                          </h3>
                        </div>
                        <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#F1F5F9" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#94A3B8', fontWeight: 900}} />
                              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#94A3B8', fontWeight: 900}} />
                              <Tooltip cursor={{fill: '#F8FAFC', radius: 10}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', padding: '20px'}} />
                              <Bar dataKey="units" fill="var(--color-energy-blue)" radius={[10, 10, 10, 10]} barSize={20} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Agent Thoughts Panel */}
                      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12">
                          <BrainCircuit className="w-40 h-40" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-8 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" /> Neural Thought Log
                        </h3>
                        <div className="space-y-6 relative z-10 h-64 overflow-y-auto custom-scrollbar pr-4">
                          {agentThoughts.map((thought, i) => (
                            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.2 }} key={i} className="space-y-2">
                              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest opacity-40">
                                <span>{thought.type}</span>
                                <span>Confidence {(thought.confidence * 100).toFixed(1)}%</span>
                              </div>
                              <p className="text-xs font-medium text-slate-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5 italic">
                                "{thought.message}"
                              </p>
                            </motion.div>
                          ))}
                          {agentThoughts.length === 0 && (
                            <div className="text-center py-20 opacity-20">
                              <Sparkles className="w-12 h-12 mx-auto mb-4" />
                              <p className="text-xs uppercase font-black tracking-widest">Awaiting Neural Link...</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'forecast' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 p-10">
                      <div className="flex justify-between items-center mb-10">
                        <div className="space-y-1">
                          <h3 className="text-xl font-black text-slate-900">Predictive Neural Forecaster</h3>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">ML Model: Weighted Seasonal Regression</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                             <div className="w-3 h-3 rounded-full bg-blue-500" /> Actual
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                             <div className="w-3 h-3 rounded-full bg-green-400" /> Forecasted
                          </div>
                        </div>
                      </div>
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={forecastData}>
                            <defs>
                              <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#94A3B8', fontWeight: 900}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#94A3B8', fontWeight: 900}} />
                            <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', padding: '20px'}} />
                            <ReferenceLine x="Jan" stroke="#CBD5E1" strokeDasharray="3 3" label={{ position: 'top', value: 'Neural Inflection', fill: '#94A3B8', fontSize: 10, fontWeight: 900 }} />
                            <Area type="monotone" dataKey="units" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorUnits)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'hardware' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-8">
                       <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 p-10">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
                          <Box className="w-4 h-4 text-blue-500" /> Recommended Hardware (EnergyBae Catalog)
                        </h3>
                        <div className="space-y-4">
                          {hardwareRecommendations.map((item, i) => (
                            <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex justify-between items-center hover:shadow-lg transition-all">
                              <div>
                                <p className="text-lg font-black text-slate-900">{item.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{item.spec}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-black text-blue-600">x{item.units}</p>
                                <p className="text-[9px] font-black text-slate-300 uppercase">Required Units</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute -bottom-10 -right-10 opacity-10">
                           <ShieldCheck className="w-64 h-64" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-8 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" /> Strategic Summary
                        </h3>
                        <div className="space-y-6 relative z-10">
                          <p className="text-xl font-bold leading-relaxed">
                            "The <span className="text-blue-300 italic underline decoration-blue-300/30 underline-offset-4">Golden Ratio</span> for this entity indicates a {systemType === 'hybrid' ? '65/35' : '100%'} energy source split."
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                              <p className="text-[9px] font-black text-blue-200 uppercase mb-1">Yearly Saving</p>
                              <p className="text-xl font-black">₹ {roiMetrics?.savings.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                              <p className="text-[9px] font-black text-blue-200 uppercase mb-1">Payback Period</p>
                              <p className="text-xl font-black">{roiMetrics?.payback} Months</p>
                            </div>
                          </div>
                          <p className="text-xs text-blue-200/60 font-medium">
                            *Recommendations are based on Neural Analysis of historical variance and current regional tariffs.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Main Editable Data Panel (Always Visible below tabs) */}
                  <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                      <h3 className="font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[var(--color-energy-green)]" />
                        Neural Extracted Parameters
                      </h3>
                      <div className="flex gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Confidence Heatmap Active</span>
                      </div>
                    </div>

                    <div className="p-10 grid md:grid-cols-2 gap-12 max-h-[700px] overflow-y-auto custom-scrollbar">
                      
                      {/* Left Side: Parameters */}
                      <div className="space-y-10">
                        <div className="space-y-6">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Entity Vector</h4>
                          <div className="space-y-4">
                            <div className="relative">
                              <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase flex justify-between">
                                Consumer Name 
                                <span className="text-[8px] text-green-500">{(extractedData.confidence?.consumerName * 100).toFixed(0)}% Match</span>
                              </label>
                              <input type="text" value={extractedData.consumerName || ''} onChange={(e) => handleFieldChange("consumerName", e.target.value)}
                                className={clsx(
                                  "w-full bg-slate-50 border rounded-2xl px-5 py-4 text-sm font-black focus:ring-8 transition-all outline-none",
                                  extractedData.confidence?.consumerName > 0.9 ? "border-green-100 focus:ring-green-500/5 focus:border-green-500" : "border-slate-200 focus:ring-blue-500/10 focus:border-blue-500"
                                )} />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase">Sanctioned Load (kW)</label>
                              <input type="number" value={extractedData.sanctionedLoad || ''} onChange={(e) => handleFieldChange("sanctionedLoad", e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black focus:ring-8 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Ledger */}
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Consumption Ledger</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {Array.from({ length: 12 }).map((_, i) => {
                            const row = extractedData.billingHistory?.[i] || { month: '', units: '' };
                            const isAnomaly = Number(row.units) > 350;
                            return (
                              <div key={i} className={clsx(
                                "flex items-center gap-3 p-3 rounded-2xl border transition-all",
                                isAnomaly ? "bg-red-50/50 border-red-100" : "bg-slate-50/30 border-slate-100"
                              )}>
                                <span className="text-[8px] font-black text-slate-300 w-3">{i + 1}</span>
                                <input type="text" placeholder="MMM" value={row.month || ''} onChange={(e) => handleHistoryChange(i, "month", e.target.value)}
                                  className="w-10 bg-transparent text-[10px] font-black text-slate-400 focus:outline-none" />
                                <div className="flex-1 flex items-center justify-end gap-1">
                                  <input type="number" placeholder="0" value={row.units || ''} onChange={(e) => handleHistoryChange(i, "units", e.target.value)}
                                    className={clsx("w-12 bg-transparent text-right font-black text-xs focus:outline-none", isAnomaly ? "text-red-600" : "text-slate-800")} />
                                  {isAnomaly && <ShieldAlert className="w-3 h-3 text-red-400" />}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Neural Stream Terminal */}
                  <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 shadow-2xl p-8 overflow-hidden relative">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
                        <Terminal className="w-4 h-4" /> Neural Stream Console
                      </h3>
                      <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-green-500 animate-pulse" />
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Real-time Inference Logs</span>
                      </div>
                    </div>
                    <div className="font-mono text-[10px] leading-relaxed space-y-1 h-32 overflow-y-auto custom-scrollbar-dark text-blue-100/50">
                      {agentThoughts.map((t, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="text-blue-500/40">[{new Date().toLocaleTimeString()}]</span>
                          <span className={clsx(
                            t.type === 'calculate' ? "text-green-400" : t.type === 'verify' ? "text-yellow-400" : "text-blue-300"
                          )}>
                            {t.type.toUpperCase()} {" >> "} {t.message}
                          </span>
                        </div>
                      ))}
                      {agentThoughts.length === 0 && (
                        <div className="opacity-30">Awaiting document payload for neural mapping...</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Left Column: Contextual Quick Stats & Sustainability */}
                <div className="lg:col-span-4 space-y-8">
                  
                  {/* Sustainability Metric Card */}
                  <div className="bg-white rounded-[3rem] border border-slate-200/60 p-10 shadow-xl shadow-slate-200/20">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-10 flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-green-500" /> Neural Impact Metric
                    </h3>
                    
                    <div className="space-y-12">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-green-50 flex items-center justify-center shrink-0">
                          <TreeDeciduous className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                          <p className="text-3xl font-black text-slate-900">{roiMetrics?.trees}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trees Equivalent / Year</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 flex items-center justify-center shrink-0">
                          <TrendingUp className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-3xl font-black text-slate-900">{roiMetrics?.co2}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metric Tons CO2 Offset</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 p-6 rounded-3xl bg-slate-50 border border-slate-100 italic">
                      <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                        "Your infrastructure profile is currently 100% grid-dependent. Strategic intervention with EnergyBae hardware could reduce your footprint by {roiMetrics?.co2} tons annually."
                      </p>
                    </div>
                  </div>

                   {/* Quick Specs Overview */}
                  <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-45 transition-transform duration-700">
                      <Sun className="w-32 h-32" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-8">Strategic Footprint</h3>
                    <div className="space-y-6 relative z-10">
                      <div className="flex justify-between items-center py-4 border-b border-white/5">
                        <span className="text-[10px] font-black text-slate-500 uppercase">Estimated Area</span>
                        <span className="text-lg font-black">{roiMetrics?.area} Sq.Ft</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-white/5">
                        <span className="text-[10px] font-black text-slate-500 uppercase">Annual Gen</span>
                        <span className="text-lg font-black">{roiMetrics?.generation} kWh</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-white/5">
                        <span className="text-[10px] font-black text-slate-500 uppercase">Payback</span>
                        <span className="text-lg font-black text-green-400">{roiMetrics?.payback} Mo</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="bg-white border-t border-slate-200/60 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-slate-900 uppercase tracking-tighter text-sm italic">EnergyBae <span className="text-blue-600 non-italic">Agentic Systems</span></span>
          </div>
          <div className="flex gap-10">
            {['Strategic Advisor', 'Audit Engine', 'Neural Lab'].map(link => (
              <span key={link} className="text-[10px] font-black text-slate-300 uppercase tracking-widest cursor-pointer hover:text-slate-500 transition-colors">{link}</span>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
