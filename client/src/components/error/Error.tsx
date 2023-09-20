import { FallbackProps } from 'react-error-boundary';
import { Link } from "react-router-dom"

export const Error=(props:FallbackProps)=>{
  const {error,resetErrorBoundary}=props;
  
    return(
        <div className="container">
                 <div className="row m-auto mt-5">
                  <h1>{error.message}</h1>
                   <div className="col-9 error_img m-auto">
                     <img className="img-fluid" src="./assests/error404.gif" alt="" />
                   </div>
                  <div className="col-4 m-auto text-center">
                   
                       <button className="btn btn-success" onClick={resetErrorBoundary}>Go to Home</button>
                   
                  </div>
                 </div>
               </div>
    )
}