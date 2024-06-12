import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sideBarOpen:true,
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSideBarOpen:(state)=>{
        state.sideBarOpen=!state.sideBarOpen;
    }
  },
});

export const { setSideBarOpen } =
  sidebarSlice.actions;

export default sidebarSlice.reducer;
