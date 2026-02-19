export const calculateAnalysis = (inputs: any) => {
    const num = (val: any) => {
        if (val === '' || val === undefined || val === null) return 0;
        const n = Number(val);
        return isNaN(n) ? 0 : n;
    };

    // Apply discount
    const purchasePrice = num(inputs.askingPrice) * (1 - (num(inputs.discountOnAsking) / 100));
    const depositAmount = purchasePrice * (num(inputs.depositPercent) / 100);
    const loanAmount = purchasePrice - depositAmount;
    const monthlyRate = num(inputs.interestRate) / 100 / 12;
    const bondPayment = loanAmount > 0 ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, num(inputs.termYears) * 12)) / (Math.pow(1 + monthlyRate, num(inputs.termYears) * 12) - 1)) : 0;
    
    // Rental Logic
    const maintenance = inputs.includeMaintenance ? num(inputs.monthlyRent) * (num(inputs.maintenancePercentRent) / 100) : 0;
    const vacancy = inputs.includeVacancy ? num(inputs.monthlyRent) * (num(inputs.vacancyPercent) / 100) : 0;
    const management = inputs.includeManagement ? num(inputs.monthlyRent) * (num(inputs.managementPercent) / 100) : 0;

    const monthlyExpenses = num(inputs.levies) + num(inputs.rates) + num(inputs.insurance) + num(inputs.utilities) + maintenance + vacancy + management;
    const netCashflow = num(inputs.monthlyRent) - bondPayment - monthlyExpenses;
    const annualNetIncome = netCashflow * 12;
    const netYield = purchasePrice > 0 ? ((num(inputs.monthlyRent) * 12 - monthlyExpenses * 12) / purchasePrice) * 100 : 0;

    const grossAnnualRent = num(inputs.monthlyRent) * 12;
    const grossYield = purchasePrice > 0 ? (grossAnnualRent / purchasePrice) * 100 : 0;
    const transferCosts = num(inputs.transferCosts);

    const bondRegistrationFees = num(inputs.bondRegistrationFees);
    const closingCosts = transferCosts + bondRegistrationFees;
    const totalEquityRequired = depositAmount + closingCosts;
    const cashOnCashReturn = totalEquityRequired > 0 ? (annualNetIncome / totalEquityRequired) * 100 : 0;

    // Shared Custom Expenses Calculation
    const customExpensesTotal = Array.isArray(inputs.customExpenses) 
      ? inputs.customExpenses.reduce((acc: number, item: any) => acc + num(item.value), 0) 
      : 0;

    // 10-Year Rental Projection
    const rentalSeries = [];
    let currentEquity = depositAmount;
    let currentLoan = loanAmount;
    let currentRent = num(inputs.monthlyRent);
    let currentFixedExpenses = num(inputs.levies) + num(inputs.rates) + num(inputs.insurance) + num(inputs.utilities);
    
    for(let y = 1; y <= 10; y++) {
        const interestForYear = currentLoan * (num(inputs.interestRate) / 100);
        const principalPaid = (bondPayment * 12) - interestForYear;
        currentLoan -= principalPaid;
        if (currentLoan < 0) currentLoan = 0;
        
        const propertyValue = purchasePrice * Math.pow(1 + (num(inputs.propertyAppreciationRate)/100), y);
        currentEquity = propertyValue - currentLoan;

        if (y > 1) {
            currentRent *= (1 + num(inputs.rentEscalationRate)/100);
            currentFixedExpenses *= (1 + num(inputs.inflationRate)/100);
        }

        const maintenance = inputs.includeMaintenance ? currentRent * (num(inputs.maintenancePercentRent) / 100) : 0;
        const vacancy = inputs.includeVacancy ? currentRent * (num(inputs.vacancyPercent) / 100) : 0;
        const management = inputs.includeManagement ? currentRent * (num(inputs.managementPercent) / 100) : 0;
        
        const totalExpenses = currentFixedExpenses + maintenance + vacancy + management;
        const monthlyCashflow = currentRent - bondPayment - totalExpenses;
        
        const annualNetIncome = (currentRent * 12) - (totalExpenses * 12);
        const yieldPercent = purchasePrice > 0 ? (annualNetIncome / purchasePrice) * 100 : 0;

        rentalSeries.push({
            year: y,
            equity: Math.round(currentEquity),
            debt: Math.round(currentLoan),
            cashflow: Math.round(monthlyCashflow * 12),
            yield: parseFloat(yieldPercent.toFixed(2))
        });
    }

    // Flip Logic
    const sunkCosts = totalEquityRequired + num(inputs.renovationBudget);
    const monthlyBurn = bondPayment + num(inputs.levies) + num(inputs.rates) + num(inputs.securityCost) + num(inputs.utilities);
    
    const flipSeries = [];
    let burnPointMonth = -1;
    
    for (let m = 0; m <= 12; m++) {
        const projectedRevenue = (num(inputs.exitPrice) * 0.93); // After 7% commission
        const totalInvested = purchasePrice + closingCosts + num(inputs.renovationBudget);
        const holdingCost = monthlyBurn * m;
        
        const profit = projectedRevenue - totalInvested - holdingCost;
        
        if (burnPointMonth === -1 && profit < 0) burnPointMonth = m;
        
        flipSeries.push({ month: m, profit: profit, burn: holdingCost });
    }

    const profitAt6Months = flipSeries[6].profit;
    const capitalInvested = depositAmount + transferCosts + bondRegistrationFees + num(inputs.renovationBudget) + (monthlyBurn * 6);
    const totalCashRequiredFlip = depositAmount + closingCosts + num(inputs.renovationBudget);
    const velocityROI = ((profitAt6Months / capitalInvested) * (12 / 6)) * 100;

    // Rent vs Buy (Tenant)
    const rentVsBuySeries = [];
    let buyNetWorth = depositAmount;
    let rentNetWorth = depositAmount;
    
    for(let y = 1; y <= 10; y++) {
        const propVal = purchasePrice * Math.pow(1 + (num(inputs.propertyAppreciationRate)/100), y);
        let loanBal = loanAmount; 
        for(let m=0; m<y*12; m++) loanBal -= (bondPayment - (loanBal * num(inputs.interestRate)/100/12));
        buyNetWorth = propVal - loanBal;

        const monthlyRentCost = num(inputs.monthlyRent) * Math.pow(1 + (num(inputs.rentEscalationRate)/100), y-1);
        const totalBuyCost = bondPayment + num(inputs.levies) + num(inputs.rates) + num(inputs.insurance) + num(inputs.utilities);
        const monthlyDiff = totalBuyCost - monthlyRentCost;
        rentNetWorth = (rentNetWorth + (monthlyDiff * 12)) * (1 + (num(inputs.investmentReturnRate)/100));

        rentVsBuySeries.push({ year: y, buy: Math.round(buyNetWorth), rent: Math.round(rentNetWorth) });
    }

    // Owner Shield
    const ownerMaintenance = inputs.includeMaintenance ? (purchasePrice * (num(inputs.maintenancePercentValue) / 100)) / 12 : 0;
    const totalOwnerCosts = bondPayment + num(inputs.levies) + num(inputs.rates) + num(inputs.insurance) + num(inputs.utilities) + ownerMaintenance;
    const incomeRatio = num(inputs.monthlyIncome) > 0 ? (totalOwnerCosts / num(inputs.monthlyIncome)) * 100 : 0;
    let maxRate = num(inputs.interestRate);
    while(maxRate < 25) {
        const testRate = (maxRate + 0.5) / 100 / 12;
        const testPayment = loanAmount * (testRate * Math.pow(1 + testRate, num(inputs.termYears) * 12)) / (Math.pow(1 + testRate, num(inputs.termYears) * 12) - 1);
        if (testPayment + num(inputs.levies) + num(inputs.rates) + num(inputs.insurance) + num(inputs.utilities) + ownerMaintenance > num(inputs.monthlyIncome) * 0.45) break;
        maxRate += 0.5;
    }

    // Owner Budget Logic
    const ownerTransport = num(inputs.transport);
    const ownerGroceries = num(inputs.groceries);
    const ownerOther = num(inputs.otherEssentials);
    const ownerTotalOutflow = totalOwnerCosts + ownerTransport + ownerGroceries + ownerOther + customExpensesTotal;
    const ownerDisposable = num(inputs.monthlyIncome) - ownerTotalOutflow;

    const ownerBudgetBreakdown = [
        { name: 'Bond', value: bondPayment },
        { name: 'Levies & Rates', value: num(inputs.levies) + num(inputs.rates) },
        { name: 'Maintenance', value: ownerMaintenance },
        { name: 'Insurance', value: num(inputs.insurance) },
        { name: 'Utilities', value: num(inputs.utilities) },
        { name: 'Transport', value: ownerTransport },
        { name: 'Groceries', value: ownerGroceries },
        { name: 'Other', value: ownerOther },
        ...(Array.isArray(inputs.customExpenses) ? inputs.customExpenses.map((c: any) => ({ name: c.name || 'Custom', value: num(c.value) })) : []),
        { name: 'Disposable', value: Math.max(0, ownerDisposable) }
    ].filter(item => item.value > 0);

    // Tenant Logic
    const totalLivingCosts = num(inputs.transport) + num(inputs.groceries) + num(inputs.otherEssentials) + num(inputs.utilities) + customExpensesTotal;
    const disposableIncome = num(inputs.monthlyIncome) - num(inputs.monthlyRent) - totalLivingCosts;
    const rentToIncomeRatio = num(inputs.monthlyIncome) > 0 ? (num(inputs.monthlyRent) / num(inputs.monthlyIncome)) * 100 : 0;
    const savingsRate = num(inputs.monthlyIncome) > 0 ? (disposableIncome / num(inputs.monthlyIncome)) * 100 : 0;

    const budgetBreakdown = [
      { name: 'Rent', value: num(inputs.monthlyRent) },
      { name: 'Utilities', value: num(inputs.utilities) },
      { name: 'Transport', value: num(inputs.transport) },
      { name: 'Groceries', value: num(inputs.groceries) },
      { name: 'Other', value: num(inputs.otherEssentials) },
      ...(Array.isArray(inputs.customExpenses) ? inputs.customExpenses.map((c: any) => ({ name: c.name || 'Custom', value: num(c.value) })) : []),
      { name: 'Disposable', value: Math.max(0, disposableIncome) },
    ].filter(item => item.value > 0);

    // Owner Equity Series
    const ownerSeries = [];
    let ownerLoanBal = loanAmount;
    for(let y = 1; y <= 10; y++) {
        const interestForYear = ownerLoanBal * (num(inputs.interestRate) / 100);
        const principalPaid = (bondPayment * 12) - interestForYear;
        ownerLoanBal -= principalPaid;
        if (ownerLoanBal < 0) ownerLoanBal = 0;
        
        const propertyValue = purchasePrice * Math.pow(1 + (num(inputs.propertyAppreciationRate)/100), y);
        const equity = propertyValue - ownerLoanBal;

        ownerSeries.push({ year: y, equity: Math.round(equity) });
    }

    return { purchasePrice, bondPayment, monthlyExpenses, netCashflow, grossYield: isNaN(grossYield) ? 0 : grossYield, netYield: isNaN(netYield) ? 0 : netYield, cashOnCashReturn: isNaN(cashOnCashReturn) ? 0 : cashOnCashReturn, rentalSeries, flip: { sunkCosts, monthlyBurn, burnPointMonth, velocityROI: isNaN(velocityROI) ? 0 : velocityROI, totalCashRequired: totalCashRequiredFlip, series: flipSeries }, tenant: { rentVsBuySeries, betterOption: rentVsBuySeries.length > 0 && rentVsBuySeries[9].buy > rentVsBuySeries[9].rent ? 'Buying' : 'Renting', rentToIncomeRatio: isNaN(rentToIncomeRatio) ? 0 : rentToIncomeRatio, disposableIncome: isNaN(disposableIncome) ? 0 : disposableIncome, savingsRate: isNaN(savingsRate) ? 0 : savingsRate, budgetBreakdown, totalLivingCosts }, owner: { totalCosts: totalOwnerCosts, totalMonthlyOutflow: ownerTotalOutflow, incomeRatio: isNaN(incomeRatio) ? 0 : incomeRatio, maxRate, series: ownerSeries, budgetBreakdown: ownerBudgetBreakdown, disposableIncome: ownerDisposable } };
};