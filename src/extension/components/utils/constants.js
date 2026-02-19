export const DEFAULTS = {
  // Investor & General
  BOND_INTEREST_RATE: 12.0, // Percentage
  LOAN_TO_VALUE: 0.80,      // 80% LTV (20% Deposit)
  BOND_TERM_YEARS: 20,
  MAINTENANCE_PROVISION: 0.05, // 5% of rent
  VACANCY_PROVISION: 0.0833,   // ~1 month/year
  MANAGEMENT_FEE: 0.10,        // 10% of rent
  CLOSING_COSTS_PERCENT: 0.03, // 3% of price
  
  // Owner-Occupied
  INSURANCE_DEFAULT: 0,
};

export const THRESHOLDS = {
  INVESTOR: {
    GROSS_YIELD: {
      GREEN: 10.0,
      AMBER_LOW: 7.0,
    },
    NET_CASHFLOW: {
      GREEN: 1000,
      AMBER_LOW: -999,
      AMBER_HIGH: 999,
    }
  },
  OWNER: {
    HOUSING_COST_RATIO: {
      GREEN: 30.0,
      AMBER_LOW: 30.0,
      AMBER_HIGH: 40.0,
    }
  },
  TENANT: {
    RENT_TO_INCOME: {
      GREEN: 30.0,
      AMBER_LOW: 30.0,
      AMBER_HIGH: 40.0,
    }
  }
};