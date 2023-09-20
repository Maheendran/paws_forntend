import React from "react";
import { Routes, Route } from "react-router-dom";
// import WelcomePage from "../pages/common/welcome/WelcomePage";
import ChooseProfile from "../pages/common/chooseProfile/ChooseProfile";
import Registration from "../pages/common/registration/Registration";
import OtpPage from "../pages/common/otpPage/OtpPage";
import PrivateOtproute from "../components/ProtetctedRoutes/PrivateOtproute";

import ClinicPR from "../components/ProtetctedRoutes/ClinicPR";

import ErrorPage from "../pages/common/ErrorPage/ErrorPage";
import OtpPR from "../components/ProtetctedRoutes/OtpPR";
import ForgotPass from "../pages/common/ForgotPass/ForgotPass";
import Profile from "../pages/common/Profile/Profile";
import CommonPR from "../components/ProtetctedRoutes/CommonPR";

import DoctorPage from "../pages/clinic/Doctors/DoctorPage";
import BookingPage from "../pages/clinic/Booking/BookingPage";
import SearchPage from "../pages/common/SearchPage/SearchPage";
import ClinicDetail from "../pages/petOwner/ServiceDetails/ClinicDetail";
import Leaveform from "../pages/clinic/LeaveForm/Leaveform";
import PaymentPage from "../pages/petOwner/Payment/PaymentPage";
import BookingHistory from '../pages/common/BookingHistory/BookingHistory'
import Complaint from "../pages/common/Complaint/Complaint";

const AllRoutes = () => {
  return (
    <>

      <Routes>
  
        <Route path="/choose-profile" element={<PrivateOtproute Component={ChooseProfile} />}/>
        <Route path="/register" element={<PrivateOtproute Component={Registration} />}/>
        <Route path="/reset-password" element={<ForgotPass />} />
        <Route path="/otp" element={<OtpPR Component={OtpPage} />} />

 
        {/* ====================common page===================== */}

        <Route path="/" element={<CommonPR Component={SearchPage} />} />
        <Route path="/clinic-detail/:id" element={<CommonPR Component={ClinicDetail} />} />
        <Route path="/userprofile" element={<CommonPR Component={Profile} />} />
        <Route path="/*" element={<ErrorPage/>} />
        <Route path="/payments" element={<CommonPR Component={PaymentPage} />} />
        <Route path="/bookings-history" element={<CommonPR Component={BookingHistory} />} />
        <Route path="/complaints" element={<CommonPR Component={Complaint} />} />


        {/* ==============================clinic ===========================*/}

        <Route path="/doctors" element={<ClinicPR Component={DoctorPage} />} />
        <Route path="/clinic" element={<ClinicPR Component={BookingPage} />} />
        <Route path="/leave-apply" element={<ClinicPR Component={Leaveform} />} />
        <Route path="/payment" element={<ClinicPR Component={PaymentPage} />} />

        
      </Routes>
    </>
  );
};

export default AllRoutes;
