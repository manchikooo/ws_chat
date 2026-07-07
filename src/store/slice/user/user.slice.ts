import type {IInitialState} from "./user.types.ts";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

const initialState: IInitialState = {
    currentUserId: '',
    isLoggedIn: false
};

export const userSlice = createSlice({
    name: 'userInfo/slice',
    initialState,
    reducers: {
        setCurrentUserId(state, action: PayloadAction<string>) {
            state.currentUserId = action.payload;
        },
        setIsLoggedIn(state, action: PayloadAction<boolean>) {
            state.isLoggedIn = action.payload;
        }
    }
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
