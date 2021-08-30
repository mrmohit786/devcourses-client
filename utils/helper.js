export const currencyFormatter = (data) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: data.currency,
  }).format((data.amount * 100) / 100);
};
