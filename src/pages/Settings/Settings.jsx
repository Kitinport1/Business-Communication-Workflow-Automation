import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup, Badge } from 'react-bootstrap';
import { 
  FaSave, FaSlack, FaEnvelope, FaWhatsapp, FaTelegram,
  FaDatabase, FaShieldAlt, FaBell, FaPalette
} from 'react-icons/fa';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  
  const [settings, setSettings] = useState({
    // General
    companyName: 'AutoFlow Inc',
    timezone: 'America/Sao_Paulo',
    language: 'en',
    
    // Notifications
    emailNotifications: true,
    slackNotifications: true,
    desktopNotifications: false,
    
    // Integrations
    slackWebhook: 'https://hooks.slack.com/services/...',
    sendgridKey: 'SG.xxxxx',
    twilioSid: 'ACxxxxx',
    
    // Security
    twoFactorAuth: false,
    sessionTimeout: 30,
    
    // Appearance
    theme: 'light',
    compactMode: false
  });

  const handleSave = () => {
    // Simulate save
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    console.log('Settings saved:', settings);
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
                <ListGroup.Item 
                  action 
                  active={activeTab === 'api'}
                  onClick={() => setActiveTab('api')}
                  className="border-0"
                >
                  🔑 API Keys
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
              {/* General Settings */}
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
                          <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
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

              {/* Notifications Settings */}
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

              {/* Integrations Settings */}
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
                    <Form.Text className="text-muted">
                      Get this from Slack Apps -{'>'} Incoming Webhooks
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label><FaEnvelope className="me-2" /> SendGrid API Key</Form.Label>
                    <Form.Control
                      type="password"
                      value={settings.sendgridKey}
                      onChange={(e) => handleChange('sendgridKey', e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label><FaWhatsapp className="me-2" /> Twilio Account SID</Form.Label>
                    <Form.Control
                      type="text"
                      value={settings.twilioSid}
                      onChange={(e) => handleChange('twilioSid', e.target.value)}
                    />
                  </Form.Group>
                </Form>
              )}

              {/* Security Settings */}
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

              {/* Appearance Settings */}
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

              {/* API Keys */}
              {activeTab === 'api' && (
                <div>
                  <Alert variant="info">
                    Your API keys are encrypted and secure.
                  </Alert>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>API Key</Form.Label>
                    <Form.Control
                      type="text"
                      value="wf_live_xxxxxxxxxxxxx"
                      readOnly
                    />
                    <Button variant="link" size="sm" className="mt-2">Regenerate</Button>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>API Secret</Form.Label>
                    <Form.Control
                      type="password"
                      value="••••••••••••••••"
                      readOnly
                    />
                    <Form.Text className="text-muted">
                      Never share this secret with anyone
                    </Form.Text>
                  </Form.Group>
                </div>
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