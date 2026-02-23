console.log('PropPlug: Scraper loaded.');

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_PAGE_DATA') {
    const data = scrapeProperty24();
    sendResponse({
      success: true,
      data,
    });
  }
  return true;
});

function scrapeProperty24() {
  const data = {
    url: window.location.href,
    address: '',
    askingPrice: 0,
    bedrooms: 0,
    bathrooms: 0,
    parking: 0,
    floorSize: 0,
    propertyType: '',
    levies: 0,
    rates: 0,
    rent: 0,
    currency: 'ZAR' // Default to ZAR for Property24
  };

  // Helper to clean text and extract numbers
  const clean = (text) => text ? text.replace(/\s+/g, ' ').trim() : '';
  const extractNumber = (text) => {
    if (!text) return 0;
    // Matches numbers with spaces or commas (e.g. "1 141" or "1,141")
    const match = text.match(/[\d\s,]+/);
    return match ? parseFloat(match[0].replace(/[\s,]/g, '')) : 0;
  };

  // --- 1. Property Overview (Type, Floor Size, Levies, Rates) ---
  const overviewRows = document.querySelectorAll('.p24_propertyOverviewRow');
  overviewRows.forEach(row => {
    const keyEl = row.querySelector('.p24_propertyOverviewKey');
    const valEl = row.querySelector('.p24_info');
    
    if (keyEl && valEl) {
      const key = clean(keyEl.textContent);
      const value = clean(valEl.textContent);

      if (key === 'Type of Property') data.propertyType = value === 'Apartment / Flat' ? 'Apartment' : value;
      if (key === 'Floor Size') data.floorSize = extractNumber(value);
      if (key === 'Levies') data.levies = extractNumber(value);
      if (key === 'Rates and Taxes') data.rates = extractNumber(value);
    }
  });

  // --- 2. Features (Bed, Bath, Parking) ---
  const featureDivs = document.querySelectorAll('.p24_listingFeatures');
  featureDivs.forEach(div => {
    const icon = div.querySelector('.p24_keyFeaturesIcon');
    const amount = div.querySelector('.p24_featureAmount');
    
    if (icon && amount) {
      const val = extractNumber(amount.textContent);
      
      if (icon.classList.contains('p24_Bedrooms')) data.bedrooms = val;
      if (icon.classList.contains('p24_Bathrooms')) data.bathrooms = val;
      if (icon.classList.contains('p24_Parking')) data.parking = val;
    }
  });

  // --- 3. Price ---
  const priceEl = document.querySelector('.p24_price');
  if (priceEl) data.askingPrice = extractNumber(priceEl.textContent);

  // --- 4. Location (City & Suburb) ---
  // We target the breadcrumb container to find the standalone location links.
  // We use .textContent to extract just "Killarney" and "Johannesburg".
  // Added .p24_breadCrumb (camelCase) which is common on P24
  const breadcrumbContainer = document.querySelector('.p24_breadcrumb, .p24_breadCrumb, .breadcrumb');
  const breadcrumbLinks = breadcrumbContainer ? breadcrumbContainer.querySelectorAll('a') : [];

  if (breadcrumbLinks.length >= 2) {
    // The last link corresponds to the Suburb (e.g. "Killarney")
    const suburb = clean(breadcrumbLinks[breadcrumbLinks.length - 1].textContent);
    // The second to last link corresponds to the City (e.g. "Johannesburg")
    const city = clean(breadcrumbLinks[breadcrumbLinks.length - 2].textContent);
    
    data.address = `${suburb}, ${city}`;
  }

  // Fallback Address if breadcrumbs fail
  if (!data.address) {
    const titleEl = document.querySelector('.p24_maintitle') || document.querySelector('h1');
    if (titleEl) data.address = clean(titleEl.textContent);
  }

  return data;
}