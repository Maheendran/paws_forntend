import React from "react";
import "./WelcomePage.css";
import { NavLink } from "react-router-dom";
const WelcomePage = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="logo">
          <img src="../assests/logo.png" alt="" />
        </div>

        <div className="row">
          <div className=" col-md-12 col-lg-5 text-center left_welcome_side mx-auto">
            <div className="left_welcome_letter">
              <h1>
                {" "}
                <span className="highlight_first">W</span>e’re Here to care of
                Your Pet’s
              </h1>

              <div className="welcome_btn_main">
                <img
                  className="dog_welcome_gif"
                  src="./assests/dog4.gif"
                  alt=""
                />
                <NavLink to={"/choose-profile"}>
                  <button className="welcome_btn">Welcome</button>{" "}
                </NavLink>
                <div className="welcome_btn_shadow"></div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-12 col-lg-5 me-auto text-center right_welcome_side">
            <div className="image_welcome_side">
              <div className="shadow_welcome_side"></div>
              <img src="./assests/person2.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomePage;
