import Headers from "./component/header";
import SideBar from "./component/Sidebar";
import ChatArea from "./component/chat"

import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io('http://localhost:5001');

export default function HomePage() {

    const { selectedChat, user } = useSelector(state => state.userReducer);
    const [onlineUsers, setOnlineUser] = useState([]);
    useEffect(() => {
        if (user) {
            socket.emit('join-room', user._id);
            socket.emit('user-login', user._id);
            socket.on('online-users', users => {
                setOnlineUser(users);
            })
            socket.on('updated-online-users', users => {
                setOnlineUser(users);
            })
        }
    }, [user,onlineUsers]);

    return (
        <div>
            <Headers socket={socket}/>
            <div className="main-content">

                    <div className="sidebar-container">
                        <SideBar socket={socket} onlineUsers={onlineUsers} />
                    </div>

                <div className="chat-container">
                    {selectedChat && <ChatArea socket={socket} />}
                </div>
            </div>
        </div>
    );
}