import {Button, CopyButton, Flex, ScrollArea, Stack, Text, TextInput, Title, UnstyledButton} from "@mantine/core";
import {IconCheck, IconCopy, IconSend} from "@tabler/icons-react";
import type {IMessage} from "./types.ts";
import {messageApi} from "../../api/message.api.ts";
import type {MessageSendDto} from "../../api/types.ts";
import {useSendMessageForm} from "../../forms/message.form.ts";
import {useSocket} from "../../hooks/useSocket.ts";
import {Message} from "../../components/Message/Message.tsx";
import {useAppSelector} from "../../store/store.ts";
import {useEffect} from "react";
import {useActions} from "../../hooks/useActions.ts";

export const Room = () => {
    const socket = useSocket();
    const {setNewMessage} = useActions();

    const {currentRoom, messages} = useAppSelector(state => state.room);

    const sendMessageForm = useSendMessageForm()

    const handleSubmitMessage = async (values: MessageSendDto) => {
        if (!currentRoom || !socket) return

        const data = await messageApi.send(socket, {
            content: values.content,
            roomId: currentRoom.id
        })
        if (!data) return
        sendMessageForm.reset()
    }

    useEffect(() => {
        socket.on('message:new', (message: IMessage) => {
            setNewMessage(message)
        })
    }, []);

    return (
        <Stack>
            {currentRoom && (
                <>
                    <Title>
                        {currentRoom.name || currentRoom.id} - {currentRoom.memberCount}
                    </Title>
                    <Flex>
                        <Text>Invite code: {currentRoom.inviteCode}</Text>
                        <CopyButton value={currentRoom.inviteCode}>
                            {({copied, copy}) => (
                                <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                                    {copied ? <IconCheck size={16}/> : <IconCopy size={16}/>}
                                </Button>
                            )}
                        </CopyButton>
                    </Flex>
                    <ScrollArea h='70dvh' offsetScrollbars>
                        {messages.map((message) => (
                            <Message message={message} key={message.id}/>
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