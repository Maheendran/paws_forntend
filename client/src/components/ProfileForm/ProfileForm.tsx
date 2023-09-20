import React from "react";
import "./ProfileFrom.css";
import { LuEdit } from "react-icons/lu";
import { userList } from "../../Redux/Slice/UserDetailSlice";
interface ChildComponentProps {
  handelPopup: () => void;
  currentUser: Partial<userList>;
}
const ProfileForm: React.FC<ChildComponentProps> = ({
  handelPopup,
  currentUser,
}) => {
  return (
    <>
      <div className="container mt-5">
        <div className="col-12 profile_form ">
          <div className="profile_edit_btn" onClick={handelPopup}>
            <LuEdit size={"1.5rem"} className="edit_icon" />
          </div>

          <div className="left_side_hole">
            <div className="holes"></div>
            <div className="holes"></div>
            <div className="holes"></div>
            <div className="holes"></div>
            <div className="holes"></div>
            <div className="holes"></div>
          </div>
          <div className="row  ">
            <div className="col-12 mx-auto ">
              <h3 className="text-start">Profile Card</h3>
            </div>
            {currentUser.accountType === "Grooming" && (
              <div className="col-12 mx-auto ">
                <p>
                  Shop Name : <span>{currentUser.shopName}</span>{" "}
                </p>
              </div>
            )}
            {currentUser.accountType === "Clinic" && (
              <div className="col-12 mx-auto">
                <p>
                  Clinic Name : <span>{currentUser.shopName}</span>{" "}
                </p>
              </div>
            )}

            {currentUser.accountType === "Grooming" ||
            currentUser.accountType === "Clinic" ? (
              <div className="col-12 mx-auto">
                <p>
                  OwnerName : <span>{currentUser.ownerName}</span>{" "}
                </p>
              </div>
            ) : (
              ""
            )}

            {currentUser.accountType === "PetOwner" && (
              <div className="col-12 mx-auto">
                <p>
                  Name : <span>{currentUser.username}</span>{" "}
                </p>
              </div>
            )}

            <div className="col-12 mx-auto">
              <p>
                Number : <span>{currentUser.mobile}</span>{" "}
              </p>
            </div>
            <div className="col-12 mx-auto ">
              <p>
                Email : <span>{currentUser.email}</span>{" "}
              </p>
            </div>
            <div className="col-12 mx-auto ">
              <p>
                UPI : <span>{currentUser.upi}</span>{" "}
              </p>
            </div>
            {/* <div className="col-7 mx-auto ">
            <p>Address : <span>Maheendran MaheendranMaheendran
                Maheendran</span> </p> 
        </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileForm;
