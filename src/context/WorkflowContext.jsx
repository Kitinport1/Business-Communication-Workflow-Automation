import React, { createContext, useState, useContext, useCallback } from 'react';

// Dados iniciais com todos os campos necessários
const initialWorkflows = [
  {
    id: 1,
    name: 'Customer Onboarding',
    description: 'Automated customer welcome and setup process',
    status: 'active',
    category: 'customer',
    trigger: 'New Customer Signup',
    steps: [
      { id: 101, name: 'Send Welcome Email', type: 'email', status: 'success', duration: 1.2 },
      { id: 102, name: 'Create CRM Record', type: 'crm', status: 'success', duration: 0.8 },
      { id: 103, name: 'Notify Sales Team', type: 'slack', status: 'success', duration: 0.5 },
      { id: 104, name: 'Schedule Follow-up', type: 'calendar', status: 'pending', duration: 0 }
    ],
    executions: 245,
    successCount: 240,
    failedCount: 5,
    successRate: 98,
    avgTime: 2.5,
    totalTime: 612.5,
    lastRun: '2024-01-20T10:30:00',
    createdBy: 'Admin',
    createdAt: '2024-01-01T08:00:00',
    triggers: ['New Customer', 'Welcome Email'],
    history: []
  },
  {
    id: 2,
    name: 'Invoice Processing',
    description: 'Automatic invoice handling and approval',
    status: 'active',
    category: 'finance',
    trigger: 'New Invoice Received',
    steps: [
      { id: 201, name: 'Extract Invoice Data', type: 'ai', status: 'success', duration: 1.5 },
      { id: 202, name: 'Validate with PO', type: 'database', status: 'success', duration: 0.9 },
      { id: 203, name: 'Route for Approval', type: 'email', status: 'success', duration: 0.3 }
    ],
    executions: 567,
    successCount: 539,
    failedCount: 28,
    successRate: 95,
    avgTime: 2.7,
    totalTime: 1530.9,
    lastRun: '2024-01-20T09:15:00',
    createdBy: 'Admin',
    createdAt: '2024-01-01T09:00:00',
    triggers: ['New Invoice', 'Payment Received'],
    history: []
  },
  {
    id: 3,
    name: 'Email Marketing Campaign',
    description: 'Scheduled email campaigns for leads',
    status: 'paused',
    category: 'marketing',
    trigger: 'Schedule',
    steps: [
      { id: 301, name: 'Segment Audience', type: 'database', status: 'success', duration: 1.8 },
      { id: 302, name: 'Personalize Content', type: 'ai', status: 'success', duration: 2.1 },
      { id: 303, name: 'Send Emails', type: 'email', status: 'success', duration: 3.4 }
    ],
    executions: 189,
    successCount: 189,
    failedCount: 0,
    successRate: 100,
    avgTime: 7.3,
    totalTime: 1379.7,
    lastRun: '2024-01-19T14:00:00',
    createdBy: 'Marketing',
    createdAt: '2024-01-02T10:00:00',
    triggers: ['Schedule', 'Campaign Start'],
    history: []
  },
  {
    id: 4,
    name: 'Data Sync',
    description: 'Sync data between systems',
    status: 'draft',
    category: 'it',
    trigger: 'Manual',
    steps: [
      { id: 401, name: 'Extract from Source', type: 'api', status: 'pending', duration: 0 },
      { id: 402, name: 'Transform Data', type: 'script', status: 'pending', duration: 0 }
    ],
    executions: 0,
    successCount: 0,
    failedCount: 0,
    successRate: 0,
    avgTime: 0,
    totalTime: 0,
    lastRun: null,
    createdBy: 'IT',
    createdAt: '2024-01-20T11:00:00',
    triggers: ['Daily Sync', 'Manual'],
    history: []
  }
];

const WorkflowContext = createContext();

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within WorkflowProvider');
  }
  return context;
};

