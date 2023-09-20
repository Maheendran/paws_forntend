import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux/Store";
import { BookingsHistory } from "../../../Redux/Slice/ServiceSlice";
import "./BookingHistory.css";

import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { useErrorBoundary } from "react-error-boundary";
const BookingHistory = () => {
  const auth = useAppSelector((state) => state.auth);
  const { Historys } = useAppSelector((state) => state.service);
  const [historyDetail, setHistoryDetail] = useState(Historys);
  const dispatch = useAppDispatch();
  const { showBoundary } = useErrorBoundary();
  useEffect(() => {
    dispatch(BookingsHistory()).then((data) => {
      if (data.payload.status === "Error") {
        return showBoundary(data.payload);
      }
      setHistoryDetail(data.payload.history);
    });
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    setTimeout(() => {}, 1000);
  };
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
    setTimeout(() => {}, 1000);
  };

  const handleSort = (e: any) => {
    const value = e.target.value;
    console.log(value);
    const sortedArray = historyDetail.slice();
    if (value === "asc") {
      sortedArray.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
    } else {
      sortedArray.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
    }
    setHistoryDetail(sortedArray);
  };

  const handlefilter = (e: any) => {
    const value = e.target.value;
    if (value === "all") {
      return dispatch(BookingsHistory()).then((data) => {
        if (data.payload.status === "Error") {
          return showBoundary(data.payload);
        }
        setHistoryDetail(data.payload.history);
      });
    }

    dispatch(BookingsHistory()).then((data) => {
      if (data.payload.status === "Error") {
        return showBoundary(data.payload);
      }
      const datas = data.payload.history;
      const filterdata = datas.filter((e: any) => {
        return e.Bookings.status === value;
      });
      setHistoryDetail(filterdata);
    });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(historyDetail.length / itemsPerPage);
  const displayData = historyDetail.filter((item, index: any) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return index >= startIndex && index < endIndex;
  });

  return (
    <>
      <div className="container-fluid main_bg">
        <div className="col-3 text-center ms-auto">
          <div className="row">
            <div className="col-6 ms-auto">
              <label htmlFor="">Date</label>
              <select
                name="sort"
                id=""
                className="form-control"
                onChange={(e) => handleSort(e)}
              >
                <option value="asc">Old to New</option>
                <option value="des">New to Old</option>
              </select>
            </div>
            <div className="col-6 ms-auto">
              <label htmlFor="">Status</label>
              <select
                name="sort"
                id=""
                className="form-control"
                onChange={(e) => handlefilter(e)}
              >
                <option value="all">All</option>
                <option value="booked">Booked</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="col-6 m-auto mt-2">
          <div className="row m-auto " style={{ overflow: "scroll" }}>
            {displayData?.map((e) => (
              <div
                className={`col-12 mb-2 py-3 ${
                  e.Bookings.status === "booked"
                    ? "booking_card"
                    : "cancelled_card"
                } `}
                key={e.Bookings._id}
              >
                <div className=" row doctor_box ">
                  <div className="col-3 my-auto ">
                    <img
                      className="img-fluid"
                      src={
                        e?.doctorInfo[0]?.profileImage
                          ? e.doctorInfo[0]?.profileImage
                          : "https://cdn4.iconfinder.com/data/icons/professions-1-2/151/3-512.png"
                      }
                      alt=""
                    />
                  </div>
                  <div className="col-5 m-auto">
                    <p>
                      {" "}
                      <span>Name :</span>
                      {e.doctorInfo[0]?.name}
                    </p>
                    <p>
                      <span>qualification :</span>
                      {e.doctorInfo[0]?.qualification}
                    </p>
                    <p>
                      <span>specialized :</span>
                      {e.doctorInfo[0]?.specialized}
                    </p>
                    <p>
                      <span>experience :</span>
                      {e.doctorInfo[0]?.experience}
                    </p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-4 me-auto">
                    {auth.choosePerson === "PetOwner" && (
                      <img
                        className="img-fluid"
                        src={e?.clinicInfo[0]?.profileImage}
                        alt=""
                      />
                    )}

                    {auth.choosePerson === "Clinic" && (
                      <img
                        className="img-fluid"
                        src={e?.userInfo[0]?.profileImage}
                        alt=""
                      />
                    )}
                  </div>
                  <div className="col-5 m-auto">
                    {auth.choosePerson === "PetOwner" ? (
                      <>
                        <h3 className="mt-2 ">
                          {e?.clinicInfo[0]?.clinicName}
                        </h3>
                        <p>
                          Status :
                          <span
                            className={` ${
                              e.Bookings.status === "booked"
                                ? "booked_txt"
                                : "cancelled_txt"
                            } `}
                          >
                            {" "}
                            {e.Bookings.status}
                          </span>
                        </p>
                        <p>
                          Time :
                          <span
                            className={`${
                              e.Bookings.status === "booked"
                                ? "booked_txt"
                                : "cancelled_txt"
                            } `}
                          >
                            {e?.Bookings.time}
                          </span>
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="mt-2 ">{e?.userInfo[0]?.username}</h3>
                        <p>
                          Status :
                          <span
                            className={` ${
                              e.Bookings.status === "booked"
                                ? "booked_txt"
                                : "cancelled_txt"
                            } `}
                          >
                            {" "}
                            {e.Bookings.status}
                          </span>
                        </p>
                        <p>
                          Time :
                          <span
                            className={`${
                              e.Bookings.status === "booked"
                                ? "booked_txt"
                                : "cancelled_txt"
                            } `}
                          >
                            {e.Bookings.time}
                          </span>
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="row text-center bg-danger text-light m-auto">
                  {e.Bookings?.reason !== "" && (
                    <p className="m-auto p-2">Reason : {e.Bookings?.reason}</p>
                  )}
                </div>
                <div className="row text-end text-muted">
                  <p className="m-auto booking_date">{e.date}</p>
                </div>
              </div>
            ))}

            {displayData.length === 0 && <p>empty list</p>}
          </div>
        </div>
      </div>
      <div className="row text-center">
        <div className="col-2 m-auto text-center">
          <button
            className="pagination_btn  m-auto"
            disabled={currentPage === 1}
            onClick={handlePrevPage}
          >
            <MdArrowBackIosNew />
          </button>
          <button
            className="pagination_btn m-auto"
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            <MdArrowForwardIos />
          </button>
        </div>
      </div>
    </>
  );
};

export default BookingHistory;
