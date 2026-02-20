import React from 'react';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { FaBell, FaUser, FaSearch, FaSignOutAlt, FaUserEdit } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Header.scss';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <Navbar bg="white" className="header shadow-sm px-3" expand="lg">
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand className="fw-bold text-primary">
          AutoFlow
        </Navbar.Brand>

        {/* Search Bar */}
        <div className="d-none d-md-block mx-auto" style={{ width: '400px' }}>
          <div className="search-wrapper">
            <FaSearch />
            <input 
              type="text" 
              className="form-control border-0 bg-light"
              placeholder="Search workflows..."
            />
          </div>
        </div>

        <Nav className="ms-auto align-items-center">
          {/* Notifications */}
          <Dropdown align="end" className="me-2">
            <Dropdown.Toggle variant="link" className="position-relative p-2 text-dark">
              <FaBell size={20} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="notifications-menu p-0">
              <div className="p-3 border-bottom">
                <h6 className="mb-0">Notificações</h6>
              </div>
              <Dropdown.Item className="p-3">
                <small className="text-muted d-block">Workflow executado com sucesso</small>
                <small className="text-muted">há 5 minutos</small>
              </Dropdown.Item>
              <Dropdown.Item className="p-3">
                <small className="text-muted d-block">Novo relatório disponível</small>
                <small className="text-muted">há 1 hora</small>
              </Dropdown.Item>
              <Dropdown.Item className="p-3">
                <small className="text-muted d-block">Alerta de concorrente detectado</small>
                <small className="text-muted">há 2 horas</small>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* User Menu */}
          <Dropdown align="end">
            <Dropdown.Toggle variant="link" className="d-flex align-items-center text-dark text-decoration-none">
              {user?.avatar && user.avatar !== 'https://via.placeholder.com/150' ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="user-avatar rounded-circle me-2"
                  style={{ width: 35, height: 35, objectFit: 'cover' }}
                />
              ) : (
                <div className="user-avatar me-2">
                  <FaUser />
                </div>
              )}
              <div className="d-none d-md-block text-start">
                <span className="fw-bold d-block">{user?.name || 'Usuário'}</span>
                <small className="text-muted">{user?.email}</small>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Header className="text-muted">
                Logado como Administrador
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleProfile}>
                <FaUserEdit className="me-2" /> Meu Perfil
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="text-danger">
                <FaSignOutAlt className="me-2" /> Sair
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;