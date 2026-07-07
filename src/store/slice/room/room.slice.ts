import type {IRoom} from "../../../modules/Room/types.ts";
import type {IInitialState} from "./room.types.ts";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

const initialState: IInitialState = {
    rooms: [],
    currentRoom: null
};

export const roomSlice = createSlice({
    name: 'room/slice',
    initialState,
    reducers: {
        setRooms(state, action: PayloadAction<IRoom[]>) {
            state.rooms = action.payload;
        },
        setCurrentRoom(state, action: PayloadAction<IRoom | null>) {
            state.currentRoom = action.payload;
        }
    }
});

export const roomActions = roomSlice.actions;
export const roomReducer = roomSlice.reducer;
