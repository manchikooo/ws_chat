import {Button, CopyButton, Flex, ScrollArea, Stack, Text, TextInput, Title, UnstyledButton} from "@mantine/core";
import {IconCheck, IconCopy, IconSend} from "@tabler/icons-react";
import type {RoomProps} from "./types.ts";
import {messageApi} from "../../api/message.api.ts";
import type {MessageSendDto} from "../../api/types.ts";
import {useSendMessageForm} from "../../forms/message.form.ts";

export const Room = ({socket, activeRoom, messages}: RoomProps) => {
    const sendMessageForm = useSendMessageForm()

    const handleSubmitMessage = async (values: MessageSendDto) => {
        if (!activeRoom || !socket) return

        const data = await messageApi.send(socket, {
            content: values.content,
            roomId: activeRoom.id
        })

        if (!data) return

        sendMessageForm.reset()
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