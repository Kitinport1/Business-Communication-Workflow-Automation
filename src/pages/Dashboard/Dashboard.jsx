import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, ProgressBar } from 'react-bootstrap';
import { 
  FaEnvelope, FaClock, FaCheckCircle, FaExclamationTriangle,
  FaChartLine, FaRocket, FaSearch, FaGoogle
} from 'react-icons/fa';
import { useWorkflow } from '../context/WorkflowContext';
import { useSEO } from '../context/SEOContext';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { workflows, executionHistory, getStats, loadWorkflows } = useWorkflow();
  const { seoData, trackingEmail, fetchSEOData, loading: seoLoading } = useSEO();
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    paused: 0,
    totalExecutions: 0,
    avgSuccessRate: 0,
    totalTime: 0
  });
  
  const [recentExecutions, setRecentExecutions] = useState([]);

  useEffect(() => {
    loadWorkflows();
    fetchSEOData(); // Buscar dados de SEO ao carregar dashboard
    
    const interval = setInterval(() => {
      const newStats = getStats();
      setStats(newStats);
      setRecentExecutions(executionHistory?.slice(0, 5) || []);
    }, 5000);

    return () => clearInterval(interval);
  }, [workflows, executionHistory]);

  useEffect(() => {
    const newStats = getStats();
    setStats(newStats);
    setRecentExecutions(executionHistory?.slice(0, 5) || []);
  }, [workflows, executionHistory]);

  const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return '0s';
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(0);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Dashboard</h2>

      {/* Welcome Message com Email Tracking */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm bg-gradient-primary">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="text-white mb-2">
                  Bem-vindo, {user?.name || 'Usuário'}! 👋
                </h4>
                {trackingEmail ? (
                  <p className="text-white-50 mb-0">
                    📧 Relatórios SEO enviados para: {trackingEmail}
                  </p>
                ) : (
                  <p className="text-white-50 mb-0">
                    Configure seu email para receber relatórios SEO
                  </p>
                )}
              </div>
              {user?.picture && (
                <img 
                  src={user.picture} 
                  alt={user.name}
                  className="rounded-circle"
                  style={{ width: 60, height: 60 }}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col xl={3} lg={6}>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-white-50 mb-1">Total Workflows</h6>
                <h2 className="mb-0">{stats.total}</h2>
                <small className="text-white-50">
                  {stats.active} ativos • {stats.paused} pausados
                </small>
              </div>
              <FaRocket size={40} className="opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6}>
          <Card className="border-0 shadow-sm bg-success text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-white-50 mb-1">Execuções Totais</h6>
                <h2 className="mb-0">{stats.totalExecutions}</h2>
                <small className="text-white-50">
                  Média de {workflows.length > 0 ? (stats.totalExecutions / workflows.length).toFixed(0) : 0} por workflow
                </small>
              </div>
              <FaChartLine size={40} className="opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6}>
          <Card className="border-0 shadow-sm bg-info text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-white-50 mb-1">SEO Score</h6>
                <h2 className="mb-0">{seoData?.siteAudit?.score || 0}</h2>
                <small className="text-white-50">
                  {seoData?.siteAudit?.score > 80 ? 'Bom' : 'Needs improvement'}
                </small>
              </div>
              <FaSearch size={40} className="opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} lg={6}>
          <Card className="border-0 shadow-sm bg-warning text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-white-50 mb-1">Palavras-chave</h6>
                <h2 className="mb-0">{seoData?.keywordRankings?.length || 0}</h2>
                <small className="text-white-50">Em monitoramento</small>
              </div>
              <FaGoogle size={40} className="opacity-50" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* SEO Rankings Section */}
      <Row className="g-4 mb-4">
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Rankings de Palavras-chave</h5>
              {seoLoading && <Badge bg="primary">Atualizando...</Badge>}
            </Card.Header>
            <Card.Body>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Palavra-chave</th>
                    <th>Posição</th>
                    <th>Variação</th>
                    <th>Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {seoData?.keywordRankings?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="fw-bold">{item.keyword}</td>
                      <td>
                        <Badge bg={item.position <= 10 ? 'success' : item.position <= 20 ? 'warning' : 'secondary'}>
                          #{item.position}
                        </Badge>
                      </td>
                      <td className={item.change > 0 ? 'text-success' : item.change < 0 ? 'text-danger' : ''}>
                        {item.change > 0 ? '+' : ''}{item.change}
                      </td>
                      <td>{item.volume.toLocaleString()}</td>
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
              <h5 className="mb-0">Análise de Concorrentes</h5>
            </Card.Header>
            <Card.Body>
              <Table hover>
                <thead>
                  <tr>
                    <th>Concorrente</th>
                    <th>Keywords</th>
                    <th>Tráfego</th>
                  </tr>
                </thead>
                <tbody>
                  {seoData?.competitorData?.map((item, idx) => (
                    <tr key={idx} className={item.name.includes('Your') ? 'table-primary' : ''}>
                      <td className="fw-bold">{item.name}</td>
                      <td>{item.keywords}</td>
                      <td>{item.traffic}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Workflows e Atividade */}
      <Row className="g-4">
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Workflows Recentes</h5>
            </Card.Header>
            <Card.Body>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Status</th>
                    <th>Execuções</th>
                    <th>Taxa</th>
                  </tr>
                </thead>
                <tbody>
                  {workflows.slice(0, 5).map(w => (
                    <tr key={w.id}>
                      <td className="fw-bold">{w.name}</td>
                      <td>
                        <Badge bg={
                          w.status === 'active' ? 'success' : 
                          w.status === 'paused' ? 'warning' : 'secondary'
                        }>
                          {w.status}
                        </Badge>
                      </td>
                      <td>{w.executions || 0}</td>
                      <td>
                        <span className={w.successRate > 80 ? 'text-success' : 'text-warning'}>
                          {w.successRate || 0}%
                        </span>
                      </td>
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
              <h5 className="mb-0">Atividade Recente</h5>
            </Card.Header>
            <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {recentExecutions.length > 0 ? (
                recentExecutions.map(exec => (
                  <div key={exec.id} className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                    <div className="d-flex align-items-center">
                      <div className={`bg-${exec.success ? 'success' : 'danger'} bg-opacity-10 p-2 rounded me-3`}>
                        {exec.success ? (
                          <FaCheckCircle className="text-success" />
                        ) : (
                          <FaExclamationTriangle className="text-danger" />
                        )}
                      </div>
                      <div>
                        <h6 className="mb-0">{exec.workflowName}</h6>
                        <small className="text-muted">
                          {new Date(exec.timestamp).toLocaleTimeString()}
                        </small>
                      </div>
                    </div>
                    <div className="text-end">
                      <Badge bg={exec.success ? 'success' : 'danger'} className="mb-1">
                        {exec.success ? 'Sucesso' : 'Falha'}
                      </Badge>
                      <br />
                      <small className="text-muted">{exec.duration?.toFixed(1)}s</small>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center py-4">Nenhuma atividade recente</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;