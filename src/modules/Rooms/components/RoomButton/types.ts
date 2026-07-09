import type {IRoom} from "../../../Room/types.ts";

export interface RoomButtonProps {
    room: IRoom;
    isRoomsLoading: boolean;
    onJoinRoom: (inviteCode: string, requestKey: `joinByRoomButton-${string}`) => void;
}