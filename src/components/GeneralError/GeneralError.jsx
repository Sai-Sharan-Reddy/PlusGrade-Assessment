

import errorImgae from "../../Assets/errorImage.jpg"
import "./GeneralError.css";


const GeneralError = () => {
    return (
        <div className="errorBody">
            <div>
                <img 
                    src={errorImgae}
                    alt="Error Image"
                />
            </div>
            <div className="errorText">
                <h1>Something went wrong</h1>
                <p>
                    We’re sorry, something went wrong while fetching data. Please try again later.
                </p>
            </div>
        </div>
    )
}

export default GeneralError;