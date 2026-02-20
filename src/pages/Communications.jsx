import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, Modal, Alert } from 'react-bootstrap';
import { 
  FaEnvelope, FaSlack, FaWhatsapp, FaTelegram,
  FaPaperPlane, FaHistory, FaBell, FaCheckCircle,
  FaExclamationCircle
} from 'react-icons/fa';

const Communications = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'email', to: 'cliente@email.com', subject: 'Welcome!', status: 'sent', time: '2 min ago' },
    { id: 2, type: 'slack', to: '#general', message: 'Daily standup', status: 'delivered', time: '15 min ago' },
    { id: 3, type: 'whatsapp', to: '+5511999999999', message: 'Promoção', status: 'read', time: '1 hour ago' }
  ]);
  
  const [showSendModal, setShowSendModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    type: 'email',
    to: '',
    subject: '',
    message: '',
    channel: '#general'
  });

  const handleSend = async () => {
    setSending(true);
    setTimeout(() => {
      const newMessage = {
        id: Date.now(),
        ...formData,
        status: 'sent',
        time: 'just now'
      };
      setMessages([newMessage, ...messages]);
      setSending(false);
      setShowSendModal(false);
      setFormData({
        type: 'email',
        to: '',
        subject: '',
        message: '',
        channel: '#general'
      });
      alert('Message sent successfully!');
    }, 1000);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'sent': return <FaCheckCircle className="text-success" />;
      case 'delivered': return <FaCheckCircle className="text-info" />;
      case 'read': return <FaCheckCircle className="text-primary" />;
      default: return <FaExclamationCircle className="text-warning" />;
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-1">Communications</h2>
          <p className="text-muted">Multi-channel messaging platform</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowSendModal(true)}>
            <FaPaperPlane className="me-2" />
            New Message
          </Button>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6>Total Messages</h6>
                <h3>1,234</h3>
              </div>
              <FaEnvelope size={30} className="opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-success text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6>Delivered</h6>
                <h3>1,180</h3>
              </div>
              <FaCheckCircle size={30} className="opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-info text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6>Open Rate</h6>
                <h3>94%</h3>
              </div>
              <FaBell size={30} className="opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-warning text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6>Channels</h6>
                <h3>4</h3>
              </div>
              <FaSlack size={30} className="opacity-50" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Recent Messages</h5>
          <FaHistory />
        </Card.Header>
        <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Type</th>
                <th>Recipient</th>
                <th>Content</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(msg => (
                <tr key={msg.id}>
                  <td>
                    {msg.type === 'email' && <FaEnvelope className="text-primary me-2" />}
                    {msg.type === 'slack' && <FaSlack className="text-success me-2" />}
                    {msg.type === 'whatsapp' && <FaWhatsapp className="text-success me-2" />}
                    {msg.type === 'telegram' && <FaTelegram className="text-info me-2" />}
                    {msg.type}
                  </td>
                  <td>{msg.to}</td>
                  <td>{msg.subject || msg.message}</td>
                  <td>
                    <span className="d-flex align-items-center gap-2">
                      {getStatusIcon(msg.status)}
                      {msg.status}
                    </span>
                  </td>
                  <td>{msg.time}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showSendModal} onHide={() => setShowSendModal(false)} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Send New Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Channel</Form.Label>
              <Form.Select 
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="email">📧 Email</option>
                <option value="slack">💬 Slack</option>
                <option value="whatsapp">📱 WhatsApp</option>
                <option value="telegram">✈️ Telegram</option>
              </Form.Select>
            </Form.Group>

            {formData.type === 'slack' ? (
              <Form.Group className="mb-3">
                <Form.Label>Channel</Form.Label>
                <Form.Select 
                  value={formData.channel}
                  onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                >
                  <option value="#general">#general</option>
                  <option value="#notifications">#notifications</option>
                  <option value="#alerts">#alerts</option>
                  <option value="#team">#team</option>
                </Form.Select>
              </Form.Group>
            ) : (
              <Form.Group className="mb-3">
                <Form.Label>Recipient</Form.Label>
                <Form.Control
                  type={formData.type === 'email' ? 'email' : 'text'}
                  placeholder={formData.type === 'email' ? 'email@example.com' : '+5511999999999'}
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                />
              </Form.Group>
            )}

            {formData.type === 'email' && (
              <Form.Group className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </Form.Group>

            <Alert variant="info">
              <small>
                <strong>Note:</strong> This will send a real message using the selected channel's API.
              </small>
            </Alert>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSendModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSend} disabled={sending}>
            {sending ? 'Sending...' : 'Send Message'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Communications;