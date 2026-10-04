import React, { useState } from 'react';
import { 
  Cpu, GitFork, ArrowRight, Server, ShieldCheck, Database, 
  Layers, Lock, CheckCircle2, MessageSquare, Terminal, Eye
} from 'lucide-react';

export default function UmlArchitecture() {
  const [activeDiagram, setActiveDiagram] = useState('sequence');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" /> OMG UML 2.5 Architecture & IEEE 830
            </span>
            <span className="text-slate-400 text-xs font-mono">Microservices Gateway Invariant</span>
          </div>
          <h2 className="font-outfit font-extrabold text-2xl text-white mt-1">
            Software Design, UML Modeling & Loose Coupling Architecture
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Examines Use Cases, Loose Coupling Adapters, Cohesive Microservice Boundaries, and the Sequence Diagram for automated handover.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveDiagram('sequence')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeDiagram === 'sequence' ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Sequence Diagram
          </button>
          <button
            onClick={() => setActiveDiagram('usecase')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeDiagram === 'usecase' ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Use Case Model
          </button>
          <button
            onClick={() => setActiveDiagram('architecture')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeDiagram === 'architecture' ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Loose Coupling System
          </button>
        </div>
      </div>

      {/* DIAGRAM VIEWERS */}
      
      {/* 1. Sequence Diagram View */}
      {activeDiagram === 'sequence' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-100 font-outfit">
                Sequence Interaction Diagram: Automated Bill Query & Threshold Handover
              </h3>
              <p className="text-xs text-slate-400">Interaction trace across Ingress, NLU Engine, Billing Adapter, and Agent CRM.</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px] border border-cyan-800">
              Sequence Execution Flow
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3 overflow-x-auto text-slate-200">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold border-b border-slate-800 pb-2 text-[11px]">
              <span className="w-32">Subscriber</span>
              <span className="w-36 text-center">Ingress Web/WA</span>
              <span className="w-36 text-center">NLU Engine</span>
              <span className="w-36 text-center">Billing REST Adapter</span>
              <span className="w-36 text-center">Agent CRM Bus</span>
            </div>

            {/* Step 1 */}
            <div className="flex items-center space-x-2 py-1">
              <span className="w-32 text-cyan-300 font-semibold">1. User Query</span>
              <span className="text-slate-400 flex-1 flex items-center gap-2">
                -----------------------------&gt; [POST /message]
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex items-center space-x-2 py-1 text-slate-300">
              <span className="w-32 text-slate-400"></span>
              <span className="w-36 text-center text-slate-400">Ingress Gateway</span>
              <span className="text-slate-400 flex-1 flex items-center gap-2">
                --------------&gt; [Classify Intent & Confidence Score]
              </span>
            </div>

            {/* Step 3 (Branch A: Confidence >= 0.75) */}
            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-[11px] space-y-1">
              <div className="font-bold text-emerald-300">alt [Confidence Score ≥ 0.75 - Autonomous Resolution]</div>
              <p className="text-slate-300 pl-4">
                NLU Engine calls Billing REST Adapter -&gt; GET /api/v1/bills/{'{acc_no}'} -&gt; Returns Invoice payload -&gt; Bot renders PDF card to Subscriber.
              </p>
            </div>

            {/* Step 4 (Branch B: Confidence < 0.75) */}
            <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-[11px] space-y-1">
              <div className="font-bold text-amber-300">alt [Confidence Score &lt; 0.75 - IEEE 830 Handover Trigger]</div>
              <p className="text-slate-300 pl-4">
                NLU Engine triggers Handover Bus -&gt; POST /crm/handover {'{transcript, score, accountNo}'} -&gt; Context saved -&gt; Session assigned to Support Agent CRM.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Use Case Model View */}
      {activeDiagram === 'usecase' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-100 font-outfit">
              Use Case Actor & Operational Boundary Model (UC-01 to UC-07)
            </h3>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px]">
              OMG UML 2.5 Standard
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {[
              { id: 'UC-01', title: 'Authenticate Session', actor: 'Subscriber', desc: 'Validates subscriber RMN & OTP; initializes session token.' },
              { id: 'UC-02', title: 'Resolve Bill Query', actor: 'Subscriber', desc: 'Fetches outstanding balance, due date, itemized ledger & PDF.' },
              { id: 'UC-03', title: 'Execute Plan Change', actor: 'Subscriber', desc: 'Presents broadband plan catalogue; provisions upgrade via OTP.' },
              { id: 'UC-04', title: 'Test Line Speed', actor: 'Subscriber', desc: 'Probes OLT line power, executes sync check, advises router reboot.' },
              { id: 'UC-05', title: 'Hand Over to Agent', actor: 'Support Agent', desc: 'Transfers session context to Support CRM when score < 0.75.' },
              { id: 'UC-06', title: 'Check Outage Status', actor: 'Subscriber', desc: 'Queries pincode outage incident database for live status.' },
              { id: 'UC-07', title: 'Audit Deflection Logs', actor: 'Call-Centre Mgr', desc: 'Monitors call deflection metrics & cost savings performance.' },
            ].map((uc) => (
              <div key={uc.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 hover:border-cyan-500/40 transition">
                <div className="flex justify-between items-center font-mono">
                  <span className="font-bold text-cyan-400">{uc.id}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">{uc.actor}</span>
                </div>
                <h4 className="font-bold text-slate-100">{uc.title}</h4>
                <p className="text-slate-400 text-[11px]">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Loose Coupling & Architectural System Diagram */}
      {activeDiagram === 'architecture' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-100 font-outfit">
                Microservices Gateway & Loose Coupling Architectural Layers
              </h3>
              <p className="text-xs text-slate-400">Guarantees zero coupling dependency on legacy billing ERP implementations.</p>
            </div>
          </div>

          {/* Diagram Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2">
              <span className="text-[10px] text-cyan-400 block font-bold">1. INGRESS CHANNELS</span>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">Web Portal Widget</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">WhatsApp Cloud API</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2">
              <span className="text-[10px] text-cyan-400 block font-bold">2. NLU GATEWAY</span>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">Intent Classifier</div>
              <div className="p-2 rounded bg-amber-950 text-amber-300 border border-amber-800">Confidence Gate (&ge;0.75)</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2">
              <span className="text-[10px] text-cyan-400 block font-bold">3. LOOSE REST ADAPTERS</span>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">Billing ERP REST Adapter</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">NOC OLT Telemetry Bus</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2">
              <span className="text-[10px] text-cyan-400 block font-bold">4. ENTERPRISE BACKENDS</span>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">Legacy Billing DB</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">Agent Handover CRM</div>
            </div>
          </div>
        </div>
      )}

      {/* COHESION AND COUPLING JUSTIFICATION CARD */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl text-xs">
        <h3 className="font-bold text-slate-100 text-sm font-outfit flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" /> Cohesion & Loose Coupling Engineering Rationale
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 leading-relaxed text-slate-300">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-cyan-300">High Functional Cohesion</h4>
            <p className="text-[11px] text-slate-400">
              Each microservice component encapsulates exactly one single concern: the NLU classifier handles intent prediction, the Billing Adapter translates JSON schemas, and the Handover Manager preserves agent chat context.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-emerald-300">Loose Coupling Safeguards</h4>
            <p className="text-[11px] text-slate-400">
              HelpBot communicates with the billing engine via asynchronous REST APIs over HTTP/2. If the billing system suffers a delayed response, cached fallback schemas keep the chatbot operational without locking threads.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
