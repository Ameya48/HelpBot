// Data baseline from Case Study No. 97 - HelpBot Support Platform Specifications

export const CASE_STUDY_METRICS = {
  totalMonthlyCalls: 45000,
  top5CategoryPercentage: 60, // 60%
  top5CallVolume: 27000,
  targetDeflectionRate: 50, // 50%
  monthlyDeflectedCalls: 13500,
  costPerCall: 42, // ₹42 per call
  monthlySavings: 567000, // ₹5.67 Lakhs
  annualSavings: 6804000, // ₹68.04 Lakhs
  projectCost: 1800000, // ₹18 Lakhs
  paybackPeriodMonths: 3.17, // 3.17 Months (~96 days)
  confidenceThreshold: 0.75, // Boundary value threshold
};

export const TOP_5_CATEGORIES = [
  {
    id: 'bill_query',
    name: 'Bill Queries',
    frCode: 'FR-03',
    icon: 'Receipt',
    volumePct: 22,
    monthlyCalls: 9900,
    typicalQuery: 'View latest bill, itemized breakdown, and due date',
    defaultConfidence: 0.95,
  },
  {
    id: 'plan_change',
    name: 'Plan Changes',
    frCode: 'FR-04',
    icon: 'Zap',
    volumePct: 15,
    monthlyCalls: 6750,
    typicalQuery: 'Upgrade speed tier from 100 Mbps to 300 Mbps Fiber',
    defaultConfidence: 0.92,
  },
  {
    id: 'slow_speed',
    name: 'Slow Speed Diagnostics',
    frCode: 'FR-05',
    icon: 'Activity',
    volumePct: 11,
    monthlyCalls: 4950,
    typicalQuery: 'Run line diagnostics, check optical Rx power & reboot router',
    defaultConfidence: 0.88,
  },
  {
    id: 'outage_status',
    name: 'Outage Status',
    frCode: 'FR-06',
    icon: 'AlertTriangle',
    volumePct: 7,
    monthlyCalls: 3150,
    typicalQuery: 'Check area fiber outage by pincode / subscriber ID',
    defaultConfidence: 0.96,
  },
  {
    id: 'payment',
    name: 'Payment Processing',
    frCode: 'FR-07',
    icon: 'CreditCard',
    volumePct: 5,
    monthlyCalls: 2250,
    typicalQuery: 'Pay bill balance via UPI / Card & download receipt',
    defaultConfidence: 0.94,
  }
];

export const MOCK_USER_ACCOUNT = {
  accountNo: 'HB-90824156',
  name: 'Ameya Sagwekar',
  rmn: '+91 98765 43210',
  currentPlan: 'Fiber Ultra 100 Mbps',
  monthlyRent: 799,
  billingCycle: '1st - 30th of every month',
  status: 'ACTIVE',
  address: 'Flat 402, Broadband Heights, Pincode 400001',
  lastBill: {
    billId: 'INV-2026-10-8842',
    amount: 942.82,
    baseAmount: 799.00,
    taxAmount: 143.82,
    dueDate: '2026-10-15',
    status: 'UNPAID'
  }
};

export const MOCK_PLAN_CATALOGUE = [
  {
    id: 'plan-100',
    name: 'Fiber Basic 100 Mbps',
    speed: '100 Mbps',
    monthlyCost: 799,
    dataLimit: 'Unlimited (3.3 TB FUP)',
    isCurrent: true,
  },
  {
    id: 'plan-300',
    name: 'Fiber Super 300 Mbps',
    speed: '300 Mbps',
    monthlyCost: 1199,
    dataLimit: 'Unlimited + Free OTT Bundle (Disney+, Prime)',
    recommended: true,
    isCurrent: false,
  },
  {
    id: 'plan-1000',
    name: 'GigaMax 1 Gbps Ultra',
    speed: '1000 Mbps (1 Gbps)',
    monthlyCost: 2499,
    dataLimit: 'Unlimited + Static IP + Premium OTT Pack',
    isCurrent: false,
  }
];

