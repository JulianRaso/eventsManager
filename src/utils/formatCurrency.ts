export function formatCurrency(currency: number) {
    const number = typeof currency === "string" ? parseFloat(currency) : currency;
  
    if (isNaN(number)) {
      return 0;
    }
  
    return number.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }