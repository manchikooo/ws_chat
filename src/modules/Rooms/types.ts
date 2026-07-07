import type {IMessage, IRoom} from "../Room/types.ts";
import type {Dispatch, SetStateAction} from "react";

export type RoomsProps = {
    rooms: IRoom[];
    handleRequestRooms: () => Promise<void>;
    setActiveRoom: Dispatch<SetStateAction<IRoom | null>>;
    setMessages: Dispatch<SetStateAction<IMessage[]>>;
}