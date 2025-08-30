import Headers from "./component/header";
import SideBar from "./component/Sidebar";
export default function HomePage(){
    return (
        <div className="home-page">
            <Headers />
            <div className="main-content">
                <SideBar/>
            </div>
        </div>
    );
}