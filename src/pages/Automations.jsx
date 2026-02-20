import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, Form, Button, 
  Table, Badge, Modal, Alert, Tabs, Tab
} from 'react-bootstrap';
import { 
  FaRobot, FaPlus, FaPlay, FaPause, FaTrash, FaCopy,
  FaClock, FaHistory, FaCheck, FaEnvelope, FaSlack, FaWhatsapp,
  FaUserPlus, FaBirthdayCake, FaShoppingCart, FaDollarSign,
  FaUserClock, FaCalendarAlt, FaClipboardList, FaHeadset
} from 'react-icons/fa';

const Automations = () => {
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Automações
  const [automations, setAutomations] = useState([
    {
      id: 1,
      name: 'Boas-vindas Automático',
      description: 'Envia email de boas-vindas quando novo usuário se cadastra',
      trigger: 'new_user',
      channels: ['email'],
      template: 'welcome',
      schedule: 'immediate',
      status: 'active',
      stats: { triggered: 245, success: 240 },
      lastRun: '2024-02-15 09:30'
    },
    {
      id: 2,
      name: 'Promoção de Aniversário',
      description: 'Envia oferta especial no aniversário do cliente',
      trigger: 'birthday',
      channels: ['email', 'whatsapp'],
      template: 'birthday_promo',
      schedule: 'daily',
      time: '09:00',
      status: 'active',
      stats: { triggered: 89, success: 87 },
      lastRun: '2024-02-14 09:00'
    },
    {
      id: 3,
      name: 'Alerta de Abandono de Carrinho',
      description: 'Lembrete para clientes que abandonaram o carrinho',
      trigger: 'cart_abandoned',
      channels: ['email', 'whatsapp'],
      template: 'cart_reminder',
      schedule: 'delayed',
      delay: 24,
      status: 'paused',
      stats: { triggered: 156, success: 142 },
      lastRun: '2024-02-10 15:20'
    }
  ]);

  // Triggers disponíveis
  const triggers = [
    { id: 'new_user', name: 'Novo Usuário', icon: <FaUserPlus />, color: 'primary' },
    { id: 'birthday', name: 'Aniversário', icon: <FaBirthdayCake />, color: 'success' },
    { id: 'cart_abandoned', name: 'Carrinho Abandonado', icon: <FaShoppingCart />, color: 'warning' },
    { id: 'purchase', name: 'Compra Realizada', icon: <FaDollarSign />, color: 'info' },
    { id: 'inactive_user', name: 'Usuário Inativo', icon: <FaUserClock />, color: 'secondary' },
    { id: 'schedule', name: 'Agendamento', icon: <FaCalendarAlt />, color: 'dark' },
    { id: 'form_submitted', name: 'Formulário Enviado', icon: <FaClipboardList />, color: 'primary' },
    { id: 'support_ticket', name: 'Ticket de Suporte', icon: <FaHeadset />, color: 'info' }
  ];

  // Templates
  const templates = [
    { id: 'welcome', name: 'Boas-vindas', channel: 'email' },
    { id: 'birthday_promo', name: 'Promoção Aniversário', channel: 'email' },
    { id: 'cart_reminder', name: 'Lembrete Carrinho', channel: 'email' },
    { id: 'sales_report', name: 'Relatório Vendas', channel: 'slack' }
  ];

  // Nova automação
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    description: '',
    trigger: '',
    channels: [],
    template: '',
    schedule: 'immediate',
    time: '09:00',
    delay: 24
  });

  const handleCreateAutomation = () => {
    if (!newAutomation.name || !newAutomation.trigger || newAutomation.channels.length === 0) {
      alert('Preencha nome, trigger e canais');
      return;
    }

    const automation = {
      id: Date.now(),
      ...newAutomation,
      status: 'draft',
      stats: { triggered: 0, success: 0 },
      lastRun: null
    };

    setAutomations([...automations, automation]);
    setShowAutomationModal(false);
    setNewAutomation({
      name: '',
      description: '',
      trigger: '',
      channels: [],
      template: '',
      schedule: 'immediate',
      time: '09:00',
      delay: 24
    });
    setSuccessMessage('Automação criada com sucesso!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const toggleStatus = (id) => {
    setAutomations(automations.map(a => 
      a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a
    ));
  };

  const duplicateAutomation = (id) => {
    const original = automations.find(a => a.id === id);
    const duplicate = {
      ...original,
      id: Date.now(),
      name: `${original.name} (cópia)`,
      status: 'draft',
      stats: { triggered: 0, success: 0 }
    };
    setAutomations([...automations, duplicate]);
  };

  const deleteAutomation = (id) => {
    if (window.confirm('Excluir automação?')) {
      setAutomations(automations.filter(a => a.id !== id));
    }
  };

  const getTriggerIcon = (triggerId) => {
    const trigger = triggers.find(t => t.id === triggerId);
    return trigger?.icon || <FaRobot />;
  };

  const getTriggerColor = (triggerId) => {
    const trigger = triggers.find(t => t.id === triggerId);
    return trigger?.color || 'secondary';
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-1">Automações</h2>
          <p className="text-muted">Configure automações para suas campanhas de marketing</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowAutomationModal(true)}>
            <FaPlus className="me-2" /> Nova Automação
          </Button>
        </Col>
      </Row>

      {showSuccess && (
        <Alert variant="success" className="mb-4" onClose={() => setShowSuccess(false)} dismissible>
          <FaCheck className="me-2" /> {successMessage}
        </Alert>
      )}

      {/* Cards de Estatísticas */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body>
              <h6>Total Automações</h6>
              <h3>{automations.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-success text-white">
            <Card.Body>
              <h6>Ativas</h6>
              <h3>{automations.filter(a => a.status === 'active').length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-info text-white">
            <Card.Body>
              <h6>Execuções</h6>
              <h3>{automations.reduce((acc, a) => acc + a.stats.triggered, 0)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-warning text-white">
            <Card.Body>
              <h6>Taxa de Sucesso</h6>
              <h3>
                {Math.round(
                  (automations.reduce((acc, a) => acc + a.stats.success, 0) / 
                   automations.reduce((acc, a) => acc + a.stats.triggered, 1)) * 100
                )}%
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Lista de Automações */}
      <Row className="g-4">
        {automations.map(automation => (
          <Col lg={6} key={automation.id}>
            <Card className={`border-0 shadow-sm ${automation.status === 'active' ? 'border-start border-success border-4' : ''}`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="mb-1">{automation.name}</h5>
                    <p className="text-muted small mb-2">{automation.description}</p>
                  </div>
                  <Badge bg={automation.status === 'active' ? 'success' : 'secondary'}>
                    {automation.status}
                  </Badge>
                </div>

                <div className="d-flex gap-2 mb-3">
                  <Badge bg={getTriggerColor(automation.trigger)} className="p-2">
                    {getTriggerIcon(automation.trigger)} Trigger
                  </Badge>
                  {automation.channels.map(channel => (
                    <Badge key={channel} bg="light" text="dark" className="p-2">
                      {channel === 'email' && <FaEnvelope className="me-1" />}
                      {channel === 'slack' && <FaSlack className="me-1" />}
                      {channel === 'whatsapp' && <FaWhatsapp className="me-1" />}
                      {channel}
                    </Badge>
                  ))}
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <small className="text-muted">
                    <FaClock className="me-1" />
                    {automation.schedule === 'immediate' ? 'Imediato' :
                     automation.schedule === 'daily' ? `Diário ${automation.time}` :
                     `Após ${automation.delay}h`}
                  </small>
                  <small className="text-muted">
                    <FaHistory className="me-1" />
                    {automation.stats.triggered} execuções
                  </small>
                </div>

                <div className="progress mb-3" style={{ height: '5px' }}>
                  <div 
                    className="progress-bar bg-success" 
                    style={{ width: `${(automation.stats.success / (automation.stats.triggered || 1)) * 100}%` }}
                  />
                </div>

                <div className="d-flex gap-2">
                  <Button 
                    size="sm" 
                    variant={automation.status === 'active' ? 'outline-warning' : 'outline-success'}
                    onClick={() => toggleStatus(automation.id)}
                  >
                    {automation.status === 'active' ? <FaPause /> : <FaPlay />}
                  </Button>
                  <Button size="sm" variant="outline-primary" onClick={() => duplicateAutomation(automation.id)}>
                    <FaCopy />
                  </Button>
                  <Button size="sm" variant="outline-danger" onClick={() => deleteAutomation(automation.id)}>
                    <FaTrash />
                  </Button>
                </div>

                {automation.lastRun && (
                  <small className="text-muted d-block mt-2">
                    Última execução: {automation.lastRun}
                  </small>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal de Nova Automação */}
      <Modal show={showAutomationModal} onHide={() => setShowAutomationModal(false)} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Nova Automação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={newAutomation.name}
                onChange={(e) => setNewAutomation({...newAutomation, name: e.target.value})}
                placeholder="Ex: Boas-vindas automático"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={newAutomation.description}
                onChange={(e) => setNewAutomation({...newAutomation, description: e.target.value})}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Trigger</Form.Label>
                  <Form.Select 
                    value={newAutomation.trigger}
                    onChange={(e) => setNewAutomation({...newAutomation, trigger: e.target.value})}
                  >
                    <option value="">Selecione</option>
                    {triggers.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Canais</Form.Label>
                  <div>
                    <Form.Check 
                      type="checkbox" 
                      label="Email" 
                      checked={newAutomation.channels.includes('email')}
                      onChange={(e) => {
                        const channels = e.target.checked 
                          ? [...newAutomation.channels, 'email']
                          : newAutomation.channels.filter(c => c !== 'email');
                        setNewAutomation({...newAutomation, channels});
                      }}
                    />
                    <Form.Check 
                      type="checkbox" 
                      label="Slack" 
                      checked={newAutomation.channels.includes('slack')}
                      onChange={(e) => {
                        const channels = e.target.checked 
                          ? [...newAutomation.channels, 'slack']
                          : newAutomation.channels.filter(c => c !== 'slack');
                        setNewAutomation({...newAutomation, channels});
                      }}
                    />
                    <Form.Check 
                      type="checkbox" 
                      label="WhatsApp" 
                      checked={newAutomation.channels.includes('whatsapp')}
                      onChange={(e) => {
                        const channels = e.target.checked 
                          ? [...newAutomation.channels, 'whatsapp']
                          : newAutomation.channels.filter(c => c !== 'whatsapp');
                        setNewAutomation({...newAutomation, channels});
                      }}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Agendamento</Form.Label>
              <Form.Select 
                value={newAutomation.schedule}
                onChange={(e) => setNewAutomation({...newAutomation, schedule: e.target.value})}
              >
                <option value="immediate">Imediato</option>
                <option value="delayed">Atrasado</option>
                <option value="daily">Diário</option>
              </Form.Select>
            </Form.Group>

            {newAutomation.schedule === 'delayed' && (
              <Form.Group className="mb-3">
                <Form.Label>Horas de atraso</Form.Label>
                <Form.Control
                  type="number"
                  value={newAutomation.delay}
                  onChange={(e) => setNewAutomation({...newAutomation, delay: parseInt(e.target.value)})}
                />
              </Form.Group>
            )}

            {newAutomation.schedule === 'daily' && (
              <Form.Group className="mb-3">
                <Form.Label>Horário</Form.Label>
                <Form.Control
                  type="time"
                  value={newAutomation.time}
                  onChange={(e) => setNewAutomation({...newAutomation, time: e.target.value})}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAutomationModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreateAutomation}>
            Criar Automação
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Automations;