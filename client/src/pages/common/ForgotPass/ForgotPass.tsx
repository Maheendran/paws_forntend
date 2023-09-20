import React, { useEffect } from "react";
import "./ForgotPass.css";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux/Store";
import { resetPassword } from "../../../Redux/Slice/AuthSlice";
import { toast } from "react-hot-toast";
import { useErrorBoundary } from "react-error-boundary";
const ForgotPass = () => {
  const schema = Joi.object({
    password: Joi.string().min(4).max(15).required().label("password"),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .label("confirmPassword"),
  });

  interface formdata {
    accountType: string;
    confirmPassword: string;
    password: string;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formdata>({ resolver: joiResolver(schema) });
  const navigate = useNavigate();
  const {showBoundary}=useErrorBoundary()
  const { _id, choosePerson } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const handleSubmited = (data: formdata) => {
    const resetValues = {
      id: _id,
      password: data.password,
      accountType: choosePerson,
    };
    dispatch(resetPassword(resetValues)).then((data) => {
      if (data.payload.status === "Error") {
        return showBoundary(data.payload);
      }
      if (data.payload.status === "success") {
        navigate("/register");
      } else {
        toast.error(data.payload.status);
      }
    });
  };

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

        <div className="row m-auto  mt-5 ">
          <div className="col-4 m-auto otp_container  mt-5">
            <h3 className="text-center mt-3">Reset password</h3>
            <form onSubmit={handleSubmit((data) => handleSubmited(data))}>
              <label className="text-start label">Password</label>
              <input
                type="password"
                {...register("password")}
                className="form-control mt-2"
                placeholder="password"
              />
              {errors.password && (
                <p className="error_message mt-2">{errors.password.message}</p>
              )}
              <label className="text-start label">Confrim Password</label>
              <input
                type="password"
                {...register("confirmPassword")}
                className="form-control mt-2"
                placeholder="confirm password"
              />
              {errors.confirmPassword && (
                <p className="error_message mt-2">
                  {errors.confirmPassword.message}
                </p>
              )}
              <div className="row d-flex justify-content-center">
                <div className="col-3 d-flex text-center m-3">
                  <button className="m-auto  btn text-dark mt-3 register_btn ">
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPass;
