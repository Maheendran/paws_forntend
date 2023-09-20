import React, { useEffect, useRef, useState } from "react";
import "./Profile.css";
import { AiFillCloseCircle } from "react-icons/ai";
import { BiMessageSquareAdd } from "react-icons/bi";
import { useAppDispatch, useAppSelector } from "../../../Redux/Store";
import { LuEdit } from "react-icons/lu";
import {
  Createaddress,
  Updateaddress,
  UpdatecurrentUser,
  Updateprofilepic,
} from "../../../Redux/Slice/UserDetailSlice";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import LoadingComp from "../../../components/loading/LoadingComp";
import Map from "../Map/Map";
import { useErrorBoundary } from "react-error-boundary";

const Profile: React.FC = () => {
  const { showBoundary } = useErrorBoundary();
  const dispatch = useAppDispatch();
  const { currentUser, userAddress, userloading } = useAppSelector(
    (state) => state.user
  );

  const [showmodal, setShowmodal] = useState("");
  const handelPopup = () => {
    setShowmodal("profile");
  };
  const handelAddressPop = () => {
    setShowmodal("address");
  };

  const [formValues, setFormValues] = useState({});

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const navigate = useNavigate();

  const handleupdateProfile = (e: any) => {
    e.preventDefault();
    const filteredData = Object.fromEntries(
      Object.entries(formValues).filter(([key, value]) => value !== "")
    );
    dispatch(UpdatecurrentUser(filteredData)).then((data) => {
      if (data.payload.status === "Error") {
        return showBoundary(data.payload);
      }

      if (data.payload.status === "success") {
        setShowmodal("");
        navigate("/userprofile");
        toast.success("profile updated");
      } else {
        toast.error(data.payload.message);
      }
    });
  };
  // update address
  const handleupdateAddress = (e: any) => {
    e.preventDefault();
    const filteredData = Object.fromEntries(
      Object.entries(formValues).filter(([key, value]) => value !== "")
    );
    if (userAddress.adressLine) {
      filteredData._id = userAddress._id;
      dispatch(Updateaddress(filteredData)).then((data) => {
        if (data.payload.status === "Error") {
          return showBoundary(data.payload);
        }

        if (data.payload.status === "success") {
          setShowmodal("");
          navigate("/userprofile");
          toast.success("Address updated");
        } else {
          toast.error(data.payload.message);
        }
      });
    } else {
      const newAddres = {
        ...filteredData,
        userId: currentUser._id,
        mobile: currentUser.mobile,
        name: currentUser.username || currentUser.ownerName,
        is_default: true,
      };
      dispatch(Createaddress(newAddres)).then((data) => {
        console.log(data.payload,'cerated')
        if (data.payload.status === "Error") {
          return showBoundary(data.payload);
        }

        if (data.payload.status === "success") {
          setShowmodal("");
          navigate("/userprofile");
          toast.success("Address created");
        } else {
          toast.error(data.payload.message);
        }
      });
    }
  };

  // add profile pic
  const fileInputRef: any = useRef();

  const [profileImage, setProfileImage] = useState<String | ArrayBuffer | null>(
    ""
  );

  const handleprofilepopup = () => {
    fileInputRef.current.click();
  };

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
      setProfileImage(result);
      handleCall(result);
    };
  }

  const handleCall = (result: string | ArrayBuffer | null) => {
    const data = {
      image: result,
    };
    dispatch(Updateprofilepic(data)).then((data) => {
      if (data.payload.status === "Error") {
        return showBoundary(data.payload);
      }

      if (data.payload.status) {
        toast.success("Profile picture updated");
      }
    });
  };
  // ================================

  const handleGeolocation = (lat: any, lng: any, status: any) => {
    // setlocation(status);
    // setlongitude(lng);
    // setlatitude(lat);

    const filteredData = {
      longitude: lat,
      latitude: lng,
      _id: userAddress._id,
    };

    dispatch(Updateaddress(filteredData)).then((data) => {
      if (data.payload.status === "Error") {
        return showBoundary(data.payload);
      }
      if (data.payload.status === "success") {
        setShowmodal("");
        navigate("/userprofile");
        toast.success("Address updated");
      } else {
        toast.error(data.payload.message);
      }
    });
  };

  return (
    <>
      <Toaster toastOptions={{ duration: 3000 }} />

      {userloading && <LoadingComp />}

      {showmodal === "profile" && (
        <div className="profile_modal">
          <div className="modal_form">
            <div className="close_btn">
              <AiFillCloseCircle
                onClick={() => setShowmodal("")}
                size={"1.5rem"}
              />
            </div>
            <h3 className="text-center mt-2">{"Update Profile"}</h3>
            <form onSubmit={handleupdateProfile}>
              <div className="row mt-2">
                {currentUser.accountType === "Grooming" && (
                  <div className="col-6">
                    <label>Shope name</label>
                    <input
                      type="text"
                      className="form-control mt-3"
                      placeholder={
                        currentUser.shopName
                          ? currentUser.shopName
                          : "Shop name"
                      }
                      name="shopName"
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                {currentUser.accountType === "Clinic" && (
                  <div className="col-6">
                    <label>Clinic name</label>
                    <input
                      type="text"
                      className="form-control mt-3"
                      placeholder={
                        currentUser.clinicName
                          ? currentUser.clinicName
                          : "Clinic name"
                      }
                      name="clinicName"
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                {currentUser.accountType === "Clinic" ||
                currentUser.accountType === "Grooming" ? (
                  <div className="col-6">
                    <label>Owner name</label>
                    <input
                      type="text"
                      className="form-control mt-3"
                      placeholder={
                        currentUser.ownerName
                          ? currentUser.ownerName
                          : "Owner name"
                      }
                      name="ownerName"
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>

              {currentUser.accountType === "PetOwner" && (
                <div className="col-12">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control mt-3"
                    placeholder={
                      currentUser.username ? currentUser.username : "username"
                    }
                    name="username"
                    onChange={handleInputChange}
                  />
                </div>
              )}

              {currentUser.createdBy === "manual" && (
                <div className="col-12 ">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control mt-3"
                    placeholder={
                      currentUser.email ? currentUser.email : "email"
                    }
                    name="email"
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <div className="row mt-2">
                <div className="col-6">
                  <label>Mobile</label>
                  <input
                    type="number"
                    className="form-control mt-3"
                    placeholder={
                      currentUser.mobile ? currentUser.mobile : "mobile"
                    }
                    name="mobile"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-6">
                  <label>UPI</label>
                  <input
                    type="text"
                    className="form-control mt-3"
                    placeholder={currentUser.upi ? currentUser.upi : "UPI"}
                    name="upi"
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

      {showmodal === "address" && (
        <div className="profile_modal">
          <div className="modal_form">
            <div className="close_btn">
              <AiFillCloseCircle
                onClick={() => setShowmodal("")}
                size={"1.5rem"}
              />
            </div>
            {userAddress.adressLine ? (
              <h3 className="text-center mt-2">{"Update address"}</h3>
            ) : (
              <h3 className="text-center mt-2">{"Create address"}</h3>
            )}
            <form onSubmit={handleupdateAddress}>
              <div className="row mt-2">
                <div className="col-12">
                  <label>AdressLine</label>
                  <input
                    type="text"
                    className="form-control mt-3"
                    placeholder={
                      userAddress.adressLine
                        ? userAddress.adressLine
                        : "add AdressLine"
                    }
                    name="adressLine"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-6">
                  <label>city</label>
                  <input
                    type="text"
                    className="form-control mt-3"
                    placeholder={
                      userAddress.city ? userAddress.city : "add city"
                    }
                    name="city"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-6">
                  <label>State</label>
                  <input
                    type="text"
                    className="form-control mt-3"
                    placeholder={
                      userAddress.state ? userAddress.state : "add state"
                    }
                    name="state"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-6">
                  <label>Country</label>
                  <input
                    type="text"
                    className="form-control mt-3"
                    placeholder={
                      userAddress.country ? userAddress.country : "add country"
                    }
                    name="country"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-6">
                  <label>Pincode</label>
                  <input
                    type="text"
                    className="form-control mt-3"
                    placeholder={
                      userAddress.pincode ? userAddress.pincode : "add pincode"
                    }
                    name="pincode"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="row m-auto mt-4">
                <div className="col-4 mx-auto text-center">
                  {userAddress.adressLine ? (
                    <button
                      className=" btn text-dark mt-3 register_btn"
                      type="submit"
                    >
                      Update
                    </button>
                  ) : (
                    <button
                      className=" btn text-dark mt-3 register_btn"
                      type="submit"
                    >
                      Create
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="container-fluid main_bg">
        <div className="row gutters-sm">
          <div className="col-md-4 my-3 ">
            <div className=" ">
              <div className="">
                <div
                  className="d-flex flex-column align-items-center text-center"
                  style={{ cursor: "pointer" }}
                >
                  <img
                    onClick={handleprofilepopup}
                    src={
                      currentUser.profileImage
                        ? currentUser.profileImage
                        : "https://bootdey.com/img/Content/avatar/avatar7.png"
                    }
                    className="rounded-circle"
                    width="180"
                    height="180"
                  />

                  <div className="mt-3">
                    <input
                      type="file"
                      id="fileInput"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    {currentUser.accountType === "PetOwner" && (
                      <h5>{currentUser.username}</h5>
                    )}
                    {currentUser.accountType === "Clinic" && (
                      <h5>{currentUser.ownerName}</h5>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card_bg  mt-3 mb-2">
              <div className="card-body">
                <div className="row">
                  <div>
                    <h6>Profile card</h6>
                    <div className="col-1 ms-auto" onClick={handelPopup}>
                      <LuEdit size={"1.3rem"} />
                    </div>

                    <hr className="mt-0 mb-1" />
                    <div className="row pt-1">
                      {currentUser.accountType === "Clinic" && (
                        <div className="col-6 mb-2">
                          <h6>Clinic Name </h6>
                          <p className="text-muted">
                            {currentUser.clinicName
                              ? currentUser.clinicName
                              : "add clinic name "}
                          </p>
                        </div>
                      )}
                      {currentUser.accountType === "Clinic" ? (
                        <div className="col-6 mb-2">
                          <h6>Owner Name </h6>

                          <p className="text-muted">
                            {currentUser.ownerName
                              ? currentUser.ownerName
                              : "add name "}
                          </p>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="col-6 mb-2">
                        <h6>Email</h6>
                        <p className="text-muted">{currentUser.email}</p>
                      </div>

                      <div className="col-6 mb-2">
                        <h6>Phone</h6>
                        <p className="text-muted">
                          {currentUser.mobile
                            ? currentUser.mobile
                            : "add mobile number "}
                        </p>
                      </div>

                      <div className="col-6 mb-2">
                        <h6>UPI</h6>
                        <p className="text-muted">
                          {" "}
                          {currentUser.upi
                            ? currentUser.upi
                            : "add UPI address "}
                        </p>
                      </div>
                      <div className="col-6 mb-2">
                        <h6>Wallet</h6>
                        <p className="text-muted">
                          {" "}
                          {currentUser.wallet ? currentUser.wallet : 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row gutters-sm">
              <div className="col-sm-12 mb-2">
                <div className="card_bg h-100">
                  <div className="card-body">
                    {userAddress.adressLine ? (
                      <div
                        className="ms-auto  col-1 "
                        onClick={handelAddressPop}
                      >
                        <LuEdit size={"1.3rem"} />
                      </div>
                    ) : (
                      <div
                        className="ms-auto  col-1"
                        onClick={handelAddressPop}
                      >
                        <BiMessageSquareAdd size={"1.3rem"} />
                      </div>
                    )}
                    <div className="row pt-1 address_portion">
                      {userAddress.adressLine ? (
                        <div className="col-12 mb-2">
                          <div className="row">
                            <div className="col-6">
                              <p className="text-muted">
                                AdressLine: {userAddress.adressLine}
                              </p>
                            </div>
                            <div className="col-6">
                              <p className="text-muted">
                                City: {userAddress.city}
                              </p>
                            </div>
                            <div className="col-6">
                              <p className="text-muted">
                                State: {userAddress.state}
                              </p>
                            </div>
                            <div className="col-6">
                              <p className="text-muted">
                                Pincode: {userAddress.pincode}
                              </p>
                            </div>
                          </div>

                          <p className="text-muted">
                            Country: {userAddress.country}
                          </p>
                        </div>
                      ) : (
                        "Add address"
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {currentUser.accountType === "Clinic" && (
          <div className="row" style={{ height: "50vh" }}>
            <Map
              handleGeolocation={handleGeolocation}
              longitude={userAddress.longitude}
              latitude={userAddress.latitude}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
