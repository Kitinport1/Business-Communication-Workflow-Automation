import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Badge, Button, 
  Modal, Form, ProgressBar, Dropdown 
} from 'react-bootstrap';
import { 
  FaPlay, FaPause, FaEdit, FaTrash, FaCopy, 
  FaPlus, FaChartLine, FaClock, FaCheckCircle,
  FaExclamationTriangle, FaEye, FaFilter
} from 'react-icons/fa';
import { useWorkflow } from '../context/WorkflowContext';
import WorkflowBuilder from '../components/workflows/WorkflowBuilder';

const Workflows = () => {
  const { 
    workflows, 
    loading, 
    executionHistory,
    loadWorkflows,
    executeWorkflow,
    pauseWorkflow,
    activateWorkflow,
    duplicateWorkflow,
    deleteWorkflow,
    getStats 
  } = useWorkflow();

  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    paused: 0,
    totalExecutions: 0,
    avgSuccessRate: 0,
    totalTime: 0
  });

  useEffect(() => {
    loadWorkflows();
  }, []);

  useEffect(() => {
    setStats(getStats());
  }, [workflows]);

  const handleExecute = (workflow) => {
    if (workflow.status === 'active') {
      executeWorkflow(workflow.id);
    } else if (workflow.status === 'paused') {
      activateWorkflow(workflow.id);
    }
  };

  const handlePause = (workflowId) => {
    pauseWorkflow(workflowId);
  };

  const handleDuplicate = (workflowId) => {
    duplicateWorkflow(workflowId);
  };

  const handleDelete = (workflowId, workflowName) => {
    if (window.confirm(`Delete "${workflowName}"?`)) {
      deleteWorkflow(workflowId);
    }
  };

  const handleEdit = (workflow) => {
    setSelectedWorkflow(workflow);
    setShowBuilder(true);
  };

  const getStatusBadge = (status) => {
    const config = {
      active: { bg: 'success', icon: FaCheckCircle, text: 'Active' },
      paused: { bg: 'warning', icon: FaPause, text: 'Paused' },
      draft: { bg: 'secondary', icon: FaEdit, text: 'Draft' }
    };
    const { bg, icon: Icon, text } = config[status] || config.draft;
    
    return (
      <Badge bg={bg} className="d-flex align-items-center gap-1 px-3 py-2">
        <Icon size={12} />
        <span>{text}</span>
      </Badge>
    );
  };

  const filteredWorkflows = workflows.filter(w => 
    filter === 'all' || w.status === filter
  );

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(0);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-1">Workflows</h2>
          <p className="text-muted mb-0">Design, execute and monitor your automation workflows</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => {
            setSelectedWorkflow(null);
            setShowBuilder(true);
          }}>
            <FaPlus className="me-2" />
            New Workflow
          </Button>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col xl={2} lg={4} md={6}>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-white-50 mb-1">Total</h6>
                <h3 className="mb-0">{stats.total}</h3>
              </div>
              <FaChartLine size={30} className="opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={2} lg={4} md={6}>
          <Card className="border-0 shadow-sm bg-success text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-white-50 mb-1">Active</h6>
                <h3 className="mb-0">{stats.active}</h3>
              </div>
              <FaPlay size={30} className="opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={2} lg={4} md={6}>
          <Card className="border-0 shadow-sm bg-warning text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-white-50 mb-1">Paused</h6>
                <h3 className="mb-0">{stats.paused}</h3>
              </div>
              <FaPause size={30} className="opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={2} lg={4} md={6}>
          <Card className="border-0 shadow-sm bg-info text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-white-50 mb-1">Executions</h6>
                <h3 className="mb-0">{stats.totalExecutions}</h3>
              </div>
              <FaEye size={30} className="opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={2} lg={4} md={6}>
          <Card className="border-0 shadow-sm bg-success text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-white-50 mb-1">Success Rate</h6>
                <h3 className="mb-0">{stats.avgSuccessRate}%</h3>
              </div>
              <FaCheckCircle size={30} className="opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={2} lg={4} md={6}>
          <Card className="border-0 shadow-sm bg-secondary text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-white-50 mb-1">Total Time</h6>
                <h3 className="mb-0">{formatTime(stats.totalTime)}</h3>
              </div>
              <FaClock size={30} className="opacity-50" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col xs="auto">
          <div className="d-flex gap-2">
            <Button 
              variant={filter === 'all' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={filter === 'active' ? 'success' : 'outline-success'}
              size="sm"
              onClick={() => setFilter('active')}
            >
              Active
            </Button>
            <Button 
              variant={filter === 'paused' ? 'warning' : 'outline-warning'}
              size="sm"
              onClick={() => setFilter('paused')}
            >
              Paused
            </Button>
            <Button 
              variant={filter === 'draft' ? 'secondary' : 'outline-secondary'}
              size="sm"
              onClick={() => setFilter('draft')}
            >
              Draft
            </Button>
          </div>
        </Col>
      </Row>

      {/* Workflows Grid */}
      <Row className="g-4">
        {filteredWorkflows.map(workflow => (
          <Col xl={4} lg={6} key={workflow.id}>
            <Card className="workflow-card h-100 border-0 shadow-sm">
              <Card.Header className="bg-white d-flex justify-content-between align-items-center border-0 pt-4 px-4">
                {getStatusBadge(workflow.status)}
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" className="text-dark p-0">
                    ⋮
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleEdit(workflow)}>
                      <FaEdit className="me-2" /> Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDuplicate(workflow.id)}>
                      <FaCopy className="me-2" /> Duplicate
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item 
                      className="text-danger"
                      onClick={() => handleDelete(workflow.id, workflow.name)}
                    >
                      <FaTrash className="me-2" /> Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Card.Header>

              <Card.Body className="px-4">
                <Card.Title className="h5 mb-2">{workflow.name}</Card.Title>
                <Card.Text className="text-muted small mb-3">
                  {workflow.description}
                </Card.Text>

                <div className="mb-3">
                  <Badge bg="light" text="dark" className="me-2 px-3 py-2">
                    ⚡ {workflow.trigger}
                  </Badge>
                  <Badge bg="light" text="dark" className="px-3 py-2">
                    📊 {workflow.steps?.length || 0} steps
                  </Badge>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small className="text-muted">Success Rate</small>
                    <small className="fw-bold">{workflow.successRate}%</small>
                  </div>
                  <ProgressBar 
                    now={workflow.successRate} 
                    variant={workflow.successRate > 80 ? 'success' : 'warning'}
                    className="mb-2"
                    style={{ height: '6px' }}
                  />
                  
                  <div className="d-flex justify-content-between text-muted small">
                    <span>
                      <FaEye className="me-1" size={12} />
                      {workflow.executions} runs
                    </span>
                    <span>
                      <FaClock className="me-1" size={12} />
                      {workflow.avgTime}s avg
                    </span>
                  </div>
                </div>

                {workflow.lastRun && (
                  <small className="text-muted d-block">
                    Last run: {new Date(workflow.lastRun).toLocaleString()}
                  </small>
                )}
              </Card.Body>

              <Card.Footer className="bg-white border-0 px-4 pb-4 pt-0">
                <div className="d-flex gap-2">
                  {workflow.status === 'active' ? (
                    <>
                      <Button 
                        variant="outline-warning"
                        className="flex-grow-1"
                        onClick={() => handlePause(workflow.id)}
                      >
                        <FaPause className="me-2" />
                        Pause
                      </Button>
                      <Button 
                        variant="success"
                        className="flex-grow-1"
                        onClick={() => handleExecute(workflow)}
                      >
                        <FaPlay className="me-2" />
                        Run
                      </Button>
                    </>
                  ) : workflow.status === 'paused' ? (
                    <>
                      <Button 
                        variant="success"
                        className="flex-grow-1"
                        onClick={() => activateWorkflow(workflow.id)}
                      >
                        <FaPlay className="me-2" />
                        Activate
                      </Button>
                      <Button 
                        variant="outline-primary"
                        className="flex-grow-1"
                        onClick={() => handleEdit(workflow)}
                      >
                        <FaEdit className="me-2" />
                        Edit
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="primary"
                      className="flex-grow-1"
                      onClick={() => handleEdit(workflow)}
                    >
                      <FaEdit className="me-2" />
                      Configure
                    </Button>
                  )}
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Execution History */}
      {executionHistory.length > 0 && (
        <Row className="mt-5">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0">Recent Executions</h5>
              </Card.Header>
              <Card.Body>
                {executionHistory.slice(0, 5).map(exec => (
                  <div key={exec.id} className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                    <div>
                      <strong>{exec.workflowName}</strong>
                      <br />
                      <small className="text-muted">
                        {new Date(exec.timestamp).toLocaleString()}
                      </small>
                    </div>
                    <div className="text-end">
                      <Badge bg={exec.success ? 'success' : 'danger'} className="mb-1">
                        {exec.success ? 'Success' : 'Failed'}
                      </Badge>
                      <br />
                      <small className="text-muted">
                        {exec.duration.toFixed(1)}s • {exec.successCount}/{exec.totalSteps} steps
                      </small>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Workflow Builder Modal */}
      <Modal 
        show={showBuilder} 
        onHide={() => setShowBuilder(false)}
        size="xl"
        fullscreen="lg-down"
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            {selectedWorkflow ? `Edit: ${selectedWorkflow.name}` : 'Create New Workflow'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <WorkflowBuilder 
            workflow={selectedWorkflow}
            onClose={() => setShowBuilder(false)}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Workflows;