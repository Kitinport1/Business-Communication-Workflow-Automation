import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Form, Button, Table, 
  Badge, ProgressBar, Alert, Tabs, Tab, InputGroup,
  ListGroup, Modal
} from 'react-bootstrap';
import { 
  FaSearch, FaChartLine, FaGlobe, FaFileAlt, 
  FaLink, FaExclamationTriangle, FaCheckCircle,
  FaArrowUp, FaArrowDown, FaMinus, FaRocket,
  FaEnvelope, FaPlus, FaTrash, FaChartBar,
  FaExternalLinkAlt, FaSync, FaBell
} from 'react-icons/fa';
import { useSEO } from '../context/SEOContext';
import { useAuth } from '../context/AuthContext';

const SEO = () => {
  const { 
    trackingEmail, 
    competitors,
    loading,
    lastUpdate,
    updateTrackingEmail,
    addCompetitor,
    removeCompetitor,
    fetchCompetitorData,
    analyzeURL,
    compareWithCompetitors,
    generateReport
  } = useSEO();
  
  const { user } = useAuth();
  const [emailInput, setEmailInput] = useState(trackingEmail || user?.email || '');
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [competitorName, setCompetitorName] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [activeTab, setActiveTab] = useState('competitors');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Atualizar lista de concorrentes ao carregar
    if (competitors.length > 0) {
      setComparisonData(compareWithCompetitors('seu-site.com'));
    }
  }, [competitors]);

  const handleSaveEmail = () => {
    if (emailInput) {
      updateTrackingEmail(emailInput);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleAddCompetitor = async () => {
    if (!competitorUrl) {
      alert('Por favor, insira uma URL');
      return;
    }

    try {
      // Validar URL
      new URL(competitorUrl);
      
      // Analisar URL primeiro
      const analysis = await analyzeURL(competitorUrl);
      setAnalysisResult(analysis);
      
      // Adicionar concorrente
      addCompetitor(competitorUrl, competitorName);
      
      // Limpar campos
      setCompetitorUrl('');
      setCompetitorName('');
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      alert('URL inválida. Por favor, insira uma URL completa (ex: https://exemplo.com)');
    }
  };

  const handleAnalyzeCompetitor = (competitor) => {
    setSelectedCompetitor(competitor);
    setShowAnalysisModal(true);
  };

  const handleRefreshCompetitor = (id, url) => {
    fetchCompetitorData(id, url);
  };

  const handleGenerateReport = () => {
    const report = generateReport(trackingEmail || emailInput, true);
    alert('Relatório gerado e enviado para seu email!');
    console.log('Relatório:', report);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-1">SEO Workflow</h2>
          <p className="text-muted">Acompanhamento de SEO e monitoramento de concorrentes</p>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={handleGenerateReport}
            disabled={loading}
          >
            {loading ? 'Gerando...' : 'Gerar Relatório Completo'}
          </Button>
        </Col>
      </Row>

      {showSuccess && (
        <Alert variant="success" className="mb-4" dismissible onClose={() => setShowSuccess(false)}>
          Operação realizada com sucesso!
        </Alert>
      )}

      {/* Email Tracking Section */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={8}>
                  <h5 className="mb-3">
                    <FaEnvelope className="me-2" />
                    Email para Acompanhamento
                  </h5>
                  <p className="text-white-50 mb-3">
                    Receba alertas de mudanças nos concorrentes e relatórios periódicos
                  </p>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="email"
                      placeholder="seu@email.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="bg-white border-0"
                      style={{ maxWidth: '300px' }}
                    />
                    <Button variant="light" onClick={handleSaveEmail}>
                      Salvar Email
                    </Button>
                  </div>
                </Col>
                <Col md={4} className="text-end">
                  {trackingEmail && (
                    <div>
                      <small className="text-white-50">Email atual:</small>
                      <p className="mb-0 fw-bold">{trackingEmail}</p>
                      <small className="text-white-50">Última atualização: {formatDate(lastUpdate)}</small>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs para diferentes funcionalidades */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="competitors" title="Concorrentes">
              <Row>
                <Col lg={4}>
                  <Card className="bg-light border-0">
                    <Card.Body>
                      <h6 className="mb-3">Adicionar Concorrente</h6>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>URL do Concorrente *</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type="url"
                              placeholder="https://concorrente.com"
                              value={competitorUrl}
                              onChange={(e) => setCompetitorUrl(e.target.value)}
                            />
                          </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Nome (opcional)</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Nome do concorrente"
                            value={competitorName}
                            onChange={(e) => setCompetitorName(e.target.value)}
                          />
                        </Form.Group>

                        <Button 
                          variant="primary" 
                          onClick={handleAddCompetitor}
                          disabled={loading}
                          className="w-100"
                        >
                          <FaPlus className="me-2" />
                          Adicionar Concorrente
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={8}>
                  <h6 className="mb-3">Concorrentes Monitorados</h6>
                  {competitors.length === 0 ? (
                    <Alert variant="info">
                      Nenhum concorrente adicionado. Adicione URLs para começar o monitoramento.
                    </Alert>
                  ) : (
                    <ListGroup>
                      {competitors.map(comp => (
                        <ListGroup.Item key={comp.id} className="mb-2">
                          <Row className="align-items-center">
                            <Col>
                              <div className="d-flex align-items-center">
                                <FaGlobe className="text-primary me-2" />
                                <div>
                                  <h6 className="mb-0">{comp.name || comp.url}</h6>
                                  <small className="text-muted">{comp.url}</small>
                                  {comp.lastChecked && (
                                    <small className="text-muted d-block">
                                      Última verificação: {formatDate(comp.lastChecked)}
                                    </small>
                                  )}
                                </div>
                              </div>
                            </Col>
                            <Col xs="auto">
                              {comp.data && (
                                <Badge bg={getScoreColor(comp.data.authority)} className="me-2">
                                  Autoridade: {comp.data.authority}
                                </Badge>
                              )}
                              <Button 
                                variant="outline-info" 
                                size="sm"
                                className="me-2"
                                onClick={() => handleAnalyzeCompetitor(comp)}
                              >
                                <FaChartBar />
                              </Button>
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                className="me-2"
                                onClick={() => handleRefreshCompetitor(comp.id, comp.url)}
                              >
                                <FaSync />
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => removeCompetitor(comp.id)}
                              >
                                <FaTrash />
                              </Button>
                            </Col>
                          </Row>

                          {comp.data && (
                            <Row className="mt-2">
                              <Col md={3}>
                                <small className="text-muted">Rank: #{comp.data.rank}</small>
                              </Col>
                              <Col md={3}>
                                <small className="text-muted">Keywords: {comp.data.keywords}</small>
                              </Col>
                              <Col md={3}>
                                <small className="text-muted">Backlinks: {comp.data.backlinks}</small>
                              </Col>
                              <Col md={3}>
                                <small className="text-muted">Tráfego: {comp.data.traffic}</small>
                              </Col>
                            </Row>
                          )}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="comparison" title="Comparação">
              <Row>
                <Col lg={6}>
                  <Card className="bg-light border-0 mb-3">
                    <Card.Body>
                      <h6 className="mb-3">Seu Site</h6>
                      <div className="text-center mb-3">
                        <div className="display-4 text-primary">72</div>
                        <p className="text-muted">SEO Score</p>
                      </div>
                      <ProgressBar now={72} variant="warning" className="mb-3" />
                      <Table size="sm">
                        <tbody>
                          <tr>
                            <td>Autoridade</td>
                            <td>45</td>
                          </tr>
                          <tr>
                            <td>Backlinks</td>
                            <td>1,234</td>
                          </tr>
                          <tr>
                            <td>Keywords</td>
                            <td>567</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={6}>
                  <h6 className="mb-3">Comparação com Concorrentes</h6>
                  {competitors.map(comp => comp.data && (
                    <Card key={comp.id} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between mb-2">
                          <h6>{comp.name || comp.url}</h6>
                          <Badge bg={getScoreColor(comp.data.authority)}>
                            Score: {comp.data.authority}
                          </Badge>
                        </div>
                        
                        <Row>
                          <Col md={6}>
                            <small className="text-muted d-block">Keywords: {comp.data.keywords}</small>
                            <small className="text-muted d-block">Backlinks: {comp.data.backlinks}</small>
                          </Col>
                          <Col md={6}>
                            <small className="text-muted d-block">Tráfego: {comp.data.traffic}</small>
                            <small className="text-muted d-block">Rank: #{comp.data.rank}</small>
                          </Col>
                        </Row>

                        <div className="mt-2">
                          <small className="text-success">
                            <FaArrowUp /> Você está {comp.data.rank > 5 ? 'atrás' : 'à frente'} em ranking
                          </small>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="alerts" title="Alertas">
              <Card className="bg-light border-0">
                <Card.Body>
                  <h6 className="mb-3">Configurar Alertas</h6>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="checkbox"
                        label="Alertar quando concorrente subir no ranking"
                        defaultChecked
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="checkbox"
                        label="Alertar sobre novas palavras-chave dos concorrentes"
                        defaultChecked
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="checkbox"
                        label="Alertar sobre aumento significativo de backlinks"
                        defaultChecked
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Frequência de relatórios</Form.Label>
                      <Form.Select>
                        <option>Diário</option>
                        <option>Semanal</option>
                        <option>Mensal</option>
                      </Form.Select>
                    </Form.Group>
                    <Button variant="primary">Salvar Configurações</Button>
                  </Form>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      {/* Modal de Análise Detalhada */}
      <Modal show={showAnalysisModal} onHide={() => setShowAnalysisModal(false)} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            Análise Detalhada: {selectedCompetitor?.name || selectedCompetitor?.url}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCompetitor?.data && (
            <>
              <Row className="mb-4">
                <Col md={4}>
                  <Card className="bg-light">
                    <Card.Body className="text-center">
                      <h3 className="text-primary">{selectedCompetitor.data.authority}</h3>
                      <small className="text-muted">Autoridade</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="bg-light">
                    <Card.Body className="text-center">
                      <h3>{selectedCompetitor.data.backlinks}</h3>
                      <small className="text-muted">Backlinks</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="bg-light">
                    <Card.Body className="text-center">
                      <h3>{selectedCompetitor.data.traffic}</h3>
                      <small className="text-muted">Tráfego Mensal</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <h6 className="mb-3">Principais Palavras-chave</h6>
              <div className="mb-4">
                {selectedCompetitor.data.topKeywords?.map((kw, idx) => (
                  <Badge key={idx} bg="light" text="dark" className="me-2 mb-2 p-2">
                    {kw}
                  </Badge>
                ))}
              </div>

              <h6 className="mb-3">Métricas de Performance</h6>
              <Table bordered>
                <tbody>
                  <tr>
                    <td>Velocidade</td>
                    <td>
                      <ProgressBar 
                        now={selectedCompetitor.data.speedScore} 
                        variant={getScoreColor(selectedCompetitor.data.speedScore)}
                        label={`${selectedCompetitor.data.speedScore}%`}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Mobile</td>
                    <td>
                      <ProgressBar 
                        now={selectedCompetitor.data.mobileScore} 
                        variant={getScoreColor(selectedCompetitor.data.mobileScore)}
                        label={`${selectedCompetitor.data.mobileScore}%`}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Social</td>
                    <td>
                      <ProgressBar 
                        now={selectedCompetitor.data.socialScore} 
                        variant={getScoreColor(selectedCompetitor.data.socialScore)}
                        label={`${selectedCompetitor.data.socialScore}%`}
                      />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAnalysisModal(false)}>
            Fechar
          </Button>
          <Button 
            variant="primary" 
            href={selectedCompetitor?.url} 
            target="_blank"
          >
            <FaExternalLinkAlt className="me-2" />
            Visitar Site
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SEO;