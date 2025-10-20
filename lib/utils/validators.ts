// Utilidades para validación de datos

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Validar teléfono mexicano (10 dígitos)
  const phoneRegex = /^[0-9]{10}$/;
  const cleaned = phone.replace(/\D/g, '');
  return phoneRegex.test(cleaned);
};

export const validateRequired = (
  value: string | number | null | undefined
): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

export const validateMinLength = (
  value: string,
  minLength: number
): boolean => {
  return value.trim().length >= minLength;
};

export const validateMaxLength = (
  value: string,
  maxLength: number
): boolean => {
  return value.trim().length <= maxLength;
};

export const validateNumber = (value: string | number): boolean => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && isFinite(num);
};

export const validatePositiveNumber = (value: string | number): boolean => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return validateNumber(value) && num > 0;
};
