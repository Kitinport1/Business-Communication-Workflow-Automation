import { useState, useEffect } from "react";
import { workflowService } from "../services/workflowService";
import { toast } from "react-toastify";

export const useWorkflow = (workflowId) => {
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (workflowId) {
      loadWorkflow();
    }
  }, [workflowId]);

  const loadWorkflow = async () => {
    try {
      setLoading(true);
      const data = await workflowService.getById(workflowId);
      setWorkflow(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load workflow");
    } finally {
      setLoading(false);
    }
  };

  const updateWorkflow = async (updatedData) => {
    try {
      const result = await workflowService.update(workflowId, updatedData);
      setWorkflow(result);
      toast.success("Workflow updated successfully");
      return result;
    } catch (err) {
      toast.error("Failed to update workflow");
      throw err;
    }
  };

  const executeWorkflow = async (inputData) => {
    try {
      const result = await workflowService.execute(workflowId, inputData);
      toast.success("Workflow executed successfully");
      return result;
    } catch (err) {
      toast.error("Workflow execution failed");
      throw err;
    }
  };

  return {
    workflow,
    loading,
    error,
    updateWorkflow,
    executeWorkflow,
    refresh: loadWorkflow,
  };
};
