// import React from "react";
// import "./ErrorPage.css";
// import { Link } from "react-router-dom";
// const ErrorPage = () => {
//   return (
//     <>
//       <div className="container">
//         <div className="row m-auto mt-5">
//           <div className="col-9 error_img m-auto">
//             <img className="img-fluid" src="./assests/error404.gif" alt="" />
//           </div>
//           <div className="col-4 m-auto text-center">
//             <Link to={"/choose-profile"}>
//               <button className="btn btn-success">Go to Home</button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ErrorPage;

// ErrorPage.tsx
import React from "react";
import { Link } from "react-router-dom";



const ErrorPage = () => {
  return (
    <div className="container">
      <div className="row m-auto mt-5">
        <div className="col-9 error_img m-auto">
          <img className="img-fluid" src="./assests/error404.gif" alt="" />
        </div>
        <div className="col-4 m-auto text-center">
          <Link to={"/choose-profile"}>
            <button className="btn btn-success">Go to Home</button>{" "}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
