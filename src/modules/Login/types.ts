import type {Socket} from "socket.io-client";
import type {Dispatch, SetStateAction} from "react";

export type LoginProps = {
    socket: Socket | undefined;
    setIsErrorMessage: Dispatch<SetStateAction<string>>,
    setIsUserId: Dispatch<SetStateAction<string>>,
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>,
    handleRequestRooms: () => Promise<void>
}