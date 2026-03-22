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

function getRolId(user) {
  if (!user) return null;
  const candidate = user.rolId ?? user.rolID ?? user.rol;
  const rolId = Number(candidate);
  return Number.isNaN(rolId) ? null : rolId;
}

function getRolName(user) {
  if (!user) return "";
  return String(user.rol || user.role || "").toLowerCase();
}

export function isRole1(user) {
  const rolId = getRolId(user);
  if (rolId !== null) return rolId === 1;
  return getRolName(user) === "admin";
}

export function isRole2(user) {
  const rolId = getRolId(user);
  if (rolId !== null) return rolId === 2;
  return getRolName(user) === "doctor";
}

export function isRole3(user) {
  const rolId = getRolId(user);
  if (rolId !== null) return rolId === 3;
  return getRolName(user) === "recepcionista";
}

export function isRole4(user) {
  const rolId = getRolId(user);
  if (rolId !== null) return rolId === 4;
  return ["cliente", "paciente"].includes(getRolName(user));
}

export function isRoleAdminOrRecepcionista(user) {
  return isRole1(user) || isRole3(user);
}
