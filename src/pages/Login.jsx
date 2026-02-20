import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaEnvelope, FaLock, FaProjectDiagram } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!formData.email || !formData.password) {
      setLocalError('Por favor, preencha todos os campos');
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      // Erro já está sendo gerenciado pelo contexto
    }
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f4f6f9' }}>
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5} xl={4}>
          {/* Logo e Título */}
          <div className="text-center mb-4">
            <div className="d-inline-block bg-primary text-white p-3 rounded-circle mb-3">
              <FaProjectDiagram size={40} />
            </div>
            <h2 className="fw-bold">AutoFlow</h2>
            <p className="text-muted">Business Automation Platform</p>
          </div>

          {/* Card de Login */}
          <Card className="border-0 shadow-lg">
            <Card.Body className="p-5">
              <h4 className="text-center mb-4">Bem-vindo de volta!</h4>
              
              {(error || localError) && (
                <Alert variant="danger" className="mb-4">
                  {error || localError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <div className="position-relative">
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="ps-5 py-3"
                      required
                    />
                    <FaEnvelope className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <div className="position-relative">
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Senha"
                      value={formData.password}
                      onChange={handleChange}
                      className="ps-5 py-3"
                      required
                    />
                    <FaLock className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                  </div>
                </Form.Group>

                <Row className="mb-4">
                  <Col>
                    <Form.Check
                      type="checkbox"
                      name="rememberMe"
                      label="Lembrar-me"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col className="text-end">
                    <Button variant="link" className="p-0 text-decoration-none">
                      Esqueceu a senha?
                    </Button>
                  </Col>
                </Row>

                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-100 py-3 fw-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>

                <div className="text-center mt-4">
                  <span className="text-muted">Não tem uma conta? </span>
                  <Link to="/register" className="text-decoration-none">
                    Criar conta
                  </Link>
                </div>
              </Form>

              {/* Credenciais de teste */}
              <div className="mt-4 p-3 bg-light rounded">
                <small className="text-muted d-block mb-2">
                  <strong>Credenciais de teste:</strong>
                </small>
                <small className="text-muted d-block">Email: admin@email.com</small>
                <small className="text-muted d-block">Senha: admin123</small>
              </div>
            </Card.Body>
          </Card>

          {/* Footer */}
          <div className="text-center mt-4">
            <small className="text-muted">
              © 2024 AutoFlow. Todos os direitos reservados.
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;