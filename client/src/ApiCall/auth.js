import { axiosInstance } from "./index.js";

export const signupUser=async(user)=>{
    try{
        const response=await axiosInstance.post('/api/auth/signup',user);
        return response.data;
    }catch(e){
        return e;
    }
}

export const loginUser=async(user)=>{
    try{
        const response=await axiosInstance.post('/api/auth/login',user);
        return response.data;
    }catch(e){
        return e.response?.data || { success: false, message: "Something went wrong" };
    }
}