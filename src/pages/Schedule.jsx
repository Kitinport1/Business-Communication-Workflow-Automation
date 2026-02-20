import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, ListGroup, Form, Modal } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaPlus, FaBell } from 'react-icons/fa';

const Schedule = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [events, setEvents] = useState([
    { id: 1, title: 'Daily Standup', time: '09:00', duration: 30, type: 'meeting', date: new Date().toISOString().split('T')[0] },
    { id: 2, title: 'Customer Onboarding', time: '10:30', duration: 60, type: 'workflow', date: new Date().toISOString().split('T')[0] },
    { id: 3, title: 'Team Lunch', time: '12:00', duration: 60, type: 'break', date: new Date().toISOString().split('T')[0] },
    { id: 4, title: 'Invoice Processing', time: '14:00', duration: 45, type: 'workflow', date: new Date().toISOString().split('T')[0] },
    { id: 5, title: 'Weekly Review', time: '16:00', duration: 90, type: 'meeting', date: new Date().toISOString().split('T')[0] }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 30,
    type: 'meeting'
  });

  const getEventColor = (type) => {
    const colors = {
      meeting: 'primary',
      workflow: 'success',
      break: 'info',
      deadline: 'danger'
    };
    return colors[type] || 'secondary';
  };

  const handleAddEvent = () => {
    if (!newEvent.title) {
      alert('Title is required');
      return;
    }

    setEvents([...events, { id: Date.now(), ...newEvent }]);
    setShowAddModal(false);
    setNewEvent({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      duration: 30,
      type: 'meeting'
    });
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-1">Schedule</h2>
          <p className="text-muted">Manage your workflow schedules and calendar</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <FaPlus className="me-2" />
            Add Event
          </Button>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Today's Schedule</h5>
              <Badge bg="primary">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Badge>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {events
                  .filter(e => e.date === new Date().toISOString().split('T')[0])
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(event => (
                    <ListGroup.Item key={event.id} className="d-flex align-items-center">
                      <div className={`bg-${getEventColor(event.type)} bg-opacity-10 p-3 rounded me-3`}>
                        <FaCalendarAlt className={`text-${getEventColor(event.type)}`} />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{event.title}</h6>
                        <small className="text-muted">
                          <FaClock className="me-1" />
                          {event.time} ({event.duration} min)
                        </small>
                      </div>
                      <Badge bg={getEventColor(event.type)} className="px-3 py-2">
                        {event.type}
                      </Badge>
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Upcoming</h5>
            </Card.Header>
            <Card.Body>
              {events
                .filter(e => e.date > new Date().toISOString().split('T')[0])
                .slice(0, 3)
                .map(event => (
                  <div key={event.id} className="mb-3 pb-2 border-bottom">
                    <div className="d-flex justify-content-between">
                      <h6 className="mb-1">{event.title}</h6>
                      <Badge bg={getEventColor(event.type)}>{event.type}</Badge>
                    </div>
                    <small className="text-muted">
                      {event.date} at {event.time}
                    </small>
                  </div>
                ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Scheduled Workflows</h5>
            </Card.Header>
            <Card.Body>
              {[
                { name: 'Customer Onboarding', schedule: 'Daily at 09:00', next: 'Tomorrow 09:00', status: 'active' },
                { name: 'Invoice Processing', schedule: 'Every 2 hours', next: '14:30 Today', status: 'active' },
                { name: 'Weekly Report', schedule: 'Every Monday', next: 'Mon 08:00', status: 'paused' }
              ].map((wf, idx) => (
                <div key={idx} className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <div>
                    <h6 className="mb-1">{wf.name}</h6>
                    <small className="text-muted d-block">{wf.schedule}</small>
                    <small className="text-info">Next: {wf.next}</small>
                  </div>
                  <Badge bg={wf.status === 'active' ? 'success' : 'secondary'}>
                    {wf.status}
                  </Badge>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Reminders</h5>
            </Card.Header>
            <Card.Body>
              {[
                { text: 'Review workflow performance', time: '30 min before', priority: 'high' },
                { text: 'Team meeting preparation', time: '1 hour before', priority: 'medium' },
                { text: 'Update documentation', time: '2 hours before', priority: 'low' }
              ].map((rem, idx) => (
                <div key={idx} className="d-flex align-items-center mb-3 pb-2 border-bottom">
                  <FaBell className={`text-${rem.priority === 'high' ? 'danger' : rem.priority === 'medium' ? 'warning' : 'info'} me-3`} />
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{rem.text}</h6>
                    <small className="text-muted">{rem.time}</small>
                  </div>
                  <Badge bg={rem.priority === 'high' ? 'danger' : rem.priority === 'medium' ? 'warning' : 'info'}>
                    {rem.priority}
                  </Badge>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Add Schedule Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="e.g., Daily Standup"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({ ...newEvent, duration: parseInt(e.target.value) })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select 
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                  >
                    <option value="meeting">Meeting</option>
                    <option value="workflow">Workflow</option>
                    <option value="break">Break</option>
                    <option value="deadline">Deadline</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddEvent}>
            Add to Schedule
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Schedule;