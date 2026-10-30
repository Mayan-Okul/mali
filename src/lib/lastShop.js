// Convenience for this browser only — not security. Nothing sensitive goes here.
const LAST_SHOP_KEY = 'mali:lastShopName';

export function readLastShop() {
  try {
    return localStorage.getItem(LAST_SHOP_KEY) || '';
  } catch {
    return '';
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
