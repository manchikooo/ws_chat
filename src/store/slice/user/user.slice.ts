import type {IInitialState} from "./user.types.ts";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

const initialState: IInitialState = {
    currentUserId: '',
    isLoggedIn: false,
    isLoading: false,
    error: undefined
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
        },
        setUserLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setUserError(state, action: PayloadAction<string | undefined>) {
            state.error = action.payload;
        },
        clearUserError(state) {
            state.error = undefined;
        }
    }
});


export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
