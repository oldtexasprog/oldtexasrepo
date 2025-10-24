/**
 * Cloudinary Utility Functions
 * Funciones de utilidad para transformaciones, eliminacion y gestion de URLs
 */

import {
  getCloudinaryInstance,
  getCloudinaryBaseUrl,
  getCloudinaryApiUrl,
} from './config';
import type {
  CloudinaryTransformation,
  CloudinaryUrlOptions,
  CloudinaryDeleteOptions,
  CloudinaryDeleteResult,
  CloudinaryBatchDeleteOptions,
  CloudinaryBatchDeleteResult,
  CloudinaryMetadata,
} from './types';

/**
 * Construir URL con transformaciones
 */
export const buildCloudinaryUrl = (
  publicId: string,
  transformation?: CloudinaryTransformation,
  secure: boolean = true
): string => {
  const baseUrl = getCloudinaryBaseUrl(secure);
  const transformationString = buildTransformationString(transformation);

  if (transformationString) {
    return `${baseUrl}/image/upload/${transformationString}/${publicId}`;
  }

  return `${baseUrl}/image/upload/${publicId}`;
};

/**
 * Construir string de transformacion
 */
const buildTransformationString = (
  transformation?: CloudinaryTransformation
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
 * Obtener URL optimizada de imagen
 */
export const getOptimizedImageUrl = (
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
  }
): string => {
  return buildCloudinaryUrl(publicId, {
    width: options?.width,
    height: options?.height,
    quality: options?.quality || 'auto',
    fetch_format: 'auto',
    crop: 'fill',
  });
};

/**
 * Obtener thumbnail de imagen
 */
export const getThumbnailUrl = (
  publicId: string,
  size: number = 200
): string => {
  return buildCloudinaryUrl(publicId, {
    width: size,
    height: size,
    crop: 'thumb',
    quality: 'auto',
    fetch_format: 'auto',
    gravity: 'auto',
  });
};

/**
 * Obtener URL responsive
 */
export const getResponsiveImageUrl = (
  publicId: string,
  width: number
): string => {
  return buildCloudinaryUrl(publicId, {
    width,
    crop: 'scale',
    quality: 'auto',
    fetch_format: 'auto',
  });
};

/**
 * Eliminar imagen de Cloudinary
 * NOTA: Requiere signed request desde el backend
 * Para uso desde frontend, considera implementar un API endpoint
 */
export const deleteFromCloudinary = async (
  options: CloudinaryDeleteOptions
): Promise<CloudinaryDeleteResult> => {
  try {
    // Esta operacion requiere autenticacion con API secret
    // Debe implementarse en un API endpoint del backend
    console.warn(
      'deleteFromCloudinary debe llamarse desde el backend con API secret'
    );

    return {
      success: false,
      error: new Error('Operacion no soportada desde el frontend'),
      message:
        'La eliminacion de archivos debe realizarse desde el backend por seguridad',
    };
  } catch (error: any) {
    console.error('Error al eliminar de Cloudinary:', error);
    return {
      success: false,
      error,
      message: error.message || 'Error al eliminar archivo',
    };
  }
};

/**
 * Eliminar imagen desde el backend (wrapper para llamada a API)
 */
export const deleteImage = async (
  publicId: string
): Promise<CloudinaryDeleteResult> => {
  try {
    // Llamar al endpoint de API del backend
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: data.success,
      result: data.result,
      message: data.message || 'Imagen eliminada correctamente',
    };
  } catch (error: any) {
    console.error('Error al eliminar imagen:', error);
    return {
      success: false,
      error,
      message: error.message || 'Error al eliminar imagen',
    };
  }
};

/**
 * Eliminar multiples imagenes
 */
