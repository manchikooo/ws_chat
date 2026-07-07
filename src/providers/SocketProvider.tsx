import {type PropsWithChildren, useEffect, useState,} from "react";
import {io} from "socket.io-client";
import {BACKEND_URL} from "../constants/URL";
import {SocketContext} from "./SocketContext";


export function SocketProvider({children}: PropsWithChildren) {
    const [socket] = useState(() => io(BACKEND_URL));

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected");
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

