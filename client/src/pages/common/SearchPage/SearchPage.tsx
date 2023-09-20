import React, { useEffect, useRef, useState } from "react";
import "./SearchPage.css";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../Redux/Store";
import { useNavigate } from "react-router-dom";
import {
  SearchPlace,
  getNerestService,
} from "../../../Redux/Slice/ServiceSlice";
import LoadingComp from "../../../components/loading/LoadingComp";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useErrorBoundary } from "react-error-boundary";
const SearchPage = () => {
  const dispatch = useAppDispatch();
  const [selectValue, setSelectValue] = useState("place");

  useEffect(() => {
    dispatch(getNerestService()).then((data) => {
      if (data.payload.status === "Error") {
      return  showBoundary(data.payload);
      }
    });
  }, []);

  const { serviceList, serviceloading } = useAppSelector(
    (state) => state.service
  );
  console.log(serviceList, "getNerestService");
  const [currentPage, setCurrentPage] = useState(1);
  // seacrch section
  const [searchValue, setSearchValue] = useState("");

  const handleSearchvalue = (e: any) => {
    setSearchValue(e.target.value);
  };

  const selectRef = useRef<HTMLSelectElement | null>(null);

  const { showBoundary } = useErrorBoundary();

  const handleSearch = () => {
    if (selectRef.current) {
      const selectedValue = selectRef.current.value;
      setSelectValue(selectedValue);
      dispatch(SearchPlace({ searchValue: searchValue, selectedValue })).then(
        (data) => {
          if (data.payload.status === "Error") {
            return  showBoundary(data.payload);
                }
        }
      );
    }
  };

  const navigate = useNavigate();

  const handleNavigate = (clinicId: string) => {
    navigate(`/clinic-detail/${clinicId}`);
  };

  const handleclinicNavigate = (id: string) => {
    navigate(`/clinic-detail/${id}`);
  };

  // pagination
  const [isBlurred, setIsBlurred] = useState(false);
  const itemsPerPage = 3;
  const handleNextPage = () => {
    setIsBlurred(true);
    setCurrentPage((prevPage) => prevPage + 1);
    setTimeout(() => {
      setIsBlurred(false);
    }, 1000);
  };
  const handlePrevPage = () => {
    setIsBlurred(true);
    setCurrentPage((prevPage) => prevPage - 1);
    setTimeout(() => {
      setIsBlurred(false);
    }, 1000);
  };

  const totalPages = Math.ceil(serviceList.length / itemsPerPage);

  const displayData = serviceList.filter((item, index: any) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return index >= startIndex && index < endIndex;
  });

  // ==========================animation
  const headinganimation = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.1,
  });
  useEffect(() => {
    if (inView) {
      headinganimation.start({
        y: "0rem",
        transition: {
          type: "spring",
          duration: 2,
          bounce: 0.2,
        },
      });
    }
    if (!inView) {
      headinganimation.start({ y: "10vw" });
    }
  }, [inView]);

  return (
    <>
      {serviceloading && <LoadingComp />}

      <div className="container-fluid main_bg">
        <div className="row  ">
          <div className="row " ref={ref}>
            <motion.div
              className="col-5 search_box m-auto "
              animate={headinganimation}
            >
              <select className="selectoptn" ref={selectRef}>
                <option value="place">Place</option>
                <option value="doctor">Doctor</option>
                <option value="clinic">Clinic</option>
              </select>
              <input
                type="text"
                className="form-control search_input "
                onChange={handleSearchvalue}
                placeholder="Search ...!"
              />

              <button className="btn btn-success" onClick={handleSearch}>
                Search
              </button>
            </motion.div>
            <div className="col-4 ms-auto">
              <img className="img-fluid " src="../assests/dogwalk.png" alt="" />
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row  mt-2 mb-2">
            {displayData.map((e) => (
              <>
                <div
                  className="col-4"
                  onClick={() => {
                    selectValue === "doctor"
                      ? handleNavigate(e?.clinicDetails._id)
                      : handleclinicNavigate(e._id);
                  }}
                >
                  <div className="row shop_card m-auto mt-2">
                    <div className="col-5 shop_image m-auto p-2">
                      {e.profileImage ? (
                        <img src={e.profileImage} alt="" />
                      ) : (
                        <img
                          className="img-fluid"
                          src="https://th.bing.com/th/id/OIP.LKX8we1Qg7zNUGyQE5uyMQHaE6?pid=ImgDet&rs=1"
                          alt=""
                        />
                      )}
                    </div>
                    <div className="col-7  ms-auto">
                      {selectValue === "doctor" ? (
                        <>
                          <p>
                            <span>Name :</span> {e?.name}
                          </p>
                          <p>
                            <span>Experience :</span> {e.experience}
                          </p>

                          <p>
                            <span>Experience :</span> {e.qualification}
                          </p>
                        </>
                      ) : (
                        <h4>{e?.clinicName}</h4>
                      )}

                      {e?.address[0]?.city !== "" &&
                        selectValue === "place" && (
                          <p>
                            {" "}
                            <span>
                              <img
                                className="img-fluid"
                                style={{ width: "30px" }}
                                src="https://c.tenor.com/6utC7ZK8iJkAAAAC/location-red.gif"
                                alt=""
                              />
                            </span>{" "}
                            {e?.address[0]?.city}
                          </p>
                        )}

                      {selectValue === "doctor" ? (
                        ""
                      ) : (
                        <p>
                          <span>
                            <img
                              style={{ width: "30px", height: "35px" }}
                              src="https://th.bing.com/th/id/R.cf83db51e7a566b33aa2dfdb15536dcc?rik=XM1Fh4rO09MglQ&riu=http%3a%2f%2fclipart-library.com%2fimage_gallery%2fn748527.gif&ehk=YuBqRLuvaPJaB9DA%2bo9tQqt%2fOXIt0f%2fTBTp143DsGIA%3d&risl=&pid=ImgRaw&r=0"
                              alt=""
                            />
                          </span>{" "}
                          Open 10AM
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ))}

            {displayData.length === 0 && (
              <div className="col-3 m-auto">
                <img
                  className="img-fluid"
                  src="https://th.bing.com/th/id/R.74262339fa4cc98af5157734e0637719?rik=lUQaKLm8ewPmaA&riu=http%3a%2f%2fdrahmadali.com%2fimg%2fno_result.png&ehk=Y4cEIaWwpUQTBIDz3tbl2uhZSxUFat3ul1BtREhkD9s%3d&risl=&pid=ImgRaw&r=0"
                  alt=""
                />
              </div>
            )}
          </div>

          <div className="row mt-3">
            <div className="col-2 m-auto text-center">
              <button
                className="pagination_btn m-auto"
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
        </div>
      </div>
    </>
  );
};

export default SearchPage;
