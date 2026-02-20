import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export const useFirebaseUpload = () => {
  const { user, updateUserAvatar } = useAuth();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Upload de avatar
  const uploadAvatar = async (file) => {
    if (!file) return null;
    if (!user) throw new Error('Usuário não autenticado');

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Validar tipo
      if (!file.type.startsWith('image/')) {
        throw new Error('Por favor, selecione uma imagem válida');
      }

      // Validar tamanho (máx 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('A imagem deve ter no máximo 2MB');
      }

      // Criar nome único para o arquivo
      const fileName = `avatars/${user.id}_${Date.now()}.${file.name.split('.').pop()}`;
      const storageRef = ref(storage, fileName);

      // Upload com progresso
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Progresso do upload
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            // Erro no upload
            setError(error.message);
            setUploading(false);
            reject(error);
          },
          async () => {
            // Upload completo
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Atualizar contexto
            updateUserAvatar(downloadURL);
            
            // Salvar URL no localStorage como backup
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            userData.avatar = downloadURL;
            localStorage.setItem('user', JSON.stringify(userData));

            setUploading(false);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      setError(error.message);
      setUploading(false);
      throw error;
    }
  };

  // Remover avatar
  const removeAvatar = async () => {
    if (!user?.avatar || user.avatar.includes('placeholder')) return;

    try {
      // Extrair caminho do arquivo da URL
      const fileRef = ref(storage, user.avatar);
      await deleteObject(fileRef);
      
      // Atualizar para avatar padrão
      const defaultAvatar = 'https://via.placeholder.com/150';
      updateUserAvatar(defaultAvatar);
      
      localStorage.setItem('user', JSON.stringify({
        ...JSON.parse(localStorage.getItem('user') || '{}'),
        avatar: defaultAvatar
      }));
    } catch (error) {
      console.error('Erro ao remover avatar:', error);
    }
  };

  return {
    uploadAvatar,
    removeAvatar,
    uploadProgress,
    uploading,
    error
  };
};