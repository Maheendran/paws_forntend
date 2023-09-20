import React, { useEffect, useState } from 'react'
import './PaymentPage.css'
import { MdArrowBackIosNew,MdArrowForwardIos } from 'react-icons/md';
import  {PiArrowBendUpLeftBold,PiArrowBendUpRightBold}  from 'react-icons/pi';
import { useAppDispatch, useAppSelector } from '../../../Redux/Store';
import { PaymentHistory } from '../../../Redux/Slice/ServiceSlice';
import { FaRupeeSign} from 'react-icons/fa';
import { useErrorBoundary } from "react-error-boundary";
const PaymentPage:React.FC = () => {
  const {paymentHistory} = useAppSelector((state)=>state.service)
  const {currentUser} = useAppSelector((state)=>state.user)
  const dispatch=useAppDispatch()
  const { showBoundary } = useErrorBoundary();
useEffect(()=>{

dispatch(PaymentHistory()).then((data)=>{

    if (data.payload.status === "Error") {
      return showBoundary(data.payload);
    }

  if (data.payload.status === "Error") {
    return showBoundary(data.payload);
  }
})
},[])

const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;
const handleNextPage = () => {
setCurrentPage((prevPage) => prevPage + 1);
};
const handlePrevPage = () => {
setCurrentPage((prevPage) => prevPage - 1);
};

const totalPages = Math.ceil(paymentHistory.length / itemsPerPage);

const displayData = paymentHistory.filter((item, index: any) => {
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
return index >= startIndex && index < endIndex;
});

  return (
    <>
    <div className="container-fluid payment_main_box main_bg">

      <div className="col-8 m-auto">
      {displayData.map((e) => (
  <div className="row payment_row mt-2">
    {e.credited_id === currentUser._id ? (


      <div className="credited_box col-6 ">
        <div className="row">
          <div className="col-2 m-auto">
             <PiArrowBendUpRightBold  className='receive_icon'/>

          </div>
          <div className="col-10 m-auto">
<div className="row m-1">
<h3><span><FaRupeeSign/></span> {e.amount}</h3>
</div>
<div className="row">
<p>Credited - {e.debited_name}</p>
</div>
<div className="row">
<p>Status : {e.status}</p>
</div>
          </div>
        </div>
       
       <div className="row text-start">
       <p>{e.date}</p>
       </div>
      </div>
    ) : (
      <div className="debited_box col-6  ">
        <div className="row">
          <div className="col-2 m-auto">
             <PiArrowBendUpLeftBold  className='receive_icon'/>

          </div>
          <div className="col-10 m-auto">
<div className="row m-1">
<h3><span><FaRupeeSign/></span> {e.amount}</h3>
</div>
<div className="row">

<p>Debited - {e.debited_name}</p>
</div>
<div className="row">
<p>Status : {e.status}</p>
</div>
          </div>
        </div>
       
       <div className="row text-end">
       <p>{e.date}</p>
       </div>
      </div>
     
    )}
  </div>
))}


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
<MdArrowForwardIos/>
                  </button>
</div>
</div>
    
    
    
    
    </>
  )
}

export default PaymentPage