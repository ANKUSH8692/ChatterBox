import { axiosInstance } from "./index.js"; 

export const getLoggedUser=async()=>{
    try{
        const response=await axiosInstance('api/user/get-logged-user');
        return response.data;
    }catch(err){
        return err;
    }
}
export const getAllUser=async()=>{
    try{
        const response=await axiosInstance('api/user/get-All-users');
        return response.data;
    }catch(err){
        return err;
    }
}