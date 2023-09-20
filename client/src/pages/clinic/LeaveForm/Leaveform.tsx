import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../Redux/Store'
import { GetallDoctors, UpdateDoctorleave, leaveCancel } from '../../../Redux/Slice/DoctorSlice'
import {SlCalender} from 'react-icons/sl'
import { toast, Toaster } from "react-hot-toast";
import LoadingComp from '../../../components/loading/LoadingComp';
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { useErrorBoundary } from 'react-error-boundary';
const Leaveform = () => {
    const startdateInputRef = useRef<HTMLInputElement>(null); 
    const enddateInputRef = useRef<HTMLInputElement>(null); 
const [doctorId,setDoctorId]=useState('')
const {doctorsList,doctorloading}=useAppSelector((state)=>state.doctor)
console.log(doctorsList,"doctorsList")
const dispatch=useAppDispatch()
const [endDate,setEndDate]=useState("")
const [startDate,setStartDate]=useState("")
const [currentDate,setCurrentDate]=useState('')
const[history,setHistory]=useState([])
const [currentPage, setCurrentPage] = useState(1);
const {showBoundary}=useErrorBoundary()
    useEffect(()=>{
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const standardDateFormat = `${year}-${month}-${day}`;
      setCurrentDate(standardDateFormat)
        if (startdateInputRef.current) {
            const currentDate = new Date().toISOString().split('T')[0];
            startdateInputRef.current.min = currentDate;
          }
  dispatch(GetallDoctors()).then((data)=>{
    if (data.payload.status === "Error") {
      return showBoundary(data.payload);
    }
  });
      },[])

    const handleDoctorTime=(doctorId:string)=>{

        setDoctorId(doctorId)}
        const handleStartdate=(e:any)=>{

          setStartDate(e.target.value)
          
          if (enddateInputRef.current) {
            enddateInputRef.current.min = e.target.value;
          }

        }
        const handleEnddate=(e:any)=>{
            setEndDate(e.target.value)
            
          if (startdateInputRef.current) {
            startdateInputRef.current.max = e.target.value;
          }
          }
          const handleApplyleave=(id:string)=>{
       
            setDoctorId(id)
            const doctorId=id
            const formdata={
            startDate,endDate,doctorId
            }
            dispatch(UpdateDoctorleave(formdata)).then((data)=>{
            
                if (data.payload.status === "Error") {
                  return showBoundary(data.payload);
                }
            
              if(data.payload.status==="success"){
            toast.success("Leave submitted")
            dispatch(GetallDoctors()).then((data)=>{
              if (data.payload.status === "Error") {
                return showBoundary(data.payload);
              }
            });
              }
            })
          }
          const handleLeaveform=(data:any,_id:string)=>{
           
            const formdata={
              startDate:data.startDate,
              endDate:data.endDate,
              doctorId:_id
            }
           

dispatch(leaveCancel(formdata)).then((data)=>{

    if (data.payload.status === "Error") {
      return showBoundary(data.payload);
    }

  if(data.payload.status==="success"){
toast.success("Leave cancelled")
dispatch(GetallDoctors()).then((data)=>{
  if (data.payload.status === "Error") {
    return showBoundary(data.payload);
  }
});
  }
})
          }

const [boxModel,seBoxModel]=useState(false)

          const handleHistory=(data:any)=>{
            console.log(data)
            setHistory(data)

            seBoxModel(!boxModel)
          }
       
          const itemsPerPage = 2;
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
           {doctorloading && <LoadingComp/>}
           <div className="container-fluid main_bg">
            
<h4 className='text-center pt-2'>Apply leave</h4>
 
  <div className="row">
    <div className="m-auto img-fluid doctors_list_box col-6 ">
    {displayData.map((data:any) => {
  if (data.verified==="verified") {
    return (
      <div className="row mb-3 p-3">
        <div className="col-3 mt-1 text-center ">
        <img  onClick={() => handleDoctorTime(data._id)}  
        className={`mx-auto img-fluid   ${doctorId === data._id ? 'choose-doctor' : 'unchoose-doctor'}`} src={data.profileImage? data.profileImage:"https://www.pngitem.com/pimgs/m/198-1985222_avatar-doctor-png-transparent-png.png"} alt=""
          />
           <p>{data.name}</p>
        
        </div>

        <div className="col-6">
       
        {data.leave?.startDate !==""?
        <div className="col-12 text-start">

          <p><span><SlCalender/> </span> Start date: {data.leave?.startDate}</p>
          <p> <span><SlCalender/> </span>End date: {data.leave?.endDate}</p>

 
    <div className="row">
<div className="col-3 m-auto">
{data.leave!=null &&
        <button onClick={()=>handleLeaveform(data.leave,data._id)} className='btn btn-danger '>cancel</button>

}
</div>
    </div>

        </div>
:
        <div>
    
    <div className="col-12">
        <div className="row text-start">
            <div className="col-6">
                <label>Start date</label>
                {/* ref={startdateInputRef} */}
                <input type="date" className='form-control' onChange={handleStartdate}   />
            </div>
            <div className="col-6">
            <label>End date</label>
                <input type="date" className='form-control' onChange={handleEnddate}  ref={enddateInputRef}/>
            </div>
        </div>
       
        {startDate  && endDate &&
    <div className="row  text-start mt-2 ">
        <div className="col-3 m-auto">

            <button className='btn btn-warning text-center' onClick={()=>handleApplyleave(data._id)}>Apply</button>
        </div>
    </div>
}

       

    </div>
   


  </div>
  }
   </div>
   <div className="col-2 m-auto">

<button className='btn btn-success mt-2' onClick={()=>handleHistory(data.leaveHistory)}>View leaves</button>
      

   </div>
   
      </div>
    );
  }
  return null; 
})}


    </div>

   { boxModel && <div  className='mx-auto img-fluid doctors_list_box text-center col-5'
    >
      <h3> Leaves history</h3>
      <hr />

      {history?.map((e:any)=>(
        <div className='row m-auto mb-2 leave_history p-3'>
          <div className="col-6">
          <p><span>Start date : </span> {e.startDate}</p>
          <p><span>End date : </span>{e.endDate}</p>
          </div>
      <div className="col-4 m-auto">
      <p> <span>Days : </span>{e.days}</p>
      </div>
        
        </div>


      ))}
    </div>}


  </div>


  <div className="row">
              <div className="col-2 m-auto text-center">
                <button
                  className=" pagination_btn m-auto"
                  disabled={currentPage === 1}
                  onClick={handlePrevPage}
                >
                  <MdArrowBackIosNew />
                </button>
                <button
                  className=" pagination_btn m-auto"
                  disabled={currentPage === totalPages}
                  onClick={handleNextPage}
                >
                  <MdArrowForwardIos />
                </button>
              </div>
            </div>


  </div>




    </>
  )
}

export default Leaveform