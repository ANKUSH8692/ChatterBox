import { axiosInstance,BASE_URL } from "./index.js";

export const create_new_message=async(message)=>{
    try{
        const response=await axiosInstance.post(`${BASE_URL}/api/message/new-message`,message);
        return response.data;
    }catch(err){
        return err;
    }
}
export const get_all_message=async(chatId)=>{
    try{
        const response=await axiosInstance.get(`${BASE_URL}/api/message/get_message/${chatId}`);
        return response.data;
    }catch(err){
        return err;
    }
}
