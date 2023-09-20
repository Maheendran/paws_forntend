import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Redux/Store";
import { currentUserDetail } from "../../Redux/Slice/AuthSlice";
const PrivateOtproute = (props: any) => {
  const { Component } = props;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log('enteringggggg')
    dispatch(currentUserDetail());
    if (!auth.token) {
      <Outlet />;
    } else {
      // if (auth?.choosePerson === "PetOwner") {
        navigate("/register");
      // } else {
      //   if (auth?.choosePerson === "Clinic") {
      //     navigate("/clinic");
      //   } 
      // }
    }
  }, []);

  return (
    <div>
      <Component />
    </div>
  );
};

export default PrivateOtproute;
