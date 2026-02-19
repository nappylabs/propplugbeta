import { sanitizeNumber } from '../../../utils';

export const scrapePrivateProperty = () => {
  const data = {
    price: null,
    rent: null,
    levies: null,
    rates: null,
  };

  // Price
  const priceEl = document.querySelector('.propertyPrice .price');
  if (priceEl) data.price = sanitizeNumber(priceEl.textContent);

  // Levies & Rates
  const featuresList = Array.from(document.querySelectorAll('.prop_features_list li'));
  featuresList.forEach(item => {
    const text = item.textContent.toLowerCase();
    if (text.includes('levies')) {
      data.levies = sanitizeNumber(text);
    } else if (text.includes('rates')) {
      data.rates = sanitizeNumber(text);
    }
  });

  return data;
};