export const detectCurrency = (hostname) => {
  if (!hostname) return 'ZAR';
  if (hostname.includes('zoopla')) return 'GBP';
  if (hostname.includes('realtor')) return 'USD';
  if (hostname.includes('buyrentkenya')) return 'KES';
  return 'ZAR';
};

export const sanitizeNumber = (str) => {
  if (!str) return 0;
  // Remove spaces (often used as thousand separators) and currency symbols
  const clean = String(str).replace(/\s/g, '').replace(/[^\d.-]/g, '');
  return parseFloat(clean) || 0;
};