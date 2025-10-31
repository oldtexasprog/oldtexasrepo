/**
 * Firebase Storage Utilities
 * Utilidades para almacenamiento de archivos en Cloud Storage
 *
 * Funcionalidades:
 * - Subida de archivos con progreso
 * - Descarga de archivos
 * - Eliminación de archivos
 * - Obtención de URLs públicas
 * - Gestión de metadata
 */

import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
  updateMetadata,
  type UploadTaskSnapshot,
  type UploadTask,
  type StorageReference,
} from 'firebase/storage';
import { storage } from './config';
import type { UploadOptions, UploadResult, DownloadOptions } from './types';

/**
 * Rutas de carpetas en Storage
 */
export const STORAGE_PATHS = {
  PRODUCTOS: 'productos',
  COMPROBANTES: 'comprobantes',
  USUARIOS: 'usuarios',
} as const;

/**
 * Tipos de archivo permitidos
 */
export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as string[],
  DOCUMENTS: ['application/pdf'] as string[],
};

/**
 * Tamaño máximo de archivo (5MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB en bytes

/**
 * Validar tipo de archivo
 */
export const validateFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * Validar tamaño de archivo
 */
export const validateFileSize = (
  file: File,
  maxSize: number = MAX_FILE_SIZE
): boolean => {
  return file.size <= maxSize;
};

/**
 * Generar nombre único para archivo
 */
export const generateUniqueFilename = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 9);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
};

/**
 * Construir ruta de archivo en Storage
 */
export const buildStoragePath = (
  folder: string,
  id: string,
  filename: string
): string => {
  return `${folder}/${id}/${filename}`;
};

/**
 * Subir archivo con progreso
 */
