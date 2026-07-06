import type {Socket} from "socket.io-client";
import {emit} from "./socketEmit";
import type {MessageSendDto} from "./types.ts";

export const messageApi = {
    send(socket: Socket, payload: MessageSendDto) {
        return emit<{ userId: string }>(
            socket,
            "message:send",
            payload
        );
    },
};