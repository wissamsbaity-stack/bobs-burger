export const ORDER_SUCCESS_STORAGE_KEY = "bobs-order-success";

export function markOrderSuccessForHome(): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(ORDER_SUCCESS_STORAGE_KEY, "1");
  } catch {
    // sessionStorage unavailable
  }
}

export function consumeOrderSuccessForHome(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const value = sessionStorage.getItem(ORDER_SUCCESS_STORAGE_KEY);
    if (!value) return false;
    sessionStorage.removeItem(ORDER_SUCCESS_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
