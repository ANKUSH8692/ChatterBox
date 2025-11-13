import {createSlice} from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:'user',
    initialState:{user:null,
                  setAllUsers :[],
                  allChats:[],
                  selectedChat:null,
                },
    reducers:{
        setUser:(state,action)=>{state.user=action.payload;},
        setAllUsers:(state,action)=>{state.setAllUsers =action.payload;},
        setAllChats:(state,action)=>{state.allChats=action.payload},
        setselectedChat:(state,action)=>{state.selectedChat=action.payload},
    }
});

export const {setUser,setAllUsers,setAllChats,setselectedChat } =userSlice.actions;
export default userSlice.reducer;