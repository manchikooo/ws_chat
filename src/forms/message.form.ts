import {useForm} from "@mantine/form";
import type {MessageSendDto} from "../api/types.ts";

export function useSendMessageForm() {
    return useForm<MessageSendDto>({
        initialValues: {
            content: '',
            roomId: '',
        }
    })
}
