import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  enableIndexedDbPersistence, 
  CACHE_SIZE_UNLIMITED 
} from 'firebase/firestore';

// Configuração do Firebase - SUBSTITUA COM SEUS DADOS
const firebaseConfig = {
  apiKey: "AIzaSyDNlxSEnXheXT1TkTayFTTXMSIL4G6pPAc",
  authDomain: "b-c-w-automation.firebaseapp.com",
  projectId: "b-c-w-automation",
  storageBucket: "b-c-w-automation.firebasestorage.app",
  messagingSenderId: "461380535625",
  appId: "1:461380535625:web:1a9d755078dda0717d4698",
  measurementId: "G-EWYBNB77NN"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Habilitar persistência offline (opcional, mas recomendado)
enableIndexedDbPersistence(db, { cacheSizeBytes: CACHE_SIZE_UNLIMITED })
  .then(() => {
    console.log('✅ Persistência offline habilitada');
  })
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('⚠️ Persistência offline falhou: Múltiplas abas abertas');
    } else if (err.code === 'unimplemented') {
      console.warn('⚠️ Persistência offline não suportada pelo navegador');
    }
  });

export default app;