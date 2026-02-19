/**
 * Removes currency symbols, letters, and commas to get a clean number string.
 * @param {string} text
 * @returns {number}
 */
export const sanitizeNumber = (text) => {
  if (!text || typeof text !== 'string') return null;
  const sanitized = text.replace(/[^\d.]/g, '');
  const number = parseFloat(sanitized);
  return isNaN(number) ? null : number;
};

/**
 * Detects currency based on the hostname.
 * @param {string} hostname
 * @returns {'ZAR' | 'GBP' | 'USD' | 'KES' | null}
 */
export const detectCurrency = (hostname) => {
  if (hostname.includes('property24.com') || hostname.includes('privateproperty.co.za')) {
    return 'ZAR';
  }
  if (hostname.includes('zoopla.co.uk') || hostname.includes('rightmove.co.uk')) {
    return 'GBP';
  }
  if (hostname.includes('realtor.com') || hostname.includes('zillow.com')) {
    return 'USD';
  }
  if (hostname.includes('buyrentkenya.com')) {
    return 'KES';
  }
  return null;
};