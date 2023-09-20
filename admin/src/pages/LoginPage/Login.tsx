import React from "react";
import "./Login.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { useAppDispatch, useAppSelector } from "../../Redux/Store";
import { loginAdmin } from "../../Redux/Slice/AuthSlice";

const Login: React.FC<{}> = () => {
  const auth = useAppSelector((state) => state.auth);
  const schema = Joi.object({
    email: Joi.string().min(5).max(200).required().label("email"),
    password: Joi.string().min(4).max(15).required().label("password"),
  });

  interface formdata {
    email: string;
    password: string;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formdata>({ resolver: joiResolver(schema) });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleSubmited = (data: formdata) => {
    dispatch(loginAdmin(data)).then((data) => {
      if (data.payload.status === "success") {
        navigate("/");
      }
    });
  };

  return (
    <>
      <div className="register_main">
        <div className="container-fluid">
          <div className="col-1 me-auto ">
            <NavLink to="/">
              <img src="./assests/logo.png" alt="logo" height="50" />
            </NavLink>
          </div>
        </div>
        <div className="container mt-5">
          <div className="row">
            <section className="auth_form">
              <div className="container ">
                <div className="row d-flex justify-content-center align-items-center">
                  <div className="col-lg-12 col-xl-11">
                    <div className="card text-black">
                      <div className="card-body p-md-5">
                        <div className="row justify-content-center">
                          <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                            <p className="text-center h1 fw-bold mb-2 mx-1 mx-md-4 mt-2">
                              Login
                            </p>

                            <form
                              className="mx-1 mx-md-4"
                              onSubmit={handleSubmit((data) =>
                                handleSubmited(data)
                              )}
                            >
                              <div className="d-flex flex-row align-items-center mb-2">
                                <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                <div className="form-outline flex-fill mb-0">
                                  <label className="form-label"> Email</label>
                                  <input
                                    type="email"
                                    id="form3Example3c"
                                    className="form-control"
                                    {...register("email")}
                                  />
                                  {errors.email && (
                                    <p className="error_message mt-2">
                                      {errors.email.message}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="d-flex flex-row align-items-center mb-2">
                                <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                                <div className="form-outline flex-fill mb-0">
                                  <label className="form-label">Password</label>
                                  <input
                                    type="password"
                                    id="form3Example4c"
                                    className="form-control"
                                    {...register("password")}
                                  />
                                  {errors.password && (
                                    <p className="error_message mt-2">
                                      {errors.password.message}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="d-flex justify-content-center mx-4 mb-1 mb-lg-3 ">
                                <button
                                  type="submit"
                                  className="btn btn-primary"
                                >
                                  Login
                                </button>
                              </div>
                            </form>
                            <p
                              className="error_message"
                              style={{ fontSize: "0.7rem" }}
                            >
                              {auth.message}
                            </p>
                          </div>
                          <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                            <img
                              src="./assests/logo.png"
                              className="img-fluid"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
