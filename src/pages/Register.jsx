import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaEnvelope, FaLock, FaProjectDiagram, FaUser, FaPhone, FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false
  });

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    number: false,
    uppercase: false,
    lowercase: false,
    special: false
  });

  // Validações
  const validateName = (name) => {
    if (!name || name.trim() === '') return 'Nome completo é obrigatório';
    if (name.trim().length < 3) return 'Nome deve ter pelo menos 3 caracteres';
    if (name.trim().split(' ').length < 2) return 'Por favor, insira nome e sobrenome';
    return '';
  };

  const validateEmail = (email) => {
    if (!email || email.trim() === '') return 'Email é obrigatório';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Email inválido';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone || phone.trim() === '') return 'Telefone é obrigatório';
    const phoneRegex = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) return 'Telefone inválido (ex: (11) 99999-9999)';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Senha é obrigatória';
    
    // Verificar força da senha
    const strength = {
      length: password.length >= 8,
      number: /\d/.test(password),
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    setPasswordStrength(strength);

    if (password.length < 8) return 'A senha deve ter pelo menos 8 caracteres';
    if (!/\d/.test(password)) return 'A senha deve conter pelo menos um número';
    if (!/[A-Z]/.test(password)) return 'A senha deve conter pelo menos uma letra maiúscula';
    if (!/[a-z]/.test(password)) return 'A senha deve conter pelo menos uma letra minúscula';
    
    return '';
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) return 'Confirme sua senha';
    if (confirmPassword !== formData.password) return 'As senhas não coincidem';
    return '';
  };

  // Formatar telefone
  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      if (numbers.length <= 2) {
        return `(${numbers}`;
      } else if (numbers.length <= 6) {
        return `(${numbers.slice(0,2)}) ${numbers.slice(2)}`;
      } else if (numbers.length <= 10) {
        return `(${numbers.slice(0,2)}) ${numbers.slice(2,6)}-${numbers.slice(6)}`;
      } else {
        return `(${numbers.slice(0,2)}) ${numbers.slice(2,7)}-${numbers.slice(7)}`;
      }
    }
    return value;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'phone') {
      const formatted = formatPhone(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
      setErrors(prev => ({ ...prev, [name]: validatePhone(formatted) }));
    } else if (name === 'password') {
      setFormData(prev => ({ ...prev, [name]: value }));
      const passwordError = validatePassword(value);
      setErrors(prev => ({ ...prev, [name]: passwordError }));
      
      // Validar confirmação de senha também
      if (formData.confirmPassword) {
        setErrors(prev => ({ 
          ...prev, 
          confirmPassword: validateConfirmPassword(formData.confirmPassword) 
        }));
      }
    } else if (name === 'confirmPassword') {
      setFormData(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: validateConfirmPassword(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
      
      // Validar campo específico
      let error = '';
      if (name === 'name') error = validateName(value);
      if (name === 'email') error = validateEmail(value);
      
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    let error = '';
    switch (field) {
      case 'name':
        error = validateName(formData.name);
        break;
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'phone':
        error = validatePhone(formData.phone);
        break;
      case 'password':
        error = validatePassword(formData.password);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(formData.confirmPassword);
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateForm = () => {
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phone);
    const passwordError = validatePassword(formData.password);
    const confirmError = validateConfirmPassword(formData.confirmPassword);
    const termsError = !formData.acceptTerms ? 'Você deve aceitar os termos' : '';

    setErrors({
      name: nameError,
      email: emailError,
      phone: phoneError,
      password: passwordError,
      confirmPassword: confirmError,
      acceptTerms: termsError
    });

    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true
    });

    return !nameError && !emailError && !phoneError && !passwordError && !confirmError && formData.acceptTerms;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await register(formData.email, formData.password, formData.name, formData.phone);
        navigate('/');
      } catch (error) {
        // Erro já está sendo gerenciado pelo contexto
      }
    }
  };

  const isFormValid = () => {
    return !errors.name && !errors.email && !errors.phone && 
           !errors.password && !errors.confirmPassword && 
           formData.acceptTerms && formData.name && formData.email && 
           formData.phone && formData.password && formData.confirmPassword;
  };

  const getPasswordStrengthColor = () => {
    const strengthCount = Object.values(passwordStrength).filter(Boolean).length;
    if (strengthCount <= 2) return 'danger';
    if (strengthCount <= 4) return 'warning';
    return 'success';
  };

  const getPasswordStrengthText = () => {
    const strengthCount = Object.values(passwordStrength).filter(Boolean).length;
    if (strengthCount <= 2) return 'Fraca';
    if (strengthCount <= 4) return 'Média';
    return 'Forte';
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ backgroundColor: '#f4f6f9' }}>
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={6} xl={5}>
          {/* Logo e Título */}
          <div className="text-center mb-4">
            <div className="d-inline-block bg-primary text-white p-3 rounded-circle mb-3">
              <FaProjectDiagram size={40} />
            </div>
            <h2 className="fw-bold">AutoFlow</h2>
            <p className="text-muted">Business Automation Platform</p>
          </div>

          {/* Card de Registro */}
          <Card className="border-0 shadow-lg">
            <Card.Body className="p-5">
              <h4 className="text-center mb-4">Criar Nova Conta</h4>
              
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Nome Completo */}
                <Form.Group className="mb-3">
                  <div className="position-relative">
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Nome Completo *"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={() => handleBlur('name')}
                      className={`ps-5 py-3 ${touched.name && errors.name ? 'is-invalid' : ''} ${touched.name && !errors.name && formData.name ? 'is-valid' : ''}`}
                      required
                    />
                    <FaUser className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    {touched.name && !errors.name && formData.name && (
                      <FaCheck className="position-absolute top-50 end-0 translate-middle-y me-3 text-success" />
                    )}
                  </div>
                  {touched.name && errors.name && (
                    <Form.Text className="text-danger">
                      {errors.name}
                    </Form.Text>
                  )}
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3">
                  <div className="position-relative">
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Email *"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur('email')}
                      className={`ps-5 py-3 ${touched.email && errors.email ? 'is-invalid' : ''} ${touched.email && !errors.email && formData.email ? 'is-valid' : ''}`}
                      required
                    />
                    <FaEnvelope className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    {touched.email && !errors.email && formData.email && (
                      <FaCheck className="position-absolute top-50 end-0 translate-middle-y me-3 text-success" />
                    )}
                  </div>
                  {touched.email && errors.email && (
                    <Form.Text className="text-danger">
                      {errors.email}
                    </Form.Text>
                  )}
                </Form.Group>

                {/* Telefone */}
                <Form.Group className="mb-3">
                  <div className="position-relative">
                    <Form.Control
                      type="text"
                      name="phone"
                      placeholder="Telefone *"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={() => handleBlur('phone')}
                      className={`ps-5 py-3 ${touched.phone && errors.phone ? 'is-invalid' : ''} ${touched.phone && !errors.phone && formData.phone ? 'is-valid' : ''}`}
                      required
                    />
                    <FaPhone className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    {touched.phone && !errors.phone && formData.phone && (
                      <FaCheck className="position-absolute top-50 end-0 translate-middle-y me-3 text-success" />
                    )}
                  </div>
                  {touched.phone && errors.phone && (
                    <Form.Text className="text-danger">
                      {errors.phone}
                    </Form.Text>
                  )}
                </Form.Group>

                {/* Senha */}
                <Form.Group className="mb-3">
                  <div className="position-relative">
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Senha *"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur('password')}
                      className={`ps-5 py-3 ${touched.password && errors.password ? 'is-invalid' : ''}`}
                      required
                    />
                    <FaLock className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                  </div>
                  {touched.password && formData.password && (
                    <div className="mt-2">
                      <div className="d-flex justify-content-between mb-1">
                        <small className="text-muted">Força da senha:</small>
                        <small className={`text-${getPasswordStrengthColor()}`}>
                          {getPasswordStrengthText()}
                        </small>
                      </div>
                      <div className="progress" style={{ height: '5px' }}>
                        <div 
                          className={`progress-bar bg-${getPasswordStrengthColor()}`} 
                          style={{ width: `${(Object.values(passwordStrength).filter(Boolean).length / 5) * 100}%` }}
                        />
                      </div>
                      <div className="mt-2 small">
                        <div className={`d-flex align-items-center gap-2 mb-1 ${passwordStrength.length ? 'text-success' : 'text-muted'}`}>
                          {passwordStrength.length ? <FaCheck size={12} /> : <FaTimes size={12} />}
                          <span>Mínimo 8 caracteres</span>
                        </div>
                        <div className={`d-flex align-items-center gap-2 mb-1 ${passwordStrength.number ? 'text-success' : 'text-muted'}`}>
                          {passwordStrength.number ? <FaCheck size={12} /> : <FaTimes size={12} />}
                          <span>Pelo menos 1 número</span>
                        </div>
                        <div className={`d-flex align-items-center gap-2 mb-1 ${passwordStrength.uppercase ? 'text-success' : 'text-muted'}`}>
                          {passwordStrength.uppercase ? <FaCheck size={12} /> : <FaTimes size={12} />}
                          <span>Pelo menos 1 letra maiúscula</span>
                        </div>
                        <div className={`d-flex align-items-center gap-2 mb-1 ${passwordStrength.lowercase ? 'text-success' : 'text-muted'}`}>
                          {passwordStrength.lowercase ? <FaCheck size={12} /> : <FaTimes size={12} />}
                          <span>Pelo menos 1 letra minúscula</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {touched.password && errors.password && (
                    <Form.Text className="text-danger">
                      {errors.password}
                    </Form.Text>
                  )}
                </Form.Group>

                {/* Confirmar Senha */}
                <Form.Group className="mb-4">
                  <div className="position-relative">
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirmar Senha *"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={() => handleBlur('confirmPassword')}
                      className={`ps-5 py-3 ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''} ${touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword ? 'is-valid' : ''}`}
                      required
                    />
                    <FaLock className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword && (
                      <FaCheck className="position-absolute top-50 end-0 translate-middle-y me-3 text-success" />
                    )}
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Form.Text className="text-danger">
                      {errors.confirmPassword}
                    </Form.Text>
                  )}
                </Form.Group>

                {/* Termos de Uso */}
                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    name="acceptTerms"
                    label={
                      <span className="small">
                        Eu aceito os <a href="#" className="text-decoration-none">Termos de Uso</a> e{' '}
                        <a href="#" className="text-decoration-none">Política de Privacidade</a>
                      </span>
                    }
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    isInvalid={!!errors.acceptTerms}
                  />
                  {errors.acceptTerms && (
                    <Form.Text className="text-danger">
                      {errors.acceptTerms}
                    </Form.Text>
                  )}
                </Form.Group>

                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-100 py-3 fw-bold"
                  disabled={loading || !isFormValid()}
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
                      Criando conta...
                    </>
                  ) : (
                    'Criar Conta'
                  )}
                </Button>

                <div className="text-center mt-4">
                  <span className="text-muted">Já tem uma conta? </span>
                  <Link to="/login" className="text-decoration-none">
                    Fazer login
                  </Link>
                </div>
              </Form>

              {/* Indicador de campos obrigatórios */}
              <div className="mt-4 p-3 bg-light rounded">
                <small className="text-muted d-block mb-2">
                  <strong>Campos obrigatórios:</strong>
                </small>
                <div className="d-flex flex-wrap gap-3">
                  <small className={`${formData.name ? 'text-success' : 'text-muted'}`}>
                    ✓ Nome completo
                  </small>
                  <small className={`${formData.email ? 'text-success' : 'text-muted'}`}>
                    ✓ Email
                  </small>
                  <small className={`${formData.phone ? 'text-success' : 'text-muted'}`}>
                    ✓ Telefone
                  </small>
                  <small className={`${formData.password && formData.confirmPassword && !errors.password && !errors.confirmPassword ? 'text-success' : 'text-muted'}`}>
                    ✓ Senha
                  </small>
                  <small className={`${formData.acceptTerms ? 'text-success' : 'text-muted'}`}>
                    ✓ Termos
                  </small>
                </div>
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

export default Register;