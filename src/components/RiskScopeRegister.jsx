import React, { useState } from 'react';
import { 
  ShieldAlert, AlertTriangle, CheckCircle2, XCircle, FileText, 
  Layers, Shield, Target, Award, ListFilter, AlertCircle
} from 'lucide-react';
import { RISK_REGISTER, MOSCOW_REQUIREMENTS } from '../data/helpbotData';

export default function RiskScopeRegister() {
  const [selectedRisk, setSelectedRisk] = useState(RISK_REGISTER[0]);
  const [activeTabFilter, setActiveTabFilter] = useState('ALL');

  const filteredRequirements = MOSCOW_REQUIREMENTS.filter((r) => {
    if (activeTabFilter === 'ALL') return true;
    if (activeTabFilter === 'MUST') return r.category === 'Must Have';
    if (activeTabFilter === 'SHOULD') return r.category === 'Should Have';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> IEEE Std 1540 Risk Governance
            </span>
            <span className="text-slate-400 text-xs font-mono">P × I Risk Exposure Baseline</span>
          </div>
          <h2 className="font-outfit font-extrabold text-2xl text-white mt-1">
            Risk Register, Scope Governance & MoSCoW Specification
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Calculates Exposure using formula: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 font-mono">E = Probability (P) × Impact (I)</code>. Evaluates CEO scope creep, manager data sharing, and NLU accuracy risks.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 block">DRE Quality Rating</span>
            <span className="text-emerald-400 font-bold font-mono text-base">92.3% Efficiency</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 block">Defect Density</span>
            <span className="text-cyan-400 font-bold font-mono text-base">0.04 defects/FP</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: QUANTITATIVE RISK MATRIX & MASTER REGISTER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Risk Register Master Table (7 Columns) */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-100 font-outfit flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Quantitative Exposure-Ranked Risk Register
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Ranked by Exposure (E)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="py-2 px-2">ID</th>
                  <th className="py-2 px-2">Risk Event Description</th>
                  <th className="py-2 px-2 text-center">P</th>
                  <th className="py-2 px-2 text-center">I</th>
                  <th className="py-2 px-2 text-center">Exposure (E)</th>
                  <th className="py-2 px-2">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {RISK_REGISTER.map((risk) => {
                  const isSelected = selectedRisk.id === risk.id;
                  return (
                    <tr
                      key={risk.id}
                      onClick={() => setSelectedRisk(risk)}
                      className={`cursor-pointer transition-all ${
                        isSelected ? 'bg-slate-800 font-semibold' : 'hover:bg-slate-850'
                      }`}
                    >
                      <td className="py-2.5 px-2 font-mono text-cyan-400 font-bold">{risk.id}</td>
                      <td className="py-2.5 px-2 text-slate-200">
                        <div className="font-medium">{risk.title}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-xs">{risk.description}</div>
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono">{risk.probability}</td>
                      <td className="py-2.5 px-2 text-center font-mono">{risk.impact}</td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-amber-400">{risk.exposure}</td>
                      <td className="py-2.5 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          risk.severity.includes('HIGH')
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {risk.severity}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Risk Mitigation Strategy Detail Card (5 Columns) */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-mono text-cyan-400 font-bold text-xs">{selectedRisk.id} Strategy</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800">
                Status: {selectedRisk.status}
              </span>
            </div>

            <div className="mt-3 space-y-3">
              <div>
                <h4 className="font-bold text-slate-100 text-sm">{selectedRisk.title}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedRisk.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-center text-xs font-mono">
                <div className="p-1.5 rounded bg-slate-950">
                  <span className="text-[10px] text-slate-400 block">Probability (P)</span>
                  <span className="font-bold text-cyan-300">{selectedRisk.probability}</span>
                </div>
                <div className="p-1.5 rounded bg-slate-950">
                  <span className="text-[10px] text-slate-400 block">Impact (I)</span>
                  <span className="font-bold text-amber-300">{selectedRisk.impact} / 10</span>
                </div>
                <div className="p-1.5 rounded bg-slate-950">
                  <span className="text-[10px] text-slate-400 block">Exposure (P×I)</span>
                  <span className="font-bold text-rose-400 text-sm">{selectedRisk.exposure}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-cyan-900/40 space-y-1.5 text-xs">
                <span className="font-bold text-cyan-300 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> RMMM Mitigation Strategy:
                </span>
                <p className="text-slate-200 text-[11px] leading-relaxed">{selectedRisk.mitigation}</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
            <span>Designated Risk Owner:</span>
            <span className="font-semibold text-slate-200">{selectedRisk.owner}</span>
          </div>
        </div>

      </div>

      {/* SECTION 2: IN-SCOPE VS OUT-OF-SCOPE BOUNDARY GOVERNANCE TABLE */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-100 font-outfit flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" /> Scope Management & Boundary Specification Matrix
            </h3>
            <p className="text-xs text-slate-400">Enforces CEO expectation boundaries with strict in-scope vs out-of-scope rules.</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono">
            5 In-Scope Categories
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          {/* In-Scope Table */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <h4 className="font-bold text-emerald-300 flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> IN-SCOPE (Automated by HelpBot AI)
            </h4>
            <ul className="space-y-2 text-slate-200">
              <li className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span>1. Bill Queries & Ledger PDF Invoice Download</span>
                <span className="font-mono text-[10px] text-emerald-400">FR-03</span>
              </li>
              <li className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span>2. Tariff Plan Upgrades with 1-Click OTP Verification</span>
                <span className="font-mono text-[10px] text-emerald-400">FR-04</span>
              </li>
              <li className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span>3. Slow Broadband Speed Diagnostics & OLT Router Probe</span>
                <span className="font-mono text-[10px] text-emerald-400">FR-05</span>
              </li>
              <li className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span>4. Regional Fiber Outage PIN Code Status Check</span>
                <span className="font-mono text-[10px] text-emerald-400">FR-06</span>
              </li>
              <li className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span>5. Bill Payment Gateway Processing (UPI / Cards)</span>
                <span className="font-mono text-[10px] text-emerald-400">FR-07</span>
              </li>
            </ul>
          </div>

          {/* Out-of-Scope Table */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
            <h4 className="font-bold text-rose-300 flex items-center gap-1.5 text-sm">
              <XCircle className="w-4 h-4 text-rose-400" /> OUT-OF-SCOPE (Triggers Human Handover)
            </h4>
            <ul className="space-y-2 text-slate-200">
              <li className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span>1. Physical Fiber Relocation / Address Shift</span>
                <span className="font-mono text-[10px] text-rose-400">Redirects to Agent</span>
              </li>
              <li className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span>2. New Customer Broadband Connection Booking</span>
                <span className="font-mono text-[10px] text-rose-400">Sales Ingress</span>
              </li>
              <li className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span>3. Hardware Router Physical Replacement Requests</span>
                <span className="font-mono text-[10px] text-rose-400">Field Service</span>
              </li>
              <li className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span>4. Complex Legal / Tariff Contract Disputes</span>
                <span className="font-mono text-[10px] text-rose-400">Tier-2 Escalation</span>
              </li>
              <li className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span>5. Unstructured Queries with Confidence Score &lt; 0.75</span>
                <span className="font-mono text-[10px] text-rose-400">FR-08 Handover</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* SECTION 3: MOSCOW REQUIREMENTS & MEASURABLE QUALITY TARGETS */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-slate-100 font-outfit flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" /> MoSCoW Prioritization & Measurable NFR Targets
          </h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setActiveTabFilter('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                activeTabFilter === 'ALL' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              All Requirements
            </button>
            <button
              onClick={() => setActiveTabFilter('MUST')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                activeTabFilter === 'MUST' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Must Have
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {filteredRequirements.map((req, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 hover:border-slate-700 transition">
              <div className="flex items-center justify-between font-mono">
                <span className="text-cyan-400 font-bold">{req.code}</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] border border-cyan-800">
                  {req.category}
                </span>
              </div>
              <div className="font-medium text-slate-200">{req.title}</div>
              {req.target && (
                <div className="pt-1 text-[10px] flex justify-between text-slate-400 border-t border-slate-800/60 font-mono">
                  <span>Target: {req.target}</span>
                  <span className="text-emerald-400 font-bold">Achieved: {req.achieved}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