export const MOCK_OUTAGE_AREAS = {
  '400001': { status: 'NORMAL', areaName: 'South Central District', activeNodes: 42, affectedSubscribers: 0 },
  '400012': { status: 'OUTAGE', areaName: 'Parel Broadband Sector 4', activeNodes: 3, affectedSubscribers: 412, eta: '2 Hours 30 Mins', cause: 'Major Fiber Optic Cable Cut near Railway Bridge' },
  '400050': { status: 'NORMAL', areaName: 'Bandra West Substation', activeNodes: 58, affectedSubscribers: 0 },
  '400099': { status: 'MAINTENANCE', areaName: 'Andheri East Hub', activeNodes: 12, affectedSubscribers: 85, eta: '45 Mins', cause: 'Scheduled OLT Firmware Upgrade' }
};

export const RISK_REGISTER = [
  {
    id: 'R-01',
    title: 'CEO Scope Creep',
    description: 'CEO expects bot to "handle everything", risking schedule explosion & NLU drift.',
    probability: 0.7,
    impact: 6,
    exposure: 4.2,
    severity: 'HIGH',
    owner: 'Project Lead / PM',
    mitigation: 'Implement strict 5-category scope boundary table with formal sign-off. Any out-of-scope intent automatically defaults to human agent routing.',
    status: 'MITIGATED'
  },
  {
    id: 'R-02',
    title: 'Call-Centre Data Withheld',
    description: 'Call-centre manager fears job losses and refuses to share customer call transcripts.',
    probability: 0.5,
    impact: 7,
    exposure: 3.5,
    severity: 'HIGH',
    owner: 'Change Manager & CEO',
    mitigation: 'Conduct joint stakeholder workshop showcasing HelpBot as an "Agent Copilot". Guarantee zero agent layoffs; transition staff to Tier-2 escalation specialists.',
    status: 'MITIGATED'
  },
  {
    id: 'R-03',
    title: 'Reputation Damage from Bad Answers',
    description: 'Hallucinated or wrong AI answers damage brand reputation among broadband subscribers.',
    probability: 0.4,
    impact: 8,
    exposure: 3.2,
    severity: 'MEDIUM-HIGH',
    owner: 'NLP QA Lead',
    mitigation: 'Enforce rigid Confidence Threshold of 0.75. If NLU score < 0.75, immediately trigger graceful human handover with 0 text hallucination.',
    status: 'MITIGATED'
  },
  {
    id: 'R-04',
    title: 'Billing System Integration Delay',
    description: 'Legacy SOAP/REST billing API integration takes longer than scheduled.',
    probability: 0.3,
    impact: 6,
    exposure: 1.8,
    severity: 'MEDIUM',
    owner: 'Integration Architect',
    mitigation: 'Design loose microservices gateway adapter with asynchronous caching layer and fallback mock schemas.',
    status: 'MITIGATED'
  }
];

