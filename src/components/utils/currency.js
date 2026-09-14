const colombianCurrencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  currencyDisplay: 'symbol',
  maximumFractionDigits: 0,
});

export function formatCurrency(value) {
  return colombianCurrencyFormatter.format(Number(value) || 0);
}

export default colombianCurrencyFormatter;