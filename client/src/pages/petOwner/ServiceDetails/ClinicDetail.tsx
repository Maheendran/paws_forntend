import React, { useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux/Store";
import {
  BookClinicSlot,
  BookingPayment,
  CancelPayment,
  cancellingslot,
  getDoctorTimeslot,
  getclinicDetail,
} from "../../../Redux/Slice/ServiceSlice";
import "./Service.css";
import { GoLocation } from "react-icons/go";
import {
  AiFillShop,
  AiOutlineUser,
  AiOutlineBook,
  AiFillCloseCircle,
} from "react-icons/ai";
import { FcMoneyTransfer } from "react-icons/fc";
import { FaHandHoldingMedical, FaRupeeSign } from "react-icons/fa";
import { LuStethoscope } from "react-icons/lu";
import { toast, Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { getcurrentUser } from "../../../Redux/Slice/UserDetailSlice";

import { doctorDetail } from "../../../Redux/Slice/DoctorSlice";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import mapboxgl, { Marker } from "mapbox-gl";
import Map from "../../common/Map/Map";
import { useErrorBoundary } from "react-error-boundary";

const ClinicDetail = () => {
  const params = useParams<{ service?: string; id?: string }>();
  const { serviceDetail, timeslots } = useAppSelector((state) => state.service);
  const { currentUser } = useAppSelector((state) => state.user);
  const { token, choosePerson } = useAppSelector((state) => state.auth);
  const [selectedTime, setSelectedTime] = useState("");
  const dispatch = useAppDispatch();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [showmodal, setShowmodal] = useState(false);
  const [walletpopup, setWalletpopup] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [doctorFees, setDoctorFees] = useState(0);
  const [enterAmount, setEnteramount] = useState(0);
  const [paidAmount, setPaidamount] = useState(0);
  const [paymentType, setPaymentType] = useState("");
  const [confirmpayment, setConfirmpayment] = useState(false);
  const [doctordetail, setDoctordetail] = useState<doctorDetail | undefined>();

  const allTimes = [
    "10:00AM",
    "11:00AM",
    "12:00PM",
    "01:00PM",
    "02:00PM",
    "03:00PM",
    "04:00PM",
    "05:00PM",
  ];
  mapboxgl.accessToken =
    "pk.eyJ1IjoibWFoZWVuZHJhbmtwIiwiYSI6ImNsbGJ5d2Z1MjBlYXkzY3Fzd24zaGlxeHIifQ.bF2lVOg3sAFjI--Gms6C5A";

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { showBoundary } = useErrorBoundary();
  useEffect(() => {
    const currentDate = new Date();
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split("T")[0];

    setDate(tomorrowDate);
    const clinicId = params.id || "";
    dispatch(getclinicDetail({ clinicId })).then((data) => {
      if (data.payload.status === "Error") {
        showBoundary(data.payload);
      }
    });
  }, []);

  const handleDoctorTime = (data: doctorDetail) => {
    setDoctorFees(data.fees);
    setDoctorId(data._id);
    setDoctordetail(data);
    const clinicId = params.id;
    if (date === "") {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const standardDateFormat = `${year}-${month}-${day}`;
      setDate(standardDateFormat);
    }
    const formdata = {
      date,
      clinicId,
      doctorId,
    };
    dispatch(getDoctorTimeslot(formdata)).then((data) => {
      if (data.payload.status === "Error") {
        return showBoundary(data.payload);
      }
    });
  };
  //============== handle booking======================
  interface RazorpayOptions {
    key: string;
    amount: number;
    name: string;
    description: string;
    handler: (response: any) => void;
    prefill: {
      name: string | undefined;
      email: string;
    };
    notes: {
      address: string;
    };
    theme: {
      color: string;
    };
  }
  const handlebooking = () => {
    setShowmodal(!showmodal);
    setConfirmpayment(!confirmpayment);
  };
  // full online payment===========
  const handleOnlinePayment = (paidAmount: number) => {
    setWalletpopup(false);
    setShowmodal(false);
    setConfirmpayment(false);
    const options: RazorpayOptions = {
      key: "rzp_test_PDb2mkTumdooCe",
      amount: paidAmount * 100,
      name: "Paws",
      description: "Test Transaction",
      handler: function (response: any) {
        const formvalue = {
          credited_id: params?.id || "",
          debited_id: currentUser?._id || "",
          debited_name: currentUser?.username || "",
          credited_name: serviceDetail[0]?.clinicName || "",
          amount: doctorFees,
          paymentType: paymentType,
          time: Date.now(),
          date: date,
          status: "Booked",
          type: "Paid",
        };

        dispatch(BookingPayment(formvalue)).then((data) => {
          if (data.payload.status === "Error") {
            return showBoundary(data.payload);
          }
        });
        const clinicId = params.id;
        const formdata = {
          date,
          clinicId,
          doctorId,
          time,
        };
        dispatch(BookClinicSlot(formdata)).then((data) => {
          if (data.payload.status === "Error") {
            showBoundary(data.payload);
          }

          const formdata = {
            date,
            clinicId,
            doctorId,
          };
          dispatch(getDoctorTimeslot(formdata)).then((data) => {
            if (data.payload.status === "Error") {
              return showBoundary(data.payload);
            }
            setTime("");
            Swal.fire(
              "Slot Booked!",
              "Your time slot has been booked.",
              "success"
            );
            dispatch(getcurrentUser()).then((data) => {
              if (data.payload.status === "Error") {
                return showBoundary(data.payload);
              }
            });
          });
        });
      },
      prefill: {
        name: currentUser?.username,
        email: "john@example.com",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpayInstance = new (window as any).Razorpay(options);
    // Trigger payment
    razorpayInstance.open();
  };
  // full amount wallet booking===========
  const handleWalletPayment = () => {
    setWalletpopup(false);
    setShowmodal(false);
    setConfirmpayment(false);
    const formvalue = {
      credited_id: params?.id || "",
      debited_id: currentUser?._id || "",
      debited_name: currentUser?.username || "",
      credited_name: serviceDetail[0]?.clinicName || "",
      amount: doctorFees,
      paymentType: "wallet",
      time: Date.now(),
      date: date,
      status: "Booked",
      type: "Paid",
    };
    dispatch(BookingPayment(formvalue)).then((data) => {
      if (data.payload.status === "Error") {
        return showBoundary(data.payload);
      }
    });
    const clinicId = params.id;
    const formdata = {
      date,
      clinicId,
      doctorId,
      time,
    };
    dispatch(BookClinicSlot(formdata)).then((data) => {
      if (data.payload.status === "Error") {
        return showBoundary(data.payload);
      }

      const formdata = {
        date,
        clinicId,
        doctorId,
      };
      dispatch(getDoctorTimeslot(formdata)).then((data) => {
        if (data.payload.status === "Error") {
          return showBoundary(data.payload);
        }

        setTime("");
        Swal.fire("Slot Booked!", "Your time slot has been booked.", "success");
        dispatch(getcurrentUser()).then((data) => {
          if (data.payload.status === "Error") {
            return showBoundary(data.payload);
          }
        });
      });
    });
  };
  // partial amount from wallter and online
  const handlePartialpayment = () => {
    setWalletpopup(false);
    setShowmodal(false);
    setConfirmpayment(false);
    const options: RazorpayOptions = {
      key: "rzp_test_PDb2mkTumdooCe",
      amount: paidAmount * 100,
      name: "Paws",
      description: "Test Transaction",
      handler: function (response: any) {
        const formvalue = {
          credited_id: params?.id || "",
          debited_id: currentUser?._id || "",
          debited_name: currentUser?.username || "",
          credited_name: serviceDetail[0]?.clinicName || "",
          amount: doctorFees,
          paymentType: "wallet&online",
          time: Date.now(),
          date: date,
          status: "Booked",
          type: "Paid",
          enterAmount: enterAmount,
        };

        dispatch(BookingPayment(formvalue)).then((data) => {
          if (data.payload.status === "Error") {
            return showBoundary(data.payload);
          }
        });

        const clinicId = params.id;
        const formdata = {
          date,
          clinicId,
          doctorId,
          time,
        };
        dispatch(BookClinicSlot(formdata)).then((data) => {
          if (data.payload.status === "Error") {
            return showBoundary(data.payload);
          }
          const formdata = {
            date,
            clinicId,
            doctorId,
          };
          dispatch(getDoctorTimeslot(formdata)).then((data) => {
            if (data.payload.status === "Error") {
              return showBoundary(data.payload);
            }
            setTime("");
            Swal.fire(
              "Slot Booked!",
              "Your time slot has been booked.",
              "success"
            );
            dispatch(getcurrentUser()).then((data) => {
              if (data.payload.status === "error") {
                showBoundary(Error);
              }
            });
          });
        });
      },
      prefill: {
        name: currentUser?.username,
        email: "john@example.com",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpayInstance = new (window as any).Razorpay(options);
    // Trigger payment
    razorpayInstance.open();
  };
  const handleConfirmBooking = () => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      html: `
    <p>Date ${date}</p>
    <p>Time ${time}</p>
    <p>Payment ${paymentType}</p>
  `,
      confirmButtonText: "Yes, confirm",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        if (paymentType === "online" && enterAmount === 0) {
          return handleOnlinePayment(paidAmount);
        }

        if (enterAmount == doctorFees) {
          return handleWalletPayment();
        } else {
          return handlePartialpayment();
        }
      }
    });
  };
  // cancel booking
  const handleCancelBook = (time: string, slotId: string) => {
    setWalletpopup(false);
    setShowmodal(false);
    setConfirmpayment(false);
    Swal.fire({
      title: "Booking cancel?",
      icon: "warning",
      html: `
    <p>Date ${date}</p>
    <p>Time ${time}</p>
  `,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const clinicId = params.id;
        const formdata = {
          date,
          clinicId,
          doctorId,
          slotId,
        };

        dispatch(cancellingslot(formdata)).then((data) => {
          if (data.payload.status === "Error") {
            return showBoundary(data.payload);
          }

          if (data.payload.status === "success") {
            const clinicId = params.id;
            toast.success(data.payload.message);
            const formdata = {
              date,
              clinicId,
              doctorId,
            };

            const formvalue = {
              credited_id: currentUser?._id || "",
              debited_id: params?.id || "",
              debited_name: serviceDetail[0]?.clinicName || "",
              credited_name: currentUser?.username || "",
              amount: doctorFees,
              paymentType: "wallet",
              time: Date.now(),
              date: date,
              status: "cancelled",
              type: "Refund",
            };

            dispatch(CancelPayment(formvalue)).then((data) => {
              if (data.payload.status === "Error") {
                return showBoundary(data.payload);
              }
            });

            dispatch(getDoctorTimeslot(formdata)).then((data) => {
              if (data.payload.status === "Error") {
                return showBoundary(data.payload);
              }

              dispatch(getcurrentUser());
              Swal.fire("Cancelled!", "Booking cancelled", "success");
            });
          }
        });
      }
    });
  };
  const handleTime = (time: string) => {
    setTime(time);
    setSelectedTime(time);
  };
  // payment optio choose
  const handlePaymentType = (type: string) => {
    setPaymentType(type);
    if (type === "wallet") {
      setWalletpopup(!walletpopup);
    }
    if (type === "online") {
      setPaidamount(doctorFees);
      setWalletpopup(false);
    }
  };
  // input wallet amount entering
  const handleWalletAmount = (e: any) => {
    const value = e.target.value;
    setEnteramount(value);
    setPaidamount(doctorFees - value);
    const wallet = currentUser?.wallet || 0;
    if (value > wallet) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };
  const handleDateChange = (dateValue: any) => {
    setDate(dayjs(dateValue).format("YYYY-MM-DD"));
    const date = dayjs(dateValue).format("YYYY-MM-DD");
    const clinicId = params.id;
    const formdata = {
      date,
      clinicId,
      doctorId,
    };

    dispatch(getDoctorTimeslot(formdata)).then((data) => {
      if (data.payload.status === "Error") {
        return showBoundary(data.payload);
      }
    });
  };
  const shouldDisableDate = (date: any) => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return date.isBefore(today, "day");
  };
  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current || "",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [77.5946, 12.9716],
      zoom: 12,
    });

    const marker = new mapboxgl.Marker()
      .setLngLat([77.5946, 12.9716])
      .addTo(map.current);
  }, []);
  return (
    <>
      <Toaster toastOptions={{ duration: 3000 }} />
      <div className="container-fluid main_bg">
        <div className="row mt-3">
          <div className="col-6 store_card m-auto ">
            <div className="row m-auto">
              <div className="col-6 m-3 ms-auto store_profile_box">
                <img
                  className="img-fluid"
                  src={serviceDetail[0]?.profileImage}
                  alt=""
                />
              </div>
              <div className="col-5  m-auto text-center">
                <h3>{serviceDetail[0]?.clinicName}</h3>
                <p>
                  {" "}
                  <span>
                    <img
                      className="img-fluid"
                      style={{ width: "20px", height: "20px" }}
                      src="https://th.bing.com/th/id/R.7cde9e180c9f6033600de228f27fc684?rik=1r%2fwHf5hcXDdQQ&riu=http%3a%2f%2fclipartmag.com%2fimages%2flocation-icon-png-23.png&ehk=6f3Me%2fzYpj1%2bdJOq8Aa1rClCQR0DK9ga47Q7xXDZVV8%3d&risl=&pid=ImgRaw&r=0"
                      alt=""
                    />
                  </span>{" "}
                  {serviceDetail[0]?.address[0]?.city}
                </p>
                <p>
                  {" "}
                  <span>
                    <img
                      style={{ width: "20px", height: "20px" }}
                      src="https://th.bing.com/th/id/R.c87cb7df0f8e468dcf8bf127462adb8a?rik=9%2bhE0yWfdmJOCA&riu=http%3a%2f%2ficons.iconarchive.com%2ficons%2fpaomedia%2fsmall-n-flat%2f1024%2fshop-icon.png&ehk=ZWgtx3VBsxiNBdKVrPHDrs5RsMtuQPuBwCPlIbVV1ss%3d&risl=&pid=ImgRaw&r=0"
                      alt=""
                    />
                  </span>{" "}
                  Open 10AM
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container  mt-2 slot_booking_main">
          <div className="row">
            <div className="col-12">
              <h2 className="text-center">Book a slot</h2>
            </div>

            <div className="row">
              <div className="col-4 calender_box mx-auto mt-3 bg-light ">
                <div className="col-12 text-center ">
                  <h4>Choose date</h4>
                </div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    onChange={handleDateChange}
                    shouldDisableDate={shouldDisableDate}
                  />
                </LocalizationProvider>
              </div>

              <div className="col-3 me-auto">
                <div className="col-12 text-center">
                  <h4>Choose doctor</h4>
                </div>

                <div className="row d-flex justify-content-center">
                  {serviceDetail[0]?.doctorlist.map((data: any) => {
                    if (
                      data.verified === "verified" &&
                      (date > data.leave?.endDate ||
                        date < data.leave?.startDate)
                    ) {
                      return (
                        <div
                          className={`row m-2 ${
                            doctorId === data._id
                              ? "selected-doctor"
                              : "Unselected-doctor"
                          }`}
                          key={data._id}
                          onClick={() => handleDoctorTime(data)}
                        >
                          <div className={"doctor_pic m-1 "}>
                            <img
                              className="img-fluid"
                              src={
                                data.profileImage
                                  ? data.profileImage
                                  : "https://www.pngitem.com/pimgs/m/198-1985222_avatar-doctor-png-transparent-png.png"
                              }
                              alt=""
                            />
                          </div>
                          <div className="col-6 my-auto text-start">
                            <p style={{ fontSize: "0.7rem" }}>{data.name}</p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* =======================choose date==========================*/}

          <div className="row ">
            {doctorId && date && (
              <>
                <div className="col-9  mt-4">
                  <div className="p-5">
                    <div className="container mt-4  text-center">
                      <div className="row">
                        {allTimes.map((time, index) => {
                          const isCurrentUser = timeslots[0]?.Bookings.some(
                            (slot: any) =>
                              slot.time === time &&
                              slot.user_id === currentUser._id &&
                              slot.status !== "cancelled"
                          );

                          const bookingForTime = timeslots[0]?.Bookings.find(
                            (booking: any) =>
                              booking.time === time &&
                              booking.status !== "cancelled"
                          );
                          return (
                            <div className="col-1 m-auto" key={index}>
                              {choosePerson === "PetOwner" ? (
                                <button
                                  onClick={() => handleTime(time)}
                                  disabled={bookingForTime}
                                  className={
                                    bookingForTime
                                      ? "booked"
                                      : selectedTime === time
                                      ? "selected"
                                      : "unbooked"
                                  }
                                >
                                  {time}
                                </button>
                              ) : (
                                <button
                                  disabled={bookingForTime}
                                  className={
                                    bookingForTime
                                      ? "booked"
                                      : selectedTime === time
                                      ? "selected"
                                      : "unbooked"
                                  }
                                >
                                  {time}
                                </button>
                              )}

                              {isCurrentUser && (
                                <button
                                  className="cancel_btn"
                                  onClick={() =>
                                    handleCancelBook(time, bookingForTime._id)
                                  }
                                >
                                  <AiFillCloseCircle size={"2rem"} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="col-3 mx-auto mt-4">
                      {!token && (
                        <NavLink to={"/choose-profile"}>
                          <button className="btn booking_btn">
                            Please login
                          </button>
                        </NavLink>
                      )}
                    </div>

                    {showmodal && (
                      <div className="row  text-center payment_box mt-3 p-2">
                        <h4>Payment</h4>
                        <p className="mt-2 text-muted">
                          {" "}
                          Amount need to pay :{" "}
                          <span>
                            <FaRupeeSign size={"1.4rem"} />
                          </span>
                          {doctorFees}{" "}
                        </p>
                        <div className="col-6 text-center mx-auto">
                          <div className="row">
                            <div className="col-6">
                              <button
                                className={`payment_gif mx-2 ${
                                  paymentType === "wallet"
                                    ? "choosedPayment"
                                    : ""
                                }`}
                                onClick={() => handlePaymentType("wallet")}
                              >
                                {" "}
                                <span>
                                  <img src="../assests/wallet.gif" alt="" />
                                </span>{" "}
                                Wallet
                              </button>
                            </div>

                            <div className="col-6">
                              <button
                                className={`payment_gif mx-2 ${
                                  paymentType === "online"
                                    ? "choosedPayment"
                                    : ""
                                }`}
                                onClick={() => handlePaymentType("online")}
                              >
                                <span>
                                  <img src="../assests/gpay.gif" alt="" />
                                </span>
                                Online
                              </button>
                            </div>
                          </div>
                        </div>

                        {walletpopup && (
                          <div className="row">
                            <p className="mt-2">
                              Wallet balance :{" "}
                              <span>
                                <FaRupeeSign size={"1rem"} />
                              </span>
                              {currentUser.wallet}
                            </p>

                            <div className="col-3 m-auto text-center">
                              <input
                                type="number"
                                className="form-control text-center"
                                placeholder="Enter amount"
                                onChange={(e) => handleWalletAmount(e)}
                              />
                            </div>

                            {showWarning && (
                              <p
                                style={{ color: "red" }}
                                className="amount_waring"
                              >
                                Insufficient amount in wallet
                              </p>
                            )}

                            {doctorFees - enterAmount !== 0 && (
                              <p className="mt-3">
                                Balance amount need to pay :{" "}
                                {doctorFees - enterAmount}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {confirmpayment ? (
                      <>
                        {doctorId && date && time && token && (
                          <div className="col-3 mx-auto mt-4">
                            <button
                              className="btn booking_btn"
                              onClick={handleConfirmBooking}
                            >
                              Confirm booking
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {doctorId && date && time && token && (
                          <div className="col-4 mx-auto mt-4">
                            <button
                              className="btn booking_btn"
                              onClick={handlebooking}
                            >
                              Procced to Payment
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="col-3 doctor_main_card">
                  <div className="doctor_profile_pic">
                    <img
                      src={
                        doctordetail?.profileImage
                          ? doctordetail?.profileImage
                          : "https://www.pngitem.com/pimgs/m/198-1985222_avatar-doctor-png-transparent-png.png"
                      }
                      alt=""
                    />
                  </div>
                  <p>
                    {" "}
                    <span>
                      <AiOutlineUser />
                    </span>{" "}
                    Name : {doctordetail?.name}
                  </p>
                  <p>
                    {" "}
                    <span>
                      <LuStethoscope />
                    </span>{" "}
                    Experience : {doctordetail?.experience}
                  </p>
                  <p>
                    <span>
                      <AiOutlineBook />
                    </span>{" "}
                    Qualification : {doctordetail?.qualification}
                  </p>
                  <p>
                    <span>
                      <FaHandHoldingMedical />{" "}
                    </span>{" "}
                    Specialized : {doctordetail?.specialized}
                  </p>
                  <p>
                    {" "}
                    <span>
                      <FcMoneyTransfer />
                    </span>{" "}
                    Service charge : {doctordetail?.fees}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/*  */}
        <div className="row  mt-4">
          <div className="col-6 mx-auto text-center">
            <div className="row m-4">
              <h3>For more details</h3>
            </div>
            <div className="row">
              <div className="col-6 text-start">
                <p>
                  Address:{" "}
                  <span className="text-muted">
                    {serviceDetail[0]?.address[0]?.adressLine}
                  </span>{" "}
                </p>
                <p>
                  City:{" "}
                  <span className="text-muted">
                    {serviceDetail[0]?.address[0]?.city}
                  </span>{" "}
                </p>
                <p>
                  Country:{" "}
                  <span className="text-muted">
                    {serviceDetail[0]?.address[0]?.country}
                  </span>{" "}
                </p>
                <p>
                  Pincode:{" "}
                  <span className="text-muted">
                    {serviceDetail[0]?.address[0]?.pincode}
                  </span>{" "}
                </p>
                <p>
                  Contact number :{" "}
                  <span className="text-muted">
                    {serviceDetail[0]?.address[0]?.mobile}
                  </span>{" "}
                </p>
              </div>
              <div className="col-6 ms-auto">
                <div ref={mapContainer} className="map-container"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClinicDetail;
