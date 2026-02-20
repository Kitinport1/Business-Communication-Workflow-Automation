import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp,
  writeBatch,
  runTransaction
} from 'firebase/firestore';
import { db } from './firebase';
import { auth } from './firebase';

class DatabaseService {
  constructor() {
    this.collections = {
      USERS: 'users',
      WORKFLOWS: 'workflows',
      AUTOMATIONS: 'automations',
      MARKETING_LISTS: 'marketingLists',
      CAMPAIGNS: 'campaigns',
      EXECUTIONS: 'executions',
      USER_ACTIVITY: 'userActivity',
      NOTIFICATIONS: 'notifications',
      SETTINGS: 'settings'
    };
    this.retryAttempts = 3;
  }

  async retryOperation(operation, attempts = this.retryAttempts) {
    for (let i = 0; i < attempts; i++) {
      try {
        return await operation();
      } catch (error) {
        if (error.code === 'unavailable' || error.code === 'failed-precondition') {
          console.log(`Tentativa ${i + 1} falhou, tentando novamente...`);
          if (i === attempts - 1) throw error;
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        } else {
          throw error;
        }
      }
    }
  }

  // ==================== USUÁRIOS ====================

  async createUserProfile(userId, userData) {
    return this.retryOperation(async () => {
      try {
        const userRef = doc(db, this.collections.USERS, userId);
        await setDoc(userRef, {
          ...userData,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          updatedAt: serverTimestamp(),
          status: 'active',
          preferences: {
            notifications: true,
            theme: 'light',
            language: 'pt-BR'
          }
        });
        return { success: true, userId };
      } catch (error) {
        console.error('Erro ao criar perfil:', error);
        throw error;
      }
    });
  }

  async getUserProfile(userId) {
    return this.retryOperation(async () => {
      try {
        const userRef = doc(db, this.collections.USERS, userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          return { id: userSnap.id, ...userSnap.data() };
        }
        
        // Se não existir, criar perfil básico
        const defaultProfile = {
          name: 'Usuário',
          email: auth.currentUser?.email || '',
          role: 'user',
          createdAt: serverTimestamp()
        };
        await this.createUserProfile(userId, defaultProfile);
        return { id: userId, ...defaultProfile };
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        throw error;
      }
    });
  }

  async updateUserProfile(userId, updates) {
    return this.retryOperation(async () => {
      try {
        const userRef = doc(db, this.collections.USERS, userId);
        await updateDoc(userRef, {
          ...updates,
          updatedAt: serverTimestamp()
        });
        return { success: true };
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        throw error;
      }
    });
  }

  // ==================== WORKFLOWS ====================

  async createWorkflow(workflowData) {
    return this.retryOperation(async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('Usuário não autenticado');

        const workflowsRef = collection(db, this.collections.WORKFLOWS);
        const docRef = await addDoc(workflowsRef, {
          ...workflowData,
          userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          status: workflowData.status || 'draft',
          executions: 0,
          successCount: 0
        });
        
        await this.logUserActivity(userId, 'create_workflow', { workflowId: docRef.id });
        
        return { id: docRef.id, success: true };
      } catch (error) {
        console.error('Erro ao criar workflow:', error);
        throw error;
      }
    });
  }

  async getUserWorkflows(userId) {
    return this.retryOperation(async () => {
      try {
        const workflowsRef = collection(db, this.collections.WORKFLOWS);
        const q = query(
          workflowsRef, 
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Erro ao buscar workflows:', error);
        return []; // Retornar array vazio em caso de erro
      }
    });
  }

  // ==================== AUTOMAÇÕES ====================

  async createAutomation(automationData) {
    return this.retryOperation(async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('Usuário não autenticado');

        const automationsRef = collection(db, this.collections.AUTOMATIONS);
        const docRef = await addDoc(automationsRef, {
          ...automationData,
          userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          status: automationData.status || 'draft',
          stats: { triggered: 0, success: 0 }
        });
        
        await this.logUserActivity(userId, 'create_automation', { automationId: docRef.id });
        
        return { id: docRef.id, success: true };
      } catch (error) {
        console.error('Erro ao criar automação:', error);
        throw error;
      }
    });
  }

  async getUserAutomations(userId) {
    return this.retryOperation(async () => {
      try {
        const automationsRef = collection(db, this.collections.AUTOMATIONS);
        const q = query(
          automationsRef, 
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Erro ao buscar automações:', error);
        return [];
      }
    });
  }

  // ==================== ATIVIDADE DO USUÁRIO ====================

  async logUserActivity(userId, action, details = {}) {
    try {
      const activityRef = collection(db, this.collections.USER_ACTIVITY);
      await addDoc(activityRef, {
        userId,
        action,
        details,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao registrar atividade:', error);
      // Não lançar erro para não interromper fluxo principal
    }
  }

  async getUserActivity(userId, limit_count = 50) {
    return this.retryOperation(async () => {
      try {
        const activityRef = collection(db, this.collections.USER_ACTIVITY);
        const q = query(
          activityRef,
          where('userId', '==', userId),
          orderBy('timestamp', 'desc'),
          limit(limit_count)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
        }));
      } catch (error) {
        console.error('Erro ao buscar atividade:', error);
        return [];
      }
    });
  }

  // ==================== ESTATÍSTICAS ====================

  async getUserStats(userId) {
    try {
      const [workflows, automations] = await Promise.all([
        this.getUserWorkflows(userId),
        this.getUserAutomations(userId)
      ]);

      return {
        totalWorkflows: workflows.length,
        activeWorkflows: workflows.filter(w => w.status === 'active').length,
        totalAutomations: automations.length,
        activeAutomations: automations.filter(a => a.status === 'active').length
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        totalWorkflows: 0,
        activeWorkflows: 0,
        totalAutomations: 0,
        activeAutomations: 0
      };
    }
  }
}

export default new DatabaseService();