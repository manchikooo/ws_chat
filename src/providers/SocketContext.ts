import type {Socket} from "socket.io-client";
import {createContext} from "react";

export type ConnectionStatusType = 'connecting' | 'connected' | 'disconnected';

interface SocketContextValue {
    socket: Socket | null;
    isConnected: boolean;
    connectionStatus: ConnectionStatusType
}

export const SocketContext = createContext<SocketContextValue>({
    socket: null,
    isConnected: false,
    connectionStatus: 'disconnected'
});