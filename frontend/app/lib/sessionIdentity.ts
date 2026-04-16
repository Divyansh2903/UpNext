const STORAGE_KEYS = {
  hostToken: "upnext.hostToken",
  hostEmail: "upnext.hostEmail",
  hostDisplayName: "upnext.hostDisplayName",
  guestUserId: "upnext.guestUserId",
  displayName: "upnext.displayName",
};

export function getStoredHostToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEYS.hostToken);
}

export function setStoredHostAuth(token: string, email: string, displayName?: string | null) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.hostToken, token);
  window.localStorage.setItem(STORAGE_KEYS.hostEmail, email);
  if (displayName?.trim()) {
    window.localStorage.setItem(STORAGE_KEYS.hostDisplayName, displayName.trim());
  }
}

export function clearStoredHostAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEYS.hostToken);
  window.localStorage.removeItem(STORAGE_KEYS.hostEmail);
  window.localStorage.removeItem(STORAGE_KEYS.hostDisplayName);
}

export function getStoredHostDisplayName(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(STORAGE_KEYS.hostDisplayName) ?? "";
}

export function getStoredDisplayName() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(STORAGE_KEYS.displayName) ?? "";
}

export function setStoredDisplayName(name: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.displayName, name);
}

export function getOrCreateGuestUserId() {
  if (typeof window === "undefined") return "";
  const existing = window.localStorage.getItem(STORAGE_KEYS.guestUserId);
  if (existing) return existing;
  const id = crypto.randomUUID();
  window.localStorage.setItem(STORAGE_KEYS.guestUserId, id);
  return id;
}
