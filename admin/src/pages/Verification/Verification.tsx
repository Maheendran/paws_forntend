import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/Store";
import {
  UnverifiedDoctor,
  checkVerification,
} from "../../Redux/Slice/UserSlice";
import Swal from "sweetalert2";
import { toast, Toaster } from "react-hot-toast";
import "./Verfication.css";
const Verification = () => {
  const [accounttype, setAccounttype] = useState("PetOwner");
  const [blocked, setBlocked] = useState("");
  const [userList, setUserList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [effectRender, setEffectRender] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(UnverifiedDoctor()).then((data) => {
      if (data.payload.doctor) {
        setUserList(data.payload.doctor);
      }


    });
  }, [effectRender]);

  const { loading } = useAppSelector((state) => state.user);

  const handleAccount = (data: string) => {
    setAccounttype(data);
    if (data === "PetOwner") {
      setUserList([]);
      setCurrentPage(1);
      setBlocked("");
    } else {
      setUserList([]);
      setCurrentPage(1);
      setBlocked("");
    }
  };
  const itemsPerPage = 2;
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const totalPages = Math.ceil(userList.length / itemsPerPage);

  const displayData = userList.filter((item, index: any) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return index >= startIndex && index < endIndex;
  });
  // =================
  const handleshowImage = (url: string) =>
    Swal.fire({
      imageUrl: url,
      imageWidth: 300,
      imageHeight: 300,
      imageAlt: "Custom image",
    });

  const handleVerifiction = (doctorId: string, verified: string) => {
    const data = {
      doctorId,
      verified,
    };

    dispatch(checkVerification(data)).then((data) => {
      if (data.payload.status) {
        setEffectRender(!effectRender);

        toast.success(data.payload.doctor.verified);
      }
    });
  };
  return (
    <>
      <Toaster toastOptions={{ duration: 3000 }} />

      {loading && <p>Loding</p>}
      <div className="container-fluid mt-2">
    
        <div className="row">
          <div className="col-12 ">
   
            <div className="row m-auto text-center ">
              <div className="container-fluid ">

                {displayData.map((data: any) => (
                  <div className="row mt-2" key={data._id}>
                    <div className="col-2 profile_dr_image">
                    <img  className="img-fluid" src={data.profileImage? data.profileImage: "https://cdn3.iconfinder.com/data/icons/medical-and-health-2-13/52/190-1024.png"}
                        alt=""
                      />
                    </div>
                    <div className="col-4 text-start m-auto">
                      <p>
                        Name : <span>{data.name}</span>{" "}
                      </p>
                      <p>
                        Specialized : <span>{data.specialized}</span>{" "}
                      </p>
                      <p>
                        Qualification : <span>{data.qualification}</span>{" "}
                      </p>
                      <p>
                        Experience : <span>{data.experience}</span>{" "}
                      </p>
                    </div>
                    <div
                      className="col-2 d-flex doctor_doc_img m-auto"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleshowImage(data.document)}
                    >
                      <img
                        className="img-fluid"
                        src={
                          data.document
                            ? data.document
                            : "https://th.bing.com/th/id/OIP.IVwf85npYYUcwRp4EIhqDgHaJm?pid=ImgDet&rs=1"
                        }
                        alt=""
                      />
                    </div>
                    <div className="col-2 m-auto">
                      <button
                        className="btn btn-success m-3"
                        onClick={() => handleVerifiction(data._id, "verified")}
                      >
                        Verified
                      </button>
                      <button
                        className="btn btn-danger m-3"
                        onClick={() => handleVerifiction(data._id, "rejected")}
                      >
                        Rejected
                      </button>
                    </div>
                    <hr className="m-3" />
                  </div>
                ))}
              </div>
              {displayData.length === 0 && (
                <div className="row text-center ">
                  <h4 className="m-5 ">No pending verification</h4>
                </div>
              )}
            </div>
     
          </div>
        </div>
      </div>

      {displayData.length >0 &&
      <div className="row ">
              <div className="col-1 d-flex mx-auto text-center mt-5">
                <button
                  className="btn btn-dark m-auto"
                  disabled={currentPage === 1}
                  onClick={handlePrevPage}
                >
                  -
                </button>
                <p className="mx-1 m-auto">{currentPage}</p>
                <button
                  className="btn btn-dark m-auto"
                  disabled={currentPage === totalPages}
                  onClick={handleNextPage}
                >
                  +
                </button>
              </div>
            </div>
}
    </>
  );
};

export default Verification;
