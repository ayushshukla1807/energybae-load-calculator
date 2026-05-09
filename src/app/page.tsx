"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  Zap, 
  BrainCircuit, 
  ShieldCheck, 
  Leaf, 
  TrendingUp, 
  Info,
  CheckCircle2,
  Loader2,
  FileText,
  Smartphone,
  IndianRupee,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ==========================================
// CONFIGURATION & CONSTANTS
// ==========================================
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const PROVIDERS = [
  { id: 'msedcl', name: 'MSEDCL (Maharashtra)', color: 'from-orange-500 to-orange-600' },
  { id: 'adani', name: 'Adani Electricity', color: 'from-blue-500 to-blue-600' },
  { id: 'tata', name: 'Tata Power', color: 'from-teal-500 to-teal-600' }
];

// ==========================================
// CORE UI COMPONENTS
// ==========================================

const Header = () => (
  <nav className="flex justify-between items-center px-6 md:px-12 py-8 bg-background/50 backdrop-blur-xl sticky top-0 z-50 border-b border-border/50">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
        <Zap className="text-white w-7 h-7 fill-current" />
      </div>
      <div>
        <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">EnergyBae <span className="text-indigo-600">Pro</span></h1>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mt-1">Solar Audit Intelligence</p>
      </div>
    </div>
    <div className="hidden md:flex items-center gap-8">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          AI Engine Online
      </div>
    </div>
  </nav>
);

const FeatureBadge = ({ icon: Icon, text }: { icon: any, text: string }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/5 border border-indigo-500/10 text-[9px] font-black text-indigo-600 uppercase tracking-widest">
    <Icon className="w-3 h-3" />
    {text}
  </div>
);

// ==========================================
// MAIN APPLICATION
// ==========================================

