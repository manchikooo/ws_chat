import type {Socket} from "socket.io-client";
import {emit} from "./socketEmit";
import type {UserJoinDto} from "./types.ts";

export const userApi = {
    join(socket: Socket, payload: UserJoinDto) {
        return emit<{ userId: string }>(
            socket,
            "user:join",
            payload
        );
    },

};