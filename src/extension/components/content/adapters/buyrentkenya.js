import { sanitizeNumber } from '../../../utils';

export const scrapeBuyRentKenya = () => {
  const data = {
    price: null,
    rent: null,
    levies: null,
    rates: null,
  };

  const priceEl = document.querySelector('.price-tag');
  if (priceEl) data.price = sanitizeNumber(priceEl.textContent);

  return data;
};