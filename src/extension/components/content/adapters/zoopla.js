import { sanitizeNumber } from '../../../utils';

export const scrapeZoopla = () => {
  const data = {
    price: null,
    rent: null,
    levies: null,
    rates: null,
  };

  const priceEl = document.querySelector('[data-testid="price"]');
  if (priceEl) data.price = sanitizeNumber(priceEl.textContent);

  return data;
};