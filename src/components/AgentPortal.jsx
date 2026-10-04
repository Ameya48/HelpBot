import React, { useState } from 'react';
import { 
  Headphones, User, MessageSquare, AlertTriangle, CheckCircle2, 
  ShieldCheck, ArrowRight, Zap, RefreshCw, Send, Clock, UserCheck,
  FileText, Sparkles, AlertCircle
} from 'lucide-react';
import { HANDOVER_QUEUE_SEED } from '../data/helpbotData';

export default function AgentPortal({ liveTickets = [] }) {
  const allQueue = [...HANDOVER_QUEUE_SEED, ...liveTickets];
  const [selectedTicketId, setSelectedTicketId] = useState(allQueue[0]?.ticketId || 'HO-8841');
  const [agentReply, setAgentReply] = useState('');
  const [tickets, setTickets] = useState(allQueue);

  const activeTicket = tickets.find((t) => t.ticketId === selectedTicketId) || tickets[0];

  const handleSendAgentReply = () => {
    if (!agentReply.trim() || !activeTicket) return;

    const newMsg = {
      sender: 'agent',
      text: agentReply,
      timestamp: 'Just now'
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.ticketId === activeTicket.ticketId
          ? {
              ...t,
              status: 'IN_PROGRESS',
              assignedAgent: 'Support Specialist You',
              messages: [...t.messages, newMsg]
            }
          : t
      )
    );

    setAgentReply('');
  };

  const handleResolveTicket = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) => (t.ticketId === ticketId ? { ...t, status: 'RESOLVED' } : t))
    );
  };

  const insertCopilotTemplate = (text) => {
    setAgentReply(text);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Banner: Call-Centre Manager Job Protection Safeguard */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-outfit font-bold text-base text-white flex items-center gap-2">
              Call-Centre Agent Operations Console
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                Agent Copilot Enabled
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              Addresses Call-Centre Manager Job Fears: Bot handles 50% repetitive tier-1 volume; agents receive high-value escalated tickets with full context.
            </p>
          </div>
        </div>

        {/* Live Operational Metrics Bar */}
        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Queue Handover Count</span>
            <span className="text-cyan-400 font-bold text-sm">{tickets.filter(t => t.status !== 'RESOLVED').length} Active</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Avg Agent SLA</span>
            <span className="text-emerald-400 font-bold text-sm">&lt; 180s Target</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Context Loss</span>
            <span className="text-emerald-400 font-bold text-sm">0% (IEEE 830)</span>
          </div>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" style={{ minHeight: '600px' }}>
        
        {/* LEFT COLUMN: INCOMING HANDOVER QUEUE (4 Columns) */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" /> Incoming Escalated Sessions
            </h3>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
              {tickets.length} Total
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {tickets.map((t) => {
              const isSelected = t.ticketId === activeTicket?.ticketId;
              return (
                <div
                  key={t.ticketId}
                  onClick={() => setSelectedTicketId(t.ticketId)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500/60 shadow-lg'
                      : 'bg-slate-950/80 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-100">{t.subscriberName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      t.status === 'PENDING_AGENT'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : t.status === 'IN_PROGRESS'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Acc: <strong className="text-slate-300">{t.accountNo}</strong></span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px]">
                      {t.channel}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/90 text-[11px] text-amber-200 border border-amber-900/40 flex items-center justify-between">
                    <span className="truncate max-w-[200px]" title={t.reason}>⚡ {t.reason}</span>
                    <span className="font-mono font-bold text-amber-400 text-[10px]">
                      Score: {t.confidenceScore.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE AGENT WORKSPACE & TRANSCRIPT PLAYBACK (8 Columns) */}
        {activeTicket ? (
          <div className="lg:col-span-8 rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col space-y-4">
            
            {/* Ticket Header & Subscriber Metadata */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-base text-slate-100">{activeTicket.subscriberName}</h3>
                  <span className="font-mono text-xs text-cyan-400">({activeTicket.accountNo})</span>
                  <span className="px-2 py-0.5 text-[10px] rounded bg-slate-800 text-slate-300 font-mono">
                    {activeTicket.channel} Channel
                  </span>
                </div>
                <p className="text-xs text-amber-300 font-medium mt-0.5">
                  Handover Trigger Reason: {activeTicket.reason}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {activeTicket.status !== 'RESOLVED' ? (
                  <button
                    onClick={() => handleResolveTicket(activeTicket.ticketId)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1 shadow-lg shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Issue Resolved</span>
                  </button>
                ) : (
                  <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold">
                    ✅ Resolved & Archived
                  </span>
                )}
              </div>
            </div>

            {/* Conversation Transcript Stream */}
            <div className="flex-1 bg-slate-950/80 rounded-xl border border-slate-800 p-4 overflow-y-auto space-y-3" style={{ minHeight: '320px' }}>
              <div className="text-center">
                <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-400 text-[10px] border border-slate-800">
                  🔒 IEEE 830 Handover Ingress: Full Bot Transcript & Intent Context Transferred
                </span>
              </div>

              {activeTicket.messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    m.sender === 'user' ? 'items-start' : m.sender === 'bot' ? 'items-start' : m.sender === 'system' ? 'items-center' : 'items-end'
                  }`}
                >
                  {m.sender === 'system' ? (
                    <div className="my-2 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs text-center font-mono">
                      {m.text}
                    </div>
                  ) : (
                    <div className={`max-w-[80%] rounded-xl p-3 text-xs ${
                      m.sender === 'user'
                        ? 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                        : m.sender === 'bot'
                          ? 'bg-cyan-950/40 text-cyan-200 border border-cyan-800/40 rounded-tl-none'
                          : 'bg-emerald-600 text-white rounded-tr-none shadow-md'
                    }`}>
                      <div className="font-semibold text-[10px] mb-1 opacity-75">
                        {m.sender === 'user' ? 'Subscriber' : m.sender === 'bot' ? 'HelpBot AI' : 'Support Specialist (You)'}
                      </div>
                      <div className="whitespace-pre-line leading-relaxed">{m.text}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* AI Copilot Quick Assistant Response Templates */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-cyan-400">
                  <Sparkles className="w-3.5 h-3.5" /> AI Copilot Quick Assist Templates:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => insertCopilotTemplate('I reviewed your account statement. I have issued a ₹400 bill adjustment credit to your next bill for the unverified addon.')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700"
                >
                  💳 Issue ₹400 Billing Adjustment
                </button>
                <button
                  onClick={() => insertCopilotTemplate('I have scheduled a senior field technician visit to inspect your Fiber Drop Cable tomorrow between 10 AM - 1 PM.')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700"
                >
                  🔧 Dispatch Technician Visit
                </button>
                <button
                  onClick={() => insertCopilotTemplate('I am overriding your plan upgrade directly in our Billing ERP. No additional installation charges apply.')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700"
                >
                  ⚡ Override Plan Upgrade
                </button>
              </div>
            </div>

            {/* Agent Reply Input Box */}
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                value={agentReply}
                onChange={(e) => setAgentReply(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAgentReply()}
                placeholder="Type response to subscriber as Support Agent..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSendAgentReply}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1 shadow-lg shadow-emerald-600/30"
              >
                <Send className="w-4 h-4" />
                <span>Reply</span>
              </button>
            </div>

          </div>
        ) : (
          <div className="lg:col-span-8 rounded-2xl bg-slate-900 border border-slate-800 p-8 flex items-center justify-center text-slate-500 text-xs">
            Select a handed-over ticket from the left queue to view details.
          </div>
        )}

      </div>
    </div>
  );
}
