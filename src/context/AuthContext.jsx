import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../services/firebase';
import databaseService from '../services/databaseService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Buscar perfil completo do Firestore
        const userProfile = await databaseService.getUserProfile(firebaseUser.uid);
        
        const userData = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || userProfile?.name || firebaseUser.email?.split('@')[0] || 'Usuário',
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL || userProfile?.avatar || 'https://via.placeholder.com/150',
          role: userProfile?.role || 'user',
          phone: userProfile?.phone || '',
          preferences: userProfile?.preferences || { notifications: true, theme: 'light', language: 'pt-BR' }
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));

        // Registrar atividade de login
        await databaseService.logUserActivity(firebaseUser.uid, 'login', {
          timestamp: new Date().toISOString()
        });
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name, phone) => {
    setLoading(true);
    setError(null);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Criar perfil no Firestore
      await databaseService.createUserProfile(userCredential.user.uid, {
        name,
        email,
        phone,
        role: 'user',
        createdAt: new Date().toISOString()
      });

      // Registrar atividade de registro
      await databaseService.logUserActivity(userCredential.user.uid, 'register', {
        timestamp: new Date().toISOString()
      });
      
      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (user) {
      await databaseService.logUserActivity(user.id, 'logout', {
        timestamp: new Date().toISOString()
      });
    }
    await signOut(auth);
  };

  const updateUserAvatar = async (avatarUrl) => {
    setUser(prev => ({ ...prev, avatar: avatarUrl }));
    if (user) {
      await databaseService.updateUserProfile(user.id, { avatar: avatarUrl });
    }
  };

  const updateUserProfile = async (updates) => {
    if (user) {
      setUser(prev => ({ ...prev, ...updates }));
      await databaseService.updateUserProfile(user.id, updates);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUserAvatar,
    updateUserProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};