import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table } from "react-bootstrap";
import {
  FaEnvelope,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import StatsCard from "../../components/dashboard/StatsCard";
import ActivityFeed from "../../components/dashboard/ActivityFeed";
import { workflowService } from "../../services/workflowService";
import "./Dashboard.scss";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalWorkflows: 0,
    activeWorkflows: 0,
    totalExecutions: 0,
    successRate: 0,
    pendingCommunications: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await workflowService.getDashboardStats();
      setStats(data);
      setRecentActivity(data.recentActivity);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
  };

  return (
    <div className="dashboard">
      <h2 className="mb-4">Dashboard</h2>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={6} lg={3}>
          <StatsCard
            title="Total Workflows"
            value={stats.totalWorkflows}
            icon={FaProjectDiagram}
            color="primary"
            trend={+12}
          />
        </Col>
        <Col md={6} lg={3}>
          <StatsCard
            title="Active Workflows"
            value={stats.activeWorkflows}
            icon={FaCheckCircle}
            color="success"
            trend={+5}
          />
        </Col>
        <Col md={6} lg={3}>
          <StatsCard
            title="Total Executions"
            value={stats.totalExecutions}
            icon={FaClock}
            color="info"
            trend={+28}
          />
        </Col>
        <Col md={6} lg={3}>
          <StatsCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            icon={FaArrowUp}
            color="warning"
            trend={+3}
          />
        </Col>
      </Row>

      {/* Charts and Activity */}
      <Row className="g-4">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Workflow Performance</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: "300px" }}>
                {/* Add Chart Component Here */}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <ActivityFeed activities={recentActivity} />
        </Col>
      </Row>

      {/* Recent Communications */}
      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Communications</h5>
              <Badge bg="primary">{stats.pendingCommunications} Pending</Badge>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>From/To</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>{/* Map through communications */}</tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
