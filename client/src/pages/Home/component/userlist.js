import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { create_new_chat } from "./../../../ApiCall/chat.js"
import { hideLoader, showLoader } from "../../../redux/loaderSlice.js";
import { setAllChats, setselectedChat } from "../../../redux/userSlice.js";
import moment from 'moment';
import { useEffect } from "react";
import store from "../../../redux/store.js";

export default function Userlist({ searchKey, socket,onlineUsers }) {
    const { setAllUsers, allChats, user: currentUser } = useSelector(state => state.userReducer);
    const dispatch = useDispatch();

    const createNewChat = async (searchedUserId) => {
        try {
            dispatch(showLoader());
            const response = await create_new_chat([currentUser._id, searchedUserId]);
            dispatch(hideLoader());

            if (response.success) {
                toast.success(response.message);
                const new_chat = response.data;
                const updated_chat = [...allChats, new_chat];
                dispatch(setAllChats(updated_chat));
                dispatch(setselectedChat(new_chat));
            }
        } catch (err) {
            toast.error(err.response?.message || err.message || "Failed to create chat"); // Fixed toast.err to toast.error
            dispatch(hideLoader());
        }
    }

    const openChat = async (selectedUserId) => {
        const chat = allChats.find(chat => 
            chat.members?.some(m => m?._id === currentUser._id) && 
            chat.members?.some(m => m?._id === selectedUserId)
        );
        if (chat) {
            dispatch(setselectedChat(chat));
        }
    }

    const get_last_message = (userId) => {
        const chat = allChats.find(chat => chat.members?.some(m => m?._id === userId));
        if (!chat || !chat.lastMessage?.text) {
            return "";
        }
        
        const msgPrefix = chat.lastMessage.sender === currentUser._id ? "You" : "";
        const messageText = chat.lastMessage.text.substring(0, 20);

        return (
            <div className="last-message">
                {msgPrefix && <span className="you-prefix">{msgPrefix}: </span>}
                {messageText}
                {chat.lastMessage.text.length > 20 && '...'}
            </div>
        );
    }

    const get_last_message_Time = (userId) => {
        const chat = allChats.find(chat => chat.members?.some(m => m?._id === userId));
        if (!chat || !chat.lastMessage?.createdAt) {
            return "";
        }
        return moment(chat.lastMessage.createdAt).format('hh:mm A');
    }

    const get_unread_message_cnt = (userId) => {
        const chat = allChats.find(chat => chat.members?.some(m => m?._id === userId));
        
        if (chat?.unreadMessage && chat.lastMessage?.sender !== currentUser._id) {
            return chat.unreadMessage;
        }
        return "";
    }
    
    function getData() {
        if (searchKey === "") {
            return allChats || [];
        } else {
            return (setAllUsers || []).filter(user => {
                const firstName = user?.firstname?.toLowerCase() || "";
                const lastName = user?.lastname?.toLowerCase() || "";
                const searchTerm = searchKey?.toLowerCase() || "";
                
                return firstName.includes(searchTerm) || lastName.includes(searchTerm);
            });
        }
    }

    useEffect(() => {

        socket.on('receive-message', (message) => {
            const selectedChat = store.getState().userReducer.selectedChat;
            let allchat = store.getState().userReducer.allChats || [];
            
            if (selectedChat?._id !== message.chatId) {
                const updated_chat = allchat.map(chat => {
                    if (chat._id === message.chatId) {
                        return {
                            ...chat,
                            unreadMessage: (chat?.unreadMessage || 0) + 1,
                            lastMessage: message
                        };
                    }
                    return chat;
                });
                allchat = updated_chat;
            }
            
            const lastestchat = allchat.find(chat => chat._id === message.chatId);
            const otherchat = allchat.filter(chat => chat._id !== message.chatId);
            allchat = lastestchat ? [lastestchat, ...otherchat] : otherchat;
            dispatch(setAllChats(allchat));
        });


        // Cleanup function
        return () => {
            socket.off('receive-message');
        };
    }, [socket, dispatch]);

    const data = getData();

    return (
        data.map(obj => {
            let user = obj;
            
            // If it's a chat object, find the other user
            if (obj.members) {
                user = obj.members.find(mem => mem?._id !== currentUser._id) || {};
            }
            
            // Safe email handling
            const email = user?.email || "";
            const username = email ? email.split('@')[0] + "@" : "user@";
            
            // Safe name handling
            const firstName = user?.firstname || "Unknown";
            const lastName = user?.lastname || "User";
            const displayName = `${firstName} ${lastName}`.trim().toUpperCase();
            
            // Safe profile pic handling
            const profilePic = user?.profilepic;
            const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();

            return (
                <div className="user-search-filter" onClick={() => openChat(user?._id)} key={user?._id || Math.random()}>
                    <div className="filterd-user">
                        <div className="filter-user-display">
                            <div className="Logo_user">
                                {profilePic ? (
                                    <img src={profilePic} 
                                    alt="Profile Pic" 
                                    className="user-profile-pic-image" 
                                    style={onlineUsers.includes(user._id)? {border:'greeen 8px solid'}:{}} />
                                ) : (
                                    <div className="user-deafult-profile-pic" 
                                        style={onlineUsers.includes(user._id)? {border:'greeen 8px solid'}:{}}>
                                            {initials}
                                    </div>
                                )}
                            </div>
                            <div className="filter-user-details">
                                <div className="user-display-name">{displayName}</div>
                                <div className="user-display-email">
                                    {get_last_message(user?._id) || username}
                                </div>
                            </div>
                        </div>
                        <div className="time_message">
                            <div>{get_unread_message_cnt(user?._id)}</div>
                            <div>{get_last_message_Time(user?._id)}</div>
                        </div>
                        {!allChats?.find(chat => 
                            chat.members?.some(m => m?._id === user?._id)
                        ) && (
                            <div className="user-start-chat">
                                <button 
                                    className="user-start-chat-btn" 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering openChat
                                        createNewChat(user?._id);
                                    }}
                                >
                                    chat
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            );
        })
    );
}