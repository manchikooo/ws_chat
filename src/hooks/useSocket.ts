import {useContext} from "react";
import {SocketContext, type ConnectionStatusType} from "../providers/SocketContext.ts";
import type {Socket} from "socket.io-client";

interface UseSocketReturn {
    socket: Socket;
    isConnected: boolean;
    connectionStatus: ConnectionStatusType;
}

export function useSocket(): UseSocketReturn {
    const context = useContext(SocketContext);

    if (!context) {
        throw new Error("SocketProvider is missing");
    }

    if (!context.socket) {
        throw new Error("Socket is not initialized");
    }

    return {
        socket: context.socket,
        isConnected: context.isConnected,
        connectionStatus: context.connectionStatus
    };
}