import {Button, CopyButton, Flex, ScrollArea, Stack, Text, Textarea, Title, UnstyledButton} from "@mantine/core";
import {IconCheck, IconCopy, IconSend} from "@tabler/icons-react";
import type {IMessage} from "./types.ts";
import {messageApi} from "../../api/message.api.ts";
import type {MessageSendDto} from "../../api/types.ts";
import {useSendMessageForm} from "../../forms/message.form.ts";
import {useSocket} from "../../hooks/useSocket.ts";
import {Message} from "../../components/Message/Message.tsx";
import {useAppSelector} from "../../store/store.ts";
import {type KeyboardEvent, useEffect} from "react";
import {useActions} from "../../hooks/useActions.ts";


export const Room = () => {
    const socket = useSocket();
    const {setNewMessage} = useActions();

    const {messages} = useAppSelector(state => state.message);
    const {currentRoom} = useAppSelector(state => state.room);

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

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Shift + Enter = перенос строки (поведение по умолчанию)
                return;
            }
            e.preventDefault();
            sendMessageForm.onSubmit(handleSubmitMessage)();
        }
    };

    useEffect(() => {
        socket.on('message:new', (message: IMessage) => {
            setNewMessage(message)
        })
    }, []);

    return (
        <Stack h='calc(100dvh - 100px)'>
            {currentRoom && (
                <>
                    <Flex direction="column">
                        <Title style={{color: 'var(--mantine-color-blue-filled)'}}>
                            {currentRoom.name || currentRoom.id} - {currentRoom.memberCount}
                        </Title>
                        <Flex align='center' gap='5px' m='auto'>
                            <Text>Invite code: {currentRoom.inviteCode}</Text>
                            <CopyButton value={currentRoom.inviteCode}>
                                {({copied, copy}) => (
                                    <Button size='xs'
                                            color={copied ? 'teal' : 'blue'}
                                            onClick={copy}
                                    >
                                        {copied ? <IconCheck size={16}/> : <IconCopy size={16}/>}
                                    </Button>
                                )}
                            </CopyButton>
                        </Flex>
                    </Flex>
                    <ScrollArea h='100%' offsetScrollbars>
                        {messages.map((message) => (
                            <Message message={message} key={message.id}/>
                        ))}
                    </ScrollArea>
                    <form onSubmit={sendMessageForm.onSubmit(handleSubmitMessage)}>
                        <Flex align='flex-end' gap='10px'>
                            <Textarea
                                style={{width: '100%'}}
                                autosize
                                label='Message'
                                placeholder='Your message'
                                onKeyDown={handleKeyDown}
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