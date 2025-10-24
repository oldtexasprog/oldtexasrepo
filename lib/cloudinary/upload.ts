/**
 * Cloudinary Upload Utilities
 * Utilidades para subida de archivos a Cloudinary
 *
 * Funcionalidades:
 * - Upload de imagenes con validacion
 * - Upload con progreso
 * - Transformaciones automaticas
 * - Manejo de errores robusto
 */

import { getCloudinaryInstance, getCloudinaryApiUrl } from './config';
import type {
  CloudinaryUploadOptions,
  CloudinaryUploadResult,
  CloudinaryApiResponse,
  FileValidationResult,
  CLOUDINARY_ALLOWED_TYPES,
} from './types';
import { CLOUDINARY_MAX_FILE_SIZE, CLOUDINARY_FOLDERS } from './types';

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
 * Validar tamano de archivo
 */
export const validateFileSize = (
  file: File,
  maxSize: number = CLOUDINARY_MAX_FILE_SIZE
): boolean => {
  return file.size <= maxSize;
};

/**
 * Generar nombre unico para archivo
 */
export const generateUniqueFilename = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 9);
  const extension = originalName.split('.').pop();
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  const sanitizedName = nameWithoutExt
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase();
  return `${sanitizedName}_${timestamp}_${randomString}.${extension}`;
};

/**
 * Construir public_id para Cloudinary
 */
export const buildCloudinaryPublicId = (
  folder: string,
  id: string | undefined,
  filename: string
): string => {
  // Remover extension del filename
  const filenameWithoutExt = filename.replace(/\.[^/.]+$/, '');

  if (id) {
    return `${folder}/${id}/${filenameWithoutExt}`;
  }
  return `${folder}/${filenameWithoutExt}`;
};

/**
 * Validar y preparar imagen para subida
 */
