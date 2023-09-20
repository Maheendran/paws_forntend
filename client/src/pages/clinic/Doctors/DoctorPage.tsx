import React, { useEffect, useRef, useState } from "react";
import "./DoctorPage.css";
import { BiMessageSquareEdit } from "react-icons/bi";
import { AiFillDelete, AiFillCloseCircle } from "react-icons/ai";
import { toast, Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { useAppDispatch, useAppSelector } from "../../../Redux/Store";
import {
  CreateDoctor,
  DocotorDelete,
  GetallDoctors,
  UpdateDoctor,
  doctorDetail,
} from "../../../Redux/Slice/DoctorSlice";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import LoadingComp from "../../../components/loading/LoadingComp";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { useErrorBoundary } from "react-error-boundary";
const schema = Joi.object({
  name: Joi.string().min(3).max(20).label("name"),
  specialized: Joi.string().min(2).max(20).label("specialized"),
  qualification: Joi.string().min(1).max(20).label("qualification"),
  experience: Joi.string().min(1).max(100).label("experience"),
  document: Joi.string().min(5).max(20).label("document"),
});

const DoctorPage: React.FC = () => {
  interface formdatas {
    name: string;
    specialized: string;
    qualification: string;
    experience: string;
    document: string;
  }
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<formdatas>({ resolver: joiResolver(schema) });
  const [triggereffect, setTriggerEffect] = useState(false);
  const [popupdoc, setPopupdoc] = useState(false);
  const { showBoundary } = useErrorBoundary();
  useEffect(() => {
    setPopupdoc(true);
    dispatch(GetallDoctors()).then((data) => {});
  }, [triggereffect]);

  const handleRemoveDR = (id: string) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
        actions: "button-gap",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "delete it!",
        cancelButtonText: "cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const doctor = {
            doctorId: id,
          };
          dispatch(DocotorDelete(doctor)).then((data) => {
            if (data.payload.status === "Error") {
              return showBoundary(data.payload);
            }
            if (data.payload.status) {
              swalWithBootstrapButtons.fire(
                "Deleted!",
                "Your file has been deleted.",
                "success"
              );
            }
            setTriggerEffect(!triggereffect);
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Doctor file is safe :)",
            "error"
          );
        }
      });
  };
  const [formValues, setFormValues] = useState({});
  const [showmodal, setShowmodal] = useState(false);
  const [chooseDoctor, setChooseDoctor] = useState<doctorDetail | undefined>(
    undefined
  );
  const { doctorsList, doctorloading } = useAppSelector(
    (state) => state.doctor
  );

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };
  const handelPopup = (id: string) => {
    const findDoctor = doctorsList.find((e) => e._id === id);
    setChooseDoctor(findDoctor);
    setShowmodal(!showmodal);
  };
  const [document, setDocument] = useState<String | ArrayBuffer | null>("");
  const [profile, setProfile] = useState<String | ArrayBuffer | null>("");
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useAppDispatch();

  // create new doctor
  const handlecreateDoctor = (data: any) => {
    data.document = document;
    data.profileImage = profile;
    dispatch(CreateDoctor(data)).then((data) => {
      if (data.payload.status === "Error") {
        return showBoundary(data.payload);
      }
      if (data.payload?.status) {
        toast.success("New profile created");
        dispatch(GetallDoctors());
        reset();
        setProfile("");
        setPopupdoc(true);
      }
    });
  };
  // update doctor
  const handleUpdateDoctor = (e: any) => {
    e.preventDefault();
    const filteredData = Object.fromEntries(
      Object.entries(formValues).filter(([key, value]) => value !== "")
    );

    filteredData._id = chooseDoctor?._id;
    dispatch(UpdateDoctor(filteredData)).then((data) => {
      if (data.payload.status === "Error") {
        return showBoundary(data.payload);
      }
      if (data.payload.status) {
        toast.success("Profile updated");
        setShowmodal(!showmodal);
        dispatch(GetallDoctors());
      }
    });
  };
  // ==========docment chooose============
  const handleFileChange = (e: any) => {
    const { files } = e.target;
    const file = files[0];
    previewFile(file);
  };

  function previewFile(file: any) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      setDocument(result);
    };
  }

  const fileInputRef: any = useRef();
  const handleprofilepopup = () => {
    fileInputRef.current.click();
  };

  const handleprofileChange = (e: any) => {
    const { files } = e.target;
    const file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      setProfile(result);
    };
  };

  const handlePopupDoctor = () => {
    setPopupdoc(!popupdoc);
  };
  const itemsPerPage = 3;
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const totalPages = Math.ceil(doctorsList.length / itemsPerPage);

  const displayData = doctorsList.filter((item, index: any) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return index >= startIndex && index < endIndex;
  });

  return (
    <>
      <Toaster toastOptions={{ duration: 3000 }} />

      {doctorloading && <LoadingComp />}

      <div className="main_bg">
        <div
          className={`container-fluid ${
            popupdoc ? "semi_top_circle" : "large_top_circle"
          }  `}
        >
          {popupdoc && (
            <img
              className="img-fluid doct_image"
              src="https://th.bing.com/th/id/R.2a6a8960fd53a9ceef43145ddeac899a?rik=InWr6BqEFPNJig&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fpng-woman-doctor--602.png&ehk=%2fAbOU1N6KxLTY8nQIhp6m72SA8GBKnU6mA7ryKC35qc%3d&risl=&pid=ImgRaw&r=0"
              alt=""
            />
          )}

          {popupdoc ? (
            <div className="col-8 text-center mt-5 m-auto">
              <button className="submit_btn  " onClick={handlePopupDoctor}>
                Add doctor
              </button>
            </div>
          ) : (
            <div className="col-8 m-auto">
              <form onSubmit={handleSubmit((data) => handlecreateDoctor(data))}>
                <div className="profile_pic  mx-auto mt-2">
                  <img
                    src={
                      profile
                        ? profile.toString()
                        : "https://www.shareicon.net/data/2016/09/01/822712_user_512x512.png"
                    }
                    alt=""
                    onClick={handleprofilepopup}
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleprofileChange}
                />

                <div className="row">
                  <div className="col-6 mt-2">
                    <label>Name</label>
                    <input
                      type="text"
                      {...register("name")}
                      className="form-control"
                      placeholder="name"
                      name="name"
                    />
                    {errors.name && (
                      <p className="error_message mt-2">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="col-6 mt-2">
                    <label>Specialized</label>
                    <input
                      type="text"
                      {...register("specialized")}
                      className="form-control"
                      placeholder="Specialized"
                      name="specialized"
                    />
                    {errors.specialized && (
                      <p className="error_message mt-2">
                        {errors.specialized.message}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mt-2">
                    <label>Qualification</label>
                    <input
                      type="text"
                      {...register("qualification")}
                      className="form-control"
                      placeholder="qualification"
                      name="qualification"
                    />
                    {errors.qualification && (
                      <p className="error_message mt-2">
                        {errors.qualification.message}
                      </p>
                    )}
                  </div>
                  <div className="col-6 mt-2">
                    <label>Experience</label>
                    <input
                      type="number"
                      {...register("experience")}
                      className="form-control"
                      placeholder="experience in years"
                      name="experience"
                    />
                    {errors.experience && (
                      <p className="error_message mt-2">
                        {errors.experience.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-6 mx-auto mt-2">
                  <label>Document (Id-proof)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="form-control"
                    placeholder="id-proof"
                    name="document"
                  />
                  {errors.document && (
                    <p className="error_message mt-2">
                      {errors.document.message}
                    </p>
                  )}
                </div>
                <div className="col-6 m-auto text-center">
                  <button className="m-auto mt-4 submit_btn" type="submit">
                    Submit
                  </button>
                </div>
              </form>

              <div className="col-3 text-center mx-auto">
                <button
                  className="up-arrow_btn"
                  onClick={() => setPopupdoc(!popupdoc)}
                >
                  <img
                    className="img-fluid"
                    src="https://www.pinclipart.com/picdir/big/163-1636766_upward-fold-comments-arrow-up-icon-png-clipart.png"
                    alt=""
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="container m-auto">
          <div className="row doctgrid">
            {displayData.map((e) => (
              <div className="col-12 doctor_card mt-3" key={e._id}>
                <div className="row">
                  <div className="col-3 rounde-pill ">
                    <div className="profile_edit_btn">
                      <BiMessageSquareEdit
                        size={"1.5rem"}
                        color="grey"
                        onClick={() => handelPopup(e._id)}
                      />
                    </div>
                    <img
                      className="img-fluid"
                      src={
                        e.profileImage
                          ? e.profileImage
                          : "https://cdn4.iconfinder.com/data/icons/professions-1-2/151/3-512.png"
                      }
                      alt=""
                    />
                  </div>
                  <div className="col-1 ms-auto mx-3">
                    <AiFillDelete
                      size={"1.5rem"}
                      color="grey"
                      cursor={"pointer"}
                      onClick={() => handleRemoveDR(e._id)}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-8">
                    <p>
                      Name: <span>{e.name}</span>{" "}
                    </p>
                    <p>
                      Specialized: <span>{e.specialized}</span>{" "}
                    </p>
                    <p>
                      Qualification: <span>{e.qualification}</span>{" "}
                    </p>
                    <p>
                      Experience: <span>{e.experience}</span>{" "}
                    </p>
                  </div>

                  <div className="col-4">
                    {e.verified === "verified" && (
                      <img
                        className="img-fluid"
                        src="https://www.officialmusicbible.com/wp-content/uploads/2018/05/verified-seal-copy.png"
                        alt=""
                      />
                    )}

                    {e.verified === "rejected" && (
                      <img
                        className="img-fluid"
                        src="https://static.vecteezy.com/system/resources/previews/008/490/263/large_2x/rejected-stamp-mark-clipart-free-png.png"
                        alt=""
                      />
                    )}

                    {e.verified === "pending" && (
                      <img
                        className="img-fluid"
                        src="https://media.istockphoto.com/vectors/pending-round-red-grunge-stamp-vector-id975688486?k=6&m=975688486&s=612x612&w=0&h=OWe_05WHGb1-3FeJutU8_79DMxQRnZKA6JxeABEfbnQ="
                        alt=""
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {doctorsList.length === 0 && <h3>empty list</h3>}
          </div>
          <div className="row text-center mt-3">
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
        </div>
      </div>

      {showmodal && (
        <div className="profile_modal">
          <div className="modal_form">
            <div className="close_btn">
              <AiFillCloseCircle
                onClick={() => setShowmodal(!showmodal)}
                size={"1.5rem"}
              />
            </div>
            <h3 className="text-center mt-2">{"Update"}</h3>
            <form onSubmit={handleUpdateDoctor}>
              <div className="row">
                <div className="col-6 mt-2">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder={chooseDoctor?.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-6 mt-2">
                  <label>Specialized</label>
                  <input
                    type="text"
                    className="form-control"
                    name="specialized"
                    placeholder={chooseDoctor?.specialized}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-6 mt-2">
                  <label>Qualification</label>
                  <input
                    type="text"
                    className="form-control"
                    name="qualification"
                    placeholder={chooseDoctor?.qualification}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-6 mt-2">
                  <label>Experience</label>
                  <input
                    type="number"
                    className="form-control"
                    name="experience"
                    placeholder={chooseDoctor?.experience}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="row m-auto mt-4">
                <div className="col-4 mx-auto text-center">
                  <button
                    className=" btn text-dark mt-3 register_btn"
                    type="submit"
                  >
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorPage;
