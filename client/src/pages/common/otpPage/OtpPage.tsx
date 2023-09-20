import React from "react";
import "./OtpPage.css";
import OtpSection from "../../../components/otpMethod/OtpSection";
import { useAppSelector } from "../../../Redux/Store";
const OtpPage = () => {

  const { email } = useAppSelector((state) => state.auth);
  
  return (
    <>
      <div className="logo">
        <img src="../assests/logo.png" alt="" />
      </div>
      <div className="otp_banner">
        <div className="ellipse">
          <img src="../assests/ellipse.png" alt="" />
        </div>
        <div className="person_left">
          <img src="../assests/person4.png" alt="" />
        </div>

        <div className="paws_otp1">
          <img src="../assests/pawsblue.png" alt="" />
        </div>
        <div className="paws_otp2">
          <img src="../assests/pawsblue.png" alt="" />
        </div>

        <div className="row m-auto text-center mt-5">
          <OtpSection email={email} />
        </div>
      </div>
    </>
  );
};

export default OtpPage;
