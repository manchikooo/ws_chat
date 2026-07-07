import type {IMessage, IRoom} from "../../../modules/Room/types.ts";
import type {IInitialState} from "./room.types.ts";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

const initialState: IInitialState = {
    rooms: [],
    messages: [],
    currentRoom: null
};

export const roomSlice = createSlice({
    name: 'room/slice',
    initialState,
    reducers: {
        setRooms(state, action: PayloadAction<IRoom[]>) {
            state.rooms = action.payload;
        },
        setMessages(state, action: PayloadAction<IMessage[]>) {
            state.messages = action.payload;
        },
        setNewMessage(state, action: PayloadAction<IMessage>) {
            state.messages = [...state.messages, action.payload];
        },
        setCurrentRoom(state, action: PayloadAction<IRoom | null>) {
            state.currentRoom = action.payload;
        }
    }
});

export const roomActions = roomSlice.actions;
export const roomReducer = roomSlice.reducer;
