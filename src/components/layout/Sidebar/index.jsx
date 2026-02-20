import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaProjectDiagram, 
  FaChartBar, 
  FaCog,
  FaUsers,
  FaEnvelope,
  FaClock,
  FaSearch,
  FaUser,
  FaBullhorn,
  FaRobot
} from 'react-icons/fa';
import './Sidebar.scss';

const Sidebar = () => {
  const menuItems = [
    { path: '/', icon: FaHome, label: 'Dashboard' },
    { path: '/workflows', icon: FaProjectDiagram, label: 'Workflows' },
    { path: '/seo', icon: FaSearch, label: 'SEO Workflow' },
    { path: '/automations', icon: FaRobot, label: 'Automações' },
    { path: '/marketing', icon: FaBullhorn, label: 'Marketing' },
    { path: '/analytics', icon: FaChartBar, label: 'Analytics' },
    { path: '/communications', icon: FaEnvelope, label: 'Communications' },
    { path: '/team', icon: FaUsers, label: 'Team' },
    { path: '/schedule', icon: FaClock, label: 'Schedule' },
    { path: '/profile', icon: FaUser, label: 'Meu Perfil' },
    { path: '/settings', icon: FaCog, label: 'Settings' },
  ];

  return (
    <div className="sidebar bg-dark text-white">
      <div className="sidebar-header">
        <h3 className="h5 mb-0">
          <FaProjectDiagram className="me-2" />
          AutoFlow
        </h3>
      </div>

      <Nav className="flex-column">
        {menuItems.map((item) => (
          <Nav.Link
            key={item.path}
            as={NavLink}
            to={item.path}
            className={({ isActive }) => 
              `nav-link text-white ${isActive ? 'active' : ''}`
            }
          >
            <item.icon className="me-3" />
            <span>{item.label}</span>
          </Nav.Link>
        ))}
      </Nav>

      <div className="sidebar-footer">
        <div className="d-flex align-items-center">
          <span className="online-indicator"></span>
          <small className="text-white-50">System Online</small>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;