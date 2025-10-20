import { useState } from "react";
import { fetchTaxBrackets, calculateTax } from "../../utils/calculateHelper";
import "./TaxForm.css";

const TAXABLE_YEARS = ["2019", "2020", "2021", "2022"];

const TaxForm = ({ updateCalculatedTax, updateLoading, updateError }) => {
  const [income, setIncome] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [incomeError, setIncomeError] = useState(false);


  const handleInputOnChange = (value) => {
    setIncome(value);

    // input validation can be updated based on requirement. Currently only handles numbers greater than 0 values
     if (value < 0 || isNaN(value)) {
      setIncomeError(true);
    } else if (incomeError) {
      setIncomeError(false);
    }
  }
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    updateLoading(true);
    updateError(false);
    try {
      const data = await fetchTaxBrackets(year); // fetches the tax brackets for the selected year.
      const taxes = calculateTax(data.tax_brackets, income);
      updateCalculatedTax(taxes);
    } catch (err) {
      console.log(err);
      updateError(true);
    } finally {
      setLoading(false);
      updateLoading(false);
    }
  };

  const submitDisabled = () => {
    return Boolean(!year || !income || loading || incomeError);
  };

  return (
    <div>
      <form className="form" onSubmit={handleFormSubmit}>
        <div className="headerBlock">
          <span>Tax Calculator</span>
        </div>
        <div className="incomeBlock">
          <label htmlFor="incomeField" className="label">
            <span>Annual Income</span>
          </label>
          <input
            id="incomeField"
            type="number"
            value={income}
            onChange={(e) => handleInputOnChange(e.target.value)}
            required
          />
          {incomeError && (
            <div className="incomeHelperText" role="alert">
              <span>Please enter a valid income. Should be a number greater than or equal to 0</span>
            </div>
            )
          }
        </div>

        <div className="yearBlock">
          <label htmlFor="yearField" className="label">
            <span>Tax Year</span>
          </label>
          <select
            id="yearField"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="select"
          >
            <option value="">Select Tax Year</option>
            {TAXABLE_YEARS.map((year) => {
              return (
                <option value={year} key={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>

        <button disabled={submitDisabled()} className="submitButton">
          {loading ? "Calculating Tax..." : "Calculate Tax"}
        </button>
      </form>
    </div>
  );
};

export default TaxForm;
