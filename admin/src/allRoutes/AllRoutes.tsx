import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/LoginPage/Login";
import UnAuthPR from "../components/PrivateRoute/UnAuthPR";
import AuthPR from "../components/PrivateRoute/AuthPR";
import Home from "../pages/home/Home";
import Accounts from "../pages/Accounts/Accounts";
import Verification from "../pages/Verification/Verification";
import Complaints from "../pages/Complaint/Complaints";



const AllRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<UnAuthPR Component={Login} />} />
        <Route path="/" element={<AuthPR Component={Home} />} />
        <Route path="/users" element={<AuthPR Component={Accounts} />} />
        <Route path="/verification" element={<AuthPR Component={Verification} />} />
        <Route path="/complaints" element={<AuthPR Component={Complaints} />} />
        
      </Routes>
    </>
  );
};

export default AllRoutes;
