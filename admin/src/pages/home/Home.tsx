import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/Store";
import BarChartBox from "../../components/barChartBox/BarChartBox";
import BigChartBox from "../../components/bigChartBox/BigChartBox";
import ChartBox from "../../components/chartBox/ChartBox";
import PieChartBox from "../../components/pieCartBox/PieChartBox";
import TopBox from "../../components/topBox/TopBox";
import {
  barChartBoxRevenue,
  // barChartBoxVisit,
  chartBoxConversion,
  chartBoxProduct,
  chartBoxRevenue,
} from "../../data";
import "./home.scss";
import { getAllClinic, getAllPetOwner, getGraphData } from "../../Redux/Slice/UserSlice";

const Home = () => {
  const dispatch = useAppDispatch();
const {adminDetail,clinicList}=useAppSelector((state)=>state.user)

const[ownerLength,setOwnerLength]=useState(0)
const[clnicLength,setClinicLength]=useState(0)
const[userUserGraph,setUserGraph]=useState([])
const[userClinicGraph,setClinicGraph]=useState([])
useEffect(()=>{
  dispatch(getAllPetOwner()).then((data) => {
    setOwnerLength(data.payload.usersList.length);
  });
  dispatch(getGraphData()).then((data)=>{
    setUserGraph(data.payload?.user.userResult)
    setClinicGraph(data.payload?.user.clinicResult)
  })

    dispatch(getAllClinic()).then((data) => {
    
      setClinicLength(data.payload.usersList.length);
  });
  
},[])

const userUserGraphlist = {
  title: "users",
  color: "#FF8042",
  dataKey: "count",
  chartData: [{count:1,date:"20-09-2023"},{count:1,date:"20-09-2023"},{count:1,date:"20-09-2023"}]}

  const userClinicGraphlist = {
    title: "clinic",
    color: "#FF8042",
    dataKey: "count",
    chartData: userClinicGraph}

console.log(userUserGraph,'userGraph')

  return (
    <div className="home">
       <div className="box ">
        <ChartBox  title={'Total earnings'} count={adminDetail.wallet}/>
      </div>
      <div className="box ">
        <ChartBox  title={'Total Users'} count={ownerLength}/>
      </div>
      <div className="box ">
        <ChartBox title={'Total Clinics'} count={clnicLength} />
      </div>
      <div className="box ">
        <BarChartBox {...userUserGraphlist} />
      </div>
      <div className="box ">
        <BarChartBox {...userClinicGraphlist} />
      </div>
    </div>
  );
};

export default Home;
