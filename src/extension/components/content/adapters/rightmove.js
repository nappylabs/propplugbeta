import { sanitizeNumber } from '../../../utils';

export const scrapeRightmove = () => {
  const data = {
    price: null,
    rent: null,
    levies: null,
    rates: null,
  };

  const priceEl = document.querySelector('.property-header-price') || document.querySelector('[data-test="price"]');
  if (priceEl) data.price = sanitizeNumber(priceEl.textContent);

  return data;
};