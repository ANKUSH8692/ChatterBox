import "../../../home.css"

import { useDispatch, useSelector } from "react-redux";

export default function Headers(){
    function getFullName(){
        let fname=user?.firstname.toUpperCase();
        let lname=user?.lastname.toUpperCase();
        return fname+" "+lname;
    }
    function getLogo(){
        let f=user?.firstname.toUpperCase()[0];
        let l=user?.lastname.toUpperCase()[0];
        return f+""+l;
    }
    const {user}=useSelector(state=>state.userReducer);
    return(
        <div className="app-header">
            <div className="app-logo">
                
                Chat BOX 💬
            </div>
            <div className="app-use-profile">
                <div className="logged-user-name">{getFullName()}</div>
                <div className="logged-user-Profile">{getLogo()}</div>
            </div>
        </div>
    );
}