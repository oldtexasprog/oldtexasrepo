/**
 * Cloudinary - Barrel Export
 * Exporta todas las utilidades de Cloudinary desde un solo punto
 *
 * ALTERNATIVA GRATUITA A FIREBASE STORAGE
 * Plan gratuito: 25GB storage + 25GB bandwidth/mes
 */

// Configuration
export {
  getCloudinaryConfig,
  validateCloudinaryConfig,
  isCloudinaryConfigured,
  getCloudinaryInfo,
  getCloudinaryInstance,
  getCloudinaryBaseUrl,
  getCloudinaryApiUrl,
} from './config';

// Upload
export {
  validateFileType,
  validateFileSize,
  generateUniqueFilename,
  buildCloudinaryPublicId,
  prepareImageForUpload,
  uploadToCloudinary,
  uploadImage,
  uploadProductImage,
  uploadComprobante,
  uploadUserPhoto,
} from './upload';

// Utils
export {
  buildCloudinaryUrl,
  getOptimizedImageUrl,
  getThumbnailUrl,
  getResponsiveImageUrl,
  deleteFromCloudinary,
  deleteImage,
  deleteImages,
  extractPublicIdFromUrl,
  getImageMetadataFromUrl,
  isCloudinaryUrl,
  transformCloudinaryUrl,
  CloudinaryPresets,
  generateSrcSet,
  generateSizes,
} from './utils';

// Types
export type {
  CloudinaryConfig,
  CloudinaryFolder,
  CloudinaryTransformation,
  CloudinaryUploadOptions,
  CloudinaryUploadResult,
  CloudinaryDeleteOptions,
  CloudinaryDeleteResult,
  CloudinaryUrlOptions,
  CloudinaryApiResponse,
  CloudinaryMetadata,
  FileValidationResult,
  CloudinaryBatchDeleteOptions,
  CloudinaryBatchDeleteResult,
} from './types';

export {
  CLOUDINARY_FOLDERS,
  CLOUDINARY_ALLOWED_TYPES,
  CLOUDINARY_MAX_FILE_SIZE,
} from './types';
