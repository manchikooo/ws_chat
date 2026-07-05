import {Button, CopyButton, Flex, ScrollArea, Stack, Text, TextInput, Title, UnstyledButton} from "@mantine/core";
import {IconCheck, IconCopy, IconSend} from "@tabler/icons-react";
import type {RoomProps} from "./types.ts";
import {useForm} from "@mantine/form";
import {emit} from "../../api/socketEmit.ts";

export const Room = ({socket, activeRoom, messages}: RoomProps) => {

    const sendMessageForm = useForm({
        initialValues: {
            content: '',
        }
    })

    const handleSubmitMessage = async (values: { content: string }) => {
        if (!activeRoom) return
        const data = await emit<{ ok: boolean, id: string }>(socket, "message:send", {
            content: values.content,
            roomId: activeRoom.id
        })
        if (data) {
            sendMessageForm.reset()
        }
    }
    return (
        <Stack>
            {activeRoom && (
                <>
                    <Title>
                        {activeRoom.name || activeRoom.id} - {activeRoom.memberCount}
                    </Title>
                    <Flex>
                        <Text>Invite code: {activeRoom.inviteCode}</Text>
                        <CopyButton value={activeRoom.inviteCode}>
                            {({copied, copy}) => (
                                <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                                    {copied ? <IconCheck size={16}/> : <IconCopy size={16}/>}
                                </Button>
                            )}
                        </CopyButton>
                    </Flex>
                    <ScrollArea h='70dvh'>
                        {messages.map((message) => (
                            <Text key={message.id}>
                                {message.senderName}:{message.content}
                            </Text>
                        ))}
                    </ScrollArea>
                    <form onSubmit={sendMessageForm.onSubmit(handleSubmitMessage)}>
                        <Flex align='flex-end' gap='10px'>
                            <TextInput
                                withAsterisk
                                label='Message'
                                placeholder='Your message'
                                {...sendMessageForm.getInputProps('content')} />
                            <UnstyledButton type='submit'>
                                <IconSend/>
                            </UnstyledButton>
                        </Flex>
                    </form>
                </>)}
        </Stack>
    )
}