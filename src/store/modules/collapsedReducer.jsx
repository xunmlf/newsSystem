import { createSlice } from "@reduxjs/toolkit";


const collapsedSlice = createSlice({
    name: "collapsed",
    initialState: {
        isCollapsed: false,
    },
    reducers: {
        changeCollapsed(state) {
            state.isCollapsed = !state.isCollapsed;
        },
    },
});

export const { changeCollapsed } = collapsedSlice.actions;

const collapsedReducer = collapsedSlice.reducer;

export default collapsedReducer;