export const WorkflowProvider = ({ children }) => {
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [executionHistory, setExecutionHistory] = useState([]);

  // Carregar workflows
  const loadWorkflows = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setWorkflows(prev => [...prev]);
      setLoading(false);
    }, 500);
  }, []);

  // Criar workflow
  const createWorkflow = (workflowData) => {
    const newWorkflow = {
      id: Date.now(),
      ...workflowData,
      steps: [],
      executions: 0,
      successCount: 0,
      failedCount: 0,
      successRate: 0,
      avgTime: 0,
      totalTime: 0,
      lastRun: null,
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      status: workflowData.status || 'draft',
      triggers: [workflowData.trigger === 'manual' ? 'Manual' : 'Scheduled'],
      history: []
    };
    
    setWorkflows(prev => [...prev, newWorkflow]);
    return newWorkflow;
  };

  // Executar workflow COM CÁLCULO DE TEMPO REAL
  const executeWorkflow = (workflowId) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (!workflow) return;

    // Registrar início da execução
    const startTime = performance.now();
    const startTimestamp = new Date().toISOString();

    // Simular processamento do workflow (tempo variável baseado nos steps)
    const executionTime = (workflow.steps?.length || 3) * (Math.random() * 0.5 + 0.3); // 0.3-0.8 segundos por passo
    const success = Math.random() > 0.1; // 90% chance de sucesso

    // Calcular tempo de execução
    const timeInSeconds = parseFloat(executionTime.toFixed(1));

    // Atualizar workflow com novos dados
    setWorkflows(prev => prev.map(w => {
      if (w.id === workflowId) {
        const newExecutions = (w.executions || 0) + 1;
        const newSuccessCount = (w.successCount || 0) + (success ? 1 : 0);
        const newFailedCount = (w.failedCount || 0) + (success ? 0 : 1);
        const newSuccessRate = Math.round((newSuccessCount / newExecutions) * 100);
        
        // Calcular nova média de tempo
        const totalTimeSum = ((w.avgTime || 0) * (w.executions || 0)) + timeInSeconds;
        const newAvgTime = parseFloat((totalTimeSum / newExecutions).toFixed(1));
        
        // Registrar no histórico
        const executionRecord = {
          id: Date.now(),
          timestamp: startTimestamp,
          duration: timeInSeconds,
          success,
          steps: workflow.steps?.length || 0,
          details: `Executed ${workflow.steps?.length || 0} steps in ${timeInSeconds.toFixed(1)}s`
        };

        return {
          ...w,
          executions: newExecutions,
          successCount: newSuccessCount,
          failedCount: newFailedCount,
          successRate: newSuccessRate,
          avgTime: newAvgTime,
          totalTime: (w.totalTime || 0) + timeInSeconds,
          lastRun: startTimestamp,
          history: [executionRecord, ...(w.history || [])].slice(0, 10) // Manter últimos 10
        };
      }
      return w;
    }));

    // Adicionar ao log global
    const executionLog = {
      id: Date.now(),
      workflowId: workflow.id,
      workflowName: workflow.name,
      timestamp: startTimestamp,
      duration: timeInSeconds,
      success,
      steps: workflow.steps?.length || 0,
      successCount: success ? 1 : 0,
      totalSteps: workflow.steps?.length || 0
    };

    setExecutionHistory(prev => [executionLog, ...prev].slice(0, 50));

    return {
      success,
      timeInSeconds,
      message: success ? 'Workflow executed successfully' : 'Workflow execution failed'
    };
  };

  // Executar workflow múltiplas vezes para teste
  const executeMultiple = (id, times = 5) => {
    const results = [];
    for (let i = 0; i < times; i++) {
      setTimeout(() => {
        const result = executeWorkflow(id);
        results.push(result);
      }, i * 100); // Executar com intervalo de 100ms
    }
    return results;
  };

  // Pausar workflow
  const pauseWorkflow = (workflowId) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId ? { ...w, status: 'paused' } : w
    ));
  };

  // Ativar workflow
  const activateWorkflow = (workflowId) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId ? { ...w, status: 'active' } : w
    ));
  };

  // Adicionar step
  const addStep = (workflowId, step) => {
    setWorkflows(prev => prev.map(w => {
      if (w.id === workflowId) {
        const newStep = {
          id: Date.now(),
          ...step,
          status: 'pending',
          duration: 0
        };
        return { ...w, steps: [...(w.steps || []), newStep] };
      }
      return w;
    }));
  };

  // Remover step
  const removeStep = (workflowId, stepId) => {
    setWorkflows(prev => prev.map(w => {
      if (w.id === workflowId) {
        return { ...w, steps: (w.steps || []).filter(s => s.id !== stepId) };
      }
      return w;
    }));
  };

  // Atualizar step
  const updateStep = (workflowId, stepId, updates) => {
    setWorkflows(prev => prev.map(w => {
      if (w.id === workflowId) {
        return {
          ...w,
          steps: (w.steps || []).map(s => s.id === stepId ? { ...s, ...updates } : s)
        };
      }
      return w;
    }));
  };

  // Duplicar workflow
  const duplicateWorkflow = (workflowId) => {
    const original = workflows.find(w => w.id === workflowId);
    if (!original) return;

    const duplicate = {
      ...original,
      id: Date.now(),
      name: `${original.name} (Copy)`,
      status: 'draft',
      executions: 0,
      successCount: 0,
      failedCount: 0,
      successRate: 0,
      avgTime: 0,
      totalTime: 0,
      lastRun: null,
      createdAt: new Date().toISOString(),
      steps: (original.steps || []).map(s => ({ ...s, id: Date.now() + Math.random() }))
    };

    setWorkflows(prev => [...prev, duplicate]);
    return duplicate;
  };

  // Deletar workflow
  const deleteWorkflow = (workflowId) => {
    setWorkflows(prev => prev.filter(w => w.id !== workflowId));
  };

  // FUNÇÃO GETSTATS - Obter estatísticas gerais
  const getStats = () => {
    const total = workflows.length;
    const active = workflows.filter(w => w.status === 'active').length;
    const paused = workflows.filter(w => w.status === 'paused').length;
    const draft = workflows.filter(w => w.status === 'draft').length;
    const totalExecutions = workflows.reduce((acc, w) => acc + (w.executions || 0), 0);
    const totalSuccess = workflows.reduce((acc, w) => acc + (w.successCount || 0), 0);
    const avgSuccessRate = totalExecutions > 0 ? (totalSuccess / totalExecutions) * 100 : 0;
    const totalTime = workflows.reduce((acc, w) => acc + (w.totalTime || 0), 0);

    return {
      total,
      active,
      paused,
      draft,
      totalExecutions,
      totalSuccess,
      avgSuccessRate: parseFloat(avgSuccessRate.toFixed(1)),
      totalTime: parseFloat(totalTime.toFixed(1))
    };
  };

  // Obter estatísticas de um workflow específico
  const getWorkflowStats = (id) => {
    const workflow = workflows.find(w => w.id === id);
    if (!workflow) return null;

    const avgTimePerStep = workflow.steps?.length > 0 
      ? (workflow.avgTime / workflow.steps.length).toFixed(2)
      : 0;
    
    const efficiency = workflow.successRate > 95 ? 'Excellent' : 
                      workflow.successRate > 85 ? 'Good' : 
                      workflow.successRate > 70 ? 'Average' : 'Needs Improvement';

    return {
      ...workflow,
      avgTimePerStep,
      efficiency,
      totalSteps: workflow.steps?.length || 0
    };
  };

  // Calcular tempo total de todos os workflows
  const getTotalSystemTime = () => {
    const totalSeconds = workflows.reduce((acc, w) => acc + (w.totalTime || 0), 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = (totalSeconds % 60).toFixed(1);
    
    return { 
      totalSeconds, 
      hours, 
      minutes, 
      seconds,
      formatted: hours > 0 
        ? `${hours}h ${minutes}m ${seconds}s` 
        : minutes > 0 
          ? `${minutes}m ${seconds}s` 
          : `${seconds}s`
    };
  };

  const value = {
    workflows,
    selectedWorkflow,
    loading,
    executionHistory,
    setSelectedWorkflow,
    loadWorkflows,
    createWorkflow,
    executeWorkflow,
    executeMultiple,
    pauseWorkflow,
    activateWorkflow,
    addStep,
    removeStep,
    updateStep,
    duplicateWorkflow,
    deleteWorkflow,
    getStats,
    getWorkflowStats,
    getTotalSystemTime
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};