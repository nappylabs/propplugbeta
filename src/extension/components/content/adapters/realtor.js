import { sanitizeNumber } from '../../../utils';

export const scrapeRealtor = () => {
  const data = {
    price: null,
    rent: null,
    levies: null,
    rates: null,
  };

  const priceEl = document.querySelector('[data-testid="list-price"]');
  if (priceEl) data.price = sanitizeNumber(priceEl.textContent);

  return data;
};