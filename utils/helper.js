export const currencyFormatter = (data) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: data.currency,
}).format((data.amount * 100) / 100);

export const stripeCurrencyFormatter = (data) => (data.amount / 100).toLocaleString(data.currency, {
  style: 'currency',
  currency: data.currency,
});
