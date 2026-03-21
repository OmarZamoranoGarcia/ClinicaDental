export const USER_STORAGE_KEY = "usuario";

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(USER_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

export function setCurrentUser(user) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearCurrentUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function isRole4(user) {
  if (!user) return false;
  // rolId puede haber sido guardado como número o string
  const rolId = Number(user.rolId ?? user.rolID ?? user.rol); // backup in case
  if (!Number.isNaN(rolId)) {
    return rolId === 4;
  }
  // si no hay id, comparar por nombre de rol
  return String(user.rol || user.role || "").toLowerCase() === "cliente";
}
