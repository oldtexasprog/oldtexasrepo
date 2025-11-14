/**
 * Firebase Utilities - Barrel Export
 * Exporta todas las utilidades de Firebase desde un solo punto
 */

// Configuration & Services
export {
  app,
  auth,
  db,
  storage,
  // getMessagingInstance, // DEPRECATED: Usar notificaciones in-app (lib/notifications)
  // initializeAnalytics, // No disponible en config.ts
  // firebaseInfo, // No disponible en config.ts
} from './config';

// Authentication
export {
  login,
  logout,
  registerUser,
  resetPassword,
  updateUserProfile,
  changeEmail,
  changePassword,
  getCurrentUser,
  getCurrentUserData,
  hasRole,
  isAdmin,
  isManager,
  subscribeToAuthState,
  waitForAuthInit,
  isAuthenticated,
  getAuthToken,
  refreshAuthToken,
} from './auth';

// Firestore
export {
  COLLECTIONS,
  getDocument,
  getDocuments,
  getPaginatedDocuments,
  createDocument,
  setDocument,
  updateDocument,
  deleteDocument,
  batchOperations,
  executeTransaction,
  subscribeToDocument,
  subscribeToCollection,
  countDocuments,
  documentExists,
  getDocumentsWhereIn,
  timestampToDate,
  dateToTimestamp,
} from './firestore';

// Storage - DEPRECATED: Usar Cloudinary (lib/cloudinary)
// Los archivos storage.ts y messaging.ts permanecen para referencia
// pero NO deben usarse en produccion (requieren plan Blaze)
/*
export {
  STORAGE_PATHS,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  validateFileType,
  validateFileSize,
  generateUniqueFilename,
  buildStoragePath,
  uploadFile,
  uploadImage,
  getFileURL,
  deleteFile,
  deleteFolder,
  listFiles,
  getFileMetadata,
  updateFileMetadata,
  downloadFile,
  downloadAndSaveFile,
  prepareImageForUpload,
  uploadProductImage,
  deleteProductImage,
  deleteAllProductImages,
  uploadComprobante,
  deleteComprobante,
  uploadUserPhoto,
  deleteUserPhoto,
} from './storage';
*/

// Messaging - DEPRECATED: Usar notificaciones in-app (lib/notifications)
/*
export {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  getFCMToken,
  registerServiceWorker,
  saveFCMToken,
  deleteFCMToken,
  initializeFCM,
  onForegroundMessage,
  showNotification,
  notifyNewOrder,
  notifyOrderStatusChange,
  disableNotifications,
  areNotificationsEnabled,
} from './messaging';
*/

// Types
export type {
  FirebaseConfig,
  FirebaseServices,
  AuthState,
  AuthResult,
  LoginCredentials,
  RegisterData,
  QueryOptions,
  PaginatedResult,
  // UploadOptions, // DEPRECATED: Usar CloudinaryUploadOptions
  // UploadResult, // DEPRECATED: Usar CloudinaryUploadResult
  // DownloadOptions, // DEPRECATED
  // NotificationPayload, // DEPRECATED: Usar Notification from lib/notifications
  // FCMToken, // DEPRECATED
  FirestoreDocument,
  BatchOperation,
  FirestoreResult,
  FirestoreTimestamp,
  FirestoreData,
  AnalyticsEvent,
  AnalyticsEventData,
} from './types';
