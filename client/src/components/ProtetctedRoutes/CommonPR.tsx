import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector, } from "../../Redux/Store";

import { Outlet, useNavigate } from "react-router-dom";
import { getcurrentUser } from "../../Redux/Slice/UserDetailSlice";
// import ClinicNav from "../../pages/clinic/Navbar/ClinicNav";
import NavbarPet from "../../pages/petOwner/Navbar/NavbarPet";
import ClinicNav from "../../pages/clinic/Navbar/ClinicNav";
import { ErrorBoundary } from "react-error-boundary";
import { Error } from "../error/Error";

interface CommonPRProps {
  Component: React.FC<{}>;
}
const CommonPR: React.FC<CommonPRProps> = ({ Component }) => {

  const dispatch = useAppDispatch();


const [authorized,setAuthorized]=useState(false)
  
const user=useAppSelector((state)=>state.user)
const {token}=useAppSelector((state)=>state.auth)
const navigate=useNavigate()
useEffect(() => {    
  if(token){
     dispatch(getcurrentUser()).then((data) => {
      if (data.payload.status === "success" && data.payload.userdata){
        if (data.payload.userdata?.blocked===true) {
          localStorage.removeItem("token");
       return   navigate('/')
        }
        setAuthorized(true)
        return <Outlet />;
        } 
        else if (data.payload.status === "success"){
          setAuthorized(false)
        }
        else if (data.payload.status === "error"){
          navigate('/*')
        }

    });

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
        if(data.payload.userdata.accountType==='petOwner'){
          navigate("/pet-owner");
        }
         else{
          <Outlet />;
        }
      } 
    });    
  }
  },[]);

  return (
    <div>
       <ErrorBoundary  FallbackComponent={Error} >
        {user.currentUser.accountType==='Clinic' ? <ClinicNav/> : 
<NavbarPet  authorized={authorized}/>
}
      <Component />
       </ErrorBoundary>

    </div>
  );
};

export default CommonPR;
