import React, { useEffect, useRef, useState } from "react";
import "./OtpSection.css";
import { useAppDispatch, useAppSelector } from "../../Redux/Store";
// import { useNavigate } from 'react-router-dom';
import { resendOtp, verifyOtp } from "../../Redux/Slice/AuthSlice";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const OtpSection: React.FC<{ email: string }> = ({ email }) => {
  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);
  const input3Ref = useRef<HTMLInputElement>(null);
  const input4Ref = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { _id, choosePerson, otpTime, otpType } = useAppSelector(
    (state) => state.auth
  );

  const handleSubmit = () => {
    const otpValue1 = input1Ref.current?.value || "";
    const otpValue2 = input2Ref.current?.value || "";
    const otpValue3 = input3Ref.current?.value || "";
    const otpValue4 = input4Ref.current?.value || "";

    const otpvalues = {
      accountType: choosePerson,
      otp: otpValue1 + otpValue2 + otpValue3 + otpValue4,
      _id: _id,
    };
    dispatch(verifyOtp(otpvalues)).then((data) => {
      if (data.payload.status === "success") {
        if (otpType === "forgotpassword") {
          return navigate("/reset-password");
        }
        navigate("/register");
      } else {
        toast.error("invalid otp");
      }
    });
  };

  const [avilabe, setAvilable] = useState(true);

  const [remainingTime, setRemainingTime] = useState("00");
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      let differenceInSeconds = Math.floor(
        (60000 + Number(otpTime) - currentTime) / 1000
      );
      if (differenceInSeconds <= 0) {
        clearInterval(intervalId);
        setRemainingTime("00");
        localStorage.removeItem("otpVerified");
        localStorage.removeItem("otpTime");
        setAvilable(false);
      } else {
        const seconds = differenceInSeconds % 60;

        const formattedTime = `${String(seconds).padStart(2, "0")}`;
        setRemainingTime(formattedTime);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [otpTime]);

  const handleResend = () => {
    setAvilable(true);
    const otpvalues = {
      id: _id,
      accountType: choosePerson,
    };
    dispatch(resendOtp(otpvalues));
    toast.success("OTP sended to the mail");
  };

  return (
    <>
      <Toaster toastOptions={{ duration: 3000 }} />

      <div className="col-4 m-auto  mt-5 otp_container">
        <div className="d-flex justify-content-center align-items-center container">
          <div className=" py-5 px-3">
            <h1
              className={
                Number(remainingTime) > 20 ? "goodtime" : "warninttime"
              }
            >
              {remainingTime}
              <span style={{ fontSize: "1.4rem" }}>s</span>{" "}
            </h1>
            <h5 className="m-0">Email verification</h5>
            <span className="mobile-text">
              Enter the code we just send on your email
              <p className="text-dark"> {email}</p>
            </span>

            <div className="d-flex flex-row mt-3">
              <div className="col-9 d-flex flex m-auto">
                <input
                  type="text"
                  className="form-control text-center"
                  ref={input1Ref}
                  maxLength={1}
                />
                <input
                  type="text"
                  className="form-control text-center"
                  ref={input2Ref}
                  maxLength={1}
                />
                <input
                  type="text"
                  className="form-control text-center"
                  ref={input3Ref}
                  maxLength={1}
                />
                <input
                  type="text"
                  className="form-control text-center"
                  ref={input4Ref}
                  maxLength={1}
                />
              </div>
            </div>
            {avilabe === true && (
              <button
                onClick={handleSubmit}
                className="btn otp_btn text-light mt-3"
              >
                Verify otp
              </button>
            )}
            <div className="text-center mt-2">
              {avilabe === false && (
                <>
                  <span className="d-block mobile-text">
                    Don't receive the code?
                  </span>
                  <button
                    className=" btn font-weight-bold border-0 text-danger cursor"
                    onClick={handleResend}
                  >
                    Resend
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtpSection;
