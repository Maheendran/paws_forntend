import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../Redux/Store";
import {
  AccountBlock,
  getAllClinic,
  getAllPetOwner,
} from "../../Redux/Slice/UserSlice";
import "./Account.css";
import { toast, Toaster } from "react-hot-toast";
import DataTable from "../../components/DataTable/DataTable";

const Accounts = () => {
  const dispatch = useAppDispatch();
  const { petOwnerList, loading, clinicList } = useAppSelector(
    (state) => state.user
  );

  const [userList, setUserList] = useState(petOwnerList);
  const [accounttype, setAccounttype] = useState("PetOwner");
  const [blocked, setBlocked] = useState("");

  useEffect(() => {
    if(accounttype==="PetOwner"){
      dispatch(getAllPetOwner()).then((data) => {
      setUserList(data.payload.usersList);
    });
    }
    if(accounttype==="Clinic"){
      dispatch(getAllClinic()).then((data) => {
      
      setUserList(data.payload.usersList);
    });
    }

  }, [blocked]);


  const handleAccount = (data: string) => {
    setAccounttype(data);
    if (data === "PetOwner") {
      setUserList(petOwnerList);
      setCurrentPage(1);
      setBlocked("");
    } else {
        setUserList(clinicList);
      setCurrentPage(1);
      setBlocked("updated");
    }
  };

  const itemsPerPage = 2;
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleBlocked = (id: string, accountType: string, blocked: boolean) => {

    const data = {
      id,
      accountType,
      blocked,
    };

    dispatch(AccountBlock(data)).then((data) => {
   
      if (data.payload?.account.blocked) {
        toast.success("Blocked");
        setBlocked("upaed");
      } else {
        toast.success("Unblocked");
        setBlocked("upaedted");
      }
    });
  };
  return (
    <>
      <Toaster toastOptions={{ duration: 3000 }} />
      {loading && <p>Loding</p>}
      <div className="container-fluid mt-2 main-container">
        <div className="row">
   
          <div className="col-12 ">
            <div className="row ">
              <div className="col-3 mx-auto   text-center">
                <button
                  onClick={() => handleAccount("PetOwner")}
                  className={
                    accounttype === "PetOwner" ? "active_heading" : "heading"
                  }>
                  PetOwners
                </button>
              </div>
           
              <div className="col-3 mx-auto text-center">
                <button
                  onClick={() => handleAccount("Clinic")}
                  className={
                    accounttype === "Clinic" ? "active_heading" : "heading"
                  }>
                  Clinic
                </button>
              </div>
            </div>

            <div className="row m-auto text-center">


              <DataTable dataList={displayData} handleBlocked={handleBlocked} />


            </div>
           
          </div>
         
        </div>  
        
      </div>

      <div className="row ">
              <div className="col-2 d-flex m-auto text-center mt-5">
                <button
                  className="btn btn-dark"
                  disabled={currentPage === 1}
                  onClick={handlePrevPage}
                >
                  -
                </button>
                <p className="mx-1">{currentPage}</p>
                <button
                  className="btn btn-dark"
                  disabled={currentPage === totalPages}
                  onClick={handleNextPage}
                >
                  +
                </button>
              </div>
            </div>
    </>
  );
};

export default Accounts;
