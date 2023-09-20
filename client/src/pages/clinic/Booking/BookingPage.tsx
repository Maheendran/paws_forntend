import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux/Store";
import {
  BookClinicSlot,
  cancellingslot,
  CancelPayment,
  getDoctorTimeslot,
} from "../../../Redux/Slice/ServiceSlice";
import { toast, Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { GetallDoctors } from "../../../Redux/Slice/DoctorSlice";
import { AiFillCloseCircle } from "react-icons/ai";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import { useErrorBoundary } from "react-error-boundary";
import LoadingComp from "../../../components/loading/LoadingComp";

// import './Service.css'
const BookingPage: React.FC = () => {
  const params = useParams<{ service?: string; id?: string }>();
  const { timeslots ,serviceloading} = useAppSelector((state) => state.service);

  const { token } = useAppSelector((state) => state.auth);

  const { doctorsList } = useAppSelector((state) => state.doctor);

  const { currentUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [currentTime, setCurrentTime] = useState("");
const {showBoundary}=useErrorBoundary()
  useEffect(() => {
 
    dispatch(GetallDoctors()).then((data)=>{
      if (data.payload.status === "Error") {
        return showBoundary(data.payload);
      }
    });
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const standardDateFormat = `${year}-${month}-${day}`;
    setDate(standardDateFormat);

    const hours = currentDate.getHours() + 4;
    const minutes = currentDate.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    const formattedHours = hours % 12 || 12;
    const formattedMinutes = String(minutes).padStart(2, "0");

    const currentTimeFormatted = `${formattedHours}:${formattedMinutes}${ampm}`;
    setCurrentTime(currentTimeFormatted);
  }, []);

  const handleDoctorTime = (doctorId: string) => {
    setDoctorId(doctorId);
    const clinicId = currentUser?._id;
    if (date === "") {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const standardDateFormat = `${year}-${month}-${day}`;
      setDate(standardDateFormat);
      setDate(standardDateFormat);
    }
    const formdata = {
      date,
      clinicId,
      doctorId,
    };

    dispatch(getDoctorTimeslot(formdata)).then((data)=>{
      if (data.payload.status === "Error") {
        return showBoundary(data.payload);
      }
    });
  };

  //============== handle booking======================
  const handlebooking = (time: string) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      html: `
    <p>Date ${date}</p>
    <p>Time ${time}</p>
  `,
      confirmButtonText: "Yes, confirm",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        const clinicId = currentUser._id;
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
          });
        });
      }
    });
  };
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

  const handleCancelBook = (time: string, slotId: string,user_id:string) => {

    Swal.fire({
      title: "Booking cancel?",
      icon: "warning",
      html: `
    <p>Date ${date}</p>
    <p>Time ${time}</p>
    <label>Reason</label> <br/>
    <textarea type="text"  id="inputField" placeholder="Enter reason" />
  `,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const reasonInput = document.getElementById(
          "inputField"
        ) as HTMLInputElement | null;
        const reason = reasonInput?.value;

        const formdata = {
          date,
          clinicId: currentUser?._id,
          doctorId,
          slotId,
          reason,
        };

        dispatch(cancellingslot(formdata)).then((data) => {
        
            if (data.payload.status === "Error") {
              return showBoundary(data.payload);
            }
          
          if (data.payload.status === "success") {
            toast.success(data.payload.message);
if(user_id!==currentUser._id){

 const formvalue={
              credited_id:user_id,
               debited_id:currentUser?._id||"",
               debited_name:currentUser.clinicName||"",
               credited_name:currentUser?.username || "",
               amount:100,
               paymentType:"wallet",
               time:Date.now(),
               date:date,
               status:'cancelled',
               type:"Refund"
            }     
            dispatch(CancelPayment(formvalue)).then((data)=>{
              if (data.payload.status === "Error") {
                return showBoundary(data.payload);
              }
            })}
            const formdata = {
              date,
              clinicId: currentUser?._id,
              doctorId,
            };
            dispatch(getDoctorTimeslot(formdata)).then((data) => {
            
                if (data.payload.status === "Error") {
                  return showBoundary(data.payload);
                }
              
              Swal.fire("Cancelled!", "Booking cancelled", "success");
            });
          }
        });
      }
    });
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
    dispatch(getDoctorTimeslot(formdata)).then((data)=>{
      if (data.payload.status === "Error") {
        return showBoundary(data.payload);
      }
    });;
  };
  const shouldDisableDate = (date: any) => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return date.isBefore(today, "day");
  };

  return (
    <>

    {serviceloading && <LoadingComp/>}
      <Toaster toastOptions={{ duration: 3000 }} />

      <div className="container-fluid main_bg  mt-2 ">
        <div className="row">
          <div className="col-12">
            <h3 className="text-center">Bookings</h3>
          </div>

          <div className="row ">
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
                {doctorsList?.map((data: any) => {
                  if (
                    data.verified === "verified" &&
                    (date > data.leave?.endDate || date < data.leave?.startDate)
                  ) {
                    return (
                      <div
                        className={`row m-2 ${
                          doctorId === data._id
                            ? "selected-doctor"
                            : "Unselected-doctor"
                        }`}
                        key={data._id}
                        onClick={() => handleDoctorTime(data._id)}
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
              <div className="col-9  m-auto text-center">
                <div className="p-5">
                  <div className="container  text-center">
                    <h3 className="text-center mb-4 ">Time slots</h3>
                    <div className="row ">
                      {allTimes.map((time, index) => {
                        const bookedslot = timeslots[0]?.Bookings.some(
                          (slot: any) =>
                            slot.time === time && slot.status !== "cancelled"
                        );

                        const bookingForTime = timeslots[0]?.Bookings.find(
                          (booking: any) =>
                            booking.time === time &&
                            booking.status !== "cancelled"
                        );
                        const isPastDate = timeslots[0]?.date < date;
                        const currentTime = new Date().toLocaleTimeString(
                          "en-US",
                          {
                            hour12: false,
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        );

                        const isPastTime =
                          isPastDate ||
                          (timeslots[0]?.date === date &&
                            timeslots[0]?.Bookings.find(
                              (booking: any) =>
                                booking.time === currentTime &&
                                booking.status !== "cancelled"
                            ));

                        return (
                          <div className="col-1 m-auto " key={index}>
                            {isPastTime ? (
                              <button
                                onClick={() => setTime(time)}
                                disabled={true}
                                className="booked"
                              >
                                {time}
                              </button>
                            ) : (
                              <button
                                onClick={() => setTime(time)}
                                disabled={bookedslot}
                                className={bookedslot ? "booked" : "unbooked"}
                              >
                                {time}
                              </button>
                            )}

                            {bookingForTime && !isPastTime ? (
                              <button
                                className="cancel_btn mt-1"
                                onClick={() =>
                                  handleCancelBook(time, bookingForTime._id,bookingForTime.user_id)
                                }
                              >
                                <AiFillCloseCircle size={"2rem"} />
                              </button>
                            ) : (
                              <button
                                className="block_btn mt-1"
                                onClick={() => handlebooking(time)}>
                                block
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
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingPage;
