export function formatPrice(amount: number): string {
  return `Rs ${amount}`;
}

export function formatPriceDecimal(amount: number): string {
  return `Rs ${amount.toFixed(2)}`;
}
