/**
 * Cloudinary Types
 * Tipos TypeScript para la integracion con Cloudinary
 */

/**
 * Configuracion de Cloudinary
 */
export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  uploadPreset?: string;
}

/**
 * Carpetas de almacenamiento en Cloudinary
 */
export const CLOUDINARY_FOLDERS = {
  PRODUCTOS: 'old-texas-bbq/productos',
  COMPROBANTES: 'old-texas-bbq/comprobantes',
  USUARIOS: 'old-texas-bbq/usuarios',
} as const;

export type CloudinaryFolder = (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS];

/**
 * Tipos de transformacion de imagenes
 */
export interface CloudinaryTransformation {
  width?: number;
  height?: number;
  crop?: 'scale' | 'fit' | 'fill' | 'thumb' | 'crop';
  quality?: 'auto' | number;
  format?: 'auto' | 'jpg' | 'png' | 'webp' | 'avif';
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
  fetch_format?: 'auto';
}

/**
 * Opciones de subida
 */
export interface CloudinaryUploadOptions {
  folder: CloudinaryFolder;
  id?: string;
  filename?: string;
  transformation?: CloudinaryTransformation;
  tags?: string[];
  context?: Record<string, string>;
  onProgress?: (progress: number) => void;
}

/**
 * Resultado de subida
 */
export interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  secureUrl?: string;
  publicId?: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  error?: Error;
  message?: string;
}

/**
 * Opciones de eliminacion
 */
export interface CloudinaryDeleteOptions {
  publicId: string;
  invalidate?: boolean;
}

/**
 * Resultado de eliminacion
 */
export interface CloudinaryDeleteResult {
  success: boolean;
  result?: 'ok' | 'not found';
  error?: Error;
  message?: string;
}

/**
 * Opciones para obtener URL optimizada
 */
export interface CloudinaryUrlOptions {
  publicId: string;
  transformation?: CloudinaryTransformation;
  secure?: boolean;
}

/**
 * Tipos de archivo permitidos
 */
export const CLOUDINARY_ALLOWED_TYPES = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'],
  DOCUMENTS: ['application/pdf'],
} as const;

/**
 * Tamano maximo de archivo (10MB para plan gratuito)
 */
export const CLOUDINARY_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB en bytes

/**
 * Respuesta de la API de Cloudinary
 */
export interface CloudinaryApiResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
  api_key: string;
}

/**
 * Metadata de archivo en Cloudinary
 */
export interface CloudinaryMetadata {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  createdAt: string;
  folder: string;
  originalFilename: string;
}

/**
 * Validacion de archivo
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
  preview?: string;
}

/**
 * Opciones de batch delete
 */
export interface CloudinaryBatchDeleteOptions {
  publicIds: string[];
  invalidate?: boolean;
}

/**
 * Resultado de batch delete
 */
export interface CloudinaryBatchDeleteResult {
  success: boolean;
  deleted: string[];
  failed: string[];
  message?: string;
}
