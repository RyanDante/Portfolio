import { Project, SystemLog } from '../types';

export const PROJECTS: Omit<Project, 'id'>[] = [
  {
    title: 'SOS_OFFLINE',
    tagline: 'DeploymentManifest.v2',
    description: 'A high-resilience emergency messaging framework designed for urban crises where cellular networks are either congested or disabled by authorities.',
    env: 'Android / Firebase (Local) / BLE',
    stableSince: 'Q1 2025',
    features: [
      { name: 'Mesh Protocol', text: 'Uses BLE 5.0 to hop message packets between devices within 100m radius.' },
      { name: 'SMS Gateway', text: 'Opportunistic bridging: if one device finds 2G signal, it auto-relays the entire local mesh buffer via SMS.' }
    ],
    stack: ['Flutter', 'SQLite', 'C++', 'Protobuf'],
    impact: 'Reduced emergency response times in zero-connectivity experimental zones by 40%. Framework now supports up to 50 active nodes in a single mesh cluster.',
    logic: 'The system optimizes for power-efficiency, idling BLE scans until a broadcast trigger is detected.',
    iconName: 'Radio',
    status: 'PROD_READY',
    problemSpace: 'Emergency alerts fail in zero-connectivity zones. SMS-to-IP bridging required.',
    repoUrl: 'https://github.com/dante-eng/sos-offline',
    order: 0
  },
  {
    title: 'M-PAY_BRIDGE',
    tagline: 'LegacyConnector.bridge',
    description: 'Bridging the gap between legacy USSD payment flows and modern webhooks for automated fulfillment.',
    env: 'Node.js / React Native SDK',
    stableSince: 'Q3 2024',
    features: [
      { name: 'USSD Scraper', text: 'Automated response parsing of incoming payment confirmation SMS.' },
      { name: 'Webhook Relay', text: 'Converts local SMS signals into authenticated JSON POST requests.' }
    ],
    stack: ['Node.js', 'React Native', 'Redis', 'WebSockets'],
    impact: 'Abstracted USSD complexity for 12 local vendors, enabling "instant-pay" features on previously manual WhatsApp storefronts.',
    logic: 'Asynchronous USSD session management allows for concurrent payment tracking.',
    iconName: 'Wallet',
    status: 'BETA_DEV',
    problemSpace: 'Complex USSD flows inhibit rapid mobile money integration. Requires abstraction layer.',
    repoUrl: 'https://github.com/dante-eng/mpay-bridge',
    order: 1
  },
  {
    title: 'BOT_BILL',
    tagline: 'NLUProcess.v1',
    description: 'Intelligent billing assistant that monitors receipts and automates accounting for informal retail.',
    env: 'Python / WhatsApp Cloud API',
    stableSince: 'Q2 2024',
    features: [
      { name: 'NL Processing', text: 'Captures and extracts ID, amount, and sender from generic carrier SMS.' },
      { name: 'Auto-Invoice', text: 'Generates PDF receipts and updates Google Sheets instantly.' }
    ],
    stack: ['Python', 'OpenAI API', 'Twilio', 'FastAPI'],
    impact: 'Automated 1,200+ monthly transactions for a Douala-based retail chain, eliminating manual verification errors entirely.',
    logic: 'Recursive regex-matching ensures 99.9% accuracy across various mobile carrier message formats.',
    iconName: 'MessageSquare',
    status: 'STABLE',
    problemSpace: 'Manual verification of payment SMS is inefficient. Dynamic text parsing required.',
    repoUrl: 'https://github.com/dante-eng/bot-bill',
    order: 2
  },
  {
    title: 'GUSTO_SYNC',
    tagline: 'ResilienceEngine.sync',
    description: 'Offline-first POS engine for restaurant clusters in areas with frequent data blackouts.',
    env: 'React Native / WatermelonDB',
    stableSince: 'Q4 2024',
    features: [
      { name: 'Conflict Resolution', text: 'Last-write-wins with logical clock timestamps for concurrent entries.' },
      { name: 'Sync Strategy', text: 'Lazy-loading replication: syncs high-prio data when bandwidth is < 50kbps.' }
    ],
    stack: ['React Native', 'WatermelonDB', 'SQLite', 'GraphQL'],
    impact: 'Maintained 100% data integrity during 3 separate municipal network outages. Sync latency under 2 seconds upon signal recovery.',
    logic: 'Data stays purely local during operation, minimizing API wait-times and maximizing service speed.',
    iconName: 'Utensils',
    status: 'PROD_READY',
    problemSpace: 'Cloud-only POS systems fail during blackouts. Offline-first synchronization required.',
    repoUrl: 'https://github.com/dante-eng/gusto-sync',
    order: 3
  }
];

export const LOGS: SystemLog[] = [
  { id: '2026.04.12', tag: 'USSD_OPTIMIZATION', title: 'Reduced handshake latency in M-Pay Bridge', body: 'Modified the dial-stream timeout logic to account for heavy network congestion in the Douala IV region. Resulted in 12% fewer session dropouts.' },
  { id: '2026.03.22', tag: 'OFFLINE_SYNC', title: 'Implementing WatermelonDB for local indexing', body: 'Switched from raw SQLite to WatermelonDB for GustoSync to handle relational data sync more efficiently on low-memory Android devices.' },
  { id: '2026.02.10', tag: 'UI_CORE', title: 'Finalizing high-contrast theme for systems', body: 'Ensured WCAG AAA compliance for all engineering dashboards to assist operators in sunlight-heavy environments.' }
];