export const uploadFile = async (
  file: File,
  options: UploadOptions
): Promise<UploadResult> => {
  if (!storage) {
    return {
      success: false,
      error: new Error('Firebase Storage no está configurado'),
      message: 'Firebase Storage no está configurado',
    };
  }

  try {
    // Validar tipo de archivo
    if (
      !validateFileType(file, [
        ...ALLOWED_FILE_TYPES.IMAGES,
        ...ALLOWED_FILE_TYPES.DOCUMENTS,
      ])
    ) {
      return {
        success: false,
        error: new Error('Tipo de archivo no permitido'),
        message: 'Solo se permiten imágenes (jpg, png, webp) y documentos PDF',
      };
    }

    // Validar tamaño
    if (!validateFileSize(file)) {
      return {
        success: false,
        error: new Error('Archivo demasiado grande'),
        message: `El archivo no debe superar ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      };
    }

    // Generar nombre de archivo
    const filename = options.filename || generateUniqueFilename(file.name);

    // Construir ruta
    const path = buildStoragePath(options.folder, options.id, filename);

    // Crear referencia
    const storageRef = ref(storage, path);

    // Preparar metadata
    const metadata = {
      contentType: options.metadata?.contentType || file.type,
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        originalName: file.name,
        ...options.metadata?.customMetadata,
      },
    };

    // Subir archivo con progreso si se proporciona callback
    if (options.onProgress) {
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      return new Promise<UploadResult>((resolve) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            options.onProgress?.(progress);
          },
          (error) => {
            console.error('Error al subir archivo:', error);
            resolve({
              success: false,
              error,
              message: 'Error al subir archivo',
            });
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              success: true,
              url,
              path,
              message: 'Archivo subido correctamente',
            });
          }
        );
      });
    }

    // Subir archivo sin progreso
    const snapshot = await uploadBytes(storageRef, file, metadata);
    const url = await getDownloadURL(snapshot.ref);

    return {
      success: true,
      url,
      path,
      message: 'Archivo subido correctamente',
    };
  } catch (error: any) {
    console.error('Error al subir archivo:', error);
    return {
      success: false,
      error,
      message: error.message || 'Error al subir archivo',
    };
  }
};

/**
 * Subir imagen optimizada
 * (Considera usar una función de Cloud Functions para redimensionar/optimizar)
 */
export const uploadImage = async (
  file: File,
  options: Omit<UploadOptions, 'metadata'>
): Promise<UploadResult> => {
  // Validar que sea imagen
  if (!validateFileType(file, ALLOWED_FILE_TYPES.IMAGES)) {
    return {
      success: false,
      error: new Error('No es una imagen válida'),
      message: 'Solo se permiten imágenes (jpg, png, webp)',
    };
  }

  return uploadFile(file, {
    ...options,
    metadata: {
      contentType: file.type,
      customMetadata: {
        type: 'image',
      },
    },
  });
};

/**
 * Obtener URL de descarga de un archivo
 */
export const getFileURL = async (path: string): Promise<string | null> => {
  if (!storage) {
    console.warn('Firebase Storage no está configurado');
    return null;
  }

  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error al obtener URL:', error);
    return null;
  }
};

/**
 * Eliminar archivo
 */
export const deleteFile = async (path: string): Promise<UploadResult> => {
  if (!storage) {
    return {
      success: false,
      error: new Error('Firebase Storage no está configurado'),
      message: 'Firebase Storage no está configurado',
    };
  }

  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);

    return {
      success: true,
      message: 'Archivo eliminado correctamente',
    };
  } catch (error: any) {
    console.error('Error al eliminar archivo:', error);

    // Si el archivo no existe, considerarlo como éxito
    if (error.code === 'storage/object-not-found') {
      return {
        success: true,
        message: 'El archivo ya no existe',
      };
    }

    return {
      success: false,
      error,
      message: error.message || 'Error al eliminar archivo',
    };
  }
};

/**
 * Eliminar todos los archivos de una carpeta
 */
export const deleteFolder = async (
  folder: string,
  id: string
): Promise<UploadResult> => {
  if (!storage) {
    return {
      success: false,
      error: new Error('Firebase Storage no está configurado'),
      message: 'Firebase Storage no está configurado',
    };
  }

  try {
    const folderRef = ref(storage, `${folder}/${id}`);
    const list = await listAll(folderRef);

    // Eliminar todos los archivos
    await Promise.all(list.items.map((item) => deleteObject(item)));

    return {
      success: true,
      message: `${list.items.length} archivos eliminados`,
    };
  } catch (error: any) {
    console.error('Error al eliminar carpeta:', error);
    return {
      success: false,
      error,
      message: error.message || 'Error al eliminar carpeta',
    };
  }
};

/**
 * Listar archivos en una carpeta
 */
export const listFiles = async (
  folder: string,
  id?: string
): Promise<string[]> => {
  if (!storage) {
    console.warn('Firebase Storage no está configurado');
    return [];
  }

  try {
    const path = id ? `${folder}/${id}` : folder;
    const folderRef = ref(storage, path);
    const list = await listAll(folderRef);

    // Obtener URLs de todos los archivos
    const urls = await Promise.all(
      list.items.map((item) => getDownloadURL(item))
    );

    return urls;
  } catch (error) {
    console.error('Error al listar archivos:', error);
    return [];
  }
};

/**
 * Obtener metadata de un archivo
 */
export const getFileMetadata = async (path: string) => {
  if (!storage) {
    console.warn('Firebase Storage no está configurado');
    return null;
  }

  try {
    const storageRef = ref(storage, path);
    return await getMetadata(storageRef);
  } catch (error) {
    console.error('Error al obtener metadata:', error);
    return null;
  }
};

/**
 * Actualizar metadata de un archivo
 */
export const updateFileMetadata = async (
  path: string,
  metadata: { [key: string]: string }
): Promise<boolean> => {
  if (!storage) {
    console.warn('Firebase Storage no está configurado');
    return false;
  }

  try {
    const storageRef = ref(storage, path);
    await updateMetadata(storageRef, { customMetadata: metadata });
    return true;
  } catch (error) {
    console.error('Error al actualizar metadata:', error);
    return false;
  }
};

/**
 * Descargar archivo como Blob
 */
export const downloadFile = async (
  options: DownloadOptions
): Promise<Blob | null> => {
  try {
    const url = await getFileURL(options.path);
    if (!url) return null;

    const response = await fetch(url);
    return await response.blob();
  } catch (error) {
    console.error('Error al descargar archivo:', error);
    return null;
  }
};

/**
 * Descargar archivo y guardar en el dispositivo
 */
export const downloadAndSaveFile = async (
  options: DownloadOptions
): Promise<boolean> => {
  try {
    const blob = await downloadFile(options);
    if (!blob) return false;

    // Crear URL temporal
    const url = window.URL.createObjectURL(blob);

    // Crear link temporal y hacer clic
    const link = document.createElement('a');
    link.href = url;
    link.download = options.filename || 'download';
    document.body.appendChild(link);
    link.click();

    // Limpiar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error al descargar y guardar archivo:', error);
    return false;
  }
};

/**
 * Validar y preparar imagen para subida
 * Útil para mostrar preview antes de subir
 */
export const prepareImageForUpload = async (
  file: File
): Promise<{ preview: string; valid: boolean; error?: string }> => {
  // Validar tipo
  if (!validateFileType(file, ALLOWED_FILE_TYPES.IMAGES)) {
    return {
      preview: '',
      valid: false,
      error: 'Tipo de archivo no permitido',
    };
  }

  // Validar tamaño
  if (!validateFileSize(file)) {
    return {
      preview: '',
      valid: false,
      error: `El archivo no debe superar ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  // Crear preview
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      resolve({
        preview: e.target?.result as string,
        valid: true,
      });
    };

    reader.onerror = () => {
      resolve({
        preview: '',
        valid: false,
        error: 'Error al leer archivo',
      });
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Utilidades de productos
 */
export const uploadProductImage = (
  file: File,
  productId: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  return uploadImage(file, {
    folder: STORAGE_PATHS.PRODUCTOS,
    id: productId,
    onProgress,
  });
};

export const deleteProductImage = (
  productId: string,
  filename: string
): Promise<UploadResult> => {
  const path = buildStoragePath(STORAGE_PATHS.PRODUCTOS, productId, filename);
  return deleteFile(path);
};

export const deleteAllProductImages = (
  productId: string
): Promise<UploadResult> => {
  return deleteFolder(STORAGE_PATHS.PRODUCTOS, productId);
};

/**
 * Utilidades de comprobantes
 */
export const uploadComprobante = (
  file: File,
  pedidoId: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  return uploadFile(file, {
    folder: STORAGE_PATHS.COMPROBANTES,
    id: pedidoId,
    onProgress,
  });
};

export const deleteComprobante = (
  pedidoId: string,
  filename: string
): Promise<UploadResult> => {
  const path = buildStoragePath(STORAGE_PATHS.COMPROBANTES, pedidoId, filename);
  return deleteFile(path);
};

/**
 * Utilidades de usuarios
 */
export const uploadUserPhoto = (
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  return uploadImage(file, {
    folder: STORAGE_PATHS.USUARIOS,
    id: userId,
    filename: 'profile.jpg',
    onProgress,
  });
};

export const deleteUserPhoto = (userId: string): Promise<UploadResult> => {
  const path = buildStoragePath(STORAGE_PATHS.USUARIOS, userId, 'profile.jpg');
  return deleteFile(path);
};
