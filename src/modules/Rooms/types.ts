import type {IMessage, IRoom} from "../Room/types.ts";
import {Socket} from "socket.io-client";
import type {Dispatch, SetStateAction} from "react";

export type RoomsProps = {
    socket: Socket | undefined;
    rooms: IRoom[];
    handleRequestRooms: () => Promise<void>;
    setActiveRoom: Dispatch<SetStateAction<IRoom | null>>;
    setMessages: Dispatch<SetStateAction<IMessage[]>>;
}