import {axiosInstance,BASE_URL} from "./index.js"
export const getAllchat=async()=>{
    try{
        const response=await axiosInstance.get(`${BASE_URL}/api/chat/get-all-chats`);
        return response.data;
    }catch(err){
        return err;
    }
}
export const create_new_chat=async(members)=>{
    try{
        const response=await axiosInstance.post(`${BASE_URL}/api/chat/create-new-chat`,{members});
        return response.data;
    }catch(err){
        return err;
    }
}

export const clear_unread_msg_cnt=async(chatId)=>{
    try{
        const response=await axiosInstance.post(`${BASE_URL}/api/chat/clear_unread_msg`,{chatId});
        return response.data;
    }catch(err){
        return err;
    }
}