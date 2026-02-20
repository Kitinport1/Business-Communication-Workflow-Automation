import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, ListGroup } from 'react-bootstrap';
import { FaPlus, FaTrash, FaGripVertical, FaSave, FaTimes } from 'react-icons/fa';
import { useWorkflow } from '../../../context/WorkflowContext';

const WorkflowBuilder = ({ workflow, onClose }) => {
  const { createWorkflow, addStep, removeStep, updateStep } = useWorkflow();
  
  const [formData, setFormData] = useState({
    name: workflow?.name || '',
    description: workflow?.description || '',
    category: workflow?.category || 'general',
    trigger: workflow?.trigger || 'Manual',
    status: workflow?.status || 'draft'
  });

  const [steps, setSteps] = useState(workflow?.steps || []);
  const [showAddStep, setShowAddStep] = useState(false);
  const [newStep, setNewStep] = useState({
    name: '',
    type: 'email',
    config: {}
  });

  const stepTypes = [
    { value: 'email', label: 'Send Email', icon: '📧', color: 'primary' },
    { value: 'slack', label: 'Slack Message', icon: '💬', color: 'success' },
    { value: 'webhook', label: 'Webhook', icon: '🔗', color: 'info' },
    { value: 'database', label: 'Database Query', icon: '🗄️', color: 'warning' },
    { value: 'condition', label: 'Condition', icon: '⚡', color: 'danger' },
    { value: 'delay', label: 'Delay', icon: '⏰', color: 'secondary' },
    { value: 'ai', label: 'AI Process', icon: '🤖', color: 'dark' },
    { value: 'crm', label: 'CRM Action', icon: '📊', color: 'success' },
    { value: 'calendar', label: 'Calendar', icon: '📅', color: 'info' },
    { value: 'api', label: 'API Call', icon: '🌐', color: 'primary' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveWorkflow = () => {
    if (!formData.name) {
      alert('Workflow name is required');
      return;
    }

    if (workflow) {
      // Update existing workflow
      updateStep(workflow.id, steps);
    } else {
      // Create new workflow
      createWorkflow({
        ...formData,
        steps,
        createdAt: new Date().toISOString()
      });
    }
    
    onClose();
  };

  const handleAddStep = () => {
    if (!newStep.name) {
      alert('Step name is required');
      return;
    }

    const step = {
      id: Date.now(),
      ...newStep,
      status: 'pending',
      duration: 0
    };

    setSteps([...steps, step]);
    setNewStep({ name: '', type: 'email', config: {} });
    setShowAddStep(false);
  };

  const handleRemoveStep = (stepId) => {
    setSteps(steps.filter(s => s.id !== stepId));
  };

  return (
    <Container fluid className="p-4">
      {/* Workflow Details */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-3">Workflow Details</h5>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Customer Onboarding"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select name="category" value={formData.category} onChange={handleInputChange}>
                  <option value="general">General</option>
                  <option value="customer">Customer</option>
                  <option value="finance">Finance</option>
                  <option value="marketing">Marketing</option>
                  <option value="it">IT</option>
                  <option value="hr">HR</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what this workflow does..."
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Trigger</Form.Label>
                <Form.Control
                  type="text"
                  name="trigger"
                  value={formData.trigger}
                  onChange={handleInputChange}
                  placeholder="e.g., New Email, Schedule, Webhook"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Steps Builder */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Workflow Steps ({steps.length})</h5>
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => setShowAddStep(!showAddStep)}
          >
            <FaPlus className="me-2" />
            Add Step
          </Button>
        </Card.Header>
        <Card.Body>
          {steps.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p>No steps added yet. Click "Add Step" to start building your workflow.</p>
            </div>
          ) : (
            <ListGroup>
              {steps.map((step, index) => {
                const stepType = stepTypes.find(t => t.value === step.type);
                return (
                  <ListGroup.Item key={step.id} className="d-flex align-items-center">
                    <FaGripVertical className="text-muted me-3" />
                    <Badge bg={stepType?.color || 'secondary'} className="me-3 px-3 py-2">
                      {stepType?.icon} {stepType?.label}
                    </Badge>
                    <div className="flex-grow-1">
                      <strong>{step.name}</strong>
                      {step.config && Object.keys(step.config).length > 0 && (
                        <small className="text-muted ms-2">
                          • {JSON.stringify(step.config)}
                        </small>
                      )}
                    </div>
                    <Button 
                      variant="link" 
                      className="text-danger"
                      onClick={() => handleRemoveStep(step.id)}
                    >
                      <FaTrash />
                    </Button>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          )}

          {/* Add Step Form */}
          {showAddStep && (
            <Card className="mt-4 bg-light border-0">
              <Card.Body>
                <h6 className="mb-3">Add New Step</h6>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Step Type</Form.Label>
                      <Form.Select 
                        value={newStep.type}
                        onChange={(e) => setNewStep({ ...newStep, type: e.target.value })}
                      >
                        {stepTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Step Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={newStep.name}
                        onChange={(e) => setNewStep({ ...newStep, name: e.target.value })}
                        placeholder="e.g., Send Welcome Email"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex gap-2 justify-content-end">
                  <Button variant="secondary" size="sm" onClick={() => setShowAddStep(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleAddStep}>
                    Add Step
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Card.Body>
        <Card.Footer className="bg-white d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            <FaTimes className="me-2" />
            Cancel
          </Button>
          <Button variant="success" onClick={handleSaveWorkflow}>
            <FaSave className="me-2" />
            Save Workflow
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default WorkflowBuilder