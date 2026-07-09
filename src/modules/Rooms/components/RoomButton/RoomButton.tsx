import {memo, useMemo} from "react";
import {makeSelectIsJoinByRoomButtonLoading} from "../../../../store/slice/room/room.selectors.ts";
import {useAppSelector} from "../../../../store/store.ts";
import {Button} from "@mantine/core";
import type {RoomButtonProps} from "./types.ts";

export const RoomButton = memo(({room, isRoomsLoading, onJoinRoom}: RoomButtonProps) => {
    const selectIsJoinByRoomButtonLoading = useMemo(() => makeSelectIsJoinByRoomButtonLoading(), []);
    const isJoinByRoomButtonLoading = useAppSelector(state =>
        selectIsJoinByRoomButtonLoading(state, room.id)
    );

    return (
        <Button
            onClick={() => onJoinRoom(room.inviteCode, `joinByRoomButton-${room.id}`)}
            loading={isJoinByRoomButtonLoading}
            disabled={isRoomsLoading}
        >
            {room.name}
        </Button>
    );
});