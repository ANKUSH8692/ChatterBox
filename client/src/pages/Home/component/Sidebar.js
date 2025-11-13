import { useState } from "react";
import Searchbar from "./Searchbar.js";
import Userslist from "./userlist.js";
import "./../../../home.css"


import '@fortawesome/fontawesome-free/css/all.min.css';

export default function SideBar({socket,onlineUsers}){
    const [searchKey,setSearchKey]=useState('');

    return (
        
        
            <div className="app-sidebar">
                <Searchbar 
                    searchKey={searchKey}
                    setSearchKey={setSearchKey}
                />

            <div className="list">
                <Userslist searchKey={searchKey} socket={socket} onlineUsers=
                {onlineUsers}/>
            </div>
                
            
        </div>
    );
}