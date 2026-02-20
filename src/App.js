import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/main.scss';

// Layout Components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Workflows from './pages/Workflows';
import Automations from './pages/Automations';
import Analytics from './pages/Analytics';
import Communications from './pages/Communications';
import Team from './pages/Team';
import Schedule from './pages/Schedule';
import Settings from './pages/Settings';
import SEO from './pages/SEO';
import MarketingChannels from './pages/MarketingChannels';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkflowProvider } from './context/WorkflowContext';
import { SEOProvider } from './context/SEOContext';
import PrivateRoute from './components/PrivateRoute';

// Componentes adicionais
import ConnectionStatus from './components/ConnectionStatus';

// Layout principal para usuários autenticados
const AppLayout = ({ children }) => {
  return (
    <div className="app-wrapper d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Header />
        <main>
          {children}
        </main>
        {/* Componente de status de conexão - aparece quando offline */}
        <ConnectionStatus />
      </div>
    </div>
  );
};

// Componente de rotas
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/" replace /> : <Login />
      } />
      <Route path="/register" element={
        isAuthenticated ? <Navigate to="/" replace /> : <Register />
      } />
      
      {/* Rotas protegidas */}
      <Route path="/" element={
        <PrivateRoute>
          <AppLayout>
            <Dashboard />
          </AppLayout>
        </PrivateRoute>
      } />
      
      <Route path="/profile" element={
        <PrivateRoute>
          <AppLayout>
            <Profile />
          </AppLayout>
        </PrivateRoute>
      } />
      
      <Route path="/workflows" element={
        <PrivateRoute>
          <AppLayout>
            <Workflows />
          </AppLayout>
        </PrivateRoute>
      } />
      
      <Route path="/automations" element={
        <PrivateRoute>
          <AppLayout>
            <Automations />
          </AppLayout>
        </PrivateRoute>
      } />
      
      <Route path="/analytics" element={
        <PrivateRoute>
          <AppLayout>
            <Analytics />
          </AppLayout>
        </PrivateRoute>
      } />
      
      <Route path="/communications" element={
        <PrivateRoute>
          <AppLayout>
            <Communications />
          </AppLayout>
        </PrivateRoute>
      } />
      
      <Route path="/team" element={
        <PrivateRoute>
          <AppLayout>
            <Team />
          </AppLayout>
        </PrivateRoute>
      } />
      
      <Route path="/schedule" element={
        <PrivateRoute>
          <AppLayout>
            <Schedule />
          </AppLayout>
        </PrivateRoute>
      } />
      
      <Route path="/settings" element={
        <PrivateRoute>
          <AppLayout>
            <Settings />
          </AppLayout>
        </PrivateRoute>
      } />
      
      <Route path="/seo" element={
        <PrivateRoute>
          <AppLayout>
            <SEO />
          </AppLayout>
        </PrivateRoute>
      } />

      <Route path="/marketing" element={
        <PrivateRoute>
          <AppLayout>
            <MarketingChannels />
          </AppLayout>
        </PrivateRoute>
      } />

      {/* Rota 404 - redireciona para dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <WorkflowProvider>
        <SEOProvider>
          <Router>
            <AppRoutes />
          </Router>
        </SEOProvider>
      </WorkflowProvider>
    </AuthProvider>
  );
}

export default App;