export const MOSCOW_REQUIREMENTS = [
  { code: 'FR-01', title: 'Multi-Channel Ingress (Web & WhatsApp)', category: 'Must Have', status: 'Implemented' },
  { code: 'FR-02', title: 'OTP Identity Authentication', category: 'Must Have', status: 'Implemented' },
  { code: 'FR-03', title: 'Bill Query & Ledger Inspection', category: 'Must Have', status: 'Implemented' },
  { code: 'FR-04', title: 'Tariff Plan Upgrade & Provisioning', category: 'Must Have', status: 'Implemented' },
  { code: 'FR-05', title: 'Broadband Speed Diagnostics & Router Probe', category: 'Must Have', status: 'Implemented' },
  { code: 'FR-06', title: 'Regional Outage PIN Status Lookup', category: 'Must Have', status: 'Implemented' },
  { code: 'FR-07', title: 'Payment Gateway Integration', category: 'Must Have', status: 'Implemented' },
  { code: 'FR-08', title: 'Confidence Threshold Handover (<0.75)', category: 'Must Have', status: 'Implemented' },
  { code: 'FR-09', title: 'Contextual Agent CRM Transcript Transfer', category: 'Must Have', status: 'Implemented' },
  { code: 'FR-10', title: 'Executive ROI & Analytics Dashboard', category: 'Should Have', status: 'Implemented' },
  { code: 'NFR-01', title: 'Answer Accuracy Target (≥ 95% on Top 5)', category: 'Must Have', target: '≥ 95%', achieved: '96.4%' },
  { code: 'NFR-02', title: 'API Response Latency Target (≤ 2.0 sec)', category: 'Must Have', target: '≤ 2.0s', achieved: '0.85s' },
  { code: 'NFR-03', title: 'Zero Context Loss on Handover', category: 'Must Have', target: '100% Transfer', achieved: '100%' },
  { code: 'NFR-04', title: 'Data Privacy & TLS 1.3 Encryption', category: 'Must Have', target: 'IEEE 830 Privacy', achieved: 'Compliant' },
  { code: 'NFR-05', title: 'Availability SLA (99.9% Uptime)', category: 'Should Have', target: '99.9%', achieved: '99.95%' },
  { code: 'NFR-06', title: 'Defect Removal Efficiency (DRE ≥ 80%)', category: 'Must Have', target: '≥ 80%', achieved: '92.3%' },
  { code: 'NFR-07', title: 'Concurrency (1,500 simultaneous chats)', category: 'Should Have', target: '1,500 chats', achieved: 'Tested' },
];

export const HANDOVER_QUEUE_SEED = [
  {
    ticketId: 'HO-8841',
    subscriberName: 'Rajesh Kumar',
    accountNo: 'HB-772104',
    channel: 'WhatsApp',
    reason: 'Low Confidence (0.62) - Complex Bill Discrepancy',
    confidenceScore: 0.62,
    timestamp: '2 mins ago',
    status: 'PENDING_AGENT',
    messages: [
      { sender: 'user', text: 'Hi, why is my bill ₹400 higher this month?' },
      { sender: 'bot', text: 'Let me fetch your invoice... Your base plan is ₹799 + ₹400 international static IP addon charged on Sep 22nd.' },
      { sender: 'user', text: 'I never requested any static IP addon! Please refund this immediately or cancel my line.' },
      { sender: 'system', text: '⚡ Confidence score 0.62 dropped below 0.75 threshold. Automated Seamless Handover Triggered.' }
    ]
  },
  {
    ticketId: 'HO-8842',
    subscriberName: 'Priya Sharma',
    accountNo: 'HB-661902',
    channel: 'Web Self-Care',
    reason: 'Explicit User Request ("Talk to Human")',
    confidenceScore: 0.89,
    timestamp: '5 mins ago',
    status: 'IN_PROGRESS',
    assignedAgent: 'Support Specialist Vikram',
    messages: [
      { sender: 'user', text: 'My internet speed test shows only 15 Mbps instead of 300 Mbps.' },
      { sender: 'bot', text: 'I ran a diagnostic on line #HB-661902. Optical power is healthy (-18.4 dBm). Have you tried restarting your optical router?' },
      { sender: 'user', text: 'Yes I restarted 3 times already. Connect me to a real person right now.' },
      { sender: 'system', text: '👤 User requested human handover. Session context transferred to Agent CRM.' }
    ]
  },
  {
    ticketId: 'HO-8843',
    subscriberName: 'Vikramaditya S.',
    accountNo: 'HB-110293',
    channel: 'WhatsApp',
    reason: 'Out of Scope Intent - Relocation Request',
    confidenceScore: 0.41,
    timestamp: '12 mins ago',
    status: 'RESOLVED',
    assignedAgent: 'Support Specialist Ananya',
    messages: [
      { sender: 'user', text: 'I want to transfer my broadband connection to a new apartment in Thane.' },
      { sender: 'bot', text: 'I specialize in bill queries, plan changes, speed diagnostics, outages, and payments. I will connect you to our relocation desk agent.' },
      { sender: 'system', text: '⚡ Out of scope category. Seamless Handover executed.' }
    ]
  }
];
