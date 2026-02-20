import React, { useState, useEffect } from 'react';
import { Input } from './Input';
import { Result } from './Result'; // This is now our "Metric Card"
import { BottomSheet } from './BottomSheet';
import { calculateInvestorMetrics, calculateOwnerMetrics, calculateTenantMetrics } from '../shared/logic/calculations';
import { DEFAULTS } from '../shared/constants';
import { trackSiteAccess } from './components/services/tracking';
import { Logo } from '../shared/components/Logo';
import { APP_BASE_URL } from '../lib/constants'; 

const CURRENCY_SYMBOLS = {
  ZAR: 'R',
  KES: 'KSh',
  USD: '$'
};

const TABS = [
  { id: 'investor', label: 'Investor' },
  { id: 'owner', label: 'Owner' },
  { id: 'tenant', label: 'Tenant' }
];

// Number Formatting Helper
const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  const abs = Math.abs(num);
  const isNeg = num < 0;
  let valStr;
  
  if (abs >= 1000000) {
    valStr = (abs / 1000000).toFixed(2) + 'm';
  } else if (abs >= 1000) {
    valStr = (abs / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  } else {
    valStr = Math.round(abs).toString();
  }
  
  return isNeg ? `(${valStr})` : valStr;
};

const initialInputsState = {
  askingPrice: '',
  discountOnAsking: '0',
  monthlyRent: '',
  levies: '',
  rates: '',
  depositPercent: '0',
  interestRate: '11.75',
  termYears: DEFAULTS.BOND_TERM_YEARS.toString(),
  monthlyIncome: '',
  utilities: '',
  insurance: '',
  includeMaintenance: true,
  maintenancePercentRent: '5',
  maintenancePercentValue: '1',
  includeVacancy: true,
  vacancyPercent: '5',
  includeManagement: true,
  managementPercent: '8',
  // Tenant specifics
  transport: '',
  groceries: '',
  otherEssentials: '',
  assumedPurchasePrice: '',
  address: '',
  url: '',
  currency: 'ZAR'
};

