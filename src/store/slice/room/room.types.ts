import type {IRoom} from "../../../modules/Room/types";

export interface IInitialState {
    rooms: IRoom[];
    currentRoom: IRoom | null
}
