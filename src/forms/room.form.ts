import {useForm} from "@mantine/form";
import type {RoomCreateDto, RoomJoinDto} from "../api/types.ts";
import type {RoomType} from "../modules/Room/types.ts";

export function useCreateRoomForm() {
    return useForm<RoomCreateDto>({
        initialValues: {
            name: '',
            type: 'DIRECT' as RoomType
        },
        validate: {
            name: (value: string) =>
                value.trim().length > 0 ? null : 'Name is required'
        }
    })
}

export function useJoinRoomForm() {
    return useForm<RoomJoinDto>({
        initialValues: {
            inviteCode: '',
        },
        validate: {
            inviteCode: (value: string) =>
                value.trim().length > 0 ? null : 'Invite code is required',
        }
    })
}