export const prepareImageForUpload = async (
  file: File,
  allowedTypes: string[]
): Promise<FileValidationResult> => {
  // Validar tipo
  if (!validateFileType(file, allowedTypes)) {
    return {
      valid: false,
      error: 'Tipo de archivo no permitido. Solo se permiten imagenes.',
    };
  }

  // Validar tamano
  if (!validateFileSize(file)) {
    return {
      valid: false,
      error: `El archivo no debe superar ${CLOUDINARY_MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  // Crear preview
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      resolve({
        valid: true,
        preview: e.target?.result as string,
      });
    };

    reader.onerror = () => {
      resolve({
        valid: false,
        error: 'Error al leer archivo',
      });
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Subir archivo a Cloudinary usando unsigned upload
 */
export const uploadToCloudinary = async (
  file: File,
  options: CloudinaryUploadOptions
): Promise<CloudinaryUploadResult> => {
  try {
    const config = getCloudinaryInstance();

    if (!config.uploadPreset) {
      return {
        success: false,
        error: new Error('Upload preset no configurado'),
        message:
          'NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET no esta configurado en .env',
      };
    }

    // Generar filename unico si no se proporciona
    const filename = options.filename || generateUniqueFilename(file.name);

    // Construir public_id
    const publicId = buildCloudinaryPublicId(
      options.folder,
      options.id,
      filename
    );

    // Preparar FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);
    formData.append('public_id', publicId);
    formData.append('folder', options.folder);

    // Agregar tags si se proporcionan
    if (options.tags && options.tags.length > 0) {
      formData.append('tags', options.tags.join(','));
    }

    // Agregar context si se proporciona
    if (options.context) {
      const contextString = Object.entries(options.context)
        .map(([key, value]) => `${key}=${value}`)
        .join('|');
      formData.append('context', contextString);
    }

    // Agregar transformacion si se proporciona
    if (options.transformation) {
      const transformation = buildTransformationString(options.transformation);
      if (transformation) {
        formData.append('transformation', transformation);
      }
    }

    // Realizar upload con XMLHttpRequest para soporte de progreso
    return new Promise<CloudinaryUploadResult>((resolve) => {
      const xhr = new XMLHttpRequest();

      // Manejar progreso
      if (options.onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            options.onProgress?.(progress);
          }
        });
      }

      // Manejar respuesta
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response: CloudinaryApiResponse = JSON.parse(
              xhr.responseText
            );
            resolve({
              success: true,
              url: response.url,
              secureUrl: response.secure_url,
              publicId: response.public_id,
              width: response.width,
              height: response.height,
              format: response.format,
              bytes: response.bytes,
              message: 'Archivo subido correctamente',
            });
          } catch (error) {
            resolve({
              success: false,
              error: error as Error,
              message: 'Error al parsear respuesta de Cloudinary',
            });
          }
        } else {
          resolve({
            success: false,
            error: new Error(`HTTP ${xhr.status}: ${xhr.statusText}`),
            message: 'Error al subir archivo a Cloudinary',
          });
        }
      });

      // Manejar error
      xhr.addEventListener('error', () => {
        resolve({
          success: false,
          error: new Error('Error de red al subir archivo'),
          message: 'Error de red al subir archivo',
        });
      });

      // Manejar timeout
      xhr.addEventListener('timeout', () => {
        resolve({
          success: false,
          error: new Error('Timeout al subir archivo'),
          message: 'El upload tardo demasiado tiempo',
        });
      });

      // Configurar y enviar request
      const uploadUrl = `${getCloudinaryApiUrl()}/image/upload`;
      xhr.open('POST', uploadUrl);
      xhr.timeout = 60000; // 60 segundos
      xhr.send(formData);
    });
  } catch (error: any) {
    console.error('Error al subir archivo a Cloudinary:', error);
    return {
      success: false,
      error,
      message: error.message || 'Error al subir archivo',
    };
  }
};

/**
 * Construir string de transformacion para Cloudinary
 */
const buildTransformationString = (
  transformation: CloudinaryUploadOptions['transformation']
): string => {
  if (!transformation) return '';

  const parts: string[] = [];

  if (transformation.width) parts.push(`w_${transformation.width}`);
  if (transformation.height) parts.push(`h_${transformation.height}`);
  if (transformation.crop) parts.push(`c_${transformation.crop}`);
  if (transformation.quality) parts.push(`q_${transformation.quality}`);
  if (transformation.format) parts.push(`f_${transformation.format}`);
  if (transformation.gravity) parts.push(`g_${transformation.gravity}`);

  return parts.join(',');
};

/**
 * Subir imagen con validacion previa
 */
export const uploadImage = async (
  file: File,
  options: Omit<CloudinaryUploadOptions, 'transformation'>
): Promise<CloudinaryUploadResult> => {
  // Validar que sea imagen
  const validation = await prepareImageForUpload(file, [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
  ]);

  if (!validation.valid) {
    return {
      success: false,
      error: new Error(validation.error),
      message: validation.error,
    };
  }

  // Subir con transformacion automatica para optimizacion
  return uploadToCloudinary(file, {
    ...options,
    transformation: {
      quality: 'auto',
      fetch_format: 'auto',
    },
  });
};

/**
 * Utilidades especificas para productos
 */
export const uploadProductImage = (
  file: File,
  productId: string,
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> => {
  return uploadImage(file, {
    folder: CLOUDINARY_FOLDERS.PRODUCTOS,
    id: productId,
    tags: ['producto', productId],
    onProgress,
  });
};

/**
 * Utilidades especificas para comprobantes
 */
export const uploadComprobante = (
  file: File,
  pedidoId: string,
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> => {
  return uploadToCloudinary(file, {
    folder: CLOUDINARY_FOLDERS.COMPROBANTES,
    id: pedidoId,
    tags: ['comprobante', pedidoId],
    onProgress,
  });
};

/**
 * Utilidades especificas para fotos de usuario
 */
export const uploadUserPhoto = (
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> => {
  return uploadImage(file, {
    folder: CLOUDINARY_FOLDERS.USUARIOS,
    id: userId,
    filename: 'profile.jpg',
    tags: ['usuario', userId],
    onProgress,
  });
};
