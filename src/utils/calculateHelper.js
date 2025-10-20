
const DOMAIN = `http://localhost:5001`; // can be moved the env. variables


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


// Utility function to format into percent.
function formatToPercent(value) {
   const percent = Intl.NumberFormat("en-CA", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return percent;
}

// Utility function to format the currency to represent CAD
function formatCurrency(value) {
  const currencyConverted = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(value);
  return currencyConverted;
}

export {fetchTaxBrackets, calculateTax, formatCurrency, formatToPercent};

