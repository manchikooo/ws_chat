import type {RoomType} from "../modules/Room/types.ts";

export interface RoomCreateDto {
    name: string,
    type: RoomType
}

export interface RoomJoinDto {
    inviteCode: string;
}

export interface RoomHistoryDto {
    roomId: string;
}

export interface MessageSendDto {
    content: string;
    roomId: string;
}

export interface MessageEditDto {
    messageId: string;
    content: string;
}

export interface UserJoinDto {
    name: string,
    userId?: string
}

