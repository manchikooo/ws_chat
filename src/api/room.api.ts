import type {Socket} from "socket.io-client";
import {emit} from "./socketEmit";
import type {IMessage, IRoom} from "../modules/Room/types.ts";
import type {RoomCreateDto, RoomHistoryDto, RoomJoinDto} from "./types.ts";

export const roomApi = {
    list(socket: Socket) {
        return emit<IRoom[]>(socket, "room:list");
    },

    create(socket: Socket, payload: RoomCreateDto) {
        return emit<{ room: IRoom }>(
            socket,
            "room:create",
            payload
        );
    },

    join(socket: Socket, payload: RoomJoinDto) {
        return emit<{ room: IRoom }>(
            socket,
            "room:join",
            payload
        );
    },

    history(socket: Socket, payload: RoomHistoryDto) {
        return emit<{ messages: IMessage[] }>(
            socket,
            "room:history",
            payload
        );
    },
};