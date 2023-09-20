import React from "react";
import "./Modal.css";
import { AiFillCloseCircle } from "react-icons/ai";

interface ChildComponentProps {
  handleforgotPass: () => void;
  title: string;
}
const Modal: React.FC<ChildComponentProps> = ({ handleforgotPass, title }) => {
  const handlepassForgot = () => {};
  return (
    <div className="modal_parent">
      <div className="modal_form">
        <div className="close_btn">
          <AiFillCloseCircle onClick={handleforgotPass} size={"1.5rem"} />
        </div>
        <h3 className="text-center mt-2">{title}</h3>
        <input
          type="text"
          className="form-control mt-3"
          placeholder="registered email.."
          required
        />
        <div className="row m-auto mt-4">
          <div className="col-12 mx-auto text-center">
            <button className="submit_btn" onClick={handlepassForgot}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
