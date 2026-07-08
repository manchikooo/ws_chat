import {type PropsWithChildren, useEffect, useState} from "react";
import {io} from "socket.io-client";
import {BACKEND_URL} from "../constants/URL.ts";
import {SocketContext} from "./SocketContext.ts";

export function SocketProvider({children}: PropsWithChildren) {
    const [socket] = useState(() => io(BACKEND_URL));
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

    useEffect(() => {
        socket.on("connect", () => {
            setIsConnected(true);
            setConnectionStatus('connected');
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
            setConnectionStatus('disconnected');
        });

        socket.on("connect_error", () => {
            setConnectionStatus('disconnected');
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={{socket, isConnected, connectionStatus}}>
            {children}
        </SocketContext.Provider>
    );
}