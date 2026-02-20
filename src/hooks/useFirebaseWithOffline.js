import { useState, useEffect } from 'react';
import { 
  doc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  where,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  Timestamp,
  enableNetwork,
  disableNetwork,
  waitForPendingWrites
} from 'firebase/firestore';
import { db } from '../services/firebase';
import connectionService from '../services/connectionService';

export const useFirebaseWithOffline = () => {
  const [isOnline, setIsOnline] = useState(connectionService.getStatus());
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [processingQueue, setProcessingQueue] = useState(false);

  useEffect(() => {
    // Monitorar status da conexão
    const handleConnectionChange = (online) => {
      setIsOnline(online);
      if (online) {
        processOfflineQueue();
      }
    };

    connectionService.addListener(handleConnectionChange);
    
    return () => {
      connectionService.removeListener(handleConnectionChange);
    };
  }, []);

  // Processar fila de operações offline
  const processOfflineQueue = async () => {
    if (processingQueue || offlineQueue.length === 0 || !isOnline) return;

    setProcessingQueue(true);
    const queue = [...offlineQueue];
    setOfflineQueue([]);

    for (const operation of queue) {
      try {
        await operation.fn();
        console.log('Operação offline processada:', operation.id);
      } catch (error) {
        console.error('Erro ao processar operação offline:', error);
        // Re-adicionar à fila
        setOfflineQueue(prev => [...prev, operation]);
      }
    }

    setProcessingQueue(false);
  };

  // Função segura para buscar documento
  const getDocumentSafe = async (collectionName, docId, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
        } else {
          return { success: true, data: null };
        }
      } catch (error) {
        console.error(`Tentativa ${i + 1} falhou:`, error);
        
        if (i === retries - 1) {
          if (!isOnline) {
            // Se estiver offline, retornar dados do cache local
            try {
              const docRef = doc(db, collectionName, docId);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                return { 
                  success: true, 
                  data: { id: docSnap.id, ...docSnap.data() },
                  fromCache: true 
                };
              }
            } catch (cacheError) {
              console.error('Erro ao buscar cache:', cacheError);
            }
          }
          return { success: false, error: error.message };
        }
        
        // Aguardar antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  };

  // Função segura para adicionar documento com fallback offline
  const addDocumentSafe = async (collectionName, data) => {
    try {
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: Timestamp.now(),
        synced: true
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      if (!isOnline) {
        // Adicionar à fila offline
        const operationId = Date.now().toString();
        setOfflineQueue(prev => [...prev, {
          id: operationId,
          fn: () => addDocumentSafe(collectionName, data),
          data,
          type: 'add',
          timestamp: Date.now()
        }]);
        
        // Retornar ID temporário
        return { 
          success: true, 
          id: `offline_${operationId}`,
          offline: true 
        };
      }
      return { success: false, error: error.message };
    }
  };

  // Função segura para atualizar documento
  const updateDocumentSafe = async (collectionName, docId, data) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
      return { success: true };
    } catch (error) {
      if (!isOnline) {
        setOfflineQueue(prev => [...prev, {
          id: Date.now().toString(),
          fn: () => updateDocumentSafe(collectionName, docId, data),
          data,
          type: 'update',
          timestamp: Date.now()
        }]);
        return { success: true, offline: true };
      }
      return { success: false, error: error.message };
    }
  };

  // Buscar coleção com tratamento de erro
  const getCollectionSafe = async (collectionName, constraints = []) => {
    try {
      const collectionRef = collection(db, collectionName);
      const q = constraints.length > 0 
        ? query(collectionRef, ...constraints)
        : query(collectionRef);
      
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao buscar coleção:', error);
      
      if (!isOnline) {
        // Tentar buscar do cache local
        try {
          const collectionRef = collection(db, collectionName);
          const q = query(collectionRef);
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          return { success: true, data, fromCache: true };
        } catch (cacheError) {
          return { success: false, error: error.message };
        }
      }
      
      return { success: false, error: error.message };
    }
  };

  // Forçar sincronização
  const forceSync = async () => {
    if (!isOnline) return { success: false, message: 'Offline' };
    
    try {
      await waitForPendingWrites(db);
      await processOfflineQueue();
      return { success: true };
    } catch (error) {
      console.error('Erro na sincronização:', error);
      return { success: false, error: error.message };
    }
  };

  // Habilitar/Desabilitar rede manualmente
  const toggleNetwork = async (enable) => {
    try {
      if (enable) {
        await enableNetwork(db);
      } else {
        await disableNetwork(db);
      }
      return { success: true };
    } catch (error) {
      console.error('Erro ao alternar rede:', error);
      return { success: false };
    }
  };

  return {
    isOnline,
    offlineQueue,
    getDocumentSafe,
    addDocumentSafe,
    updateDocumentSafe,
    getCollectionSafe,
    forceSync,
    toggleNetwork
  };
};