import { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getLoggedUser,getAllUser} from "./../ApiCall/user.js";
import {getAllchat} from "./../ApiCall/chat.js";
import { useDispatch, useSelector } from "react-redux";

import { hideLoader, showLoader } from "../redux/loaderSlice.js";
import { setUser, setAllUsers,setAllChats } from "../redux/userSlice.js";

function ProtectedRoute({children}){
    const {user}=useSelector(state=>state.userReducer);
 
    //call every time when restart, refresh application

    const navigate=useNavigate();
   const dispatch=useDispatch();
    const getLogeddInUser=async()=>{
        try{    
            dispatch(showLoader());
            const response=await getLoggedUser();
            dispatch(hideLoader());
            if(response.success){
                
                dispatch(setUser(response.data));
            }else{
                toast.error(response.message);
                navigate('/login');
            }
        }catch(err){
            dispatch(hideLoader());
            navigate('/login');
        }
    }

    const getAllUsers = async()=>{
        try{
            dispatch(showLoader());
            const response=await getAllUser();
            dispatch(hideLoader());

            if(response?.success){
                dispatch(setAllUsers (response.data));
            }else{
                toast.error(response.message);
                navigate('/login');
            }
        }catch(e){
     
            dispatch(hideLoader());
            navigate('/login');
           
        }
    }

    const getAllChats=async()=>{
        try{
            dispatch(showLoader());
            const response=await getAllchat();
            dispatch(hideLoader());
            if(response.success){
                
                dispatch(setAllChats(response.data));
            }else{
                toast.error(response.message);
                navigate('/login');
            }
        }catch(e){
            navigate('/login')
        }
    }
    useEffect(()=>{
        if(localStorage.getItem('token')){
            //details of current user
            getLogeddInUser(); 
            getAllUsers();
            getAllChats();

        }else{
            navigate('/login');
            
        }
    },[]);
    return <div>
        {children}
    </div>
}

export default ProtectedRoute;