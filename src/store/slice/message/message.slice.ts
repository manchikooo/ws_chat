import type {IMessage} from "../../../modules/Room/types.ts";
import type {IInitialState} from "./message.types.ts";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

const initialState: IInitialState = {
    messages: [],
};

export const messageSlice = createSlice({
    name: 'message/slice',
    initialState,
    reducers: {
        setMessages(state, action: PayloadAction<IMessage[]>) {
            state.messages = action.payload;
        },
        setNewMessage(state, action: PayloadAction<IMessage>) {
            state.messages = [...state.messages, action.payload];
        },

    }
});

export const messageActions = messageSlice.actions;
export const messageReducer = messageSlice.reducer;
