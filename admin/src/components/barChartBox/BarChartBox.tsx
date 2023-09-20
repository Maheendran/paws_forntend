import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import "./barChartBox.scss";


type Props = {
  title: string;
  color: string;
  dataKey: string;
  chartData: object[];
};


const BarChartBox = (props: Props) => {

  
  return (
    // count: 1, date
    <div className="barChartBox">
      <h1>{props.title}</h1>
      <div className="chart">
        <ResponsiveContainer width="99%" height={150}>
          <BarChart data={props.chartData}>
          <XAxis dataKey="date" />
            <Tooltip
             
              contentStyle={{ background: "#2a3420", borderRadius: "5px" }}
              labelStyle={{ display: "none" }}
              cursor={{fill:"none"}}
            />
            <Bar dataKey={props.dataKey} fill={props.color} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

  );
};

export default BarChartBox;






