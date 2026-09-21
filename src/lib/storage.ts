/**
 * Safe local storage wrapper with in-memory fallback for environments where
 * localStorage might be disabled or restricted (e.g. private browsing).
 */

class SafeStorage {
  private memoryMap = new Map<string, string>();

  getItem<T = unknown>(key: string): T | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const value = window.localStorage.getItem(key);
        return value ? (JSON.parse(value) as T) : null;
      }
    } catch {
      // Fall back to memory
    }
    const memVal = this.memoryMap.get(key);
    return memVal ? (JSON.parse(memVal) as T) : null;
  }

  setItem<T>(key: string, value: T): void {
    const serialized = JSON.stringify(value);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, serialized);
      }
    } catch {
      // Fallback
    }
    this.memoryMap.set(key, serialized);
  }

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Fallback
    }
    this.memoryMap.delete(key);
  }
}

export const safeStorage = new SafeStorage();
