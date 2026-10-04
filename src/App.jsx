import React, { useState } from 'react';
import Header from './components/Header';
import ChatSimulator from './components/ChatSimulator';
import AgentPortal from './components/AgentPortal';
import RoiDashboard from './components/RoiDashboard';
import RiskScopeRegister from './components/RiskScopeRegister';
import UmlArchitecture from './components/UmlArchitecture';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [channelMode, setChannelMode] = useState('web'); // 'web' | 'whatsapp'
  const [liveHandoverTickets, setLiveHandoverTickets] = useState([]);

  const handleNewHandoverTicket = (ticket) => {
    setLiveHandoverTickets((prev) => [ticket, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-900 pb-12">
      
      {/* Top Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        channelMode={channelMode}
        setChannelMode={setChannelMode}
      />

      {/* Main Tab Content */}
      <main className="transition-all duration-300">
        {activeTab === 'chat' && (
          <ChatSimulator 
            channelMode={channelMode} 
            onTriggerHandover={handleNewHandoverTicket}
          />
        )}

        {activeTab === 'agent' && (
          <AgentPortal 
            liveTickets={liveHandoverTickets} 
          />
        )}

        {activeTab === 'roi' && (
          <RoiDashboard />
        )}

        {activeTab === 'risk' && (
          <RiskScopeRegister />
        )}

        {activeTab === 'uml' && (
          <UmlArchitecture />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            HelpBot Support System — Case Study No. 97 Baseline Specification
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            IEEE 830 | IEEE 829 | IEEE 1540 | OMG UML 2.5
          </div>
        </div>
      </footer>
    </div>
  );
}
