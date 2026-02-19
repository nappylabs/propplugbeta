import { detectCurrency } from './utils';
import { scrapeProperty24 } from './components/content/adapters/property24';
import { scrapePrivateProperty } from './components/content/adapters/privateproperty';
import { scrapeZoopla } from './components/content/adapters/zoopla';
import { scrapeRealtor } from './components/content/adapters/realtor';
import { scrapeBuyRentKenya } from './components/content/adapters/buyrentkenya';

console.log('PropPlug: Scraper loaded.');

const getScrapedData = () => {
  const hostname = window.location.hostname;
  let siteData = {};
  let siteName = null;

  try {
    if (hostname.includes('property24.com')) {
      siteData = scrapeProperty24();
      siteName = 'property24';
    } else if (hostname.includes('privateproperty.co.za')) {
      siteData = scrapePrivateProperty();
      siteName = 'privateproperty';
    } else if (hostname.includes('zoopla.co.uk')) {
      siteData = scrapeZoopla();
      siteName = 'zoopla';
    } else if (hostname.includes('realtor.com')) {
      siteData = scrapeRealtor();
      siteName = 'realtor';
    } else if (hostname.includes('buyrentkenya.com')) {
      siteData = scrapeBuyRentKenya();
      siteName = 'buyrentkenya';
    }
  } catch (error) {
    console.error('PropPlug: Error during scraping', error);
    // Return empty object on error to ensure graceful failure
    return {};
  }

  // Return the normalized response object
  return {
    price: siteData.price || null,
    rent: siteData.rent || null,
    levies: siteData.levies || null,
    rates: siteData.rates || null,
    currency: detectCurrency(hostname),
    site: siteName,
  };
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_PAGE_DATA') {
    const data = getScrapedData();
    sendResponse({
      success: true,
      data,
    });
  }
  return true; // Keep the message channel open for the asynchronous response.
});