import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux/Store";
import { currentUserDetail, logoutUser } from "../../../Redux/Slice/AuthSlice";
import { Navigate, useNavigate } from "react-router-dom";
import NavbarPet from "../Navbar/NavbarPet";
import { motion } from "framer-motion";
import "./HomePage.css";
import { useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { CardRight } from "../../../components/Cards/CardRight";
import Cardleft from "../../../components/Cards/Cardleft";

const HomePage = () => {


  // ======================
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(currentUserDetail());
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/choose-profile");
  };

  return (
    <>
      {/* <NavbarPet /> */}
      {/* <div className="user_banner container-fluid">
        <div
          id="carouselExampleControls"
          className="carousel slide "
          data-ride="carousel"
        >
          <div className="carousel-inner  ">
            <div className="carousel-item active inner_carousel">
              <img
                className="d-block w-100"
                src="https://images.template.net/66383/Pet-Clinic-Billboard-Template.jpeg"
                alt="First slide"
              />
            </div>
            <div className="carousel-item  inner_carousel">
              <img
                className="d-block w-100"
                src="https://onaircode.com/wp-content/uploads/2017/11/Bootstrap-Carousel-Full-Screen.jpg"
                alt="First slide"
              />
            </div>
            <div className="carousel-item  inner_carousel">
              <img
                className="d-block w-100"
                src="https://onaircode.com/wp-content/uploads/2017/11/Bootstrap-Carousel-Full-Screen.jpg"
                alt="First slide"
              />
            </div>
          </div>
          <a
            className="carousel-control-prev"
            href="#carouselExampleControls"
            role="button"
            data-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="sr-only">Previous</span>
          </a>
          <a
            className="carousel-control-next"
            href="#carouselExampleControls"
            role="button"
            data-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="sr-only">Next</span>
          </a>
        </div>
      </div> */}
      <div className="homepage">
<div className="homepage_bg">
  <img src="../assests/Vector 1.png" alt="" />
  <div className="bg_paws">
    <img src="../assests/semi.png" alt="" />
  </div>
  <div className="bg_violet_paws">
    <img src="../assests/paw1.png" alt="" />
  </div>
</div>
{/* card section */}


<div className="container">



  {/* clinic card */}

  <div className="row card_box m-3">
    <div className="col-4 m-auto">
    <img  className="img-fluid" src="../assests/dog2.png" alt="" />
    </div>
    
    <div className="col-10 m-auto d-flex justify-content-center ">
      <button className="card_btn m-auto ">Add pets details</button>
    </div>
  </div> 
  
  {/* pet details */}
   <div className="row card_box">
    <div className="col-4 ms-auto">
      <div className="card_clinic_img m-auto">
            <img  className="img-fluid" src="../assests/dog_grooming 1.png" alt="" />
      </div>

    </div>

    <div className="col-4 m-auto text-center ">
     
      <p className="text-start m-auto text-center" >Instantly Book a Professional 
Pet Groomer Online, 
Whenever you need one.</p>
      <button className="card_btn_clinic m-auto">Book for grooming</button>
      
    </div>
  </div>
{/* clinic */}
<div className="row card_box">


    <div className="col-12 col-sm-4 m-auto ">
     
      <p className="text-center m-auto " >"Effortless pet care at your fingertips - book 
a professional pet clinic online, anytime, anywhere."</p>
      <button className="card_btn_clinic  ">Book for grooming</button>
      
    </div>
    <div className="col-12 col-sm-4 me-auto">
      <div className="card_clinic_img m-auto">
            <img  className="img-fluid" src="../assests/doctor.png" alt="" />
      </div>

    </div>
  </div>








</div>






      </div>
    </>
  );
};

export default HomePage;
