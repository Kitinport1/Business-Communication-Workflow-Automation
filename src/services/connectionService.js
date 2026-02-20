class ConnectionService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.listeners = [];
    this.offlineQueue = [];
    this.syncInProgress = false;
    
    // Listeners para eventos de conexão
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
    
    // Verificar conexão periodicamente
    setInterval(this.checkConnection.bind(this), 30000);
  }

  handleOnline() {
    console.log('🟢 Conexão detectada - Online');
    this.isOnline = true;
    this.notifyListeners();
    
    // Tentar sincronizar dados pendentes
    this.syncOfflineData();
  }

  handleOffline() {
    console.log('🔴 Conexão perdida - Offline');
    this.isOnline = false;
    this.notifyListeners();
  }

  checkConnection() {
    // Verificar se o status mudou (para casos onde o evento não dispara)
    const onlineStatus = navigator.onLine;
    if (onlineStatus !== this.isOnline) {
      this.isOnline = onlineStatus;
      this.notifyListeners();
      
      if (onlineStatus) {
        this.syncOfflineData();
      }
    }
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.isOnline);
      } catch (error) {
        console.error('Erro ao notificar listener:', error);
      }
    });
  }

  getStatus() {
    return this.isOnline;
  }

  // Adicionar operação à fila offline
  addToOfflineQueue(operation) {
    this.offlineQueue.push({
      ...operation,
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString()
    });
    
    // Salvar no localStorage para persistência
    this.saveQueueToStorage();
    
    console.log(`📦 Operação adicionada à fila offline. Total: ${this.offlineQueue.length}`);
  }

  // Sincronizar dados offline
  async syncOfflineData() {
    if (this.syncInProgress || this.offlineQueue.length === 0 || !this.isOnline) {
      return;
    }

    this.syncInProgress = true;
    console.log(`🔄 Sincronizando ${this.offlineQueue.length} operações offline...`);

    const queue = [...this.offlineQueue];
    const failed = [];

    for (const operation of queue) {
      try {
        // Tentar executar a operação
        if (operation.fn && typeof operation.fn === 'function') {
          await operation.fn();
          console.log(`✅ Operação ${operation.id} sincronizada com sucesso`);
        }
      } catch (error) {
        console.error(`❌ Falha ao sincronizar operação ${operation.id}:`, error);
        failed.push(operation);
      }
    }

    // Atualizar fila (remover sucedidos, manter falhos)
    this.offlineQueue = failed;
    this.saveQueueToStorage();
    
    this.syncInProgress = false;
    
    if (failed.length === 0) {
      console.log('🎉 Todas as operações offline foram sincronizadas!');
    } else {
      console.log(`⚠️ ${failed.length} operações aguardam nova tentativa`);
    }

    this.notifyListeners();
  }

  // Salvar fila no localStorage
  saveQueueToStorage() {
    try {
      localStorage.setItem('offlineQueue', JSON.stringify(this.offlineQueue));
    } catch (error) {
      console.error('Erro ao salvar fila offline:', error);
    }
  }

  // Carregar fila do localStorage
  loadQueueFromStorage() {
    try {
      const saved = localStorage.getItem('offlineQueue');
      if (saved) {
        this.offlineQueue = JSON.parse(saved);
        console.log(`📦 Carregadas ${this.offlineQueue.length} operações pendentes`);
      }
    } catch (error) {
      console.error('Erro ao carregar fila offline:', error);
    }
  }

  // Limpar fila
  clearQueue() {
    this.offlineQueue = [];
    localStorage.removeItem('offlineQueue');
    console.log('🗑️ Fila offline limpa');
  }

  // Obter tamanho da fila
  getQueueSize() {
    return this.offlineQueue.length;
  }

  // Forçar sincronização manual
  forceSync() {
    if (this.isOnline) {
      return this.syncOfflineData();
    } else {
      console.log('⚠️ Não é possível sincronizar: offline');
      return Promise.reject(new Error('Offline'));
    }
  }
}

// Inicializar e carregar fila salva
const connectionService = new ConnectionService();
connectionService.loadQueueFromStorage();

export default connectionService;