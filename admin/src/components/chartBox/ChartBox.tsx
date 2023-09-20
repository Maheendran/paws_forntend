import { Link } from "react-router-dom";
import "./chartBox.scss";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

type Props = {

  title: string;
  count:number

};

const ChartBox = (props: Props) => {
  return (

    <>
    <div className="main_bg">
          <h3 className="heading">{props.title}</h3>    
    <h1 className="value">{props.count}</h1>
    </div>

    </>
  );
};

export default ChartBox;
