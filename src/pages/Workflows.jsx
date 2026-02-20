import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Modal, Form } from 'react-bootstrap';
import { FaPlus, FaTrash, FaPlay, FaPause } from 'react-icons/fa';

// Dados mock iniciais
const initialWorkflows = [
  {
    id: 1,
    name: 'Customer Onboarding',
    description: 'Automated customer welcome process',
    status: 'active',
    category: 'customer',
    steps: 5,
    executions: 150
  },
  {
    id: 2,
    name: 'Invoice Processing',
    description: 'Automatic invoice handling',
    status: 'paused',
    category: 'finance',
    steps: 3,
    executions: 320
  },
  {
    id: 3,
    name: 'Email Marketing',
    description: 'Scheduled email campaigns',
    status: 'active',
    category: 'marketing',
    steps: 4,
    executions: 89
  }
];

const Workflows = () => {
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    status: 'draft'
  });

  // Handler para inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Criar novo workflow
  const handleCreateWorkflow = () => {
    if (!formData.name.trim()) {
      alert('Please enter a workflow name');
      return;
    }

    const newWorkflow = {
      id: Date.now(),
      ...formData,
      steps: 0,
      executions: 0
    };

    setWorkflows([...workflows, newWorkflow]);
    setShowModal(false);
    setFormData({
      name: '',
      description: '',
      category: 'general',
      status: 'draft'
    });
  };

  // Deletar workflow
  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      setWorkflows(workflows.filter(w => w.id !== id));
    }
  };

  // Toggle status
  const toggleStatus = (id) => {
    setWorkflows(workflows.map(w => 
      w.id === id 
        ? { ...w, status: w.status === 'active' ? 'paused' : 'active' }
        : w
    ));
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      active: 'success',
      paused: 'warning',
      draft: 'secondary'
    };
    return colors[status] || 'primary';
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h2>Workflows</h2>
          <p className="text-muted">Manage your automation workflows</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FaPlus className="me-2" />
            Create New Workflow
          </Button>
        </Col>
      </Row>

      {/* Workflow Grid */}
      <Row>
        {workflows.map(workflow => (
          <Col lg={4} md={6} key={workflow.id} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <span className={`badge bg-${getStatusColor(workflow.status)}`}>
                  {workflow.status}
                </span>
                <Button 
                  variant="link" 
                  className="text-danger p-0"
                  onClick={() => handleDelete(workflow.id)}
                >
                  <FaTrash />
                </Button>
              </Card.Header>
              <Card.Body>
                <Card.Title>{workflow.name}</Card.Title>
                <Card.Text className="text-muted small">
                  {workflow.description}
                </Card.Text>
                
                <div className="mt-3">
                  <span className="badge bg-light text-dark me-2">
                    {workflow.category}
                  </span>
                  <span className="badge bg-light text-dark">
                    {workflow.steps} steps
                  </span>
                </div>

                <div className="mt-3 text-muted small">
                  Executions: {workflow.executions}
                </div>
              </Card.Body>
              <Card.Footer className="bg-white border-0">
                <Button 
                  variant={workflow.status === 'active' ? 'outline-warning' : 'outline-success'}
                  size="sm"
                  onClick={() => toggleStatus(workflow.id)}
                  className="me-2"
                >
                  {workflow.status === 'active' ? <FaPause /> : <FaPlay />}
                  {workflow.status === 'active' ? ' Pause' : ' Start'}
                </Button>
                <Button variant="outline-primary" size="sm">
                  Edit
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Create Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Workflow</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Workflow Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Customer Onboarding"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                placeholder="Describe what this workflow does..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="general">General</option>
                <option value="customer">Customer</option>
                <option value="sales">Sales</option>
                <option value="marketing">Marketing</option>
                <option value="finance">Finance</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Initial Status</Form.Label>
              <Form.Select 
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateWorkflow}>
            Create Workflow
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Workflows;