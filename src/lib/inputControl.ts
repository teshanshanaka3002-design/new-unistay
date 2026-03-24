export const PHONE_MAX_DIGITS = 10;
export const NIC_MAX_CHARS = 12;
export const NOTE_MAX_WORDS = 300;

export const sanitizePhoneNumber = (value: string) =>
  value.replace(/\D/g, '').slice(0, PHONE_MAX_DIGITS);

export const sanitizeNic = (value: string) =>
  value.replace(/[^a-zA-Z0-9]/g, '').slice(0, NIC_MAX_CHARS);

export const countWords = (value: string) => {
  const normalized = value.trim();
  if (!normalized) return 0;
  return normalized.split(/\s+/).length;
};

export const enforceWordLimit = (currentValue: string, nextValue: string, maxWords = NOTE_MAX_WORDS) => {
  return countWords(nextValue) <= maxWords ? nextValue : currentValue;
};
