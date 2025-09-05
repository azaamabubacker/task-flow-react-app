export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  // Fallback (very rare)
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
