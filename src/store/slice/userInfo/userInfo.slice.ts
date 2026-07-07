import type {IInitialState} from "./userInfo.types.ts";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

const initialState: IInitialState = {
    currentUserId: ''
};

export const userInfoSlice = createSlice({
    name: 'userInfo/slice',
    initialState,
    reducers: {
        setCurrentUserId(state, action: PayloadAction<string>) {
            state.currentUserId = action.payload;
        }
    }
});

export const userInfoActions = userInfoSlice.actions;
export const userInfoReducer = userInfoSlice.reducer;
