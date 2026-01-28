/**
 * Feature Flags - Exports
 * Old Texas BBQ - CRM
 */

export {
  FEATURE_FLAGS,
  isFeatureEnabled,
  checkFeature,
  getTimeUntilActivation,
  getActivationDateFormatted,
  isFeatureOverridden,
} from './config';

export type { FeatureFlag } from './config';
