import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, ProgressBar, ButtonGroup, Button } from 'react-bootstrap';
import { 
  FaChartLine, FaDownload, FaArrowUp, FaArrowDown
} from 'react-icons/fa';
import { useWorkflow } from '../context/WorkflowContext';

const Analytics = () => {
  const { workflows, executionHistory } = useWorkflow();
  const [period, setPeriod] = useState('week');
  const [analytics, setAnalytics] = useState({
    totalExecutions: 0,
    successRate: 0,
    avgResponseTime: 0,
    totalTime: 0,
    topWorkflows: []
  });

  useEffect(() => {
    calculateAnalytics();
  }, [workflows, period]);

  const calculateAnalytics = () => {
    const totalExecs = workflows.reduce((acc, w) => acc + (w.executions || 0), 0);
    const totalSuccess = workflows.reduce((acc, w) => acc + (w.successCount || 0), 0);
    const successRate = totalExecs > 0 ? (totalSuccess / totalExecs) * 100 : 0;
    const avgTime = workflows.reduce((acc, w) => acc + (w.avgTime || 0), 0) / workflows.length || 0;
    const totalTime = workflows.reduce((acc, w) => acc + (w.totalTime || 0), 0);

    const topWorkflows = [...workflows]
      .sort((a, b) => (b.executions || 0) - (a.executions || 0))
      .slice(0, 5);

    setAnalytics({
      totalExecutions: totalExecs,
      successRate: successRate.toFixed(1),
      avgResponseTime: avgTime.toFixed(1),
      totalTime: totalTime.toFixed(1),
      topWorkflows
    });
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0s';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(0);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-1">Analytics</h2>
          <p className="text-muted">Workflow performance and metrics</p>
        </Col>
        <Col xs="auto">
          <ButtonGroup className="me-2">
            <Button 
              variant={period === 'day' ? 'primary' : 'outline-primary'}
              onClick={() => setPeriod('day')}
            >
              Day
            </Button>
            <Button 
              variant={period === 'week' ? 'primary' : 'outline-primary'}
              onClick={() => setPeriod('week')}
            >
              Week
            </Button>
            <Button 
              variant={period === 'month' ? 'primary' : 'outline-primary'}
              onClick={() => setPeriod('month')}
            >
              Month
            </Button>
          </ButtonGroup>
          <Button variant="outline-primary">
            <FaDownload /> Export
          </Button>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body>
              <h6>Total Executions</h6>
              <h2>{analytics.totalExecutions}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-success text-white">
            <Card.Body>
              <h6>Success Rate</h6>
              <h2>{analytics.successRate}%</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-info text-white">
            <Card.Body>
              <h6>Avg Response Time</h6>
              <h2>{analytics.avgResponseTime}s</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-warning text-white">
            <Card.Body>
              <h6>Total Processing Time</h6>
              <h2>{formatTime(analytics.totalTime)}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Top Performing Workflows</h5>
            </Card.Header>
            <Card.Body>
              <Table hover>
                <thead>
                  <tr>
                    <th>Workflow</th>
                    <th>Executions</th>
                    <th>Success Rate</th>
                    <th>Avg Time</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topWorkflows.map(w => (
                    <tr key={w.id}>
                      <td className="fw-bold">{w.name}</td>
                      <td>{w.executions || 0}</td>
                      <td>
                        <Badge bg={(w.successRate || 0) > 90 ? 'success' : 'warning'}>
                          {w.successRate || 0}%
                        </Badge>
                      </td>
                      <td>{w.avgTime || 0}s</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Recent Activity</h5>
            </Card.Header>
            <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {executionHistory?.slice(0, 10).map(exec => (
                <div key={exec.id} className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <div>
                    <h6 className="mb-1">{exec.workflowName}</h6>
                    <small className="text-muted">
                      {new Date(exec.timestamp).toLocaleString()}
                    </small>
                  </div>
                  <div className="text-end">
                    <Badge bg={exec.success ? 'success' : 'danger'}>
                      {exec.success ? 'Success' : 'Failed'}
                    </Badge>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Analytics;