export default function App() {
  const [activeTab, setActiveTab] = useState('investor');
  const [loading, setLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  
  // "BetterDeal" Style: We track which "Sheet" is open
  const [activeSheet, setActiveSheet] = useState(null); // 'acquisition', 'expenses', 'income', 'living_costs'

  const [inputs, setInputs] = useState(initialInputsState);
  const isSupportedSite = currentUrl.includes('property24.com') || currentUrl.includes('buyrentkenya.com');

  // --- Data Fetching (Keep existing logic) ---
  const fetchPageData = async () => {
    setLoading(true);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_DATA' }, (response) => {
          if (chrome.runtime.lastError) {
            // Content script likely not injected or page not supported
            console.log("Scraper not available on this page.");
            trackSiteAccess(tab.url, 'unsupported');
            return;
          }
          if (response && response.success) {
            setInputs(prev => ({
              ...prev,
              askingPrice: response.data.price || '',
              assumedPurchasePrice: response.data.price || '',
              levies: response.data.levies || '',
              rates: response.data.rates || '',
              monthlyRent: response.data.rent || '',
              address: response.data.address || prev.address,
              url: tab.url
            }));
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.error("Connection error", e);
      setLoading(false);
    }
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url || '';
      setCurrentUrl(url);
    });
  }, []);

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    setInputs(initialInputsState);
  };

  const handleSaveDeal = () => {
    const payload = {
      ...inputs,
      currency: inputs.currency,
      type: activeTab, // Critical: Tell dashboard which view to open
      timestamp: new Date().toISOString(),
      source: 'Extension'
    };

    try {
      // Unicode-safe Base64 encoding
      const json = JSON.stringify(payload);
      const base64 = btoa(unescape(encodeURIComponent(json)));
      const encoded = encodeURIComponent(base64);
      
      const targetUrl = `${APP_BASE_URL}/login?data=${encoded}`;
      console.log("Opening URL:", targetUrl);
      window.open(targetUrl, '_blank');
    } catch (e) {
      console.error("Encoding failed", e);
      alert("Failed to process deal data. Please try again.");
    }
  };

  // --- Metrics Calculation ---
  const num = val => {
      if (val === '' || val === undefined || val === null) return 0;
      const n = Number(val);
      return isNaN(n) ? 0 : n;
  };
  const purchasePrice = num(inputs.askingPrice) * (1 - (num(inputs.discountOnAsking) / 100));
  const metricsInputs = {
    ...inputs,
    purchasePrice,
    askingPrice: num(inputs.askingPrice),
    monthlyRent: num(inputs.monthlyRent),
    levies: num(inputs.levies),
    rates: num(inputs.rates),
    monthlyIncome: num(inputs.monthlyIncome),
    utilities: num(inputs.utilities),
    insurance: num(inputs.insurance),
    transport: num(inputs.transport),
    groceries: num(inputs.groceries),
    otherEssentials: num(inputs.otherEssentials),
  };
  const invMetrics = calculateInvestorMetrics(metricsInputs);
  const ownMetrics = calculateOwnerMetrics(metricsInputs);
  const tenMetrics = calculateTenantMetrics(metricsInputs);
  const currencySymbol = CURRENCY_SYMBOLS[inputs.currency] || 'R';

  // --- Render Sheets (The Content inside the slide-up) ---
  const renderSheetContent = () => {
    switch (activeSheet) {
      case 'purchase_price':
        return (
          <>
            <Input label="Asking Price" value={inputs.askingPrice} onChange={v => handleChange('askingPrice', v)} prefix={currencySymbol} />
            <Input label="Discount %" value={inputs.discountOnAsking} onChange={v => handleChange('discountOnAsking', v)} suffix="%" />
          </>
        );
      case 'bond_cost':
        return (
          <>
            <Input label="Asking Price" value={inputs.askingPrice} onChange={v => handleChange('askingPrice', v)} prefix={currencySymbol} />
            <Input label="Discount %" value={inputs.discountOnAsking} onChange={v => handleChange('discountOnAsking', v)} suffix="%" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Deposit %" value={inputs.depositPercent} onChange={v => handleChange('depositPercent', v)} suffix="%" />
              <Input label="Loan Term (Years)" value={inputs.termYears} onChange={v => handleChange('termYears', v)} />
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700">
              Monthly Bond Cost: <strong>{currencySymbol} {formatNumber(invMetrics.bondPayment)}</strong>
            </div>
          </>
        );
      case 'expenses':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Levies" value={inputs.levies} onChange={v => handleChange('levies', v)} prefix={currencySymbol} />
              <Input label="Rates & Taxes" value={inputs.rates} onChange={v => handleChange('rates', v)} prefix={currencySymbol} />
            </div>
            <Input label="Insurance" value={inputs.insurance} onChange={v => handleChange('insurance', v)} prefix={currencySymbol} />
            
            <div className="border-t pt-3 mt-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Provisions</h4>
              <div className="space-y-3"> 
                <div className="flex items-center gap-2">
                  <Input 
                    label={activeTab === 'owner' ? "Maintenance % (of Value)" : "Maintenance % (of Rent)"} 
                    value={activeTab === 'owner' ? inputs.maintenancePercentValue : inputs.maintenancePercentRent} 
                    onChange={v => handleChange(activeTab === 'owner' ? 'maintenancePercentValue' : 'maintenancePercentRent', v)} 
                    suffix="%" 
                    className="flex-grow" 
                  />
                  <div className="pt-5">
                    <input type="checkbox" checked={inputs.includeMaintenance} onChange={e => setInputs(p => ({...p, includeMaintenance: e.target.checked}))} className="w-5 h-5 text-prop-600 rounded" />
                  </div>
                </div>

                {activeTab !== 'owner' && (
                  <>
                    <div className="flex items-center gap-2">
                      <Input label="Management %" value={inputs.managementPercent} onChange={v => handleChange('managementPercent', v)} suffix="%" className="flex-grow" />
                      <div className="pt-5">
                        <input type="checkbox" checked={inputs.includeManagement} onChange={e => setInputs(p => ({...p, includeManagement: e.target.checked}))} className="w-5 h-5 text-prop-600 rounded" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input label="Vacancy %" value={inputs.vacancyPercent} onChange={v => handleChange('vacancyPercent', v)} suffix="%" className="flex-grow" />
                      <div className="pt-5">
                        <input type="checkbox" checked={inputs.includeVacancy} onChange={e => setInputs(p => ({...p, includeVacancy: e.target.checked}))} className="w-5 h-5 text-prop-600 rounded" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        );
      case 'rental_income':
        return (
            <Input 
              label={activeTab === 'tenant' ? "Monthly Rent Expense" : "Monthly Rent"} 
              value={inputs.monthlyRent} 
              onChange={v => handleChange('monthlyRent', v)} 
              prefix={currencySymbol} 
            />
        );
      case 'personal_income':
        return (
          <Input label="Your Monthly Income" value={inputs.monthlyIncome} onChange={v => handleChange('monthlyIncome', v)} prefix={currencySymbol} />
        );
      case 'living_expenses':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
               <Input label="Utilities" value={inputs.utilities} onChange={v => handleChange('utilities', v)} prefix={currencySymbol} />
               <Input label="Transport" value={inputs.transport} onChange={v => handleChange('transport', v)} prefix={currencySymbol} />
            </div>
            <div className="grid grid-cols-2 gap-3">
               <Input label="Groceries" value={inputs.groceries} onChange={v => handleChange('groceries', v)} prefix={currencySymbol} />
               <Input label="Other" value={inputs.otherEssentials} onChange={v => handleChange('otherEssentials', v)} prefix={currencySymbol} />
            </div>
          </>
        );
      default: return null;
    }
  };

  const getSheetTitle = () => {
    switch (activeSheet) {
      case 'purchase_price': return 'Purchase Price';
      case 'bond_cost': return 'Bond Cost';
      case 'expenses': return 'Monthly Expenses';
      case 'rental_income': return 'Rental Income';
      case 'personal_income': return 'Personal Income';
      case 'living_expenses': return 'Living Costs';
      default: return '';
    }
  };

  // --- Render Views ---

  const renderInvestor = () => {
    const cfStatus = invMetrics.netCashflow >= 0 ? 'green' : 'red';

    return (
      <div className="space-y-3 animate-fade-in">
        {/* Main Hero Card */}
        <Result 
          label="Net Cashflow" 
          value={`${currencySymbol} ${formatNumber(invMetrics.netCashflow)}`} 
          status={cfStatus}
          subtext={invMetrics.netCashflow < 0 ? "Shortfall per month" : "Positive income"}
        />
        
        <div className="grid grid-cols-2 gap-3">
          <Result 
            label="Gross Yield" 
            value={`${(invMetrics.grossYield || 0).toFixed(1)}%`} 
            status="purple"
          />
           <Result 
            label="Bond Cost" 
            value={`${currencySymbol} ${formatNumber(invMetrics.bondPayment)}`}
            status="neutral"
            onClick={() => setActiveSheet('bond_cost')}
          />
        </div>

        {/* Inputs Summary / Triggers */}
        <div>
           <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
             <div onClick={() => setActiveSheet('purchase_price')} className="p-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer">
               <span className="text-sm text-gray-600">Purchase Price</span>
               <span className="text-sm font-bold text-gray-900">{currencySymbol} {formatNumber(purchasePrice)}</span>
             </div>
             <div onClick={() => setActiveSheet('expenses')} className="p-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer">
               <span className="text-sm text-gray-600">Total Expenses (w/bond costs)</span>
               <span className="text-sm font-bold text-gray-900">{currencySymbol} {formatNumber(invMetrics.totalMonthlyExpenses)}</span>
             </div>
             <div onClick={() => setActiveSheet('rental_income')} className="p-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer">
               <span className="text-sm text-gray-600">Rental Income</span>
               <span className="text-sm font-bold text-gray-900">{currencySymbol} {formatNumber(inputs.monthlyRent)}</span>
             </div>
            </div>
        </div>
      </div>
    );
  };

  const renderOwner = () => {
    return (
      <div className="space-y-3 animate-fade-in">
        <Result
          label="Total Housing Cost"
          value={`${currencySymbol} ${formatNumber(ownMetrics.totalHousingCost)}`}
          subtext="Bond + Levies + Rates + Insurance"
          onClick={() => setActiveSheet('expenses')}
        />
        
        {inputs.monthlyIncome > 0 ? (
          <Result
            label="Housing Ratio" 
            value={`${(ownMetrics.housingCostRatio || 0).toFixed(1)}%`} 
            status={(ownMetrics.housingCostRatio || 0) < 30 ? 'green' : 'amber'}
            subtext="of your income"
            onClick={() => setActiveSheet('personal_income')}
          />
        ) : (
          <div onClick={() => setActiveSheet('personal_income')} className="p-4 border border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:bg-gray-50">
             <span className="text-sm text-prop-600 font-semibold">+ Add Income to see Affordability</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-2">
         <Result label="Purchase Price" value={`${currencySymbol} ${formatNumber(purchasePrice)}`} onClick={() => setActiveSheet('purchase_price')} />
         <Result 
            label="Bond Cost" 
            value={`${currencySymbol} ${formatNumber(ownMetrics.bondPayment)}`}
            status="neutral"
            onClick={() => setActiveSheet('bond_cost')}
          />
        </div>
      </div>
    );
  };

  const renderTenant = () => {
    return (
      <div className="space-y-3 animate-fade-in">
        <Result 
          label="Rent to Income" 
          value={`${(tenMetrics.rentToIncomeRatio || 0).toFixed(1)}%`} 
          status={(tenMetrics.rentToIncomeRatio || 0) < 30 ? 'green' : 'amber'}
          subtext="Affordability"
        />

        <Result 
          label="Disposable Income"
          value={`${currencySymbol} ${formatNumber(tenMetrics.disposableIncome)}`} 
          subtext="After rent & essentials"
          status={tenMetrics.disposableIncome > 0 ? 'green' : 'red'}
        />
        <Result
          label="Living Costs" 
          value={` ${formatNumber(tenMetrics.totalEssentials)}`} 
          subtext="Utilities + Transport + Other"
          onClick={() => setActiveSheet('living_expenses')}
        />

        <div className="grid grid-cols-2 gap-3 mt-2">
           <Result label="Rent Expense" value={`${currencySymbol} ${formatNumber(inputs.monthlyRent)}`} onClick={() => setActiveSheet('rental_income')} />
           <Result label="Income" value={`${currencySymbol} ${formatNumber(inputs.monthlyIncome)}`} onClick={() => setActiveSheet('personal_income')} />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Top Header */}
        <div className="flex items-center gap-2 p-4 bg-white border-b border-gray-200">
             {/* Logo */}
             <div className="h-8 flex items-center justify-center text-slate-900">
               <Logo />
             </div>
             <div className="relative ml-auto">
                <select
                  value={inputs.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                    className="bg-gray-100 border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-gray-600 appearance-none focus:outline-none focus:ring-2 focus:ring-prop-500"
                >
                    <option value="ZAR">ZAR</option>
                    <option value="KES">KES</option>
                    <option value="USD">USD</option>
                </select>
             </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 py-4">
          <div className="flex bg-gray-200/60 p-1 rounded-xl">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                  activeTab === tab.id ? 'bg-white text-prop-700 shadow-sm transform scale-[1.02]' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow px-4 pb-20">
          {activeTab === 'investor' && renderInvestor()}
          {activeTab === 'owner' && renderOwner()}
          {activeTab === 'tenant' && renderTenant()}
        </div>

        {/* Bottom Actions */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 flex gap-3 z-20">
          <button onClick={handleClear} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50" title="Clear Inputs">Clear</button>
          <button 
            onClick={fetchPageData} 
            className={`p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 ${!isSupportedSite ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isSupportedSite ? "Sync data from page" : "Auto-sync unavailable. Please enter data manually for this site."}
            disabled={!isSupportedSite}
          >
            {loading ? 
              <svg className="animate-spin h-5 w-5 text-prop-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              :
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691V5.25a3.375 3.375 0 00-3.375-3.375H8.25a3.375 3.375 0 00-3.375 3.375v5.25m-4.991 2.691l3.181-3.183a8.25 8.25 0 0111.667 0l3.181 3.183" /></svg>
            }
          </button>
          <button
            onClick={handleSaveDeal}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200"
          >
            Save Deal
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* The Magic Bottom Sheet */}
      <BottomSheet 
        isOpen={!!activeSheet} 
        onClose={() => setActiveSheet(null)}
        title={getSheetTitle()}
      >
        {renderSheetContent()}
      </BottomSheet>
    </>
  );
}
