import api from './api';

export const workflowService = {
  // Get all workflows
  getAll: async () => {
    try {
      const response = await api.get('/workflows');
      return response.data;
    } catch (error) {
      console.log('Using mock data');
      // Return mock data for development
      return [
        { 
          id: 1, 
          name: 'Customer Onboarding', 
          description: 'Automated customer welcome and setup process',
          status: 'active', 
          category: 'customer',
          trigger: 'email',
          executions: 150,
          successRate: '98%',
          steps: [],
          stats: { executions: 150, successRate: '98%' }
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
          steps: [],
          stats: { executions: 320, successRate: '95%' }
        }
      ];
    }
  },

  // Get workflow by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/workflows/${id}`);
      return response.data;
    } catch (error) {
      console.log('Using mock data for workflow', id);
      return { id, name: 'Mock Workflow', steps: [] };
    }
  },

  // Create new workflow
  create: async (workflow) => {
    try {
      const response = await api.post('/workflows', workflow);
      return response.data;
    } catch (error) {
      console.log('Mock create workflow', workflow);
      return { ...workflow, id: Date.now() };
    }
  },

  // Update workflow
  update: async (id, workflow) => {
    try {
      const response = await api.put(`/workflows/${id}`, workflow);
      return response.data;
    } catch (error) {
      console.log('Mock update workflow', id, workflow);
      return { ...workflow, id };
    }
  },

  // Delete workflow
  delete: async (id) => {
    try {
      await api.delete(`/workflows/${id}`);
      return true;
    } catch (error) {
      console.log('Mock delete workflow', id);
      return true;
    }
  },

  // Execute workflow
  execute: async (id, data) => {
    try {
      const response = await api.post(`/workflows/${id}/execute`, data);
      return response.data;
    } catch (error) {
      console.log('Mock execute workflow', id, data);
      return { success: true, executionId: Date.now() };
    }
  },

  // Get workflow logs
  getLogs: async (id) => {
    try {
      const response = await api.get(`/workflows/${id}/logs`);
      return response.data;
    } catch (error) {
      return [];
    }
  }
};