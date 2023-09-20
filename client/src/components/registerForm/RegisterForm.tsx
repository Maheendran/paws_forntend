import React, { useEffect, useState } from "react";
import "./RegisterForm.css";
import { useAppDispatch, useAppSelector } from "../../Redux/Store";
import { createUser } from "../../Redux/Slice/AuthSlice";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { useErrorBoundary } from "react-error-boundary";


interface ChildProps {
  handleToggle: () => void;
}

const schema = Joi.object({
  username: Joi.string().min(5).max(20).label("username"),
  email: Joi.string().min(5).max(200).required().label("email"),
  mobile: Joi.string().min(10).max(10).required().label("mobile"),
  password: Joi.string().min(4).max(15).required().label("password"),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .label("confirmPassword"),
  shopName: Joi.string().min(4).max(25).label("shopName"),
  ownerName: Joi.string().min(4).max(25).label("ownerName"),
  clinicName: Joi.string().min(4).max(25).label("shopName"),
});

const RegisterForm: React.FC<ChildProps> = ({ handleToggle }) => {
  interface formdatas {
    accountType: string;
    username: string;
    email: string;
    mobile: string;
    password: string;
    confirmPassword: string;
    shopName: string;
    ownerName: string;
    clinicName: string;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formdatas>({ resolver: joiResolver(schema) });

  const { choosePerson } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [backendError, setBackendError] = useState("");
const {showBoundary}=useErrorBoundary()
  // =======================================//
  useEffect(() => {
    if (!choosePerson) {
      navigate("/choose-profile"); }
  }, [choosePerson]);
  // =======================================//
  const handleSubmited = (data: formdatas) => {
    data.accountType = choosePerson;
    dispatch(createUser(data)).then((data) => {
      if (data.payload.status === "Error") {
        return showBoundary(data.payload);
      }
      if (data.payload.status === "success") {
        navigate("/otp");
      } else {
        setBackendError(data.payload.message);
      }
    });
  };
  return (
    <>
      <div
        className={
          choosePerson === "PetOwner" ? "user_registerform" : "registerform"
        }
      >


        <h1 className="text-center">SignUp</h1>
        <form onSubmit={handleSubmit((data) => handleSubmited(data))}>
          <div className="row text-start ">
            {choosePerson === "PetOwner" && (
              <>
                <div className="col-12 mt-3">
                  <label className="mt-2 label"> Username</label>
                  <input
                    {...register("username")}
                    type="text"
                    className="form-control mx-2"
                  />
                </div>
                {errors.username && (
                  <p className="error_message mt-2">
                    {errors.username.message}
                  </p>
                )}
              </>
            )}
            <div className="row">
              {choosePerson === "Grooming" ? (
                <div className="col-6 mt-3">
                  <label className="mt-2 label"> Shop name</label>
                  <input
                    {...register("shopName")}
                    type="text"
                    className="form-control mx-2"
                  />
                  {errors.shopName && (
                    <p className="error_message mt-2">
                      {errors.shopName.message}
                    </p>
                  )}
                </div>
              ) : (
                ""
              )}
              {choosePerson === "Grooming" && (
                <div className="col-6 mt-3 section_input">
                  <label className="mt-2 label"> Owner name</label>
                  <input
                    {...register("ownerName")}
                    type="text"
                    className="form-control mx-2"
                  />
                  {errors.ownerName && (
                    <p className="error_message mt-2">
                      {errors.ownerName.message}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="row">
              {choosePerson === "Clinic" && (
                <div className="col-6 mt-3">
                  <label className="mt-2 label"> Clinic name</label>
                  <input
                    {...register("clinicName")}
                    type="text"
                    className="form-control mx-2"
                  />
                  {errors.clinicName && (
                    <p className="error_message mt-2">
                      {errors.clinicName.message}
                    </p>
                  )}
                </div>
              )}
              {choosePerson === "Clinic" && (
                <div className="col-6 mt-3">
                  <label className="mt-2 label"> Owner name</label>
                  <input
                    {...register("ownerName")}
                    type="text"
                    className="form-control mx-2"
                  />
                  {errors.ownerName && (
                    <p className="error_message mt-2">
                      {errors.ownerName.message}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="row">
              <div className="col-6">
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
              <div className="col-6">
                <label className="mt-2 label"> Mobile</label>
                <input
                  {...register("mobile")}
                  type="number"
                  className="form-control mx-2"
                />
                {errors.mobile && (
                  <p className="error_message mt-2">{errors.mobile.message}</p>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <label className="mt-2 label"> Password</label>
                <input
                  {...register("password")}
                  type="password"
                  className="form-control mx-2"
                />
                {errors.password && (
                  <p className="error_message mt-2">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="col-6">
                <label className="mt-2 label"> Confirm password</label>
                <input
                  {...register("confirmPassword")}
                  type="password"
                  className="form-control mx-2"
                />
                {errors.confirmPassword && (
                  <p className="error_message mt-2">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-11 m-auto">
              <button className="btn text-dark mt-3 register_btn" type="submit">
                Signup
              </button>
            </div>
          </div>
        </form>

        <p className="error_message">{backendError}</p>

        <p
          className="mt-4  mx-auto text-center"
          style={{ fontSize: "0.8rem", color: "grey" }}
        >
          Already have an account{" "}
          <span
            style={{ color: "black", cursor: "pointer" }}
            onClick={handleToggle}
          >
            Login
          </span>
        </p>
      
      </div>
    </>
  );
};

export default RegisterForm;
