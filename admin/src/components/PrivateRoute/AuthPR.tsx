import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Redux/Store";
import { currentUserDetail } from "../../Redux/Slice/AuthSlice";
import Menu from "../menu/Menu";
import LoadingComp from "../../pages/loading/LoadingComp";
import { getcurrentUser } from "../../Redux/Slice/UserSlice";

interface AuthPRProps {
  Component: React.ComponentType<any>;
}

const AuthPR: React.FC<AuthPRProps> = (props: any) => {
  const { Component } = props;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
const user=useAppSelector((state)=>state.user)
  useEffect(() => {

    dispatch(currentUserDetail());
    dispatch(getcurrentUser()).then(()=>{

  if (auth.token && auth.choosePerson === "admin") {
      <Outlet />;
    } else {
      navigate("/login");
    }

    })
  
  }, []);

  return (
    <>

{user.loading &&  <LoadingComp/>}

<div className="container-fluid">
  <div className="row">

    <div className="col-2 bg-dark">
     <Menu/>
    </div>
    <div className="col-10 ">

      <Component/>
    </div>
  </div>
</div>

    </>
  );
};

export default AuthPR;
