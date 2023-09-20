import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../Redux/Store'
import { getComplaints, updateComplaint } from '../../Redux/Slice/UserSlice'
import Swal from "sweetalert2";
import { toast, Toaster } from "react-hot-toast";


const Complaints = () => {

const {allcomplaint}=useAppSelector((state)=>state.user)
console.log(allcomplaint,'allcomplaint')
  const dispatch=useAppDispatch()

  useEffect(()=>{
  dispatch(getComplaints())
  
},[])

const handleshowImage = (url: string,message:string) =>
Swal.fire({
  imageUrl: url,
  imageWidth: 300,
  imageHeight: 300,
  imageAlt: "Custom image",
  text: message
});


const handlecancel=(complaintId:string)=>{
  const formdata={
      complaintId
  }

  dispatch(updateComplaint(formdata)).then((data)=>{
      if(data.payload.status==='success'){
          toast.success('complaint solved')
          dispatch(getComplaints())
      }
  })
}
  return (
    <>

<Toaster toastOptions={{ duration: 3000 }} />
{allcomplaint.length>0 ?
    <div className="row mt-3 mx-auto">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>image</th>
                      <th>Name</th>
                      <th>Complaint</th>
                      <th>Date</th>
                      <th>Screenshot</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allcomplaint.map((e: any, index: number) => (
                      <tr key={e._id}>
                        <td>{index + 1}</td>
                        <td
                          className="table_image mx-auto text-center"
                          style={{ width: "10px", height: "20px" }}
                        >
                       
                           <img  className="img-fluid" src={e.user
? e.user[0].profileImage: "https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-1024.png"}
                    alt=""
                  
                  />
                        </td>
  
                        <td>{e.user[0].username}</td>
                        <td>{e.message}</td>
                        <td>{e.date}</td>
                        
                        <td
                          className="table_image mx-auto text-center"
                          style={{ width: "10px", height: "20px",cursor:'pointer' }}
                          onClick={() => handleshowImage(e.scrnshot,e.message)}
                        >
                       
                           <img  className="img-fluid" src={e.scrnshot
? e.scrnshot: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/No_Screenshot.svg/1200px-No_Screenshot.svg.png"}
                    alt=""
                  
                  />
                        </td>
                     
                        <td>
                          <button
                            className="btn btn-dark"
                            onClick={() =>
                              handlecancel(e._id)
                            }
                          >


                            {e.status==="resolve" ? "Resolve" : "Solved"}
                          </button>
                        </td>
                      </tr>
                    ))}

                    {allcomplaint.length === 0 && <td className='text-center m-auto'>Empty list......!</td>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      :

      <div className="row text-center ">
                  <h4 className="mt-5 ">No complaints</h4>
                </div>
}


    </>
  )
}

export default Complaints