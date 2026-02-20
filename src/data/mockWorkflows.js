// Dados mock para teste
export const mockWorkflows = [
  {
    id: 1,
    name: 'Customer Onboarding',
    description: 'Automated customer welcome and setup process',
    status: 'active',
    category: 'customer',
    trigger: 'email',
    executions: 150,
    successRate: '98%',
    steps: [
      { id: 101, type: 'email', name: 'Send Welcome Email', config: { template: 'welcome' } },
      { id: 102, type: 'slack', name: 'Notify Sales Team', config: { channel: '#sales' } }
    ],
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Invoice Processing',
    description: 'Automatic invoice handling and approval',
    status: 'active',
    category: 'finance',
    trigger: 'webhook',
    executions: 320,
    successRate: '95%',
    steps: [
      { id: 201, type: 'webhook', name: 'Receive Invoice', config: { endpoint: '/invoices' } },
      { id: 202, type: 'condition', name: 'Validate Amount', config: { condition: 'amount < 1000' } }
    ],
    createdAt: '2024-01-10T14:20:00Z'
  },
  {
    id: 3,
    name: 'Email Marketing Campaign',
    description: 'Scheduled email campaigns for leads',
    status: 'paused',
    category: 'marketing',
    trigger: 'schedule',
    executions: 89,
    successRate: '100%',
    steps: [
      { id: 301, type: 'email', name: 'Send Newsletter', config: { template: 'newsletter' } }
    ],
    createdAt: '2024-01-05T09:15:00Z'
  },
  {
    id: 4,
    name: 'Data Sync',
    description: 'Sync data between systems',
    status: 'active',
    category: 'it',
    trigger: 'schedule',
    executions: 567,
    successRate: '92%',
    steps: [
      { id: 401, type: 'database', name: 'Extract Data', config: { query: 'SELECT * FROM users' } },
      { id: 402, type: 'webhook', name: 'Send to API', config: { url: 'https://api.example.com/sync' } }
    ],
    createdAt: '2024-01-01T08:00:00Z'
  }
];