/**
 * Cloudinary Configuration
 * Configuracion y validacion de credenciales de Cloudinary
 *
 * Plan Gratuito Cloudinary:
 * - 25 GB storage
 * - 25 GB bandwidth/mes
 * - Transformaciones ilimitadas
 * - CDN global incluido
 */

import type { CloudinaryConfig } from './types';

/**
 * Obtener configuracion de Cloudinary desde variables de entorno
 */
export const getCloudinaryConfig = (): CloudinaryConfig => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName) {
    throw new Error(
      'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME no esta configurado en .env'
    );
  }

  return {
    cloudName,
    apiKey: apiKey || '',
    apiSecret: apiSecret || '',
    uploadPreset,
  };
};

/**
 * Validar configuracion de Cloudinary
 */
export const validateCloudinaryConfig = (): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    errors.push('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME no esta configurado');
  }

  // Upload preset es requerido para uploads sin firma (unsigned)
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
    errors.push(
      'NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET no esta configurado (requerido para uploads)'
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Verificar si Cloudinary esta configurado correctamente
 */
export const isCloudinaryConfigured = (): boolean => {
  return validateCloudinaryConfig().valid;
};

/**
 * Obtener informacion de configuracion (para debugging)
 */
export const getCloudinaryInfo = () => {
  const config = getCloudinaryConfig();
  const validation = validateCloudinaryConfig();

  return {
    configured: validation.valid,
    cloudName: config.cloudName,
    hasUploadPreset: !!config.uploadPreset,
    errors: validation.errors,
  };
};

/**
 * Configuracion exportada (singleton)
 */
let cloudinaryConfig: CloudinaryConfig | null = null;

export const getCloudinaryInstance = (): CloudinaryConfig => {
  if (!cloudinaryConfig) {
    cloudinaryConfig = getCloudinaryConfig();
  }
  return cloudinaryConfig;
};

/**
 * URL base de Cloudinary para transformaciones
 */
export const getCloudinaryBaseUrl = (secure: boolean = true): string => {
  const config = getCloudinaryInstance();
  const protocol = secure ? 'https' : 'http';
  return `${protocol}://res.cloudinary.com/${config.cloudName}`;
};

/**
 * URL base de API de Cloudinary
 */
export const getCloudinaryApiUrl = (): string => {
  const config = getCloudinaryInstance();
  return `https://api.cloudinary.com/v1_1/${config.cloudName}`;
};
