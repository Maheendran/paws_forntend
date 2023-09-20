import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../Redux/Store'
import { addComplaint, cancelComplaint, getComplaint } from '../../../Redux/Slice/CompaintSlice'
import LoadingComp from '../../../components/loading/LoadingComp'
import toast, { Toaster } from 'react-hot-toast'
import { MdArrowBackIosNew,MdArrowForwardIos } from 'react-icons/md';
import { useErrorBoundary } from 'react-error-boundary'
const Complaint = () => {

    const[inputValue,setInputValue]=useState('')
const user =useAppSelector((state)=>state.user)
const {complaintLoading,complaintList}=useAppSelector((state)=>state.complaint)
    const dispatch=useAppDispatch()
    const {showBoundary}=useErrorBoundary()
const [showTable,setShowTable]=useState(false)
const hnadleHistory=()=>{
  setShowTable(!showTable)
    dispatch(getComplaint()).then((data)=>{
      if (data.payload.status === "Error") {
        return showBoundary(data.payload);
      }
    })
}

const handlecancel=(complaintId:string)=>{
    const formdata={
        complaintId
    }

    dispatch(cancelComplaint(formdata)).then((data)=>{
      if (data.payload.status === "Error") {
        return showBoundary(data.payload);
      }
        if(data.payload.status==='success'){
            toast.success('complaint cancelled')
            hnadleHistory()
        }
    })
}


const [scrnshot,setScrnshot]=useState<String | ArrayBuffer | null>('')
const handleFileChange = (e:any) => {
    const { files } = e.target;
    const file = files[0];
    previewFile(file);
  };
  
  function previewFile(file:any) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      setScrnshot(result);
       
    };
  
  
  }

  const handleComplaint=()=>{

if(inputValue.length>0){

    const inputDate = new Date('2023-09-18');
const formattedDate = `${inputDate.getDate()}-${(inputDate.getMonth() + 1)
.toString()
.padStart(2, '0')}-${inputDate.getFullYear()}`;

const formdata={
date:formattedDate,
userId:user?.currentUser._id,
message:inputValue,
status:"resolve",
scrnshot:scrnshot
}
dispatch(addComplaint(formdata)).then((data)=>{
  if (data.payload.status === "Error") {
    return showBoundary(data.payload);
  }
if(data.payload.status==='success'){
    toast.success('Raise new complaint')
}
setInputValue('')

})
}
else{
  toast.error('fill complaint field')
}



}

const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 3;
const handleNextPage = () => {

setCurrentPage((prevPage) => prevPage + 1);
setTimeout(() => {
 
}, 1000);
};
const handlePrevPage = () => {

setCurrentPage((prevPage) => prevPage - 1);
setTimeout(() => {

}, 1000); 

};
const totalPages = Math.ceil(complaintList.length / itemsPerPage);
const displayData = complaintList.filter((item, index: any) => {
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
return index >= startIndex && index < endIndex;
});


  return (
    <>

    <div className="main_bg">

 
  <Toaster toastOptions={{ duration: 3000 }} />
    {complaintLoading && <LoadingComp/> }
    <div className="conatiner text-center ">

<h3 className='text-center'>Raise Compaints</h3>
<div className="col-4 mx-auto">
    <label htmlFor="" >Screenshot(Optional)</label>
<input type="file" onChange={handleFileChange}  className='form-control' />
<br />
<label  >Complaint</label>
  <textarea className='form-control' placeholder='Mention complaint..'   onChange={(e)=>setInputValue(e.target.value)}/>
  <button type='submit' onClick={()=>handleComplaint()} className='btn btn-primary mt-2'>submit </button>
</div>


<button onClick={()=>hnadleHistory()} className='text-center m-auto btn btn-warning mt-5'>history</button>
    </div>
   

{showTable &&
  <div className="container mx-auto">
       <div className="row mt-3 mx-auto">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                     
                      <th>Complaint</th>
                      <th>Date</th>
                      <th>Action</th>
                      <th>Screenshot</th>
                     
                    </tr>
                  </thead>
                  <tbody>
                    {displayData?.map((e: any, index: number) => (
                      <tr key={e._id}>
                        <td>{index + 1}</td>
                      
                       
                        <td>{e.message}</td>
                        <td>{e.date}</td>
                        
                     
                     
                        <td>

{e.status==="resolve" ?
                          <button
                            className="btn btn-dark"
                            onClick={() =>
                              handlecancel(e._id)
                            }>
                            {e.status==="resolve" ? "Cancel" : "Solved"}
                          </button>
                          :
                          <button
                          className="btn btn-danger"
                          disabled={true}>
                          {e.status==="cancelled" ? "cancelled": 'solve' }
                        </button>
}


                        </td>
                           <td
                          className="table_image mx-auto text-center"
                          style={{ width: "10px", height: "20px",cursor:'pointer' }}
                          
                        >
                       
                           <img  className="img-fluid" src={e.scrnshot
? e.scrnshot: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/No_Screenshot.svg/1200px-No_Screenshot.svg.png"}
                    alt=""
                  
                  />
                        </td>
                      </tr>
                    ))}

                    {complaintList.length === 0 && <td className='text-center m-auto'>Empty list......!</td>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>}
    {/* pagination */}

{showTable &&  

<div className="container m-auto">


<div className="row text-center ">
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

</div>
}
</div>
    </>
  )
}

export default Complaint