import React from 'react';
import { Bot, Headphones, BarChart3, ShieldAlert, Cpu, MessageSquare, Smartphone, CheckCircle2 } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, channelMode, setChannelMode }) {
  const tabs = [
    { id: 'chat', label: 'Chatbot Simulator', icon: Bot, badge: '5 Core Flows' },
    { id: 'agent', label: 'Agent Handover Portal', icon: Headphones, badge: 'Live CRM' },
    { id: 'roi', label: 'Executive ROI & Financials', icon: BarChart3, badge: '₹5.67L/mo' },
    { id: 'risk', label: 'Risk & Scope Register', icon: ShieldAlert, badge: 'IEEE 1540' },
    { id: 'uml', label: 'UML Architecture & SRS', icon: Cpu, badge: 'IEEE 830' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand / Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-outfit font-bold text-lg text-white tracking-wide">HelpBot</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Case Study #97
                </span>
              </div>
              <p className="text-xs text-slate-400">Broadband Customer Support AI & Human Handover System</p>
            </div>
          </div>

          {/* Right Controls: Channel Toggle & System Status */}
          <div className="flex items-center space-x-4">
            
            {/* Channel Ingress Toggle for Simulator tab */}
            {activeTab === 'chat' && (
              <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center space-x-1">
                <button
                  onClick={() => setChannelMode('web')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    channelMode === 'web'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Web Portal Widget</span>
                </button>

                <button
                  onClick={() => setChannelMode('whatsapp')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    channelMode === 'whatsapp'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>WhatsApp Cloud API</span>
                </button>
              </div>
            )}

            {/* System Operational Badge */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Confidence Gate: 0.75 Active</span>
            </div>
          </div>
        </div>

        {/* Bottom Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none border-t border-slate-800/60 pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
