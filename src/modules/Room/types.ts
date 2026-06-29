import type {Socket} from "socket.io-client";

export type RoomProps = {
    socket: Socket | undefined;
    activeRoom: IRoom | null;
    messages: IMessage[];
}

export type RoomType = "DIRECT" | "GROUP"

export interface IRoom {
    id: string    // UUID комнаты
    type: RoomType
    name: string | null // Название
    inviteCode: string    // 10-символьный nanoid
    createdAt: string    // ISO 8601
    memberCount: number    // Число участников
}

export type MessageStatus = "SENT" | "DELIVERED" | "READ"

export interface IMessage {
    id: string    // UUID сообщения
    content: string    // Текст (пусто если удалено)
    roomId: string    // Комната
    senderId: string    // UUID отправителя
    senderName: string    // Имя отправителя
    status: MessageStatus
    isDeleted: boolean   // true если мягко удалено
    createdAt: string    // ISO 8601
    updatedAt: string    // ISO 8601 (отличается если редактировано)
}

