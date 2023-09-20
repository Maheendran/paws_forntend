import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/Store";
import { Outlet, useNavigate } from "react-router-dom";
import { getcurrentUser } from "../../Redux/Slice/UserDetailSlice";
import LoadingComp from "../loading/LoadingComp";
import NavbarPet from "../../pages/petOwner/Navbar/NavbarPet";
const PetOwnerPR = (props: any) => {
  const { Component } = props;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
 
  useEffect(() => {
    dispatch(getcurrentUser()).then((data) => {
      if (data.payload.status === "token") {
        localStorage.removeItem("token");
        return navigate("/register");
      }
      if (data.payload.status === "success" && data.payload.userdata) {
        if (data.payload.userdata?.blocked===true) {
          localStorage.removeItem("token");
          navigate("/register");
        }
        if(data.payload.userdata.accountType==='Clinic'){
          navigate("/clinic");
        }
        else{
          <Outlet />;
        }
      } 
    });
  }, []);

  return <>{user.userloading ? <LoadingComp /> : 

<>
{/* <NavbarPet  /> */}
  <Component />
  </>
  }</>;
};

export default PetOwnerPR;
