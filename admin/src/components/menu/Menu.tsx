import { Link, useNavigate } from "react-router-dom";
import "./menu.scss";
import { menu } from "../../data";
import { useAppDispatch } from "../../Redux/Store";
import { logoutUser } from "../../Redux/Slice/AuthSlice";

const Menu = () => {
  const navigate=useNavigate()
  const dispatch=useAppDispatch()
  const handlelogout=()=>{
dispatch(logoutUser())
    navigate('/login')
  }
  return (
    <div className="menu">
      {menu.map((item) => (
        <div className="item" key={item.id}>
          <span className="title">{item.title}</span>
          {item.listItems.map((listItem) => (
            <Link to={listItem.url} className="listItem" key={listItem.id}>
              <img src={listItem.icon} alt="" />
              <span className="listItemTitle">{listItem.title}</span>
            </Link>
          ))}
        </div>
      ))}


      <p className="text-light text-end mx-auto" style={{cursor:"pointer"}} onClick={handlelogout}> <span> <img src='../user.svg' alt="" /></span> logout</p>
    </div>

  );
};

export default Menu;
