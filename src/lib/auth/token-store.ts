const STORAGE_KEY = "ait_tokens";

let accessToken: string | null = null;
let refreshToken: string | null = null;

const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

function hydrateFromStorage(): void {
  if (typeof window === "undefined") return;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw) as { access?: string; refresh?: string };
    if (parsed.access && parsed.refresh) {
      accessToken = parsed.access;
      refreshToken = parsed.refresh;
    }
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

function persist(access: string, refresh: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ access, refresh }));
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

  getSnapshot(): { access: string | null; refresh: string | null } {
    return { access: accessToken, refresh: refreshToken };
  },

  getServerSnapshot(): { access: string | null; refresh: string | null } {
    return { access: null, refresh: null };
  },

  getAccessToken: () => accessToken,
  getRefreshToken: () => refreshToken,

  setTokens: (access: string, refresh: string) => {
    accessToken = access;
    refreshToken = refresh;
    persist(access, refresh);
    notify();
  },

  clear: () => {
    accessToken = null;
    refreshToken = null;
    clearStorage();
    notify();
  },

  hasTokens: () => !!accessToken,
};
