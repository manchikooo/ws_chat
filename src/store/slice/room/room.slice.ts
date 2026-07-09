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
        setRoomLoading(
            state,
            action: PayloadAction<{ key: RoomRequestKey; isLoading: boolean }>
        ) {
            state.loadingByKey[action.payload.key] = action.payload.isLoading;
        },
        setRoomError(
            state,
            action: PayloadAction<{ key: RoomRequestKey; error: string }>
        ) {
            state.errorByKey[action.payload.key] = action.payload.error;
        },
        clearRoomError(state, action: PayloadAction<RoomRequestKey>) {
            delete state.errorByKey[action.payload];
        }
    }
});

export const roomActions = roomSlice.actions;
export const roomReducer = roomSlice.reducer;