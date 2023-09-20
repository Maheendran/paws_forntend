import React from "react";
import "./NavbarPet.css";
import { NavLink, useNavigate } from "react-router-dom";
import { BiSolidUserCircle } from "react-icons/bi";
import { AiOutlineUser, AiOutlineLogout } from "react-icons/ai";
import { FaRupeeSign } from "react-icons/fa";
import { useAppDispatch } from "../../../Redux/Store";
import { logoutUser } from "../../../Redux/Slice/AuthSlice";

const NavbarPet:React.FC<{ authorized: boolean }> = ({authorized}) => {
  
  const handleservice = (value: string) => {
    if (value === "clinic"){
      navigate("/");
    } 
  };

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/register");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light  ">
        <div className="col-1">
          <NavLink className="navbar-brand" to={"/"}>
            <img src="../assests/logo.png" height={40} alt="" />
          </NavLink>
        </div>
        <div className="walk_gif col-4">
          <img src="../../assests/waking.gif" alt="" />
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav m-auto px-2">
            <li className="nav-item m-auto">
              <button
                className="mx-2 nav_head_btn text-muted"
                onClick={() => handleservice("clinic")} >
                clinic
              </button>
            </li>
          </ul>
          <ul>
            <div className="btn-group btn_dropdown">
              <button
                type="button"
                className="profile_nav_btn dropdown-toggle"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <BiSolidUserCircle size={"1.5rem"} />
              </button>
              <div className="dropdown-menu dropdown-menu-right dropdown_link">
               
               
               {authorized ?
               <>
                <li className="nav-item m-auto mt-2">
                  <NavLink to={"/userprofile"}>
                    Profile{" "}
                    <span>
                      {" "}
                      <AiOutlineUser />{" "}
                    </span>
                  </NavLink>
                </li>

                <li className="nav-item m-auto mt-2">
                  <NavLink to={"/payments"}>
                    Payments{" "}
                    <span>
                      <FaRupeeSign />{" "}
                    </span>
                  </NavLink>
                </li>
                <li className="nav-item m-auto mt-2">
                  <NavLink to={"/bookings-history"}>
                    Bookings{" "}
                  </NavLink>
                </li> 
                 <li className="nav-item m-auto mt-2">
                  <NavLink to={"/complaints"}>
                    Complaints{" "}
                  </NavLink>
                </li>
             
                <li className="nav-item  mx-2 mt-2" onClick={handleLogout}>
                  Logout{" "}
                  <span>
                    {" "}
                    <AiOutlineLogout />{" "}
                  </span>
                </li>
               </>    :
               <>
                   <li className="nav-item m-auto mt-2">
                  <NavLink to={"/choose-profile"}>
                    Register{" "}
                    <span>
                      {" "}
                      <AiOutlineUser />{" "}
                    </span>
                  </NavLink>
                </li>
               </>         
}
              </div>
            </div>

            <div className="mob_nav_box m-auto">
              <li className="nav-item m-auto">
                <NavLink to={"/booking"}>Porfile</NavLink>{" "}
              </li>
              <li className="nav-item m-auto">
                <NavLink to={"/"}>Payments</NavLink>{" "}
              </li>
              <li className="nav-item  mx-2 mt-2" onClick={handleLogout}>
                Logout{" "}
                <span>
                  {" "}
                  <AiOutlineLogout />{" "}
                </span>
              </li>
            </div>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavbarPet;
