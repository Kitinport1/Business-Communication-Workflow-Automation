import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, ProgressBar } from 'react-bootstrap';
import { FaUserPlus, FaUser, FaClock } from 'react-icons/fa';

const Team = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [team, setTeam] = useState([
    { id: 1, name: 'João Silva', email: 'joao@empresa.com', role: 'Admin', status: 'active', lastActive: 'Now', tasks: 12 },
    { id: 2, name: 'Maria Santos', email: 'maria@empresa.com', role: 'Manager', status: 'active', lastActive: '5 min ago', tasks: 8 },
    { id: 3, name: 'Pedro Oliveira', email: 'pedro@empresa.com', role: 'Operator', status: 'away', lastActive: '1 hour ago', tasks: 5 },
    { id: 4, name: 'Ana Costa', email: 'ana@empresa.com', role: 'Operator', status: 'offline', lastActive: '1 day ago', tasks: 0 }
  ]);

  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'operator'
  });

  const handleInvite = () => {
    const newMember = {
      id: Date.now(),
      name: inviteForm.email.split('@')[0],
      email: inviteForm.email,
      role: inviteForm.role === 'admin' ? 'Admin' : 
             inviteForm.role === 'manager' ? 'Manager' : 'Operator',
      status: 'pending',
      lastActive: 'Not yet',
      tasks: 0
    };
    
    setTeam([...team, newMember]);
    setShowInviteModal(false);
    setInviteForm({ email: '', role: 'operator' });
    alert(`Invitation sent to ${inviteForm.email}`);
  };

  const getRoleBadge = (role) => {
    const colors = {
      Admin: 'danger',
      Manager: 'warning',
      Operator: 'info',
      pending: 'secondary'
    };
    return <Badge bg={colors[role] || 'secondary'}>{role}</Badge>;
  };

  const getStatusIndicator = (status) => {
    const colors = {
      active: 'success',
      away: 'warning',
      offline: 'secondary',
      pending: 'secondary'
    };
    return <span className={`status-indicator bg-${colors[status]} me-2`} />;
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-1">Team Management</h2>
          <p className="text-muted">Manage your team members and permissions</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowInviteModal(true)}>
            <FaUserPlus className="me-2" />
            Invite Member
          </Button>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body>
              <h6>Total Members</h6>
              <h3>{team.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-success text-white">
            <Card.Body>
              <h6>Active Now</h6>
              <h3>{team.filter(m => m.status === 'active').length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-info text-white">
            <Card.Body>
              <h6>Total Tasks</h6>
              <h3>{team.reduce((acc, m) => acc + m.tasks, 0)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-warning text-white">
            <Card.Body>
              <h6>Admins</h6>
              <h3>{team.filter(m => m.role === 'Admin').length}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <h5 className="mb-0">Team Members</h5>
        </Card.Header>
        <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Status</th>
                <th>Tasks</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.map(member => (
                <tr key={member.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="bg-light rounded-circle p-2 me-3">
                        <FaUser />
                      </div>
                      <div>
                        <div className="fw-bold">{member.name}</div>
                        <small className="text-muted">{member.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>{getRoleBadge(member.role)}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      {getStatusIndicator(member.status)}
                      {member.status}
                    </div>
                  </td>
                  <td>
                    <ProgressBar 
                      now={(member.tasks / 15) * 100} 
                      style={{ width: '100px', height: '5px' }}
                    />
                    <small className="text-muted">{member.tasks} tasks</small>
                  </td>
                  <td>
                    <FaClock className="text-muted me-2" />
                    {member.lastActive}
                  </td>
                  <td>
                    <Button variant="link" size="sm">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showInviteModal} onHide={() => setShowInviteModal(false)}>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Invite Team Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="colleague@company.com"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select 
                value={inviteForm.role}
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
              >
                <option value="admin">Admin - Full access</option>
                <option value="manager">Manager - Can manage workflows</option>
                <option value="operator">Operator - Can execute workflows</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Permissions</Form.Label>
              <div>
                <Form.Check type="checkbox" label="Create workflows" defaultChecked />
                <Form.Check type="checkbox" label="Edit workflows" defaultChecked />
                <Form.Check type="checkbox" label="Delete workflows" />
                <Form.Check type="checkbox" label="Invite members" />
                <Form.Check type="checkbox" label="View analytics" defaultChecked />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInviteModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleInvite}>
            Send Invitation
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Team;