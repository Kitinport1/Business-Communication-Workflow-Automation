import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, Form, Button, 
  Table, Badge, Modal, Alert, Tabs, Tab,
  InputGroup, FormControl
} from 'react-bootstrap';
import { 
  FaEnvelope, FaSlack, FaWhatsapp, FaTelegram,
  FaPlus, FaTrash, FaEdit, FaCheck, FaTimes,
  FaBell, FaPaperPlane, FaUsers, FaChartLine,
  FaRobot, FaClock, FaCalendarAlt, FaCog,
  FaPlay, FaPause, FaHistory, FaCopy
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const MarketingChannels = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('automations'); // Mudar para aba de automações como padrão
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedAutomation, setSelectedAutomation] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // ==================== AUTOMAÇÕES ====================
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
      lastRun: '2024-02-15 09:30',
      createdAt: '2024-01-10'
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
      lastRun: '2024-02-14 09:00',
      createdAt: '2024-01-15'
    },
    {
      id: 3,
      name: 'Alerta de Abandono de Carrinho',
      description: 'Lembrete para clientes que abandonaram o carrinho',
      trigger: 'cart_abandoned',
      channels: ['email', 'whatsapp'],
      template: 'cart_reminder',
      schedule: 'delayed',
      delay: 24, // horas
      status: 'paused',
      stats: { triggered: 156, success: 142 },
      lastRun: '2024-02-10 15:20',
      createdAt: '2024-01-20'
    },
    {
      id: 4,
      name: 'Relatório Semanal de Vendas',
      description: 'Envia relatório de vendas para equipe no Slack',
      trigger: 'schedule',
      channels: ['slack'],
      template: 'sales_report',
      schedule: 'weekly',
      dayOfWeek: 'monday',
      time: '08:00',
      status: 'active',
      stats: { triggered: 8, success: 8 },
      lastRun: '2024-02-12 08:00',
      createdAt: '2024-02-01'
    }
  ]);

  // ==================== TRIGGERS DISPONÍVEIS ====================
  const availableTriggers = [
    { 
      id: 'new_user', 
      name: 'Novo Usuário', 
      description: 'Quando um novo usuário se cadastra',
      icon: '👤',
      channels: ['email', 'slack']
    },
    { 
      id: 'birthday', 
      name: 'Aniversário', 
      description: 'No aniversário do cliente',
      icon: '🎂',
      channels: ['email', 'whatsapp']
    },
    { 
      id: 'cart_abandoned', 
      name: 'Carrinho Abandonado', 
      description: 'Quando cliente abandona o carrinho',
      icon: '🛒',
      channels: ['email', 'whatsapp']
    },
    { 
      id: 'purchase', 
      name: 'Compra Realizada', 
      description: 'Após uma compra ser concluída',
      icon: '💰',
      channels: ['email', 'slack']
    },
    { 
      id: 'inactive_user', 
      name: 'Usuário Inativo', 
      description: 'Usuário sem acesso por X dias',
      icon: '😴',
      channels: ['email']
    },
    { 
      id: 'schedule', 
      name: 'Agendamento', 
      description: 'Executa em horário específico',
      icon: '⏰',
      channels: ['email', 'slack', 'whatsapp']
    },
    { 
      id: 'form_submitted', 
      name: 'Formulário Enviado', 
      description: 'Quando um formulário é preenchido',
      icon: '📝',
      channels: ['email', 'slack']
    },
    { 
      id: 'support_ticket', 
      name: 'Ticket de Suporte', 
      description: 'Novo ticket aberto',
      icon: '🎫',
      channels: ['slack']
    }
  ];

  // ==================== MODELOS DE AUTOMAÇÃO ====================
  const automationTemplates = [
    {
      id: 'welcome',
      name: 'Boas-vindas',
      description: 'Sequência de boas-vindas para novos usuários',
      triggers: ['new_user'],
      channels: ['email'],
      estimatedTime: 'Imediato'
    },
    {
      id: 'birthday_promo',
      name: 'Promoção de Aniversário',
      description: 'Oferta especial para aniversariantes',
      triggers: ['birthday'],
      channels: ['email', 'whatsapp'],
      estimatedTime: 'Diário'
    },
    {
      id: 'cart_reminder',
      name: 'Lembrete de Carrinho',
      description: 'Lembrete para carrinho abandonado',
      triggers: ['cart_abandoned'],
      channels: ['email', 'whatsapp'],
      estimatedTime: '24h após abandono'
    },
    {
      id: 'post_purchase',
      name: 'Pós-compra',
      description: 'Sequência após compra',
      triggers: ['purchase'],
      channels: ['email'],
      estimatedTime: 'Imediato + 3 dias'
    },
    {
      id: 'reengagement',
      name: 'Reengajamento',
      description: 'Tentar reativar usuários inativos',
      triggers: ['inactive_user'],
      channels: ['email'],
      estimatedTime: '30 dias inatividade'
    },
    {
      id: 'sales_report',
      name: 'Relatório de Vendas',
      description: 'Relatório semanal para equipe',
      triggers: ['schedule'],
      channels: ['slack'],
      estimatedTime: 'Toda segunda 08:00'
    }
  ];

  // ==================== HISTÓRICO DE EXECUÇÕES ====================
  const [executionHistory, setExecutionHistory] = useState([
    {
      id: 1,
      automationId: 1,
      automationName: 'Boas-vindas Automático',
      trigger: 'Novo usuário: joao@email.com',
      status: 'success',
      timestamp: '2024-02-15 09:30:22',
      channels: ['email'],
      details: 'Email enviado com sucesso'
    },
    {
      id: 2,
      automationId: 1,
      automationName: 'Boas-vindas Automático',
      trigger: 'Novo usuário: maria@email.com',
      status: 'success',
      timestamp: '2024-02-15 10:15:03',
      channels: ['email'],
      details: 'Email enviado com sucesso'
    },
    {
      id: 3,
      automationId: 2,
      automationName: 'Promoção de Aniversário',
      trigger: 'Aniversário de Carlos',
      status: 'success',
      timestamp: '2024-02-14 09:00:00',
      channels: ['email', 'whatsapp'],
      details: 'Email e WhatsApp enviados'
    },
    {
      id: 4,
      automationId: 3,
      automationName: 'Alerta de Abandono de Carrinho',
      trigger: 'Carrinho de Ana (3 itens)',
      status: 'failed',
      timestamp: '2024-02-10 15:20:45',
      channels: ['email'],
      details: 'Falha no envio do email'
    }
  ]);

  // ==================== ESTADO PARA NOVA AUTOMAÇÃO ====================
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    description: '',
    trigger: '',
    channels: [],
    template: '',
    schedule: 'immediate',
    time: '09:00',
    dayOfWeek: 'monday',
    delay: 24,
    conditions: [],
    status: 'draft'
  });

  // ==================== FUNÇÕES PARA AUTOMAÇÕES ====================

  // Criar nova automação
  const handleCreateAutomation = () => {
    if (!newAutomation.name || !newAutomation.trigger || newAutomation.channels.length === 0) {
      alert('Por favor, preencha nome, trigger e canais');
      return;
    }

    const automation = {
      id: Date.now(),
      ...newAutomation,
      stats: { triggered: 0, success: 0 },
      lastRun: null,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'draft'
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
      dayOfWeek: 'monday',
      delay: 24,
      conditions: [],
      status: 'draft'
    });
    setSuccessMessage('Automação criada com sucesso!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Ativar/desativar automação
  const toggleAutomationStatus = (id) => {
    setAutomations(automations.map(automation => 
      automation.id === id 
        ? { ...automation, status: automation.status === 'active' ? 'paused' : 'active' }
        : automation
    ));
    setSuccessMessage(`Automação ${automations.find(a => a.id === id)?.status === 'active' ? 'pausada' : 'ativada'} com sucesso!`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Duplicar automação
  const duplicateAutomation = (id) => {
    const original = automations.find(a => a.id === id);
    const duplicate = {
      ...original,
      id: Date.now(),
      name: `${original.name} (cópia)`,
      status: 'draft',
      stats: { triggered: 0, success: 0 },
      lastRun: null,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAutomations([...automations, duplicate]);
    setSuccessMessage('Automação duplicada com sucesso!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Excluir automação
  const deleteAutomation = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta automação?')) {
      setAutomations(automations.filter(a => a.id !== id));
      setSuccessMessage('Automação excluída com sucesso!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // Executar automação manualmente
  const runAutomationNow = (id) => {
    const automation = automations.find(a => a.id === id);
    
    // Simular execução
    const newExecution = {
      id: Date.now(),
      automationId: id,
      automationName: automation.name,
      trigger: 'Execução manual',
      status: Math.random() > 0.1 ? 'success' : 'failed',
      timestamp: new Date().toLocaleString(),
      channels: automation.channels,
      details: 'Executado manualmente pelo usuário'
    };

    setExecutionHistory([newExecution, ...executionHistory].slice(0, 50));
    
    // Atualizar estatísticas
    setAutomations(automations.map(a => 
      a.id === id 
        ? { 
            ...a, 
            stats: { 
              triggered: a.stats.triggered + 1, 
              success: a.stats.success + (newExecution.status === 'success' ? 1 : 0) 
            },
            lastRun: new Date().toLocaleString()
          }
        : a
    ));

    alert(`Automação executada com ${newExecution.status === 'success' ? 'sucesso' : 'falha'}!`);
  };

  // ==================== FUNÇÕES EXISTENTES (EMAIL, SLACK, WHATSAPP) ====================
  const [emailLists, setEmailLists] = useState([
    { id: 1, name: 'Newsletter Geral', total: 1250, active: 980, status: 'active', lastCampaign: '2024-02-10' },
    { id: 2, name: 'Promoções', total: 850, active: 720, status: 'active', lastCampaign: '2024-02-12' },
    { id: 3, name: 'Clientes VIP', total: 120, active: 115, status: 'active', lastCampaign: '2024-02-14' }
  ]);

  const [slackChannels, setSlackChannels] = useState([
    { id: 1, name: '#marketing', members: 15, status: 'active', lastMessage: '2024-02-14 10:30' },
    { id: 2, name: '#promocoes', members: 8, status: 'active', lastMessage: '2024-02-13 15:45' }
  ]);

  const [whatsappGroups, setWhatsappGroups] = useState([
    { id: 1, name: 'Clientes - Promoções', number: '+5511999999999', participants: 45, status: 'active', lastMessage: '2024-02-14 09:15' },
    { id: 2, name: 'Marketing - Interno', number: '+5511888888888', participants: 12, status: 'active', lastMessage: '2024-02-14 11:20' }
  ]);

  const [templates, setTemplates] = useState([
    { id: 1, name: 'Promoção de Verão', subject: '🔥 Promoção Especial!', content: 'Aproveite 30% de desconto...', channel: 'email', used: 3 },
    { id: 2, name: 'Liquidação Mensal', subject: '🛍️ Liquidação', content: 'Descontos imperdíveis...', channel: 'email', used: 5 },
    { id: 3, name: 'Alerta de Promoção', content: '🚨 Promoção relâmpago!', channel: 'slack', used: 2 },
    { id: 4, name: 'Boas-vindas', subject: 'Bem-vindo!', content: 'Olá, seja bem-vindo...', channel: 'email', used: 45 },
    { id: 5, name: 'Aniversário', subject: 'Feliz Aniversário!', content: 'Parabéns! Ganhe 20% off...', channel: 'whatsapp', used: 12 }
  ]);

  const [newEmailList, setNewEmailList] = useState({ name: '', emails: '', description: '' });
  const [newSlackChannel, setNewSlackChannel] = useState({ name: '', webhook: '' });
  const [newWhatsAppGroup, setNewWhatsAppGroup] = useState({ name: '', number: '', description: '' });
  const [campaignData, setCampaignData] = useState({ subject: '', message: '', template: '', schedule: 'now', scheduleDate: '', scheduleTime: '' });

  // Funções para Email
  const handleAddEmailList = () => {
    if (!newEmailList.name || !newEmailList.emails) {
      alert('Por favor, preencha nome e lista de emails');
      return;
    }
    const newList = {
      id: Date.now(),
      name: newEmailList.name,
      total: newEmailList.emails.split(',').length,
      active: newEmailList.emails.split(',').length,
      status: 'active',
      created: new Date().toISOString().split('T')[0],
      lastCampaign: 'Nunca'
    };
    setEmailLists([...emailLists, newList]);
    setShowAddModal(false);
    setNewEmailList({ name: '', emails: '', description: '' });
    setSuccessMessage('Lista de emails adicionada com sucesso!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Funções para Slack
  const handleAddSlackChannel = () => {
    if (!newSlackChannel.name) {
      alert('Por favor, preencha o nome do canal');
      return;
    }
    const newChannel = {
      id: Date.now(),
      name: newSlackChannel.name,
      members: 0,
      status: 'active',
      lastMessage: 'Nunca'
    };
    setSlackChannels([...slackChannels, newChannel]);
    setShowAddModal(false);
    setNewSlackChannel({ name: '', webhook: '' });
    setSuccessMessage('Canal do Slack adicionado com sucesso!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Funções para WhatsApp
  const handleAddWhatsAppGroup = () => {
    if (!newWhatsAppGroup.name || !newWhatsAppGroup.number) {
      alert('Por favor, preencha nome e número do grupo');
      return;
    }
    const newGroup = {
      id: Date.now(),
      name: newWhatsAppGroup.name,
      number: newWhatsAppGroup.number,
      participants: 0,
      status: 'active',
      lastMessage: 'Nunca'
    };
    setWhatsappGroups([...whatsappGroups, newGroup]);
    setShowAddModal(false);
    setNewWhatsAppGroup({ name: '', number: '', description: '' });
    setSuccessMessage('Grupo do WhatsApp adicionado com sucesso!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Testar canal
  const handleTestChannel = (channel, item) => {
    setSelectedChannel({ type: channel, ...item });
    setShowTestModal(true);
  };

  const sendTestMessage = () => {
    alert(`Mensagem de teste enviada para ${selectedChannel.name}!`);
    setShowTestModal(false);
  };

  // Enviar campanha
  const handleSendCampaign = () => {
    if (!campaignData.message) {
      alert('Por favor, insira uma mensagem');
      return;
    }
    alert(`Campanha enviada com sucesso!`);
    setCampaignData({ subject: '', message: '', template: '', schedule: 'now', scheduleDate: '', scheduleTime: '' });
  };

  // Renderizar status com badge
  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      paused: 'warning',
      draft: 'secondary',
      failed: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  // Renderizar ícone do trigger
  const getTriggerIcon = (triggerId) => {
    const trigger = availableTriggers.find(t => t.id === triggerId);
    return trigger?.icon || '⚡';
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-1">Automações de Marketing</h2>
          <p className="text-muted">Configure automações para email, Slack e WhatsApp</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowAutomationModal(true)}>
            <FaRobot className="me-2" /> Nova Automação
          </Button>
        </Col>
      </Row>

      {showSuccess && (
        <Alert variant="success" className="mb-4" dismissible onClose={() => setShowSuccess(false)}>
          <FaCheck className="me-2" /> {successMessage}
        </Alert>
      )}

      {/* Cards de Estatísticas */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6>Automações Ativas</h6>
                <h3>{automations.filter(a => a.status === 'active').length}</h3>
              </div>
              <FaRobot size={30} className="opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-success text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6>Execuções Hoje</h6>
                <h3>{executionHistory.filter(e => e.timestamp.startsWith('2024-02-15')).length}</h3>
              </div>
              <FaHistory size={30} className="opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-info text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6>Taxa de Sucesso</h6>
                <h3>
                  {Math.round((automations.reduce((acc, a) => acc + a.stats.success, 0) / 
                              automations.reduce((acc, a) => acc + a.stats.triggered, 1)) * 100)}%
                </h3>
              </div>
              <FaChartLine size={30} className="opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-warning text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6>Total Contatos</h6>
                <h3>{emailLists.reduce((acc, l) => acc + l.total, 0)}</h3>
              </div>
              <FaUsers size={30} className="opacity-50" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs para Automações e Canais */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            {/* ABA DE AUTOMAÇÕES (NOVA) */}
            <Tab eventKey="automations" title={<span><FaRobot className="me-2" />Automações</span>}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Automações Configuradas</h6>
                <Button 
                  size="sm" 
                  variant="outline-primary"
                  onClick={() => setShowAutomationModal(true)}
                >
                  <FaPlus /> Nova Automação
                </Button>
              </div>
              
              <Row>
                {automations.map(automation => (
                  <Col md={6} key={automation.id} className="mb-3">
                    <Card className={`border-0 shadow-sm ${automation.status === 'active' ? 'border-start border-success border-4' : ''}`}>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h5 className="mb-1">{automation.name}</h5>
                            <p className="text-muted small mb-2">{automation.description}</p>
                          </div>
                          {getStatusBadge(automation.status)}
                        </div>

                        <div className="d-flex gap-2 mb-2">
                          <Badge bg="light" text="dark">
                            {getTriggerIcon(automation.trigger)} Trigger: {availableTriggers.find(t => t.id === automation.trigger)?.name || automation.trigger}
                          </Badge>
                          <Badge bg="light" text="dark">
                            {automation.channels.map(c => 
                              c === 'email' ? '📧' : c === 'slack' ? '💬' : '📱'
                            ).join(' ')} {automation.channels.length} canais
                          </Badge>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <small className="text-muted">
                            <FaClock className="me-1" />
                            {automation.schedule === 'immediate' ? 'Imediato' : 
                             automation.schedule === 'daily' ? `Diário às ${automation.time}` :
                             automation.schedule === 'weekly' ? `Semanal (${automation.dayOfWeek})` :
                             automation.schedule === 'delayed' ? `Após ${automation.delay}h` : 'Agendado'}
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
                            onClick={() => toggleAutomationStatus(automation.id)}
                          >
                            {automation.status === 'active' ? <FaPause /> : <FaPlay />}
                            {automation.status === 'active' ? ' Pausar' : ' Ativar'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline-primary"
                            onClick={() => runAutomationNow(automation.id)}
                          >
                            <FaPlay /> Executar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline-info"
                            onClick={() => duplicateAutomation(automation.id)}
                          >
                            <FaCopy />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline-danger"
                            onClick={() => deleteAutomation(automation.id)}
                          >
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
            </Tab>

            {/* ABA DE HISTÓRICO (NOVA) */}
            <Tab eventKey="history" title={<span><FaHistory className="me-2" />Histórico</span>}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Últimas Execuções</h6>
                <Badge bg="info">Total: {executionHistory.length}</Badge>
              </div>
              
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Automação</th>
                    <th>Trigger</th>
                    <th>Status</th>
                    <th>Data/Hora</th>
                    <th>Detalhes</th>
                  </tr>
                </thead>
                <tbody>
                  {executionHistory.map(exec => (
                    <tr key={exec.id}>
                      <td className="fw-bold">{exec.automationName}</td>
                      <td>
                        <small className="text-muted">{exec.trigger}</small>
                      </td>
                      <td>
                        <Badge bg={exec.status === 'success' ? 'success' : 'danger'}>
                          {exec.status === 'success' ? '✅ Sucesso' : '❌ Falha'}
                        </Badge>
                      </td>
                      <td>{exec.timestamp}</td>
                      <td>
                        <small className="text-muted">{exec.details}</small>
                        <br />
                        <small className="text-muted">
                          {exec.channels.map(c => 
                            c === 'email' ? '📧' : c === 'slack' ? '💬' : '📱'
                          ).join(' ')}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            {/* ABA DE MODELOS (NOVA) */}
            <Tab eventKey="templates" title={<span><FaCopy className="me-2" />Modelos</span>}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Modelos de Automação</h6>
              </div>
              
              <Row>
                {automationTemplates.map(template => (
                  <Col md={4} key={template.id} className="mb-3">
                    <Card className="bg-light h-100">
                      <Card.Body>
                        <h6 className="mb-2">{template.name}</h6>
                        <p className="small text-muted mb-2">{template.description}</p>
                        <div className="mb-2">
                          <Badge bg="primary" className="me-1">
                            {template.triggers.map(t => availableTriggers.find(tr => tr.id === t)?.icon).join(' ')}
                          </Badge>
                          <Badge bg="info" className="me-1">
                            {template.channels.map(c => 
                              c === 'email' ? '📧' : c === 'slack' ? '💬' : '📱'
                            ).join(' ')}
                          </Badge>
                        </div>
                        <small className="text-muted d-block mb-2">
                          ⏱️ {template.estimatedTime}
                        </small>
                        <Button 
                          size="sm" 
                          variant="outline-primary" 
                          className="w-100"
                          onClick={() => {
                            setNewAutomation({
                              ...newAutomation,
                              name: template.name,
                              description: template.description,
                              trigger: template.triggers[0],
                              channels: template.channels,
                              template: template.id
                            });
                            setShowAutomationModal(true);
                          }}
                        >
                          Usar este modelo
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Tab>

            {/* Abas existentes (Email, Slack, WhatsApp) */}
            <Tab eventKey="email" title={<span><FaEnvelope className="me-2" />Email</span>}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Listas de Email</h6>
                <Button 
                  size="sm" 
                  variant="outline-primary"
                  onClick={() => {
                    setActiveTab('email');
                    setShowAddModal(true);
                  }}
                >
                  <FaPlus /> Nova Lista
                </Button>
              </div>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Nome da Lista</th>
                    <th>Total</th>
                    <th>Ativos</th>
                    <th>Status</th>
                    <th>Última Campanha</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {emailLists.map(list => (
                    <tr key={list.id}>
                      <td className="fw-bold">{list.name}</td>
                      <td>{list.total}</td>
                      <td><Badge bg="success">{list.active}</Badge></td>
                      <td><Badge bg={list.status === 'active' ? 'success' : 'secondary'}>{list.status}</Badge></td>
                      <td>{list.lastCampaign}</td>
                      <td>
                        <Button variant="link" size="sm" className="text-primary me-2" onClick={() => handleTestChannel('email', list)}>
                          <FaPaperPlane />
                        </Button>
                        <Button variant="link" size="sm" className="text-danger">
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            <Tab eventKey="slack" title={<span><FaSlack className="me-2" />Slack</span>}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Canais do Slack</h6>
                <Button size="sm" variant="outline-primary" onClick={() => { setActiveTab('slack'); setShowAddModal(true); }}>
                  <FaPlus /> Novo Canal
                </Button>
              </div>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Canal</th>
                    <th>Membros</th>
                    <th>Status</th>
                    <th>Última Mensagem</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {slackChannels.map(channel => (
                    <tr key={channel.id}>
                      <td className="fw-bold">{channel.name}</td>
                      <td>{channel.members}</td>
                      <td><Badge bg={channel.status === 'active' ? 'success' : 'secondary'}>{channel.status}</Badge></td>
                      <td>{channel.lastMessage}</td>
                      <td>
                        <Button variant="link" size="sm" className="text-primary me-2" onClick={() => handleTestChannel('slack', channel)}>
                          <FaPaperPlane />
                        </Button>
                        <Button variant="link" size="sm" className="text-danger">
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            <Tab eventKey="whatsapp" title={<span><FaWhatsapp className="me-2" />WhatsApp</span>}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Grupos do WhatsApp</h6>
                <Button size="sm" variant="outline-primary" onClick={() => { setActiveTab('whatsapp'); setShowAddModal(true); }}>
                  <FaPlus /> Novo Grupo
                </Button>
              </div>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Grupo</th>
                    <th>Número</th>
                    <th>Participantes</th>
                    <th>Status</th>
                    <th>Última Mensagem</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {whatsappGroups.map(group => (
                    <tr key={group.id}>
                      <td className="fw-bold">{group.name}</td>
                      <td>{group.number}</td>
                      <td>{group.participants}</td>
                      <td><Badge bg={group.status === 'active' ? 'success' : 'secondary'}>{group.status}</Badge></td>
                      <td>{group.lastMessage}</td>
                      <td>
                        <Button variant="link" size="sm" className="text-primary me-2" onClick={() => handleTestChannel('whatsapp', group)}>
                          <FaPaperPlane />
                        </Button>
                        <Button variant="link" size="sm" className="text-danger">
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            <Tab eventKey="messageTemplates" title="📝 Templates">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Templates de Mensagem</h6>
                <Button size="sm" variant="outline-primary">
                  <FaPlus /> Novo Template
                </Button>
              </div>
              <Row>
                {templates.map(template => (
                  <Col md={6} key={template.id} className="mb-3">
                    <Card className="bg-light">
                      <Card.Body>
                        <div className="d-flex justify-content-between mb-2">
                          <h6 className="mb-0">{template.name}</h6>
                          <Badge bg="info">Usado {template.used}x</Badge>
                        </div>
                        {template.subject && (
                          <small className="text-muted d-block mb-1">
                            <strong>Assunto:</strong> {template.subject}
                          </small>
                        )}
                        <p className="small mb-2">{template.content}</p>
                        <div className="d-flex gap-2">
                          <Badge bg="light" text="dark">
                            {template.channel === 'email' && <FaEnvelope className="me-1" />}
                            {template.channel === 'slack' && <FaSlack className="me-1" />}
                            {template.channel === 'whatsapp' && <FaWhatsapp className="me-1" />}
                            {template.channel}
                          </Badge>
                          <Button size="sm" variant="link" className="p-0">
                            Usar
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      {/* Seção de Nova Campanha Manual */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <h5 className="mb-0">Nova Campanha Manual</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Mensagem</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={campaignData.message}
                  onChange={(e) => setCampaignData({...campaignData, message: e.target.value})}
                  placeholder="Digite sua mensagem de promoção..."
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Template (opcional)</Form.Label>
                    <Form.Select 
                      value={campaignData.template}
                      onChange={(e) => setCampaignData({...campaignData, template: e.target.value})}
                    >
                      <option value="">Selecione um template</option>
                      {templates.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Agendamento</Form.Label>
                    <Form.Select 
                      value={campaignData.schedule}
                      onChange={(e) => setCampaignData({...campaignData, schedule: e.target.value})}
                    >
                      <option value="now">Enviar agora</option>
                      <option value="later">Agendar para depois</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {campaignData.schedule === 'later' && (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Data</Form.Label>
                      <Form.Control
                        type="date"
                        value={campaignData.scheduleDate}
                        onChange={(e) => setCampaignData({...campaignData, scheduleDate: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Hora</Form.Label>
                      <Form.Control
                        type="time"
                        value={campaignData.scheduleTime}
                        onChange={(e) => setCampaignData({...campaignData, scheduleTime: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}
            </Col>

            <Col md={4}>
              <Card className="bg-light">
                <Card.Body>
                  <h6 className="mb-3">Canais Disponíveis</h6>
                  <div className="mb-3">
                    <Form.Check type="checkbox" label={`Email (${emailLists.reduce((acc, l) => acc + l.total, 0)} contatos)`} defaultChecked />
                    <Form.Check type="checkbox" label={`Slack (${slackChannels.length} canais)`} defaultChecked />
                    <Form.Check type="checkbox" label={`WhatsApp (${whatsappGroups.length} grupos)`} defaultChecked />
                  </div>
                  <Button variant="success" className="w-100" onClick={handleSendCampaign}>
                    <FaPaperPlane className="me-2" /> Enviar Campanha
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Modal para Adicionar Canal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            {activeTab === 'email' && 'Nova Lista de Email'}
            {activeTab === 'slack' && 'Novo Canal do Slack'}
            {activeTab === 'whatsapp' && 'Novo Grupo do WhatsApp'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {activeTab === 'email' && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nome da Lista</Form.Label>
                <Form.Control type="text" placeholder="Ex: Newsletter Geral" value={newEmailList.name} onChange={(e) => setNewEmailList({...newEmailList, name: e.target.value})} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Emails (separados por vírgula)</Form.Label>
                <Form.Control as="textarea" rows={4} placeholder="email1@exemplo.com, email2@exemplo.com" value={newEmailList.emails} onChange={(e) => setNewEmailList({...newEmailList, emails: e.target.value})} />
              </Form.Group>
            </Form>
          )}
          {activeTab === 'slack' && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nome do Canal</Form.Label>
                <Form.Control type="text" placeholder="Ex: #marketing" value={newSlackChannel.name} onChange={(e) => setNewSlackChannel({...newSlackChannel, name: e.target.value})} />
              </Form.Group>
            </Form>
          )}
          {activeTab === 'whatsapp' && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nome do Grupo</Form.Label>
                <Form.Control type="text" placeholder="Ex: Clientes VIP" value={newWhatsAppGroup.name} onChange={(e) => setNewWhatsAppGroup({...newWhatsAppGroup, name: e.target.value})} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Número do Grupo</Form.Label>
                <Form.Control type="text" placeholder="+5511999999999" value={newWhatsAppGroup.number} onChange={(e) => setNewWhatsAppGroup({...newWhatsAppGroup, number: e.target.value})} />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={() => {
            if (activeTab === 'email') handleAddEmailList();
            if (activeTab === 'slack') handleAddSlackChannel();
            if (activeTab === 'whatsapp') handleAddWhatsAppGroup();
          }}>Adicionar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para Nova Automação */}
      <Modal show={showAutomationModal} onHide={() => setShowAutomationModal(false)} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <FaRobot className="me-2" /> Nova Automação
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome da Automação</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: Boas-vindas Automático"
                value={newAutomation.name}
                onChange={(e) => setNewAutomation({...newAutomation, name: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Descreva o que esta automação faz"
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
                    <option value="">Selecione um trigger</option>
                    {availableTriggers.map(trigger => (
                      <option key={trigger.id} value={trigger.id}>
                        {trigger.icon} {trigger.name} - {trigger.description}
                      </option>
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
              <Form.Label>Template (opcional)</Form.Label>
              <Form.Select 
                value={newAutomation.template}
                onChange={(e) => setNewAutomation({...newAutomation, template: e.target.value})}
              >
                <option value="">Selecione um template</option>
                {templates.filter(t => newAutomation.channels.includes(t.channel)).map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Agendamento</Form.Label>
              <Form.Select 
                value={newAutomation.schedule}
                onChange={(e) => setNewAutomation({...newAutomation, schedule: e.target.value})}
              >
                <option value="immediate">Imediato (assim que trigger ocorrer)</option>
                <option value="delayed">Atrasado (após X horas)</option>
                <option value="daily">Diário (horário específico)</option>
                <option value="weekly">Semanal (dia específico)</option>
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

            {newAutomation.schedule === 'weekly' && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Dia da Semana</Form.Label>
                    <Form.Select 
                      value={newAutomation.dayOfWeek}
                      onChange={(e) => setNewAutomation({...newAutomation, dayOfWeek: e.target.value})}
                    >
                      <option value="monday">Segunda-feira</option>
                      <option value="tuesday">Terça-feira</option>
                      <option value="wednesday">Quarta-feira</option>
                      <option value="thursday">Quinta-feira</option>
                      <option value="friday">Sexta-feira</option>
                      <option value="saturday">Sábado</option>
                      <option value="sunday">Domingo</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Horário</Form.Label>
                    <Form.Control
                      type="time"
                      value={newAutomation.time}
                      onChange={(e) => setNewAutomation({...newAutomation, time: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>
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

      {/* Modal de Teste */}
      <Modal show={showTestModal} onHide={() => setShowTestModal(false)}>
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title>Testar Canal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedChannel && (
            <>
              <p className="mb-3">
                Enviar mensagem de teste para <strong>{selectedChannel.name}</strong>?
              </p>
              <Form.Group className="mb-3">
                <Form.Label>Mensagem de Teste</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  defaultValue="🔔 Mensagem de teste do sistema AutoFlow"
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTestModal(false)}>
            Cancelar
          </Button>
          <Button variant="info" onClick={sendTestMessage}>
            Enviar Teste
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MarketingChannels;