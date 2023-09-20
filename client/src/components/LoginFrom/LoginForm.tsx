import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/Store";
import {
  forgotpasswordOtp,
  googlesignIn,
  loginUser,
} from "../../Redux/Slice/AuthSlice";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { toast, Toaster } from "react-hot-toast";
import { AiFillCloseCircle } from "react-icons/ai";
import "./LoginForm.css";
import {  useErrorBoundary } from "react-error-boundary";
interface ChildProps {
  handleToggle: () => void;
}
export interface googlelogin {
  accountType: string;
  email: string;
  username: string;
}

const LoginForm: React.FC<ChildProps> = ({ handleToggle }) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(200).required().label("email"),
    password: Joi.string().min(4).max(15).required().label("password"),
  });

  interface formdata {
    accountType: string;
    email: string;
    password: string;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formdata>({ resolver: joiResolver(schema) });

  const { choosePerson } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [backendError, setBackendError] = useState("");

  // =======================================//

  useEffect(() => {
    if (!choosePerson) {
    
      navigate("/choose-profile");
    }
  }, [choosePerson]);

  // =======================================//
const {showBoundary}=useErrorBoundary()
  const handleSubmited = (data: formdata) => {
    const cleanedString = choosePerson.replace(/^"(.*)"$/, "$1");
    data.accountType = cleanedString;
    dispatch(loginUser(data)).then((data) => {
  
        if (data.payload.status === "Error") {
          return showBoundary(data.payload);
        }
    
      if (data.payload.status === "success") {
        if (data.payload.data.accountType === "PetOwner") {
          navigate("/");
        }else if (data.payload.data.accountType === "Clinic") {
          navigate("/clinic");
        }
      } else {
        setBackendError(data.payload.message);
      }
    });
  };
  const handleGoogle = (decoded: any) => {
    decoded.accountType = choosePerson;
    const data: googlelogin = {
      accountType: choosePerson,
      email: decoded.email,
      username: decoded.name,
    };

    dispatch(googlesignIn(data)).then((data) => {
      if (data.payload.status === "Error") {
        return showBoundary(data.payload);
      }
      if (data.payload.status === "success") {
        if (data.payload.userdata.accountType === "Clinic") {
          navigate("/clinic");
        }  else if (data.payload.userdata.accountType === "PetOwner") {
          navigate("/");
        }
      } else {
        setBackendError(data.payload.message);
      }
    });
  };

  const [showmodal, setShowmodal] = useState(false);
  const [tempemail, setTempemail] = useState("");

  const handleforgotPass = () => {
    localStorage.setItem("email", tempemail);
    const values = {
      email: tempemail,
      accountType: choosePerson,
    };

    dispatch(forgotpasswordOtp(values)).then((data) => {
      if (data.payload.status === "Error") {
        return showBoundary(data.payload);
      }
      console.log(data.payload, "data.payload");
      if (data.payload.status === "success") {
        setShowmodal(!showmodal);
        navigate("/otp");
      } else {
        toast.error(data.payload.message);
      }
    });
  };

  return (
    <>




      <Toaster toastOptions={{ duration: 4000 }} />
      <div
        className={
          choosePerson === "PetOwner" ? "user_registerform" : "registerform"
        }
      >
        <h1 className="text-center">Login</h1>

        <form onSubmit={handleSubmit((data) => handleSubmited(data))}>
          <div className="row text-start ">
            <div className="col-12">
              <label className="mt-2 label"> Email</label>
              <input
                {...register("email")}
                type="email"
                className="form-control mx-2"
              />
              {errors.email && (
                <p className="error_message mt-2">{errors.email.message}</p>
              )}
            </div>
            <div className="col-12">
              <label className="mt-2 label"> Password</label>
              <input
                {...register("password")}
                type="password"
                className="form-control mx-2"
              />
              {errors.password && (
                <p className="error_message mt-2">{errors.password.message}</p>
              )}
            </div>
          </div>
          <p
            className="ms-auto text-end mt-2"
            style={{ fontSize: "0.8rem", cursor: "pointer" }}
            onClick={() => setShowmodal(!showmodal)}
          >
            Forgot password
          </p>

          <div className="row">
            <div className="col-11 m-auto">
              <button className="btn text-dark mt-3 register_btn" type="submit">
                Login
              </button>
            </div>
          </div>
        </form>
        <p className="error_message mt-3">{backendError}</p>

        <div className="row">
          <div className="col-12 m-auto  text-center">
            <p>Or</p>
          </div>
          <div className="row">
            <div className="col-7  mx-auto  d-flex justify-content-center">
              <GoogleOAuthProvider clientId="585711333789-j332iagr0aio3ebf0rkv0ct6jshjugem.apps.googleusercontent.com">
                <GoogleLogin
                  onSuccess={(credentialResponse: any) => {
                    var decoded = jwtDecode(credentialResponse.credential);
                    handleGoogle(decoded);
                  }}
                  onError={() => {
                    toast.error("Login Failed");
                  }}
                />
              </GoogleOAuthProvider>
            </div>
          </div>
        </div>
        <p
          className="mt-4  mx-auto text-center"
          style={{ fontSize: "0.8rem", color: "grey" }}
        >
          Create an account ?{" "}
          <span
            style={{ color: "black", cursor: "pointer" }}
            onClick={handleToggle}
          >
            Signup
          </span>
        </p>
      </div>

      {showmodal && (
        <div className="modal_parent">
          <div className="modal_form">
            <div className="close_btn">
              <AiFillCloseCircle
                onClick={() => setShowmodal(!showmodal)}
                size={"1.5rem"}
              />
            </div>
            <h3 className="text-center mt-2">{"Registered email"}</h3>
            <input
              type="email"
              className="form-control mt-3"
              onChange={(e) => setTempemail(e.target.value)}
              placeholder="registered email.."
              required
            />
            <div className="row m-auto mt-4">
              <div className="col-4 mx-auto text-center">
                <button
                  className=" btn text-dark mt-3 register_btn"
                  onClick={handleforgotPass}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
   
    </>
  );
};

export default LoginForm;
