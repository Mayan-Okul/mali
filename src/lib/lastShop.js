// Convenience for this browser only — not security. Nothing sensitive goes here.
const LAST_SHOP_KEY = 'mali:lastShopName';
const LAST_SIGNIN_KEY = 'mali:lastSignInTime';

export function readLastShop() {
  try {
    return localStorage.getItem(LAST_SHOP_KEY) || '';
  } catch {
    return '';
  }
}

export function readLastSignIn() {
  try {
    const value = localStorage.getItem(LAST_SIGNIN_KEY);
    return value ? Number(value) : null;
  } catch {
    return null;
  }
}

export function rememberShopName(name) {
  if (!name) return;
  try {
    localStorage.setItem(LAST_SHOP_KEY, name);
  } catch {
    // Storage unavailable — the login page falls back to the marketing headline.
  }
}

export function rememberSignInTime() {
  try {
    localStorage.setItem(LAST_SIGNIN_KEY, String(Date.now()));
  } catch {
    // Storage unavailable — timestamp line will be hidden.
  }
}

export function clearLastShop() {
  try {
    localStorage.removeItem(LAST_SHOP_KEY);
    localStorage.removeItem(LAST_SIGNIN_KEY);
  } catch {
    // Storage unavailable — nothing to do.
  }
}
