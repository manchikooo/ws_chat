import {useForm} from "@mantine/form";
import type {UserJoinDto} from "../api/types.ts";

export function useUserJoinForm() {
    return useForm<UserJoinDto>({
        initialValues: {
            name: '',
        },
        validate: {
            name: (value: string) => (value.trim().length > 0) ? null : 'Name is required',
        },
    })
}