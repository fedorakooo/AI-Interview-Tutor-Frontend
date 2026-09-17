const STORAGE_KEY = "ait_access_token";

let accessToken: string | null = null;

const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

function hydrateFromStorage(): void {
  if (typeof window === "undefined") return;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    if (raw.startsWith("{")) {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }
    accessToken = raw;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

function persist(access: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, access);
}

function clearStorage(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

hydrateFromStorage();

export const tokenStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSnapshot(): { access: string | null } {
    return { access: accessToken };
  },

  getServerSnapshot(): { access: string | null } {
    return { access: null };
  },

  getAccessToken: () => accessToken,

  setAccessToken: (access: string) => {
    accessToken = access;
    persist(access);
    notify();
  },

  clear: () => {
    accessToken = null;
    clearStorage();
    notify();
  },

  hasTokens: () => !!accessToken,
};
