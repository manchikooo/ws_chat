import type {Socket} from "socket.io-client";
import {emit} from "./socketEmit";
import type {MessageEditDto, MessageSendDto} from "./types.ts";

export const messageApi = {
    send(socket: Socket | undefined, payload: MessageSendDto) {
        return emit<{ ok: boolean; id: string }>(
            socket,
            "message:send",
            payload
        );
    },
    edit(socket: Socket | undefined, payload: MessageEditDto) {
        return emit<{ ok: boolean }>(
            socket,
            "message:edit",
            payload
        );
    }
};