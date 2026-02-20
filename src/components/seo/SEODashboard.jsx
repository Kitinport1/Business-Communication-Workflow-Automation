import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, ProgressBar, Alert } from 'react-bootstrap';
import { 
  FaSearch, FaChartLine, FaGlobe, FaFileAlt, 
  FaLink, FaExclamationTriangle, FaCheckCircle,
  FaArrowUp, FaArrowDown, FaMinus, FaRocket
} from 'react-icons/fa';
import seoService from '../../services/seoService';

const SEODashboard = () => {
  const [url, setUrl] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [keywordAnalysis, setKeywordAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Analisar URL
  const handleAnalyze = async () => {
    if (!url) {
      alert('Please enter a URL');
      return;
    }

    setLoading(true);
    const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k);
    
    try {
      const result = await seoService.generateFullReport(url, keywordList);
      setReport(result);
    } catch (error) {
      console.error('Error analyzing:', error);
    } finally {
      setLoading(false);
    }
  };

  // Analisar palavra-chave específica
  const handleKeywordAnalysis = async (keyword) => {
    setLoading(true);
    try {
      const result = await seoService.analyzeKeyword(keyword);
      setKeywordAnalysis(result);
    } catch (error) {
      console.error('Error analyzing keyword:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sugerir palavras-chave
  const handleSuggestKeywords = async (base) => {
    setLoading(true);
    try {
      const suggestions = await seoService.suggestKeywords(base);
      // Atualizar UI com sugestões
      console.log('Suggestions:', suggestions);
    } catch (error) {
      console.error('Error getting suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2 className="mb-0">SEO Workflow Automation</h2>
          <p className="text-muted">Análise, monitoramento e otimização automatizada</p>
        </Col>
      </Row>

      {/* Input Section */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Website URL</Form.Label>
                      <Form.Control
                        type="url"
                        placeholder="https://seusite.com.br"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Palavras-chave (separadas por vírgula)</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="seo, marketing digital, google ads"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button 
                  variant="primary" 
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? 'Analisando...' : 'Analisar SEO Completo'}
                  {!loading && <FaSearch className="ms-2" />}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Stats */}
        <Col lg={4}>
          <Card className="bg-primary text-white shadow-sm h-100">
            <Card.Body className="d-flex flex-column justify-content-center">
              <h5>SEO Workflow Status</h5>
              <div className="mt-3">
                <small>Análises hoje: 12</small>
                <ProgressBar now={65} className="mb-2" variant="light" />
                <small>Monitoramento ativo: 3 sites</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Results Section */}
      {report && (
        <>
          {/* Score Overview */}
          <Row className="mb-4">
            <Col md={4}>
              <Card className={`border-${report.audit.score > 80 ? 'success' : 'warning'}`}>
                <Card.Body className="text-center">
                  <h1 className={`display-4 text-${report.audit.score > 80 ? 'success' : 'warning'}`}>
                    {report.audit.score}
                  </h1>
                  <h6>SEO Score</h6>
                  <Badge bg={report.audit.score > 80 ? 'success' : 'warning'}>
                    Grade {report.audit.grade}
                  </Badge>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body className="text-center">
                  <h1 className="display-4 text-primary">{report.overview.averagePosition.toFixed(1)}</h1>
                  <h6>Posição Média</h6>
                  <small className="text-muted">
                    Top 10: {report.overview.top10Keywords} palavras-chave
                  </small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body className="text-center">
                  <h1 className="display-4 text-info">{report.opportunities.length}</h1>
                  <h6>Oportunidades Identificadas</h6>
                  <Button variant="link" size="sm">Ver todas</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* SEO Audit Details */}
          <Row className="mb-4">
            <Col lg={6}>
              <Card className="shadow-sm">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Auditoria SEO On-Page</h5>
                </Card.Header>
                <Card.Body>
                  <Table borderless size="sm">
                    <tbody>
                      {Object.entries(report.audit.checks).map(([key, check]) => (
                        <tr key={key}>
                          <td className="text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                          <td className="text-end">
                            {check.status ? (
                              <Badge bg="success" className="px-3">
                                <FaCheckCircle className="me-1" /> OK
                              </Badge>
                            ) : (
                              <Badge bg="danger" className="px-3">
                                <FaExclamationTriangle className="me-1" /> Issues
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6}>
              <Card className="shadow-sm">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Análise de Concorrentes</h5>
                </Card.Header>
                <Card.Body>
                  {report.competitors.map((comp, idx) => (
                    <div key={idx} className="mb-3 pb-2 border-bottom">
                      <div className="d-flex justify-content-between">
                        <strong>{comp.url}</strong>
                        <Badge bg="info">Autoridade: {comp.authority}</Badge>
                      </div>
                      <small className="text-muted d-block">
                        {comp.keywords} keywords • {comp.backlinks} backlinks
                      </small>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Rankings */}
          <Row className="mb-4">
            <Col>
              <Card className="shadow-sm">
                <Card.Header className="bg-white d-flex justify-content-between">
                  <h5 className="mb-0">Rankings de Palavras-chave</h5>
                  <Badge bg="primary">Atualizado agora</Badge>
                </Card.Header>
                <Card.Body>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Palavra-chave</th>
                        <th>Posição</th>
                        <th>Variação</th>
                        <th>Volume</th>
                        <th>URL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.rankings.map((rank, idx) => (
                        <tr key={idx}>
                          <td className="fw-bold">{rank.keyword}</td>
                          <td>
                            <span className={`badge bg-${rank.position <= 10 ? 'success' : rank.position <= 20 ? 'warning' : 'secondary'}`}>
                              #{rank.position}
                            </span>
                          </td>
                          <td>
                            {rank.change > 0 ? (
                              <span className="text-success"><FaArrowUp /> +{rank.change}</span>
                            ) : rank.change < 0 ? (
                              <span className="text-danger"><FaArrowDown /> {rank.change}</span>
                            ) : (
                              <span className="text-muted"><FaMinus /> 0</span>
                            )}
                          </td>
                          <td>{rank.volume.toLocaleString()}</td>
                          <td>
                            <small className="text-muted">{rank.url}</small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Action Items */}
          <Row className="mb-4">
            <Col>
              <Card className="border-warning">
                <Card.Header className="bg-warning text-white">
                  <h5 className="mb-0">Ações Recomendadas</h5>
                </Card.Header>
                <Card.Body>
                  {report.actionItems.map((item, idx) => (
                    <Alert key={idx} variant={idx === 0 ? 'danger' : 'warning'} className="mb-2">
                      <FaRocket className="me-2" />
                      {item}
                    </Alert>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Keyword Analysis Modal/Component */}
      {keywordAnalysis && (
        <Card className="mt-4 shadow-sm">
          <Card.Header className="bg-white">
            <h5 className="mb-0">Análise Detalhada: {keywordAnalysis.keyword}</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <div className="text-center p-3 bg-light rounded">
                  <h3>{keywordAnalysis.volume.toLocaleString()}</h3>
                  <small className="text-muted">Volume mensal</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center p-3 bg-light rounded">
                  <h3>{keywordAnalysis.difficulty}%</h3>
                  <small className="text-muted">Dificuldade</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center p-3 bg-light rounded">
                  <h3>R$ {keywordAnalysis.cpc}</h3>
                  <small className="text-muted">CPC médio</small>
                </div>
              </Col>
            </Row>
            
            <div className="mt-3">
              <h6>Oportunidade: {keywordAnalysis.opportunity}</h6>
              <ProgressBar 
                now={100 - keywordAnalysis.difficulty} 
                variant={keywordAnalysis.difficulty < 50 ? 'success' : 'warning'}
                label={`${100 - keywordAnalysis.difficulty}%`}
              />
            </div>

            <div className="mt-3">
              <h6>Recomendações:</h6>
              <ul>
                {keywordAnalysis.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default SEODashboard;