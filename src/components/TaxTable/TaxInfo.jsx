
import "./TaxInfo.css"
import { formatToPercent, formatCurrency } from "../../utils/calculateHelper";


const TaxInfo = ( {calculatedTax} ) => {

  return (
    <div className="taxInfoContainer">
        <div className="perBandTable">
            <table border="1">
                <thead>
                    <tr>
                        <th>Tax Bracket</th>
                        <th>Marginal Tax Rate</th>
                        <th>Amount Taxable</th>
                        <th>Tax Payable</th>
                    </tr>
                </thead>
                <tbody>
                    {calculatedTax?.perBand.map((pb, index) => {
                        return ( 
                            <tr key={`key_${index}`}>
                                <td>{formatCurrency(pb.from)} {pb.to == null ? "+" : `- ${formatCurrency(pb.to)}`}</td>
                                <td>{formatToPercent(pb.rate)}</td>
                                <td>{formatCurrency(pb.taxable)}</td>
                                <td>{formatCurrency(pb.tax)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
        <div className="taxesInfo">
          <div className="total"> Total Payable Taxes: {formatCurrency(calculatedTax?.totalTax)} </div> 
          <div className="effectiveRate"> Effective Rate: {formatToPercent(calculatedTax?.effectiveRate)} </div>  
        </div>
    </div>
  );
};


export default TaxInfo;