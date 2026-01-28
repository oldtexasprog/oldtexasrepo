/**
 * Clip Payment Gateway - Exports
 * Old Texas BBQ - CRM
 */

// Tipos
export * from './types';

// Configuración (solo server-side)
export { getClipConfig, clipPublicConfig, isSandbox, CLIP_TEST_CARDS, CLIP_LIMITS } from './config';

// Servicio
export { clipService } from './clip.service';
