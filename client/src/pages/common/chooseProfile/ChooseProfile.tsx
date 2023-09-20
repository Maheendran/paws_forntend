import React from "react";
import "./ChooseProfile.css";
import { useAppDispatch, useAppSelector } from "../../../Redux/Store";
import { choosePerson } from "../../../Redux/Slice/AuthSlice";
import { useNavigate } from "react-router-dom";
const ChooseProfile: React.FC = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const auth = useAppSelector((state) => state.auth);

  const handleChooseProfile = (value: string): void => {
    dispatch(choosePerson({ value }));
    navigate("/register");
  };

  return (
    <>
      <div className="chooseprofile_main container-fluid">
        <div className="logo">
          <img src="../assests/logo.png" alt="" />
        </div>
        <h1 className="text-center mt-4">Who are you ?</h1>
        <div className="bottom_chooseprofile_shadow">
          <div className="chooseprofile_row">
            <div
              className="small_chooseProfile"
              onClick={() => handleChooseProfile("PetOwner")}>
              <img src="./assests/person1.jpg" alt="" />
              <div className="chooseprofile_title">
                <p>Pet Owner</p>
              </div>
            </div>
            <div
              className="small_chooseProfile"
              onClick={() => handleChooseProfile("Clinic")}>
              <img src="./assests/doctor1.png" alt="" />
              <div className="chooseprofile_title">
                <p>Clinic</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChooseProfile;
