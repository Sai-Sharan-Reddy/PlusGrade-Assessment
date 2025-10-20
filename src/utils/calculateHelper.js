
const DOMAIN = `http://localhost:5001`; // can be moved the env. variables

/**
 * Fetches tax bracket data for a given tax year from the API with retry logic.
 * It automatically retries up to 3 times in case of network failures or non-OK responses,
 * providing robust error handling for unreliable network conditions.
 *
 * @param {number|string} year - The tax year to fetch brackets for (e.g., 2019–2022).
 * @returns {Promise<Object>} Resolves to a JSON object containing tax bracket data.
 * @throws {Error} If the API request fails after 3 retry attempts.
 */

async function fetchTaxBrackets(year) {

  console.info("Fetching tax brackets for the year:", year);
    let retryCount = 0;
    while (retryCount <= 3) {
        try {
            const data = await fetch(`${DOMAIN}/tax-calculator/tax-year/${year}`);
            if(!data.ok) {
                throw new Error("API Request Failed");
            }
            return data.json();
        }
        catch(err) {
            if (retryCount === 3) {
                console.error("Max retries reached while fetching tax brackets with error:", err);
                throw err;
            }
            console.info(`Error while fetching tax brackets for the year ${year}, Attempting to retry.`);
            retryCount++;
        }
    }
}

/**
 * Calculates total income tax, per-band tax breakdown, and effective tax rate.
 *
 * @param {Array} taxBrackets
 * @param {number} income
 * @returns  
 *   An object containing:
 *   - `perBand`: Tax calculation per bracket.
 *   - `totalTax`: Sum of all bracket taxes.
 *   - `effectiveRate`: Ratio of totalTax to income (0 if income is 0).
 */

function calculateTax(taxBrackets, income) {
  console.info(`Calculating taxes for income ${income}`);
  const bands = [...taxBrackets].sort((a, b) => a.min - b.min);

  let totalTax = 0;
    const perBand = bands.map(band => {
        const upper = Number.isFinite(band.max) ? band.max : Infinity;
        const taxable = Math.max(0, Math.min(income, upper) - band.min);
        const tax = taxable * band.rate;

        totalTax += tax;
        return {
            from: band.min,
            to: Number.isFinite(band.max) ? band.max : null,
            rate: band.rate,
            taxable: taxable,
            tax: tax,
        };
    });

  const effectiveRate = income > 0 ? totalTax / income : 0;
  return { perBand, totalTax, effectiveRate };
}


/**
 * Formats a numeric value into a localized percentage string.
 *
 * Example:
 *   formatToPercent(0.15)    → "15.00%"
 *
 * @param {number} value - A decimal value representing the rate (e.g., 0.15 for 15%).
 * @returns {string} The formatted percentage string with two decimal places.
 */

function formatToPercent(value) {
   const percent = Intl.NumberFormat("en-CA", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return percent;
}

/**
 * Formats a numeric value into a localized Canadian currency string.

 * @param {number} value - The numeric value representing an amount in Canadian dollars.
 * @returns {string} A string formatted as currency, using CAD and two decimal places.
 */
function formatCurrency(value) {
  const currencyConverted = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(value);
  return currencyConverted;
}

export {fetchTaxBrackets, calculateTax, formatCurrency, formatToPercent};

