import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, PhoneCall, CheckCircle2, 
  Sparkles, Calculator, PieChart, ArrowUpRight, Award, ShieldCheck
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid, Legend 
} from 'recharts';
import { CASE_STUDY_METRICS, TOP_5_CATEGORIES } from '../data/helpbotData';

export default function RoiDashboard() {
  // Interactive Slider State initialized with exact Case Study Givens
  const [callVolume, setCallVolume] = useState(CASE_STUDY_METRICS.totalMonthlyCalls); // 45000
  const [top5Pct, setTop5Pct] = useState(CASE_STUDY_METRICS.top5CategoryPercentage); // 60%
  const [deflectionPct, setDeflectionPct] = useState(CASE_STUDY_METRICS.targetDeflectionRate); // 50%
  const [costPerCall, setCostPerCall] = useState(CASE_STUDY_METRICS.costPerCall); // ₹42
  const [projectCost, setProjectCost] = useState(CASE_STUDY_METRICS.projectCost); // ₹1800000

  // Dynamic Calculations based on Case Study Formulas
  const top5Calls = Math.round((callVolume * top5Pct) / 100);
  const deflectedCalls = Math.round((top5Calls * deflectionPct) / 100);
  const monthlySavings = deflectedCalls * costPerCall;
  const annualSavings = monthlySavings * 12;
  const paybackMonths = monthlySavings > 0 ? (projectCost / monthlySavings).toFixed(2) : 0;
  const paybackDays = Math.round(paybackMonths * 30.4);
  const netYear1Gain = annualSavings - projectCost;

  // Chart 1 Data: Call Breakdown by Category
  const categoryChartData = TOP_5_CATEGORIES.map((cat) => {
    const catVol = Math.round((deflectedCalls * cat.volumePct) / 60);
    return {
      name: cat.name,
      'Deflected Calls': catVol,
      'Monthly Savings (₹)': catVol * costPerCall
    };
  });

  // Chart 2 Data: 12-Month Cumulative Cashflow & Breakeven
  const cashflowData = Array.from({ length: 13 }, (_, month) => {
    const cumulativeSavings = month * monthlySavings;
    const netCashflow = cumulativeSavings - projectCost;
    return {
      month: `M${month}`,
      'Cumulative Savings': cumulativeSavings / 100000, // In Lakhs
      'Project Outlay': projectCost / 100000,
      'Net Return': netCashflow / 100000
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold">
              Management & CEO Business Case
            </span>
            <span className="text-slate-400 text-xs font-mono">IEEE Case Study No. 97 Baseline</span>
          </div>
          <h2 className="font-outfit font-extrabold text-2xl text-white mt-1">
            Financial ROI & Telephony Call Deflection Engine
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Calculates call reduction, monthly cost savings, and payback period using exact case study formulas: 
            <code className="bg-slate-950 px-1.5 py-0.5 rounded text-cyan-300 font-mono">Saving = Deflected Calls × ₹42</code>
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-slate-950/80 border border-cyan-500/40 text-right shadow-inner">
          <span className="text-slate-400 text-xs block">Project Payback Period</span>
          <span className="font-outfit font-extrabold text-2xl text-emerald-400">{paybackMonths} Months</span>
          <span className="text-[11px] text-slate-300 block font-mono">({paybackDays} Calendar Days)</span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Monthly Call Deflection */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Monthly Deflected Calls</span>
            <PhoneCall className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">
            {deflectedCalls.toLocaleString()} <span className="text-xs font-normal text-slate-400">calls/mo</span>
          </div>
          <div className="text-[11px] text-cyan-300 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3.5 h-3.5" /> {deflectionPct}% of top 5 categories
          </div>
        </div>

        {/* Card 2: Monthly Cost Savings */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Monthly Financial Saving</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-outfit">
            ₹{(monthlySavings / 100000).toFixed(2)} Lakhs <span className="text-xs text-slate-400 font-normal">/mo</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            ₹{monthlySavings.toLocaleString()} at ₹{costPerCall}/call
          </div>
        </div>

        {/* Card 3: Fixed Project Outlay */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Fixed Project Cost</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-300 font-outfit">
            ₹{(projectCost / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Fixed 14-Week Outlay Ceiling
          </div>
        </div>

        {/* Card 4: Net Year 1 Gain */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Net Year-1 Financial Gain</span>
            <ArrowUpRight className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-300 font-outfit">
            ₹{(netYear1Gain / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 278% Net Return on Investment
          </div>
        </div>

      </div>

      {/* Main Grid: Interactive Calculator + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Parameter Slider Calculator (4 Columns) */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-100 font-outfit flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-400" /> Interactive Sensitivity Simulator
            </h3>
            <button
              onClick={() => {
                setCallVolume(CASE_STUDY_METRICS.totalMonthlyCalls);
                setTop5Pct(CASE_STUDY_METRICS.top5CategoryPercentage);
                setDeflectionPct(CASE_STUDY_METRICS.targetDeflectionRate);
                setCostPerCall(CASE_STUDY_METRICS.costPerCall);
                setProjectCost(CASE_STUDY_METRICS.projectCost);
              }}
              className="text-[10px] text-cyan-400 hover:underline"
            >
              Reset to Baseline
            </button>
          </div>

          {/* Slider 1: Call Volume */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-300">Total Monthly Call Volume:</span>
              <span className="font-mono font-bold text-cyan-300">{callVolume.toLocaleString()} calls</span>
            </div>
            <input
              type="range"
              min="20000"
              max="100000"
              step="1000"
              value={callVolume}
              onChange={(e) => setCallVolume(Number(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 2: Top 5 Category % */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-300">Top 5 Common Category Share:</span>
              <span className="font-mono font-bold text-cyan-300">{top5Pct}% ({top5Calls.toLocaleString()} calls)</span>
            </div>
            <input
              type="range"
              min="30"
              max="90"
              step="5"
              value={top5Pct}
              onChange={(e) => setTop5Pct(Number(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 3: Bot Deflection % */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-300">Bot Deflection Resolution Rate:</span>
              <span className="font-mono font-bold text-emerald-400">{deflectionPct}% ({deflectedCalls.toLocaleString()} calls)</span>
            </div>
            <input
              type="range"
              min="20"
              max="80"
              step="5"
              value={deflectionPct}
              onChange={(e) => setDeflectionPct(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 4: Cost per call */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-300">Call-Centre Agent Cost / Call:</span>
              <span className="font-mono font-bold text-cyan-300">₹{costPerCall}</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="2"
              value={costPerCall}
              onChange={(e) => setCostPerCall(Number(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 5: Project Outlay */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-300">Project Outlay Budget:</span>
              <span className="font-mono font-bold text-amber-300">₹{(projectCost / 100000).toFixed(1)} Lakhs</span>
            </div>
            <input
              type="range"
              min="1000000"
              max="3000000"
              step="100000"
              value={projectCost}
              onChange={(e) => setProjectCost(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

          {/* Dynamic Formulas Output Box */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1.5 font-mono text-slate-300">
            <div className="flex justify-between">
              <span>Formula:</span>
              <span className="text-cyan-400">Calls × 60% × 50% × ₹42</span>
            </div>
            <div className="flex justify-between">
              <span>Recalculated Monthly Savings:</span>
              <span className="text-emerald-400 font-bold">₹{monthlySavings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Recalculated Payback:</span>
              <span className="text-cyan-300 font-bold">{paybackMonths} Months</span>
            </div>
          </div>
        </div>

        {/* Visual Charts Container (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Chart 1: 12-Month Cashflow Breakeven Graph */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-100 font-outfit">
                12-Month Cumulative Financial Cashflow & Breakeven Point
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono">Breakeven: Month 3.17</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cashflowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} label={{ value: '₹ Lakhs', angle: -90, position: 'insideLeft', fill: '#64748b' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="Cumulative Savings" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Project Outlay" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="Net Return" stroke="#06b6d4" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Deflection Distribution by 5 Categories */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-100 font-outfit">
                Monthly Deflection & Savings by Top 5 Category Drivers
              </h3>
              <span className="text-[10px] text-cyan-400 font-mono">60% Volume Concentration</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="Deflected Calls" fill="#0284c7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
