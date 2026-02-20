const fs = require('fs');
const path = require('path');

// Função para criar arquivo com conteúdo
function createFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content);
  console.log(`✅ Created: ${filePath}`);
}

// Conteúdo dos arquivos
const files = {
  'src/pages/Dashboard.jsx': `import React from 'react';

const Dashboard = () => {
  return (
    <div className="dashboard p-4">
      <h1 className="mb-4">Dashboard</h1>
      <p>Welcome to the Business Workflow Automation Dashboard</p>
    </div>
  );
};

export default Dashboard;`,

  'src/pages/Workflows.jsx': `import React from 'react';

const Workflows = () => {
  return (
    <div className="workflows p-4">
      <h1 className="mb-4">Workflows</h1>
      <p>Manage your automation workflows here</p>
    </div>
  );
};

export default Workflows;`,

  'src/pages/Analytics.jsx': `import React from 'react';

const Analytics = () => {
  return (
    <div className="analytics p-4">
      <h1 className="mb-4">Analytics</h1>
      <p>View your workflow analytics and metrics</p>
    </div>
  );
};

export default Analytics;`,

  'src/pages/Settings.jsx': `import React from 'react';

const Settings = () => {
  return (
    <div className="settings p-4">
      <h1 className="mb-4">Settings</h1>
      <p>Configure your application settings</p>
    </div>
  );
};

export default Settings;`,

  'src/context/AuthContext.jsx': `import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const userData = { id: 1, name: 'John Doe', email, role: 'admin' };
      setUser(userData);
      localStorage.setItem('token', 'fake-token');
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};`,

  'src/components/layout/Header/Header.scss': `.header {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  .search-wrapper {
    position: relative;
    
    svg {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #6c757d;
    }
    
    input {
      padding-left: 35px;
      width: 300px;
    }
  }
  
  .user-avatar {
    width: 35px;
    height: 35px;
    background-color: #e9ecef;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #495057;
  }
}`,

  'src/components/layout/Sidebar/Sidebar.scss': `.sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-color: #343a40;
  color: #fff;
  
  .sidebar-header {
    padding: 20px;
    border-bottom: 1px solid #495057;
  }
  
  .nav-link {
    color: #adb5bd;
    padding: 12px 20px;
    
    &:hover {
      color: #fff;
      background-color: rgba(255,255,255,0.1);
    }
    
    &.active {
      color: #fff;
      background-color: #0d6efd;
    }
  }
  
  .sidebar-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px;
    border-top: 1px solid #495057;
  }
}`,

  'src/assets/styles/main.scss': `// Variables
$primary: #0d6efd;
$secondary: #6c757d;
$success: #198754;

// Global styles
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background-color: #f8f9fa;
}

.app-wrapper {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
}`
};

// Criar todos os arquivos
Object.entries(files).forEach(([filePath, content]) => {
  createFile(filePath, content);
});

console.log('\n🎉 Todos os arquivos foram criados com sucesso!');