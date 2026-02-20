import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Image, Badge, Alert, Modal } from 'react-bootstrap';
import { 
  FaUser, FaEnvelope, FaKey, FaShieldAlt, FaBell,
  FaCamera, FaSave, FaHistory, FaSignOutAlt, FaTrash,
  FaCheck, FaTimes, FaPhone, FaExclamationCircle
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useFirebaseUpload } from '../hooks/useFirebaseUpload';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const { uploadAvatar, removeAvatar, uploadProgress, uploading, error: uploadError } = useFirebaseUpload();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false
  });
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '(11) 99999-9999',
    department: 'Tecnologia',
    bio: 'Profissional de automação com experiência em workflows e processos de negócio.'
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [previewImage, setPreviewImage] = useState(user?.avatar || 'https://via.placeholder.com/150');

  // Funções de validação
  const validateName = (name) => {
    if (!name || name.trim() === '') {
      return 'Nome completo é obrigatório';
    }
    if (name.trim().length < 3) {
      return 'Nome deve ter pelo menos 3 caracteres';
    }
    if (name.trim().split(' ').length < 2) {
      return 'Por favor, insira nome e sobrenome';
    }
    return '';
  };

  const validateEmail = (email) => {
    if (!email || email.trim() === '') {
      return 'Email é obrigatório';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Email inválido';
    }
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone || phone.trim() === '') {
      return 'Telefone é obrigatório';
    }
    // Aceita formatos: (11) 99999-9999, 11999999999, 11 99999-9999
    const phoneRegex = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      return 'Telefone inválido (ex: (11) 99999-9999)';
    }
    return '';
  };

  // Validar todos os campos
  const validateForm = () => {
    const nameError = validateName(profileData.name);
    const emailError = validateEmail(profileData.email);
    const phoneError = validatePhone(profileData.phone);

    setErrors({
      name: nameError,
      email: emailError,
      phone: phoneError
    });

    return !nameError && !emailError && !phoneError;
  };

  // Verificar se o formulário é válido
  const isFormValid = () => {
    return !errors.name && !errors.email && !errors.phone && 
           profileData.name && profileData.email && profileData.phone;
  };

  // Handler para mudanças nos campos
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));

    // Validação em tempo real
    let error = '';
    switch (name) {
      case 'name':
        error = validateName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Handler para blur (quando sai do campo)
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validação adicional no blur
    let error = '';
    switch (field) {
      case 'name':
        error = validateName(profileData.name);
        break;
      case 'email':
        error = validateEmail(profileData.email);
        break;
      case 'phone':
        error = validatePhone(profileData.phone);
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Formatar telefone enquanto digita
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

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setProfileData(prev => ({ ...prev, phone: formatted }));
    
    const error = validatePhone(formatted);
    setErrors(prev => ({ ...prev, phone: error }));
  };

  const handleSaveProfile = () => {
    setTouched({
      name: true,
      email: true,
      phone: true
    });

    if (validateForm()) {
      // Aqui você salvaria os dados no Firestore
      setSuccessMessage('Perfil atualizado com sucesso!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setShowErrors(false);
    } else {
      setShowErrors(true);
      // Scroll para o primeiro erro
      const firstError = document.querySelector('.is-invalid');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      const downloadURL = await uploadAvatar(file);
      setSuccessMessage('Foto atualizada com sucesso!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Erro no upload:', error);
      setPreviewImage(user?.avatar || 'https://via.placeholder.com/150');
    }
  };

  const handleRemovePhoto = async () => {
    if (window.confirm('Deseja remover sua foto de perfil?')) {
      await removeAvatar();
      setPreviewImage('https://via.placeholder.com/150');
      setSuccessMessage('Foto removida com sucesso!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-1">Meu Perfil</h2>
          <p className="text-muted">Gerencie suas informações e configurações da conta</p>
        </Col>
      </Row>

      {showSuccess && (
        <Alert variant="success" className="mb-4" dismissible onClose={() => setShowSuccess(false)}>
          <FaCheck className="me-2" /> {successMessage}
        </Alert>
      )}

      {showErrors && !isFormValid() && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setShowErrors(false)}>
          <FaExclamationCircle className="me-2" />
          Por favor, preencha todos os campos obrigatórios corretamente.
        </Alert>
      )}

      {uploadError && (
        <Alert variant="danger" className="mb-4" dismissible>
          <FaTimes className="me-2" /> {uploadError}
        </Alert>
      )}

      <Row>
        {/* Sidebar do Perfil */}
        <Col lg={3} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              {/* Foto de Perfil */}
              <div className="position-relative d-inline-block mb-3">
                <Image 
                  src={previewImage} 
                  roundedCircle 
                  width={120} 
                  height={120}
                  className="border border-3 border-primary"
                  style={{ objectFit: 'cover' }}
                />
                
                <Button 
                  variant="light" 
                  size="sm" 
                  className="position-absolute bottom-0 end-0 rounded-circle"
                  style={{ width: '35px', height: '35px' }}
                  onClick={triggerFileInput}
                  disabled={uploading}
                >
                  <FaCamera />
                </Button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  style={{ display: 'none' }}
                />

                {previewImage !== 'https://via.placeholder.com/150' && (
                  <Button
                    variant="danger"
                    size="sm"
                    className="position-absolute top-0 end-0 rounded-circle"
                    style={{ width: '25px', height: '25px', fontSize: '12px' }}
                    onClick={handleRemovePhoto}
                    disabled={uploading}
                  >
                    <FaTrash />
                  </Button>
                )}
              </div>

              {uploading && (
                <div className="mb-3">
                  <div className="progress" style={{ height: '5px' }}>
                    <div 
                      className="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <small className="text-muted">Enviando... {Math.round(uploadProgress)}%</small>
                </div>
              )}

              <h4>{profileData.name || 'Nome não informado'}</h4>
              <p className="text-muted mb-2">{profileData.email || 'Email não informado'}</p>
              <Badge bg="primary" className="px-3 py-2 mb-3">
                Administrador
              </Badge>
              
              <hr />
              
              <div className="text-start">
                <Button 
                  variant="link" 
                  className={`text-decoration-none w-100 text-start ${activeTab === 'profile' ? 'fw-bold text-primary' : 'text-dark'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <FaUser className="me-2" /> Informações Pessoais
                </Button>
                <Button 
                  variant="link" 
                  className={`text-decoration-none w-100 text-start ${activeTab === 'security' ? 'fw-bold text-primary' : 'text-dark'}`}
                  onClick={() => setActiveTab('security')}
                >
                  <FaShieldAlt className="me-2" /> Segurança
                </Button>
                <Button 
                  variant="link" 
                  className={`text-decoration-none w-100 text-start ${activeTab === 'preferences' ? 'fw-bold text-primary' : 'text-dark'}`}
                  onClick={() => setActiveTab('preferences')}
                >
                  <FaBell className="me-2" /> Preferências
                </Button>
                <Button 
                  variant="link" 
                  className={`text-decoration-none w-100 text-start ${activeTab === 'history' ? 'fw-bold text-primary' : 'text-dark'}`}
                  onClick={() => setActiveTab('history')}
                >
                  <FaHistory className="me-2" /> Histórico de Login
                </Button>
              </div>
              
              <hr />
              
              <Button 
                variant="danger" 
                className="w-100"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="me-2" /> Sair da Conta
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Conteúdo Principal */}
        <Col lg={9}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                {activeTab === 'profile' && 'Informações Pessoais'}
                {activeTab === 'security' && 'Segurança da Conta'}
                {activeTab === 'preferences' && 'Preferências'}
                {activeTab === 'history' && 'Histórico de Login'}
              </h5>
            </Card.Header>
            <Card.Body>
              {/* Informações Pessoais - CAMPOS OBRIGATÓRIOS */}
              {activeTab === 'profile' && (
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Nome Completo <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          onBlur={() => handleBlur('name')}
                          isInvalid={touched.name && !!errors.name}
                          isValid={touched.name && !errors.name && profileData.name}
                          placeholder="Digite seu nome completo"
                        />
                        {touched.name && errors.name && (
                          <Form.Control.Feedback type="invalid">
                            {errors.name}
                          </Form.Control.Feedback>
                        )}
                        {touched.name && !errors.name && profileData.name && (
                          <Form.Text className="text-success">
                            <FaCheck /> Nome válido
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Email <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          onBlur={() => handleBlur('email')}
                          isInvalid={touched.email && !!errors.email}
                          isValid={touched.email && !errors.email && profileData.email}
                          placeholder="seu@email.com"
                          disabled // Email não pode ser alterado
                        />
                        {touched.email && errors.email && (
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        )}
                        {touched.email && !errors.email && profileData.email && (
                          <Form.Text className="text-success">
                            <FaCheck /> Email válido
                          </Form.Text>
                        )}
                        <Form.Text className="text-muted">
                          O email não pode ser alterado
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Telefone <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="phone"
                          value={profileData.phone}
                          onChange={handlePhoneChange}
                          onBlur={() => handleBlur('phone')}
                          isInvalid={touched.phone && !!errors.phone}
                          isValid={touched.phone && !errors.phone && profileData.phone}
                          placeholder="(11) 99999-9999"
                        />
                        {touched.phone && errors.phone && (
                          <Form.Control.Feedback type="invalid">
                            {errors.phone}
                          </Form.Control.Feedback>
                        )}
                        {touched.phone && !errors.phone && profileData.phone && (
                          <Form.Text className="text-success">
                            <FaCheck /> Telefone válido
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Departamento</Form.Label>
                        <Form.Select 
                          value={profileData.department}
                          onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                        >
                          <option value="Tecnologia">Tecnologia</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Vendas">Vendas</option>
                          <option value="RH">RH</option>
                          <option value="Financeiro">Financeiro</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Biografia</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      placeholder="Conte um pouco sobre você"
                    />
                  </Form.Group>

                  {/* Indicador de campos obrigatórios */}
                  <div className="bg-light p-3 rounded mb-3">
                    <small className="text-muted">
                      <span className="text-danger">*</span> Campos obrigatórios
                    </small>
                    <div className="mt-2">
                      <FaCheck className="text-success me-2" />
                      <span className={!profileData.name ? 'text-danger' : 'text-success'}>
                        Nome Completo {profileData.name ? '✓' : '(pendente)'}
                      </span>
                    </div>
                    <div className="mt-1">
                      <FaCheck className="text-success me-2" />
                      <span className={!profileData.email ? 'text-danger' : 'text-success'}>
                        Email {profileData.email ? '✓' : '(pendente)'}
                      </span>
                    </div>
                    <div className="mt-1">
                      <FaCheck className="text-success me-2" />
                      <span className={!profileData.phone ? 'text-danger' : 'text-success'}>
                        Telefone {profileData.phone ? '✓' : '(pendente)'}
                      </span>
                    </div>
                  </div>
                </Form>
              )}

              {/* Outras abas (igual ao anterior) */}
              {activeTab === 'security' && (
                <>
                  <div className="mb-4">
                    <h6 className="mb-3">Alterar Senha</h6>
                    <Button 
                      variant="outline-primary" 
                      onClick={() => setShowPasswordModal(true)}
                    >
                      <FaKey className="me-2" /> Alterar Senha
                    </Button>
                  </div>
                  <hr />
                  <div className="mb-4">
                    <h6 className="mb-3">Autenticação de Dois Fatores</h6>
                    <Button variant="outline-success" disabled>
                      <FaShieldAlt className="me-2" /> Em breve
                    </Button>
                  </div>
                </>
              )}

              {activeTab === 'preferences' && (
                <Form>
                  <h6 className="mb-3">Notificações</h6>
                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="switch"
                      label="Notificações por Email"
                      defaultChecked
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="switch"
                      label="Notificações Desktop"
                      defaultChecked
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Check 
                      type="switch"
                      label="Relatório Semanal"
                      defaultChecked
                    />
                  </Form.Group>

                  <h6 className="mb-3">Idioma e Região</h6>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Idioma</Form.Label>
                        <Form.Select defaultValue="pt-BR">
                          <option value="pt-BR">Português (Brasil)</option>
                          <option value="en-US">English (US)</option>
                          <option value="es">Español</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Fuso Horário</Form.Label>
                        <Form.Select defaultValue="America/Sao_Paulo">
                          <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                          <option value="America/New_York">Nova York (GMT-5)</option>
                          <option value="Europe/London">Londres (GMT+0)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              )}

              {activeTab === 'history' && (
                <div className="text-center py-4">
                  <p className="text-muted">Histórico de login em breve...</p>
                </div>
              )}
            </Card.Body>
            {activeTab === 'profile' && (
              <Card.Footer className="bg-white d-flex justify-content-between align-items-center">
                <div>
                  {!isFormValid() && (
                    <small className="text-danger">
                      <FaExclamationCircle className="me-1" />
                      Preencha todos os campos obrigatórios
                    </small>
                  )}
                </div>
                <Button 
                  variant="primary" 
                  onClick={handleSaveProfile}
                  disabled={!isFormValid()}
                >
                  <FaSave className="me-2" /> Salvar Alterações
                </Button>
              </Card.Footer>
            )}
          </Card>
        </Col>
      </Row>

      {/* Modal de Alterar Senha (igual ao anterior) */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Alterar Senha</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Senha Atual</Form.Label>
              <Form.Control type="password" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nova Senha</Form.Label>
              <Form.Control type="password" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirmar Nova Senha</Form.Label>
              <Form.Control type="password" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => {
            alert('Funcionalidade em desenvolvimento');
            setShowPasswordModal(false);
          }}>
            Alterar Senha
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;