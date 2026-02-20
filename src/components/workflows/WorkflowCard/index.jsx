import React from "react";
import { Card, Badge, Button, ProgressBar } from "react-bootstrap";
import { FaPlay, FaPause, FaEdit, FaTrash, FaChartLine } from "react-icons/fa";
import "./WorkflowCard.scss";

const WorkflowCard = ({ workflow, onAction }) => {
  const getStatusVariant = (status) => {
    const variants = {
      active: "success",
      paused: "warning",
      error: "danger",
      draft: "secondary",
    };
    return variants[status] || "primary";
  };

  return (
    <Card className="workflow-card h-100 shadow-sm hover-effect">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <div
            className={`status-indicator bg-${getStatusVariant(workflow.status)} me-2`}
          />
          <Badge bg={getStatusVariant(workflow.status)}>
            {workflow.status}
          </Badge>
        </div>
        <div className="workflow-actions">
          <Button
            variant="link"
            size="sm"
            onClick={() => onAction("edit", workflow)}
          >
            <FaEdit />
          </Button>
          <Button
            variant="link"
            size="sm"
            className="text-danger"
            onClick={() => onAction("delete", workflow)}
          >
            <FaTrash />
          </Button>
        </div>
      </Card.Header>

      <Card.Body>
        <Card.Title className="h5 mb-3">{workflow.name}</Card.Title>
        <Card.Text className="text-muted small mb-3">
          {workflow.description}
        </Card.Text>

        {/* Workflow Stats */}
        <div className="workflow-stats mb-3">
          <div className="d-flex justify-content-between mb-1">
            <small>Success Rate</small>
            <small className="fw-bold">{workflow.successRate}%</small>
          </div>
          <ProgressBar
            now={workflow.successRate}
            variant={workflow.successRate > 80 ? "success" : "warning"}
            className="mb-2"
          />

          <div className="d-flex justify-content-between text-muted small">
            <span>
              <FaChartLine className="me-1" /> {workflow.executions} executions
            </span>
            <span>⏱️ {workflow.avgTime}s</span>
          </div>
        </div>

        {/* Triggers */}
        <div className="triggers mb-3">
          <small className="text-muted d-block mb-2">Triggers:</small>
          {workflow.triggers.map((trigger, idx) => (
            <Badge key={idx} bg="light" text="dark" className="me-1 mb-1">
              {trigger}
            </Badge>
          ))}
        </div>
      </Card.Body>

      <Card.Footer className="bg-white border-0 d-flex justify-content-between">
        <Button
          variant={
            workflow.status === "active" ? "outline-warning" : "outline-success"
          }
          size="sm"
          onClick={() =>
            onAction(workflow.status === "active" ? "pause" : "start", workflow)
          }
        >
          {workflow.status === "active" ? <FaPause /> : <FaPlay />}
          {workflow.status === "active" ? " Pause" : " Start"}
        </Button>
        <Button variant="outline-primary" size="sm">
          View Details
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default WorkflowCard;
