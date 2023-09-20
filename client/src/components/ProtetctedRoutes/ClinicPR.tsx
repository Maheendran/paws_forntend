// import React, { useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "../../Redux/Store";
// import { Outlet, useNavigate } from "react-router-dom";
// import ClinicNav from "../../pages/clinic/Navbar/ClinicNav";
// import LoadingComp from "../loading/LoadingComp";
// import { getcurrentUser } from "../../Redux/Slice/UserDetailSlice";

// import ErrorPage from "../../pages/common/ErrorPage/ErrorPage";

// const ClinicPR = (props: any) => {



//   const auth = useAppSelector((state) => state.auth);
//   const user = useAppSelector((state) => state.user);
//   const { Component } = props;

//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   useEffect(() => {
 
//     if (!auth.token) {
//       navigate("/choose-profile");
//     }


// dispatch(getcurrentUser()).then((data) => {
//   if(data.payload){
  
//     throw new Error(data.payload.errorMessage);
//   }
//   // if (data.payload.status === "token") {
//   //   localStorage.removeItem("token");
//   //   return navigate("/register");
//   // }
//   // if (data.payload.status === "success" && data.payload.userdata) {
//   //   if (data.payload.userdata?.blocked===true) {
//   //     localStorage.removeItem("token");
//   //     window.location.reload()
//   //   }
//   //   if(data.payload.userdata.accountType==='petOwner'){
//   //     navigate("/pet-owner");
//   //   }
//   //    else{
//   //     <Outlet />;
//   //   }
//   // } 
// });    
//   },[]);


//   return (

//     <div>

//       {user.userloading ? <LoadingComp/>:
//       <>
//           <ClinicNav/>
//       <Component />
//       </>
  
//   }
//     </div>

//   );
// };

// export default ClinicPR;
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/Store";
import { Outlet, useNavigate } from "react-router-dom";
import ClinicNav from "../../pages/clinic/Navbar/ClinicNav";
import LoadingComp from "../loading/LoadingComp";
import { getcurrentUser } from "../../Redux/Slice/UserDetailSlice";
import { ErrorBoundary } from "react-error-boundary";

import { Error } from "../error/Error";

interface ClinicPRProps {
  Component: React.ComponentType<any>;
}

const ClinicPR: React.FC<ClinicPRProps> = ({ Component }) => {



  const auth = useAppSelector((state) => state.auth);
  const user = useAppSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
 
    if (!auth.token) {
      navigate("/choose-profile");
    }


dispatch(getcurrentUser()).then((data) => {

  if (data.payload.status === "token") {
    localStorage.removeItem("token");
    return navigate("/register");
  }

  if (data.payload.status === "success" && data.payload.userdata) {

    if (data.payload.userdata?.blocked===true) {
      localStorage.removeItem("token");
      window.location.reload()
    }
 
    if(data.payload.userdata.accountType==='PetOwner'){
 
      navigate("/");
    }
     else{
      <Outlet />;
    }
  } 
});    
  },[]);


  const errorHandler=(error:any,errorInfo:any)=>{
console.log(error,errorInfo)
  }
  return (
  
    <ErrorBoundary  FallbackComponent={Error} onError={errorHandler}>
      <div>
        {user.userloading ? (
          <LoadingComp />
        ) : (
          <>
            <ClinicNav />
            <Component />
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ClinicPR;
