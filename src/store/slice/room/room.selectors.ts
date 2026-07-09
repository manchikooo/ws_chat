import {createSelector} from "@reduxjs/toolkit";
import type {RootState} from "../../store";

const selectRoomState = (state: RootState) => state.room;

export const selectRooms = createSelector(
    [selectRoomState],
    room => room.rooms
);

export const selectCurrentRoom = createSelector(
    [selectRoomState],
    room => room.currentRoom
);

export const selectIsRoomsLoading = createSelector(
    [selectRoomState],
    room => room.loadingByKey.list ?? false
);

export const selectIsCreateRoomLoading = createSelector(
    [selectRoomState],
    room => room.loadingByKey.create ?? false
);


export const selectIsJoinByInviteCodeLoading = createSelector(
    [selectRoomState],
    room => room.loadingByKey.joinByInviteCode ?? false
);

export const selectCreateRoomError = createSelector(
    [selectRoomState],
    room => room.errorByKey.create
);

export const selectJoinByInviteCodeError = createSelector(
    [selectRoomState],
    room => room.errorByKey.joinByInviteCode
);

export const makeSelectIsJoinByRoomButtonLoading = () =>
    createSelector(
        [
            selectRoomState,
            (_: RootState, roomId: string) => roomId
        ],
        (room, roomId) => room.loadingByKey[`joinByRoomButton-${roomId}`] ?? false
    );