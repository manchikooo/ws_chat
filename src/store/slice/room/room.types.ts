import type {IRoom} from "../../../modules/Room/types";

export interface IInitialState {
    rooms: IRoom[];
    currentRoom: IRoom | null;
    loadingByKey: Record<string, boolean>
    errorByKey: Record<string, string | undefined>
}

export type RoomRequestKey =
    | "list"
    | "create"
    | "joinByInviteCode"
    | `joinByRoomButton-${string}`;

