import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, User, Send, RefreshCw, AlertTriangle, ShieldCheck, Zap, 
  Receipt, Activity, CreditCard, Headphones, Download, CheckCircle, 
  Wifi, Cpu, ArrowRight, CornerDownRight, CheckCircle2, ChevronRight,
  Shield, Server, Lock
} from 'lucide-react';
import { TOP_5_CATEGORIES, MOCK_USER_ACCOUNT, MOCK_PLAN_CATALOGUE, MOCK_OUTAGE_AREAS, CASE_STUDY_METRICS } from '../data/helpbotData';

export default function ChatSimulator({ channelMode, onTriggerHandover }) {
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'bot',
      text: `Hello ${MOCK_USER_ACCOUNT.name}! 👋 I am **HelpBot**, your 24/7 AI Broadband Support Assistant.`,
      timestamp: 'Just now',
      confidence: 1.0,
      intent: 'WELCOME_INGRESS',
      frCode: 'FR-01'
    },
    {
      id: 'init-2',
      sender: 'bot',
      text: 'How can I assist your broadband connection (#HB-90824156) today? Select a common category or type your issue:',
      timestamp: 'Just now',
      confidence: 1.0,
      intent: 'CATEGORY_PROMPT',
      frCode: 'FR-01',
      showCategoryButtons: true
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Real-time HUD metrics
  const [currentNlu, setCurrentNlu] = useState({
    intent: 'IDLE_WAITING',
    frCode: 'FR-01',
    confidence: 0.98,
    boundaryPass: true,
    apiLatency: '42ms',
    adapterStatus: 'HEALTHY (REST Gateway)'
  });

  // Action state modals / flows
  const [selectedPlanUpgrade, setSelectedPlanUpgrade] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [planUpgradedSuccess, setPlanUpgradedSuccess] = useState(false);

  // Speed Diagnostic animation state
  const [diagnosticState, setDiagnosticState] = useState('idle'); // idle -> testing -> finished
  const [rebootingRouter, setRebootingRouter] = useState(false);

  // Outage search state
  const [pincodeSearch, setPincodeSearch] = useState('400001');
  const [outageResult, setOutageResult] = useState(MOCK_OUTAGE_AREAS['400001']);

  // Payment state
  const [paymentDone, setPaymentDone] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, diagnosticState]);

  const handleSendCategory = (cat) => {
    triggerUserQuery(cat.typicalQuery, cat);
  };

  const triggerUserQuery = (queryText, category = null) => {
    if (!queryText.trim()) return;

    // Add user message
    const userMsgId = 'user-' + Date.now();
    const newMsg = {
      id: userMsgId,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate NLP Classifier engine
    setTimeout(() => {
      processNlpQuery(queryText, category);
      setIsTyping(false);
    }, 700);
  };

  const processNlpQuery = (queryText, catHint = null) => {
    const qLower = queryText.toLowerCase();

    // 1. Check for explicit handover or out-of-scope / low confidence test
    if (qLower.includes('human') || qLower.includes('agent') || qLower.includes('speak to real person') || qLower.includes('complain manager') || qLower.includes('relocation') || qLower.includes('low confidence test')) {
      const conf = qLower.includes('low confidence test') ? 0.62 : (qLower.includes('relocation') ? 0.45 : 0.68);
      setCurrentNlu({
        intent: 'HUMAN_HANDOVER_REQUEST',
        frCode: 'FR-08 / FR-09',
        confidence: conf,
        boundaryPass: false, // < 0.75 THRESHOLD TRIGGER!
        apiLatency: '88ms',
        adapterStatus: 'HANDOVER_QUEUE_INGRESS'
      });

      const handoverMsg = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: conf < CASE_STUDY_METRICS.confidenceThreshold
          ? `⚠️ **Confidence Score (${conf.toFixed(2)}) is below the required IEEE 830 threshold (0.75).**\n\nTransferring your session context smoothly to an active Call-Centre Support Specialist now. Zero conversation text will be lost!`
          : `👤 **Human Handover Requested.** Connecting you directly to an available Broadband Support Specialist...`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: conf,
        isHandoverTrigger: true
      };

      setMessages((prev) => [...prev, handoverMsg]);
      onTriggerHandover && onTriggerHandover({
        ticketId: 'HO-' + Math.floor(1000 + Math.random() * 9000),
        subscriberName: MOCK_USER_ACCOUNT.name,
        accountNo: MOCK_USER_ACCOUNT.accountNo,
        channel: channelMode === 'whatsapp' ? 'WhatsApp' : 'Web Self-Care',
        reason: conf < 0.75 ? `Low Confidence (${conf.toFixed(2)})` : 'Explicit Customer Handover Request',
        confidenceScore: conf,
        timestamp: 'Just now',
        status: 'PENDING_AGENT',
        messages: [...messages, newMsg, handoverMsg]
      });
      return;
    }

    // 2. Bill Queries (FR-03)
    if (catHint?.id === 'bill_query' || qLower.includes('bill') || qLower.includes('invoice') || qLower.includes('charge') || qLower.includes('due date')) {
      setCurrentNlu({
        intent: 'RESOLVE_BILL_QUERY',
        frCode: 'FR-03',
        confidence: 0.95,
        boundaryPass: true,
        apiLatency: '45ms',
        adapterStatus: 'REST Gateway -> Billing ERP'
      });

      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: `Here is your latest bill details for Broadband Account **${MOCK_USER_ACCOUNT.accountNo}**:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          confidence: 0.95,
          frCode: 'FR-03',
          type: 'bill_card'
        }
      ]);
      return;
    }

    // 3. Plan Changes (FR-04)
    if (catHint?.id === 'plan_change' || qLower.includes('plan') || qLower.includes('upgrade') || qLower.includes('speed change') || qLower.includes('tariff')) {
      setCurrentNlu({
        intent: 'EXECUTE_PLAN_CHANGE',
        frCode: 'FR-04',
        confidence: 0.92,
        boundaryPass: true,
        apiLatency: '55ms',
        adapterStatus: 'REST Gateway -> Provisioning Engine'
      });

      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: `Your current plan is **${MOCK_USER_ACCOUNT.currentPlan}** (₹${MOCK_USER_ACCOUNT.monthlyRent}/mo). You can upgrade instantly with 1-Click OTP confirmation:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          confidence: 0.92,
          frCode: 'FR-04',
          type: 'plan_upgrade_card'
        }
      ]);
      return;
    }

    // 4. Slow Speed Diagnostics (FR-05)
    if (catHint?.id === 'slow_speed' || qLower.includes('slow') || qLower.includes('speed') || qLower.includes('buffering') || qLower.includes('lag') || qLower.includes('diagnostic')) {
      setCurrentNlu({
        intent: 'DIAGNOSE_SPEED_ISSUE',
        frCode: 'FR-05',
        confidence: 0.89,
        boundaryPass: true,
        apiLatency: '110ms',
        adapterStatus: 'NOC Bus -> OLT Telemetry Probe'
      });

      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: `I will run a live hardware diagnostic on your Optical Fiber Terminal (OLT Node #42):`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          confidence: 0.89,
          frCode: 'FR-05',
          type: 'diagnostic_card'
        }
      ]);
      return;
    }

    // 5. Outage Status (FR-06)
    if (catHint?.id === 'outage_status' || qLower.includes('outage') || qLower.includes('down') || qLower.includes('fiber cut') || qLower.includes('no internet') || qLower.includes('pincode')) {
      setCurrentNlu({
        intent: 'CHECK_OUTAGE_STATUS',
        frCode: 'FR-06',
        confidence: 0.96,
        boundaryPass: true,
        apiLatency: '35ms',
        adapterStatus: 'NOC Bus -> Outage Incident Matrix'
      });

      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: `Check live network health by entering your 6-digit postal Pincode:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          confidence: 0.96,
          frCode: 'FR-06',
          type: 'outage_card'
        }
      ]);
      return;
    }

    // 6. Payment Processing (FR-07)
    if (catHint?.id === 'payment' || qLower.includes('pay') || qLower.includes('payment') || qLower.includes('recharge') || qLower.includes('upi')) {
      setCurrentNlu({
        intent: 'PROCESS_PAYMENT',
        frCode: 'FR-07',
        confidence: 0.94,
        boundaryPass: true,
        apiLatency: '60ms',
        adapterStatus: 'REST Gateway -> Payment Gateway API'
      });

      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: `Outstanding bill amount is **₹${MOCK_USER_ACCOUNT.lastBill.amount}** for Bill #${MOCK_USER_ACCOUNT.lastBill.billId}. Complete payment securely below:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          confidence: 0.94,
          frCode: 'FR-07',
          type: 'payment_card'
        }
      ]);
      return;
    }

    // Fallback query matching with high confidence fallback or boundary threshold trigger
    setCurrentNlu({
      intent: 'GENERAL_BROADBAND_QUERY',
      frCode: 'FR-01',
      confidence: 0.82,
      boundaryPass: true,
      apiLatency: '50ms',
      adapterStatus: 'REST Gateway -> Knowledge Base'
    });

    setMessages((prev) => [
      ...prev,
      {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: `I understand you are asking about: "${queryText}". Our AI Bot is configured for the 5 primary broadband categories (Bill Queries, Plan Upgrades, Speed Diagnostics, Outages, and Payments). How can I assist you with these options?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 0.82,
        frCode: 'FR-01',
        showCategoryButtons: true
      }
    ]);
  };

  // Helper functions for interactive cards
  const startSpeedTest = () => {
    setDiagnosticState('testing');
    setTimeout(() => {
      setDiagnosticState('finished');
    }, 2500);
  };

  const triggerReboot = () => {
    setRebootingRouter(true);
    setTimeout(() => {
      setRebootingRouter(false);
      alert('⚡ Router reboot signal dispatched to OLT Node! Line resynchronized in 30 seconds.');
    }, 2000);
  };

  const handleSelectUpgradePlan = (plan) => {
    setSelectedPlanUpgrade(plan);
    setShowOtpModal(true);
  };

  const confirmOtpUpgrade = () => {
    if (otpInput === '1234' || otpInput.length >= 4) {
      setPlanUpgradedSuccess(true);
      setShowOtpModal(false);
      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: `🎉 **Plan Upgrade Successful!**\nYour broadband plan has been upgraded to **${selectedPlanUpgrade.name}** (${selectedPlanUpgrade.speed}). Your line speed will refresh within 5 minutes. Receipt sent to ${MOCK_USER_ACCOUNT.rmn}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          confidence: 0.98,
          frCode: 'FR-04'
        }
      ]);
    } else {
      alert('Please enter a valid 4-digit OTP (e.g. 1234)');
    }
  };

  const handleSimulatePayment = () => {
    setShowPayModal(true);
  };

  const confirmPayment = () => {
    setPaymentDone(true);
    setShowPayModal(false);
    setMessages((prev) => [
      ...prev,
      {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: `✅ **Payment Received!**\nThank you ${MOCK_USER_ACCOUNT.name}. Amount ₹${MOCK_USER_ACCOUNT.lastBill.amount} successfully paid via UPI. Transaction ID: **TXN-90812499**. Invoice marked AS PAID.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 0.98,
        frCode: 'FR-07'
      }
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT & CENTER: CHAT SIMULATOR (8 Columns) */}
      <div className="lg:col-span-8 space-y-4">
        
        {/* Simulator Container */}
        <div className={`rounded-2xl border transition-all duration-300 shadow-2xl overflow-hidden flex flex-col ${
          channelMode === 'whatsapp'
            ? 'bg-slate-900 border-emerald-500/30'
            : 'bg-slate-900/90 border-slate-800'
        }`} style={{ height: '720px' }}>
          
          {/* Chat Channel Top Bar */}
          <div className={`px-5 py-3.5 flex items-center justify-between border-b ${
            channelMode === 'whatsapp'
              ? 'bg-emerald-900/40 border-emerald-700/30 text-white'
              : 'bg-slate-800/80 border-slate-700/50 text-white'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white shadow-md ${
                channelMode === 'whatsapp' ? 'bg-emerald-600' : 'bg-cyan-600'
              }`}>
                {channelMode === 'whatsapp' ? 'WA' : 'HB'}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-sm">
                    {channelMode === 'whatsapp' ? 'HelpBot WhatsApp Official (+91 800-HELPBOT)' : 'HelpBot Broadband Self-Care Portal'}
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {channelMode === 'whatsapp' ? 'WhatsApp Cloud API Business Ingress' : 'Web Widget REST Microservice Gateway'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: 'init-1',
                      sender: 'bot',
                      text: `Hello ${MOCK_USER_ACCOUNT.name}! 👋 I am **HelpBot**, your 24/7 AI Broadband Support Assistant.`,
                      timestamp: 'Just now',
                      confidence: 1.0,
                      frCode: 'FR-01'
                    },
                    {
                      id: 'init-2',
                      sender: 'bot',
                      text: 'How can I assist your broadband connection (#HB-90824156) today?',
                      timestamp: 'Just now',
                      confidence: 1.0,
                      frCode: 'FR-01',
                      showCategoryButtons: true
                    }
                  ]);
                  setPaymentDone(false);
                  setDiagnosticState('idle');
                }}
                title="Reset Chat Session"
                className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
            channelMode === 'whatsapp' ? 'bg-[#0b141a]' : 'bg-slate-950/60'
          }`}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-md transition-all ${
                  msg.sender === 'user'
                    ? channelMode === 'whatsapp'
                      ? 'bg-emerald-700 text-white rounded-tr-none'
                      : 'bg-cyan-600 text-white rounded-tr-none'
                    : channelMode === 'whatsapp'
                      ? 'bg-[#1f2c34] text-slate-100 rounded-tl-none border border-emerald-900/40'
                      : 'bg-slate-800/90 text-slate-100 rounded-tl-none border border-slate-700/60'
                }`}>
                  
                  {/* Message Top Badge for Bot */}
                  {msg.sender === 'bot' && (
                    <div className="flex items-center justify-between border-b border-slate-700/50 pb-1.5 mb-2 text-[10px]">
                      <span className="font-semibold text-cyan-400 flex items-center gap-1">
                        <Bot className="w-3 h-3" /> HelpBot AI Engine
                      </span>
                      <div className="flex items-center space-x-2">
                        {msg.frCode && (
                          <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                            {msg.frCode}
                          </span>
                        )}
                        {msg.confidence && (
                          <span className={`px-1.5 py-0.5 rounded font-mono ${
                            msg.confidence >= 0.75 
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50' 
                              : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                          }`}>
                            Score: {msg.confidence.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Main Message Text */}
                  <div className="whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </div>

                  {/* Dynamic Category Pill Buttons */}
                  {msg.showCategoryButtons && (
                    <div className="mt-3 pt-2 border-t border-slate-700/40 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {TOP_5_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleSendCategory(cat)}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:border-cyan-500/50 hover:bg-slate-800 text-left transition text-xs text-slate-200 group"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-bold">
                              {cat.frCode}
                            </span>
                            <span className="font-medium group-hover:text-cyan-300">{cat.name}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                        </button>
                      ))}

                      {/* Trigger Low Confidence Handover Test */}
                      <button
                        onClick={() => triggerUserQuery('I want a low confidence test to trigger handover')}
                        className="col-span-1 sm:col-span-2 flex items-center justify-between p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 hover:bg-amber-900/50 text-amber-300 text-xs transition"
                      >
                        <span className="flex items-center gap-1.5 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5" /> Test Handover Rule (&lt; 0.75 Score Trigger)
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/80">FR-08</span>
                      </button>
                    </div>
                  )}

                  {/* Interactive Card: Bill Query (FR-03) */}
                  {msg.type === 'bill_card' && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Invoice Number</span>
                        <span className="font-mono font-semibold text-cyan-300">{MOCK_USER_ACCOUNT.lastBill.billId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Current Plan Rent</span>
                        <span>₹{MOCK_USER_ACCOUNT.lastBill.baseAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">GST (18%)</span>
                        <span>₹{MOCK_USER_ACCOUNT.lastBill.taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800 font-bold text-sm">
                        <span className="text-slate-200">Total Payable</span>
                        <span className={paymentDone ? 'text-emerald-400' : 'text-cyan-400'}>
                          ₹{MOCK_USER_ACCOUNT.lastBill.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span className="text-slate-400">Due Date:</span>
                        <span className="text-amber-400 font-medium">{MOCK_USER_ACCOUNT.lastBill.dueDate}</span>
                      </div>

                      <div className="flex items-center space-x-2 pt-2">
                        <button
                          onClick={() => alert(`📥 Simulated Download PDF: ${MOCK_USER_ACCOUNT.lastBill.billId}.pdf downloaded.`)}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF Invoice</span>
                        </button>
                        {!paymentDone && (
                          <button
                            onClick={handleSimulatePayment}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md shadow-cyan-600/30"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay Now</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Interactive Card: Plan Upgrade (FR-04) */}
                  {msg.type === 'plan_upgrade_card' && (
                    <div className="mt-3 space-y-2 text-xs">
                      {MOCK_PLAN_CATALOGUE.map((plan) => (
                        <div
                          key={plan.id}
                          className={`p-3 rounded-xl border transition-all ${
                            plan.isCurrent
                              ? 'bg-slate-900/60 border-slate-800 opacity-80'
                              : 'bg-slate-900 border-cyan-500/30 hover:border-cyan-400 shadow-md'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-slate-100 flex items-center gap-1.5">
                                {plan.name}
                                {plan.recommended && (
                                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                                    RECOMMENDED
                                  </span>
                                )}
                              </h4>
                              <p className="text-slate-400 text-[11px] mt-0.5">{plan.dataLimit}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-base font-extrabold text-cyan-400">₹{plan.monthlyCost}</span>
                              <span className="text-[10px] text-slate-400">/mo</span>
                            </div>
                          </div>

                          <div className="mt-2 flex items-center justify-between border-t border-slate-800/80 pt-2">
                            <span className="text-slate-300 font-semibold flex items-center gap-1">
                              <Zap className="w-3.5 h-3.5 text-amber-400" /> {plan.speed}
                            </span>
                            {plan.isCurrent ? (
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">Active Plan</span>
                            ) : (
                              <button
                                onClick={() => handleSelectUpgradePlan(plan)}
                                className="px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow"
                              >
                                Upgrade with OTP
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Interactive Card: Speed Diagnostics (FR-05) */}
                  {msg.type === 'diagnostic_card' && (
                    <div className="mt-3 p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-cyan-400" /> OLT Hardware Probe status
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] border border-emerald-800">
                          Optical Rx: -19.2 dBm (Healthy)
                        </span>
                      </div>

                      {diagnosticState === 'idle' && (
                        <div className="text-center py-2 space-y-2">
                          <p className="text-slate-300">Run instant live line latency & throughput probe:</p>
                          <button
                            onClick={startSpeedTest}
                            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center justify-center space-x-1.5 mx-auto"
                          >
                            <Wifi className="w-4 h-4" />
                            <span>Start Line Diagnostic Probe</span>
                          </button>
                        </div>
                      )}

                      {diagnosticState === 'testing' && (
                        <div className="py-4 text-center space-y-2">
                          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                          <p className="text-cyan-300 font-mono text-xs">Querying OLT Node #42 telemetry & packet sync...</p>
                        </div>
                      )}

                      {diagnosticState === 'finished' && (
                        <div className="space-y-2">
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                              <div className="text-slate-400 text-[10px]">Ping Latency</div>
                              <div className="font-bold text-emerald-400 text-sm">12 ms</div>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                              <div className="text-slate-400 text-[10px]">Download Speed</div>
                              <div className="font-bold text-cyan-400 text-sm">98.4 Mbps</div>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                              <div className="text-slate-400 text-[10px]">Packet Loss</div>
                              <div className="font-bold text-emerald-400 text-sm">0.0%</div>
                            </div>
                          </div>

                          <div className="p-2 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-200">
                            💡 Line status is clean. If experiencing Wi-Fi lag, send automated remote router reboot signal:
                          </div>

                          <button
                            onClick={triggerReboot}
                            disabled={rebootingRouter}
                            className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-xs border border-slate-700 flex items-center justify-center space-x-1.5"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${rebootingRouter ? 'animate-spin' : ''}`} />
                            <span>{rebootingRouter ? 'Sending Reboot Command...' : 'Reboot Optical Router Remotely'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Interactive Card: Outage Status (FR-06) */}
                  {msg.type === 'outage_card' && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={pincodeSearch}
                          onChange={(e) => setPincodeSearch(e.target.value)}
                          placeholder="Enter 6-digit Pincode (e.g. 400012)"
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                        />
                        <button
                          onClick={() => {
                            const res = MOCK_OUTAGE_AREAS[pincodeSearch] || {
                              status: 'NORMAL',
                              areaName: `Pincode ${pincodeSearch} Sector`,
                              activeNodes: 24,
                              affectedSubscribers: 0
                            };
                            setOutageResult(res);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs"
                        >
                          Check Status
                        </button>
                      </div>

                      {outageResult && (
                        <div className={`p-3 rounded-lg border text-xs ${
                          outageResult.status === 'OUTAGE'
                            ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                            : outageResult.status === 'MAINTENANCE'
                              ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                              : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                        }`}>
                          <div className="flex items-center justify-between font-bold">
                            <span>{outageResult.areaName}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-950/80">
                              {outageResult.status}
                            </span>
                          </div>
                          {outageResult.status === 'OUTAGE' ? (
                            <div className="mt-2 space-y-1 text-[11px]">
                              <p className="font-semibold text-rose-300">⚠️ {outageResult.cause}</p>
                              <p className="text-slate-300">Affected Subscribers: {outageResult.affectedSubscribers}</p>
                              <p className="text-rose-200 font-bold">Estimated Resolution: {outageResult.eta}</p>
                            </div>
                          ) : (
                            <p className="mt-1 text-[11px] text-emerald-300">
                              ✅ All {outageResult.activeNodes} Fiber distribution nodes operating at 100% capacity.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Interactive Card: Payment (FR-07) */}
                  {msg.type === 'payment_card' && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Total Due Amount</span>
                        <span className="font-extrabold text-cyan-400 text-sm">₹{MOCK_USER_ACCOUNT.lastBill.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Account Holder:</span>
                        <span>{MOCK_USER_ACCOUNT.name}</span>
                      </div>

                      {paymentDone ? (
                        <div className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-800 text-emerald-300 font-bold text-center flex items-center justify-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-400" /> Bill Paid & Ledger Updated!
                        </div>
                      ) : (
                        <button
                          onClick={handleSimulatePayment}
                          className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-1.5"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Simulate Quick Payment (UPI / NetBanking)</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Handover Action Trigger Bar inside message */}
                  {msg.isHandoverTrigger && (
                    <div className="mt-3 pt-2 border-t border-amber-800/40 flex items-center justify-between">
                      <span className="text-[11px] text-amber-300 flex items-center gap-1">
                        <Headphones className="w-3.5 h-3.5" /> Transferring to Agent CRM...
                      </span>
                      <button
                        onClick={() => alert('Connected! Proceed to Agent Handover Portal tab to manage ticket.')}
                        className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shadow"
                      >
                        Open Agent Workspace
                      </button>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 mt-1.5 text-right">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 w-32">
                <Bot className="w-4 h-4 text-cyan-400 animate-bounce" />
                <span className="text-xs text-slate-400 font-mono animate-pulse">Thinking...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Footer */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && triggerUserQuery(inputQuery)}
              placeholder="Ask about bills, plan upgrades, slow speed, outage, or 'Talk to Human'..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 placeholder-slate-500"
            />
            <button
              onClick={() => triggerUserQuery(inputQuery)}
              className={`p-2.5 rounded-xl text-white font-semibold transition-all shadow-md ${
                channelMode === 'whatsapp'
                  ? 'bg-emerald-600 hover:bg-emerald-500'
                  : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/30'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: REAL-TIME NLU ENGINE & ENGINEERING HUD (4 Columns) */}
      <div className="lg:col-span-4 space-y-4">
        
        {/* NLU & IEEE 830 Boundary HUD Panel */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm text-slate-100 font-outfit">AI NLU Telemetry HUD</h3>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              IEEE 830 Gate
            </span>
          </div>

          {/* Detected Intent */}
          <div className="space-y-1">
            <div className="text-[11px] text-slate-400">Classified Intent</div>
            <div className="font-mono text-xs font-bold text-cyan-300 bg-slate-950 p-2 rounded-lg border border-slate-800 flex justify-between">
              <span>{currentNlu.intent}</span>
              <span className="text-slate-400">{currentNlu.frCode}</span>
            </div>
          </div>

          {/* NLU Confidence Gauge */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">NLU Confidence Score:</span>
              <span className={`font-mono font-bold text-sm ${
                currentNlu.confidence >= 0.75 ? 'text-emerald-400' : 'text-amber-400 animate-pulse'
              }`}>
                {currentNlu.confidence.toFixed(2)}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative">
              {/* Boundary marker at 0.75 */}
              <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-amber-400 z-10" title="0.75 Threshold Boundary"></div>
              <div
                className={`h-full transition-all duration-500 ${
                  currentNlu.confidence >= 0.75 ? 'bg-gradient-to-r from-cyan-500 to-emerald-400' : 'bg-gradient-to-r from-amber-500 to-rose-500'
                }`}
                style={{ width: `${Math.min(100, currentNlu.confidence * 100)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>0.0 (No Match)</span>
              <span className="text-amber-400 font-bold">Threshold 0.75</span>
              <span>1.0 (Exact)</span>
            </div>
          </div>

          {/* Decision Boundary Evaluator */}
          <div className={`p-3 rounded-xl border text-xs space-y-1 ${
            currentNlu.boundaryPass
              ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200'
              : 'bg-amber-950/30 border-amber-800/40 text-amber-200'
          }`}>
            <div className="font-bold flex items-center gap-1.5">
              {currentNlu.boundaryPass ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Rule: Bot Resolution Authorized</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Rule: Automated Human Handover Triggered</span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-300">
              {currentNlu.boundaryPass
                ? 'Confidence ≥ 0.75. Query handled autonomously by HelpBot.'
                : 'Confidence < 0.75 or out-of-scope. Seamlessly transfer session context to Support Agent.'}
            </p>
          </div>

          {/* Microservice Gateway Info */}
          <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1.5 text-slate-400">
            <div className="flex justify-between">
              <span>Backend Adapter Latency:</span>
              <span className="font-mono text-cyan-300 font-semibold">{currentNlu.apiLatency}</span>
            </div>
            <div className="flex justify-between">
              <span>Loosely Coupled Status:</span>
              <span className="font-mono text-emerald-400">{currentNlu.adapterStatus}</span>
            </div>
            <div className="flex justify-between">
              <span>Context Retention:</span>
              <span className="font-mono text-slate-200">100% In-Memory Buffer</span>
            </div>
          </div>
        </div>

        {/* 5 In-Scope Scope Boundaries Summary */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 text-xs space-y-2">
          <h4 className="font-bold text-slate-200 flex items-center justify-between">
            <span>5 In-Scope Categories (60% Vol)</span>
            <span className="text-[10px] text-cyan-400">FR-03 to FR-07</span>
          </h4>
          <div className="space-y-1.5">
            {TOP_5_CATEGORIES.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-300 font-medium">{cat.name}</span>
                <span className="font-mono text-slate-400 text-[10px]">{cat.volumePct}% Vol ({cat.monthlyCalls.toLocaleString()}/mo)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* OTP MODAL FOR PLAN UPGRADE */}
      {showOtpModal && selectedPlanUpgrade && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" /> Confirm Plan Upgrade OTP
              </h3>
              <button onClick={() => setShowOtpModal(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>
            <p className="text-xs text-slate-300">
              Upgrading to <strong className="text-cyan-300">{selectedPlanUpgrade.name}</strong> @ ₹{selectedPlanUpgrade.monthlyCost}/mo. Enter 4-digit OTP sent to Registered Mobile ({MOCK_USER_ACCOUNT.rmn}):
            </p>
            <input
              type="text"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              placeholder="Enter 1234 for test"
              className="w-full text-center tracking-widest text-lg font-mono font-bold py-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowOtpModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs">Cancel</button>
              <button onClick={confirmOtpUpgrade} className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs">Confirm Upgrade</button>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATED PAYMENT MODAL */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" /> Broadband Payment Checkout
              </h3>
              <button onClick={() => setShowPayModal(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>
            <div className="text-xs space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Account:</span>
                <span className="font-mono text-cyan-300">{MOCK_USER_ACCOUNT.accountNo}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Due:</span>
                <span className="font-bold text-emerald-400 text-base">₹{MOCK_USER_ACCOUNT.lastBill.amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <label className="font-semibold text-slate-300 block">Select Payment Gateway:</label>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-left font-semibold text-xs">
                  ⚡ GPay / PhonePe UPI
                </button>
                <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-left text-xs">
                  💳 Credit/Debit Card
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowPayModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs">Cancel</button>
              <button onClick={confirmPayment} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30">
                Authorize ₹{MOCK_USER_ACCOUNT.lastBill.amount.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
