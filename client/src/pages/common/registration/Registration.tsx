import React, { useState } from "react";
import "./Registration.css";
import RegisterForm from "../../../components/registerForm/RegisterForm";
import { useAppSelector } from "../../../Redux/Store";
import { Link } from "react-router-dom";
import LoadingComp from "../../../components/loading/LoadingComp";
import LoginForm from "../../../components/LoginFrom/LoginForm";
import { ErrorBoundary } from "react-error-boundary";
import { Error } from "../../../components/error/Error";
const Registration: React.FC = () => {
  const { loading } = useAppSelector((state) => state.auth);

  const [toggle, setToggle] = useState(true);
  const handleToggle = () => {
    setToggle(!toggle);
  };
  return (
    <>
    
<ErrorBoundary  FallbackComponent={Error} >
      {loading && <LoadingComp />}

      <div className="logo">
        <Link to={"/choose-profile"}>
          <img src="../assests/logo.png" alt="" />
        </Link>
      </div>

      <div className="register_main ">
        <div className="bottom_chooseprofile_shadow">
          <div className="fence">
            <img
              src="https://th.bing.com/th/id/R.4c6ac6e965c8b02bbb531ec5c2a39770?rik=1mSJ%2boHEdh86eQ&riu=http%3a%2f%2fgetdrawings.com%2fvectors%2fvector-picket-fence-19.png&ehk=FZQ1ttzhi5Zxfir102MGQ8aTZyUKXPcKmqQVXzGGHsc%3d&risl=&pid=ImgRaw&r=0"
              alt=""
            />
          </div>
          <div className="fence_right">
            <img
              src="https://th.bing.com/th/id/R.4c6ac6e965c8b02bbb531ec5c2a39770?rik=1mSJ%2boHEdh86eQ&riu=http%3a%2f%2fgetdrawings.com%2fvectors%2fvector-picket-fence-19.png&ehk=FZQ1ttzhi5Zxfir102MGQ8aTZyUKXPcKmqQVXzGGHsc%3d&risl=&pid=ImgRaw&r=0"
              alt=""
            />
          </div>

          <div className="walkdog">
            <img src="./assests/walkdog.gif" alt="" />
          </div>
        </div>

        {toggle ? (
          <LoginForm handleToggle={handleToggle} />
        ) : (
          <RegisterForm handleToggle={handleToggle} />
        )}
      </div>
      </ErrorBoundary>
    </>
  );
};

export default Registration;
