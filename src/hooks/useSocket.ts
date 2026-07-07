import {useContext} from "react";
import {SocketContext} from "../providers/SocketContext.ts";

export function useSocket() {
    const socket = useContext(SocketContext);

    if (!socket) {
        throw new Error("SocketProvider is missing");
    }

    return socket;
}