export const deleteImages = async (
  publicIds: string[]
): Promise<CloudinaryBatchDeleteResult> => {
  try {
    // Llamar al endpoint de API del backend
    const response = await fetch('/api/cloudinary/delete-batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicIds }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: data.success,
      deleted: data.deleted || [],
      failed: data.failed || [],
      message: data.message,
    };
  } catch (error: any) {
    console.error('Error al eliminar imagenes:', error);
    return {
      success: false,
      deleted: [],
      failed: publicIds,
      message: error.message || 'Error al eliminar imagenes',
    };
  }
};

/**
 * Extraer public_id de una URL de Cloudinary
 */
export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    // Formato: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
    const urlParts = url.split('/upload/');
    if (urlParts.length !== 2) return null;

    const publicIdWithVersion = urlParts[1];
    // Remover version (v123456789/)
    const publicIdParts = publicIdWithVersion.split('/').slice(1);
    const publicIdWithExt = publicIdParts.join('/');

    // Remover extension
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');

    return publicId;
  } catch (error) {
    console.error('Error al extraer public_id de URL:', error);
    return null;
  }
};

/**
 * Obtener metadata de imagen desde URL
 */
export const getImageMetadataFromUrl = (
  url: string
): CloudinaryMetadata | null => {
  try {
    const publicId = extractPublicIdFromUrl(url);
    if (!publicId) return null;

    // Extraer informacion de la URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const filename = pathParts[pathParts.length - 1];
    const format = filename.split('.').pop() || '';

    return {
      publicId,
      url,
      secureUrl: url.replace('http://', 'https://'),
      width: 0, // No disponible sin API call
      height: 0,
      format,
      bytes: 0,
      createdAt: '',
      folder: publicId.split('/').slice(0, -1).join('/'),
      originalFilename: filename,
    };
  } catch (error) {
    console.error('Error al obtener metadata de URL:', error);
    return null;
  }
};

/**
 * Validar si una URL es de Cloudinary
 */
export const isCloudinaryUrl = (url: string): boolean => {
  try {
    return url.includes('res.cloudinary.com');
  } catch {
    return false;
  }
};

/**
 * Convertir URL de Cloudinary a diferentes formatos
 */
export const transformCloudinaryUrl = (
  url: string,
  transformation: CloudinaryTransformation
): string => {
  const publicId = extractPublicIdFromUrl(url);
  if (!publicId) return url;

  return buildCloudinaryUrl(publicId, transformation);
};

/**
 * Utilidades para transformaciones comunes
 */
export const CloudinaryPresets = {
  /**
   * Thumbnail cuadrado para listados
   */
  thumbnail: (publicId: string, size: number = 200) =>
    getThumbnailUrl(publicId, size),

  /**
   * Imagen optimizada para web
   */
  webOptimized: (publicId: string, maxWidth: number = 1200) =>
    getOptimizedImageUrl(publicId, { width: maxWidth }),

  /**
   * Imagen para mobile
   */
  mobile: (publicId: string) => getOptimizedImageUrl(publicId, { width: 768 }),

  /**
   * Imagen para tablet
   */
  tablet: (publicId: string) => getOptimizedImageUrl(publicId, { width: 1024 }),

  /**
   * Imagen para desktop
   */
  desktop: (publicId: string) =>
    getOptimizedImageUrl(publicId, { width: 1920 }),

  /**
   * Avatar/perfil circular
   */
  avatar: (publicId: string, size: number = 150) =>
    buildCloudinaryUrl(publicId, {
      width: size,
      height: size,
      crop: 'thumb',
      gravity: 'face',
      quality: 'auto',
      fetch_format: 'auto',
    }),
};

/**
 * Generar srcset para imagenes responsive
 */
export const generateSrcSet = (publicId: string, widths: number[]): string => {
  return widths
    .map((width) => {
      const url = getResponsiveImageUrl(publicId, width);
      return `${url} ${width}w`;
    })
    .join(', ');
};

/**
 * Generar sizes attribute para imagenes responsive
 */
export const generateSizes = (
  breakpoints: { maxWidth: string; size: string }[]
): string => {
  return breakpoints
    .map((bp) => `(max-width: ${bp.maxWidth}) ${bp.size}`)
    .join(', ');
};
