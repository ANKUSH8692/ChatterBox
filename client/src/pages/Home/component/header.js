
//import "../../../home.css"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

export default function Headers({ socket }) {
  const { user } = useSelector(state => state.userReducer);
  const Navigate = useNavigate();

  function getFullName() {
    let fname = user?.firstname.toUpperCase();
    let lname = user?.lastname.toUpperCase();
    return fname + " " + lname;
  }

  function getLogo() {
    if(user?.profilePic){
      return <img className="profile-img" src={user?.profilePic} alt="Profile"/>;
    }

    let f = user?.firstname.toUpperCase()[0];
    let l = user?.lastname.toUpperCase()[0];
    return f + "" + l;
  }

  function Logout() {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    Navigate('/login');
    socket.emit('user-offline',user._id);
  }
  return (
    <div className="flex-container">
      <div className="logo-section">
        <div className="logo">Chat BOX 💬</div>
      </div>

      <div className="user-section">
        <div className="profile-icon" onClick={() => Navigate('/profile')}>
          <div id="userLogo">{getLogo()}</div>
        </div>
        <div className="user-name" id="userName">{getFullName()}</div>
        <div className="Logout">
          <button className="fa fa-power-off" id="logout-btn" onClick={Logout}>

          </button>
        </div>
      </div>
    </div>
  );
}