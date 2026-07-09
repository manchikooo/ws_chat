import type {IRoom} from "../../../modules/Room/types.ts";
import type {IInitialState, RoomRequestKey} from "./room.types.ts";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

const initialState: IInitialState = {
    rooms: [],
    currentRoom: null,
    loadingByKey: {},
    errorByKey: {}
};

export const roomSlice = createSlice({
    name: "room/slice",
    initialState,
    reducers: {
        setRooms(state, action: PayloadAction<IRoom[]>) {
            state.rooms = action.payload;
        },
        setCurrentRoom(state, action: PayloadAction<IRoom | null>) {
            state.currentRoom = action.payload;
        },
        setRoomRequestState(
            state,
            action: PayloadAction<{
                key: RoomRequestKey;
                isLoading: boolean;
                error?: string;
            }>
        ) {
            const {key, isLoading, error} = action.payload;

            state.loadingByKey[key] = isLoading;

            if (error) {
                state.errorByKey[key] = error;
            } else {
                delete state.errorByKey[key];
            }
        }
    }
});

export const roomActions = roomSlice.actions;
export const roomReducer = roomSlice.reducer;