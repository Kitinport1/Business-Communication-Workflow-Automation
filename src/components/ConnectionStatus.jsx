import React, { useState, useEffect } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { Wifi, WifiOff, RefreshCw } from 'react-feather';
import connectionService from '../services/connectionService';

const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(connectionService.getStatus());
  const [showOfflineAlert, setShowOfflineAlert] = useState(!connectionService.getStatus());
  const [showReconnectedAlert, setShowReconnectedAlert] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleConnectionChange = (online) => {
      setIsOnline(online);
      
      if (online) {
        // Quando voltar a ficar online
        setShowOfflineAlert(false);
        setShowReconnectedAlert(true);
        setSyncing(true);
        
        // Simular sincronização
        setTimeout(() => {
          setSyncing(false);
        }, 2000);
        
        // Esconder alerta de reconexão após 3 segundos
        setTimeout(() => {
          setShowReconnectedAlert(false);
        }, 3000);
      } else {
        // Quando ficar offline
        setShowOfflineAlert(true);
        setShowReconnectedAlert(false);
      }
    };

    connectionService.addListener(handleConnectionChange);
    
    return () => {
      connectionService.removeListener(handleConnectionChange);
    };
  }, []);

  // Não mostrar nada se estiver online e sem alertas
  if (isOnline && !showOfflineAlert && !showReconnectedAlert && !syncing) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, maxWidth: '350px' }}>
      {/* Alerta de Offline */}
      {showOfflineAlert && (
        <Alert 
          variant="danger"
          style={{ 
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderLeft: '4px solid #dc3545'
          }}
        >
          <div className="d-flex align-items-center">
            <WifiOff size={20} className="me-2" />
            <div>
              <strong>Você está offline</strong>
              <p className="mb-0 small text-muted">
                As alterações serão salvas localmente e sincronizadas quando a conexão for restabelecida.
              </p>
            </div>
          </div>
        </Alert>
      )}

      {/* Alerta de Reconexão */}
      {showReconnectedAlert && (
        <Alert 
          variant="success"
          style={{ 
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderLeft: '4px solid #28a745'
          }}
        >
          <div className="d-flex align-items-center">
            <Wifi size={20} className="me-2" />
            <div>
              <strong>Conexão restabelecida!</strong>
              {syncing ? (
                <div className="d-flex align-items-center mt-1">
                  <Spinner animation="border" size="sm" className="me-2" />
                  <small className="text-muted">Sincronizando dados...</small>
                </div>
              ) : (
                <p className="mb-0 small text-muted">
                  Todos os dados foram sincronizados com sucesso.
                </p>
              )}
            </div>
          </div>
        </Alert>
      )}

      {/* Indicador de Sincronização (quando já online mas sincronizando) */}
      {syncing && !showReconnectedAlert && isOnline && (
        <Alert 
          variant="info"
          style={{ 
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderLeft: '4px solid #17a2b8'
          }}
        >
          <div className="d-flex align-items-center">
            <RefreshCw size={20} className="me-2 spin" />
            <div>
              <strong>Sincronizando dados...</strong>
              <p className="mb-0 small text-muted">
                Suas alterações offline estão sendo enviadas.
              </p>
            </div>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default ConnectionStatus;