export default function EnergyBaeMasterpiece() {
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError(null);
      setData(null);
    }
  };

  const executeAudit = async () => {
    if (!file) {
      setError("Please upload an electricity bill first.");
      return;
    }

    setIsExtracting(true);
    setProgress(10);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      setProgress(30);
      const res = await fetch('/api/extract', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error("Server extraction failed");

      const parsed = await res.json();
      setProgress(90);
      
      if (parsed.error) {
        throw new Error(parsed.error);
      }

      setData(parsed);
      setProgress(100);
    } catch (err: any) {
      setError(err.message || "Extraction failed. Please try a clearer image.");
    } finally {
      setIsExtracting(false);
    }
  };

  const downloadExcel = async () => {
    if (!data) return;
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = data.consumerName ? data.consumerName.replace(/[^a-zA-Z0-9]/g, '_') : 'Report';
      a.download = `EnergyBae_Audit_${safeName}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
    }
  };

  // Calculations
  const avgUnits = data?.billingHistory?.length > 0 
    ? Math.round(data.billingHistory.reduce((a: any, b: any) => a + b.units, 0) / data.billingHistory.length)
    : 0;
  
  const solarKw = Math.ceil((avgUnits / 30 / (4.5 * 0.75)) * 1.2 * 10) / 10;
  const panels = Math.ceil((solarKw * 1000) / 540);
  const subsidy = solarKw <= 2 ? solarKw * 30000 : (solarKw <= 3 ? 60000 + (solarKw-2)*18000 : 78000);

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-indigo-500/10">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8"
          >
            <BrainCircuit className="w-4 h-4 text-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Neural Audit Engine V2.0</span>
          </motion.div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8">
            Precision <span className="text-indigo-600">Solar</span> <br />
            Auditing.
          </h2>
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Upload your electricity bill and receive a high-fidelity technical report and ROI analysis in seconds. Optimized for Indian Discoms.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT: UPLOAD & INPUT */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-indigo-500/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <LayoutDashboard className="w-24 h-24 text-indigo-600" />
              </div>
              
              <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                <Upload className="w-5 h-5 text-indigo-600" />
                Upload Document
              </h3>

              <div className="relative">
                <input 
                  type="file" 
                  id="bill-upload" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                />
                <label 
                  htmlFor="bill-upload" 
                  className="block p-10 md:p-16 border-2 border-dashed border-slate-200 rounded-[2rem] hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer text-center group/label"
                >
                  <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20 group-hover/label:scale-110 transition-transform">
                    <FileText className="text-white w-10 h-10" />
                  </div>
                  <p className="text-lg font-black">{file ? file.name : "Drop Electricity Bill"}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">PDF, JPG, or PNG (Max 10MB)</p>
                </label>
              </div>

              <button 
                onClick={executeAudit}
                disabled={!file || isExtracting}
                className="w-full mt-8 py-5 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:hover:bg-slate-900 flex items-center justify-center gap-4"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Data...
                  </>
                ) : "Execute Technical Audit"}
              </button>

              {error && (
                <p className="mt-6 text-center text-xs font-bold text-red-500 uppercase tracking-widest">{error}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200">
                <Smartphone className="w-6 h-6 text-indigo-600 mb-4" />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Mobile Optimized</p>
                <p className="text-sm font-black">Field Ready</p>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200">
                <ShieldCheck className="w-6 h-6 text-indigo-600 mb-4" />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Bank Grade</p>
                <p className="text-sm font-black">Secure Audit</p>
              </div>
            </div>
          </div>

          {/* RIGHT: RESULTS */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {data ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-2xl shadow-indigo-500/5">
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <h3 className="text-3xl md:text-4xl font-black tracking-tight">{data.consumerName}</h3>
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-2">Consumer No: {data.consumerNo}</p>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                        <CheckCircle2 className="w-4 h-4" />
                        Validated
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                      <ResultStat label="Avg Monthly Units" value={`${avgUnits}`} sub="kWh" />
                      <ResultStat label="Sanctioned Load" value={`${data.sanctionedLoad}`} sub="kW" />
                      <ResultStat label="Solar Required" value={`${solarKw}`} sub="kW" />
                      <ResultStat label="Total Panels" value={`${panels}`} sub="Nos" />
                    </div>

                    <div className="bg-indigo-50/50 p-8 rounded-[2rem] border border-indigo-100 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="text-center md:text-left">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Est. Govt Subsidy</p>
                        <p className="text-3xl font-black text-indigo-900">₹{subsidy.toLocaleString('en-IN')}</p>
                        <p className="text-[9px] font-medium text-indigo-400 mt-1">PM-Surya Ghar Yojana</p>
                      </div>
                      <button 
                        onClick={downloadExcel}
                        className="px-10 py-5 rounded-2xl bg-white border border-indigo-200 text-indigo-600 font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-3 shadow-sm"
                      >
                        <FileSpreadsheet className="w-5 h-5" /> Export Professional Report
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 flex items-center gap-6">
                      <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
                        <Leaf className="w-8 h-8 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-black">{Math.round(avgUnits * 12 * 0.82)}kg</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CO2 Offset / Year</p>
                      </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 flex items-center gap-6">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-black">₹{Math.round(avgUnits * 12 * 8.5 * 25 / 100000)}L</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">25yr Wealth Gain</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white p-12 md:p-20 rounded-[4rem] border border-slate-200 border-dashed flex flex-col items-center justify-center text-center space-y-8 h-full min-h-[500px]">
                  <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center">
                    <Info className="w-12 h-12 text-slate-200" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black mb-4">Audit Results Pending</h3>
                    <p className="text-slate-400 max-w-sm mx-auto text-sm leading-relaxed">
                      Please upload an electricity bill in the panel to the left. Our AI will analyze the usage and generate your solar roadmap.
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-200 text-center">
        <div className="flex justify-center gap-12 mb-12 opacity-30">
          <Zap className="w-8 h-8" />
          <BrainCircuit className="w-8 h-8" />
          <Leaf className="w-8 h-8" />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">EnergyBae Intel Engine v2.0</p>
      </footer>
    </div>
  );
}

function ResultStat({ label, value, sub }: { label: string, value: string, sub: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline gap-1">
        <p className="text-2xl md:text-3xl font-black">{value}</p>
        <span className="text-[10px] font-black text-slate-400 uppercase">{sub}</span>
      </div>
    </div>
  );
}
