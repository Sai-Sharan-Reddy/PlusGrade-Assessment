import { useState } from "react";

import TaxForm from "../components/Form/TaxForm";
import TaxInfo from "../components/TaxTable/TaxInfo";
import SkeletonTable from "../components/TaxTable/SkeletonTable.jsx";
import GeneralError from "../components/GeneralError/GeneralError";
import { ErrorBoundary } from "react-error-boundary";
import "./App.css";

function App() {
  const [calculatedTax, setCalculatedTax] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);


  // callback functions passed to the child component to update the states.
  const updateCalculatedTax = (tax) => {
    setCalculatedTax(tax);
  };

  const updateLoading = (isLoading) => {
    setLoading(isLoading);
  };

  const updateError = (errorValue) => {
    setApiError(errorValue);
  };


  return (
    <ErrorBoundary fallback={<GeneralError />}>
      <>
        <TaxForm
          updateCalculatedTax={updateCalculatedTax}
          updateLoading={updateLoading}
          updateError={updateError}
        />
        {loading && <SkeletonTable />}
        {calculatedTax && !apiError && !loading && (
          <TaxInfo calculatedTax={calculatedTax} />
        )}
        {apiError && !loading && <GeneralError />}
      </>
    </ErrorBoundary>
  );
}

export default App;
