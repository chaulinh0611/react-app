export const getLocalStorage = <T = unknown>(key: string): T | null => {
  const value = localStorage.getItem(key);
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return value as T;
  }
};

export const setLocalStorage = <T>(params: { key: string; value: T }): void => {
  const { key, value } = params;
  localStorage.setItem(key, JSON.stringify(value));
};

export const storage = {
  get(key: string): string | null {
    try {
      const value = localStorage.getItem(key);
      return value ?? null;
    } catch {
      return null;
    }
  },

  set(key: string, value: string): void {
    localStorage.setItem(key, value);
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },
};
