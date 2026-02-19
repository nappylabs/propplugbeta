import { sanitizeNumber } from '../../../utils';

export const scrapeProperty24 = () => {
  const data = {
    price: null,
    rent: null,
    levies: null,
    rates: null,
  };

  // Price
  const priceEl = document.querySelector('.p24_price');
  if (priceEl) {
    data.price = sanitizeNumber(priceEl.textContent);
  }

  // Levies & Rates
  const featureItems = Array.from(document.querySelectorAll('.p24_featureItem'));
  featureItems.forEach(item => {
    const labelEl = item.querySelector('.p24_label');
    const valueEl = item.querySelector('.p24_value');
    if (labelEl && valueEl) {
      const labelText = labelEl.textContent.toLowerCase().trim();
      if (labelText.includes('levies')) data.levies = sanitizeNumber(valueEl.textContent);
      if (labelText.includes('rates & taxes')) data.rates = sanitizeNumber(valueEl.textContent);
    }
  });

  return data;
};