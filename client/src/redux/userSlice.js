import {createSlice} from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:'user',
    initialState:{user:null,alluser:[]},
    reducers:{
        setUser:(state,action)=>{state.user=action.payload;},
        setAlluser:(state,action)=>{state.alluser=action.payload;},
    }
});

export const {setUser,alluser} =userSlice.actions;
export default userSlice.reducer;