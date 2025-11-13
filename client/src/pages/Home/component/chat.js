import { useDispatch, useSelector } from "react-redux";
import "./../../../chatArea.css"
import { create_new_message, get_all_message } from "../../../ApiCall/message.js";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { clear_unread_msg_cnt } from "../../../ApiCall/chat.js";
import toast from "react-hot-toast";
import { useEffect, useState, useMemo } from "react";
import store from './../../../redux/store.js'
import { setAllChats } from "../../../redux/userSlice.js";
import Emojipicker from 'emoji-picker-react';

export default function ChatArea({ socket }) {
    const dispatch = useDispatch();

    const { selectedChat, user, allChats } = useSelector(state => state.userReducer);

    const selectedUser = selectedChat?.members?.find(u => u._id !== user._id);

    const [istyping, setistyping] = useState(false);
    const [message, setmessage] = useState('');
    const [allmessages, setallmessage] = useState([]);
    const [showEmojiPicker, setshowEmojiPicker] = useState(false);
    const [data,setData] = useState(null);

    // Helper function to get current server time
    const getCurrentServerTime = () => {
        return new Date(Date.now());
    };

    // Helper function to group messages by date using server time
    const groupMessagesByDate = (messages) => {
        if (!messages || messages.length === 0) return [];

        const groups = [];
        let currentDate = null;
        let currentGroup = null;

        messages.forEach(message => {
            // Use server-provided createdAt timestamp
            const messageDate = new Date(message.createdAt).toDateString();

            if (messageDate !== currentDate) {
                currentDate = messageDate;
                currentGroup = {
                    date: currentDate,
                    messages: []
                };
                groups.push(currentGroup);
            }

            currentGroup.messages.push(message);
        });

        return groups;
    };

    // Use useMemo to optimize grouping calculation
    const groupedMessages = useMemo(() => {
        return groupMessagesByDate(allmessages);
    }, [allmessages]);

    const send_message = async (image) => {
        try {
            const text = (message || '').trim();
            if (!text && !image) return;
            const new_message = {
                chatId: selectedChat._id,
                sender: user._id,
                text: message.trim(),
                image:image,
                // Don't send timestamp from client - let server handle it
            }

            socket.emit('send-message', {
                ...new_message,
                members: selectedChat.members.map(m => m._id),
                read: false,
                createdAt: Date.now(),
            })


            const response = await create_new_message(new_message);


            if (response.success) {
                setmessage('');
                // Refresh messages after sending new one to get server timestamp
                setshowEmojiPicker(false);
                getmessage();
            }
        } catch (err) {

            toast.error(err.message);
        }
    }

    const getmessage = async () => {
        try {
            dispatch(showLoader());
            const response = await get_all_message(selectedChat._id);
            dispatch(hideLoader());
            if (response.success) {
                // Sort messages by server timestamp
                const sortedMessages = response.data.sort((a, b) =>
                    new Date(a.createdAt) - new Date(b.createdAt)
                );
                setallmessage(sortedMessages);
            }
        } catch (err) {
            dispatch(hideLoader());
            toast.error(err.message);
        }
    }

    const clear_unread_message = async () => {
        try {
            socket.emit('clear-unread-message', {
                chatId: selectedChat._id,
                members: selectedChat.members.map(m => m._id)
            })
            const response = await clear_unread_msg_cnt(selectedChat._id);
            if (response.success) {
                allChats.map(chat => {
                    if (chat._id === selectedChat._id) {
                        return response.data;
                    }
                    return chat;
                })
            }
        } catch (err) {

            toast.err(err.message);
        }
    }


    // Format date for display using server time
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = getCurrentServerTime();
        const today = new Date(now);
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    }

    // Show message time using server time
    const formatMessageTime = (timestamp) => {
        const messageTime = new Date(timestamp);
        return messageTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    const sendImage=async(event)=>{

        const file=event.target.files[0];
        if (!file) return;
        const reader=new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend=async()=>{
            send_message(reader.result);
        }
    }

    const onReceiveMessage = (message) => {
        const selectedChat = store.getState().userReducer.selectedChat;
            if (selectedChat._id === message.chatId) {
                setallmessage(prev_msg => [...prev_msg, message]);
            }
            if (selectedChat._id === message.chatId && message.sender !== user._id) {
                clear_unread_message();
            }
    }

    const onMessageCountClear = (data) => {
        const selectedChat = store.getState().userReducer.selectedChat;
            const allchat = store.getState().userReducer.allChats;

            if (selectedChat?._id === data.chatId) {
                const updated_chats = allchat.map(chat => {
                    if (chat._id === data.chatId) {
                        return { ...chat, unreadMessage: 0 }
                    }
                    return chat
                });
                dispatch(setAllChats(updated_chats));
                setallmessage(prevMsg => {
                    return prevMsg.map(msg => {
                        return { ...msg, read: true }
                    })
                })
            }
    }

    const onUserTyping = (data) => {
        setData(data);
        if (selectedChat?._id === data.chatId && data.sender !== user._id) {
                setistyping(true);
                setTimeout(() => {
                    setistyping(false);
                }, 3000);
            }
    }

    useEffect(() => {
        if (selectedChat?._id) {
            getmessage();
            if (selectedChat?.lastMessage?.sender !== user._id) {
                clear_unread_message();
            }

        }

        socket.on('receive-message',onReceiveMessage)

        socket.on('message-count-clear',onMessageCountClear);

        socket.on('user-typing-response',onUserTyping)

        return ()=>{
            socket.off('receive-message',onReceiveMessage);
            socket.off('message-count-clear',onMessageCountClear);
            socket.off('user-typing-response',onUserTyping);
        }
        //orr
        // socket.off('event-1').on('event-1,()=>{  });

    }, [selectedChat]);

    useEffect(() => {
        const msg_container = document.getElementById('main-chat-area');
        msg_container.scrollTop = msg_container.scrollHeight;
    }, [allmessages]);

    return (
        <div className="ChatArea">
            {
                <div className="app-chat-area">
                    <div className="app-chat-area-header">
                        {selectedUser.firstname + "  " + selectedUser?.lastname}
                    </div>

                    <div className="main-chat-area" id="main-chat-area">
                        {groupedMessages.map((group, groupIndex) => (
                            <div key={groupIndex} className="message-group">
                                {/* Date Separator */}
                                <div className="date-separator">
                                    <div className="date-separator-line"></div>
                                    <div className="date-separator-text">
                                        {formatDate(group.date)}
                                    </div>
                                    <div className="date-separator-line"></div>
                                </div>

                                {/* Messages for this date group */}
                                {group.messages.map((msg, msgIndex) => {
                                    const iscurr_user_sender = msg.sender === user._id;
                                    return (
                                        <div key={msgIndex} className="message-container">
                                            <div className={iscurr_user_sender ? "send-message" : "receiver-message"}>
                                                <div className="message-text">{msg.text}</div>
                                                <div>{msg.image && <img src={msg.image} alt="sent-img" height="100" width="100" />}</div>
                                                <p></p>
                                                <div className="message-time">
                                                    {formatMessageTime(msg.createdAt)}
                                                </div>

                                            </div>
                                            <div className="Read-message">
                                                {iscurr_user_sender && msg.read && <i className="fa fa-check-circle" aria-hidden="true" style={{ color: "green" }}></i>}
                                            </div>

                                        </div>


                                    );

                                })}

                            </div>

                        ))}
                        <div className="typing">{istyping && selectedChat?.members.map(m=>m._id).includes(data?.sender) && <i>typing...</i>}</div>
                    </div>
                    {showEmojiPicker && (
                        <div className="emoji-picker-wrapper">
                            <button className="emoji-close-btn" onClick={() => setshowEmojiPicker(false)}>✕</button>
                            <Emojipicker
                                onEmojiClick={(e) => setmessage(message + e.emoji)}
                            />
                        </div>
                    )}
                    <div className="send-message-div">
                        <input
                            type="text"
                            className="send-message-input"
                            placeholder="Type a message"
                            value={message}
                            onChange={(e) => {
                                setmessage(e.target.value)
                                socket.emit('user-typing', {
                                    chatId: selectedChat._id,
                                    members: selectedChat.members.map(m => m._id),
                                    sender: user._id
                                })
                            }
                            }
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    send_message();
                                }
                            }}
                        />
                        <label>
                            <i className="fa-solid fa-image send-image-btn"></i>
                            <input type="file" id ="file" 
                            className="send-image-input" style={{display:'none'}} 
                            accept="image/*" onChange={sendImage}
                            />
                        </label>
                        <button
                            className="smiley-btn"
                            aria-hidden="true"

                            onClick={() => { setshowEmojiPicker(!showEmojiPicker) }}
                        >😊</button>

                        <button
                            className="fa fa-paper-plane send-message-btn"
                            aria-hidden="true"
                            onClick={()=>send_message()}
                            // disabled={!message.trim() && !message.image}
                        ></button>
                    </div>
                </div>
            }
        </div>
    );
}