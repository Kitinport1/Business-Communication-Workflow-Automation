import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import { 
  FaSave, FaSlack, FaEnvelope, FaWhatsapp,
  FaShieldAlt, FaBell, FaPalette
} from 'react-icons/fa';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  
  const [settings, setSettings] = useState({
    companyName: 'AutoFlow Inc',
    timezone: 'America/Sao_Paulo',
    language: 'en',
    emailNotifications: true,
    slackNotifications: true,
    desktopNotifications: false,
    slackWebhook: 'https://hooks.slack.com/services/...',
    twoFactorAuth: false,
    sessionTimeout: 30,
    theme: 'light',
    compactMode: false
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Settings</h2>

      {saved && (
        <Alert variant="success" className="mb-4" dismissible onClose={() => setSaved(false)}>
          Settings saved successfully!
        </Alert>
      )}

      <Row>
        <Col lg={3} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item 
                  action 
                  active={activeTab === 'general'}
                  onClick={() => setActiveTab('general')}
                  className="border-0"
                >
                  ⚙️ General
                </ListGroup.Item>
                <ListGroup.Item 
                  action 
                  active={activeTab === 'notifications'}
                  onClick={() => setActiveTab('notifications')}
                  className="border-0"
                >
                  🔔 Notifications
                </ListGroup.Item>
                <ListGroup.Item 
                  action 
                  active={activeTab === 'integrations'}
                  onClick={() => setActiveTab('integrations')}
                  className="border-0"
                >
                  🔌 Integrations
                </ListGroup.Item>
                <ListGroup.Item 
                  action 
                  active={activeTab === 'security'}
                  onClick={() => setActiveTab('security')}
                  className="border-0"
                >
                  🔒 Security
                </ListGroup.Item>
                <ListGroup.Item 
                  action 
                  active={activeTab === 'appearance'}
                  onClick={() => setActiveTab('appearance')}
                  className="border-0"
                >
                  🎨 Appearance
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={9}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0 text-capitalize">{activeTab} Settings</h5>
            </Card.Header>
            <Card.Body>
              {activeTab === 'general' && (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={settings.companyName}
                      onChange={(e) => handleChange('companyName', e.target.value)}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Timezone</Form.Label>
                        <Form.Select 
                          value={settings.timezone}
                          onChange={(e) => handleChange('timezone', e.target.value)}
                        >
                          <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                          <option value="America/New_York">New York (GMT-5)</option>
                          <option value="Europe/London">London (GMT+0)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Language</Form.Label>
                        <Form.Select 
                          value={settings.language}
                          onChange={(e) => handleChange('language', e.target.value)}
                        >
                          <option value="en">English</option>
                          <option value="pt">Português</option>
                          <option value="es">Español</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              )}

              {activeTab === 'notifications' && (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="switch"
                      label="Email Notifications"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="switch"
                      label="Slack Notifications"
                      checked={settings.slackNotifications}
                      onChange={(e) => handleChange('slackNotifications', e.target.checked)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="switch"
                      label="Desktop Notifications"
                      checked={settings.desktopNotifications}
                      onChange={(e) => handleChange('desktopNotifications', e.target.checked)}
                    />
                  </Form.Group>
                </Form>
              )}

              {activeTab === 'integrations' && (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label><FaSlack className="me-2" /> Slack Webhook URL</Form.Label>
                    <Form.Control
                      type="text"
                      value={settings.slackWebhook}
                      onChange={(e) => handleChange('slackWebhook', e.target.value)}
                      placeholder="https://hooks.slack.com/services/..."
                    />
                  </Form.Group>
                </Form>
              )}

              {activeTab === 'security' && (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="switch"
                      label="Two-Factor Authentication"
                      checked={settings.twoFactorAuth}
                      onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Session Timeout (minutes)</Form.Label>
                    <Form.Control
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Form>
              )}

              {activeTab === 'appearance' && (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Theme</Form.Label>
                    <Form.Select 
                      value={settings.theme}
                      onChange={(e) => handleChange('theme', e.target.value)}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto (System)</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="switch"
                      label="Compact Mode"
                      checked={settings.compactMode}
                      onChange={(e) => handleChange('compactMode', e.target.checked)}
                    />
                  </Form.Group>
                </Form>
              )}
            </Card.Body>
            <Card.Footer className="bg-white d-flex justify-content-end">
              <Button variant="primary" onClick={handleSave}>
                <FaSave className="me-2" />
                Save Changes
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;