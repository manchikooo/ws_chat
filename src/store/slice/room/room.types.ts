import type {IMessage, IRoom} from "../../../modules/Room/types";

export interface IInitialState {
    rooms: IRoom[];
    messages: IMessage[];
    currentRoom: IRoom | null
}
