export function formatCurrency(price: number, currency: string) {
  try {
    if (typeof price !== "number") {
      return "";
    }
    return new Intl.NumberFormat("vi", {
      style: "currency",
      currency: currency || "VND",
    }).format(price || 0);
  } catch {
    return "";
  }
}
