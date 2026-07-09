import {Button, CopyButton, Flex, ScrollArea, Stack, Text, Textarea, Title} from "@mantine/core";
import {IconCheck, IconCopy, IconSend} from "@tabler/icons-react";
import type {IMessage} from "./types.ts";
import type {MessageSendDto} from "../../api/types.ts";
import {useSendMessageForm} from "../../forms/message.form.ts";
import {useSocket} from "../../hooks/useSocket.ts";
import {Message} from "../../components/Message/Message.tsx";
import {useAppSelector} from "../../store/store.ts";
import {type KeyboardEvent, useCallback, useEffect} from "react";
import {useActions} from "../../hooks/useActions.ts";
import {useMessageApi} from "../../hooks/api/useMessageApi.ts";
import {
    selectIsSendMessageLoading,
    selectMessageError,
    selectMessages
} from "../../store/slice/message/message.selectors.ts";
import {selectCurrentRoom} from "../../store/slice/room/room.selectors.ts";

export const Room = () => {
    const {socket} = useSocket();
    const {setNewMessage} = useActions();
    const {send} = useMessageApi();

    const messages = useAppSelector(selectMessages);
    const currentRoom = useAppSelector(selectCurrentRoom);
    const isSendMessageLoading = useAppSelector(selectIsSendMessageLoading)
    const sendError = useAppSelector(selectMessageError("send"));

    const sendMessageForm = useSendMessageForm();

    const handleSendMessage = useCallback(async (values: MessageSendDto) => {
        if (!currentRoom) return;

        const result = await send(currentRoom.id, values.content);

        if (!result) return;

        sendMessageForm.reset();
    }, [currentRoom, send, sendMessageForm]);

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            if (e.shiftKey) return;

            e.preventDefault();
            sendMessageForm.onSubmit(handleSendMessage)();
        }
    }, [sendMessageForm, handleSendMessage]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message: IMessage) => {
            setNewMessage(message);
        };

        socket.on("message:new", handleNewMessage);

        return () => {
            socket.off("message:new", handleNewMessage);
        };
    }, [socket, setNewMessage]);

    if (!currentRoom) {
        return (
            <Stack h="calc(100dvh - 100px)">
                <Text c="dimmed" ta="center" mt="xl">
                    Select a room to start chatting
                </Text>
            </Stack>
        );
    }

    return (
        <Stack h="calc(100dvh - 100px)">
            <Flex direction="column">
                <Title style={{color: "var(--mantine-color-blue-filled)"}}>
                    {currentRoom.name || currentRoom.id} - {currentRoom.memberCount}
                </Title>

                <Flex align="center" gap="5px" m="auto">
                    <Text>Invite code: {currentRoom.inviteCode}</Text>

                    <CopyButton value={currentRoom.inviteCode}>
                        {({copied, copy}) => (
                            <Button
                                size="xs"
                                color={copied ? "teal" : "blue"}
                                onClick={copy}
                            >
                                {copied ? <IconCheck size={16}/> : <IconCopy size={16}/>}
                            </Button>
                        )}
                    </CopyButton>
                </Flex>
            </Flex>

            <ScrollArea h="100%" offsetScrollbars>
                {messages.map((message) => (
                    <Message messageId={message.id} key={message.id}/>
                ))}
            </ScrollArea>

            <form onSubmit={sendMessageForm.onSubmit(handleSendMessage)}>
                <Flex align="flex-start" gap="10px">
                    <Textarea
                        style={{width: "100%"}}
                        autosize
                        label="Message"
                        placeholder="Your message (Enter to send, Shift+Enter for new line)"
                        onKeyDown={handleKeyDown}
                        {...sendMessageForm.getInputProps("content")}
                        error={sendMessageForm.errors.content || sendError}
                    />

                    <Button
                        type="submit"
                        variant="filled"
                        color="blue"
                        mt="25px"
                        loading={isSendMessageLoading}
                    >
                        <IconSend/>
                    </Button>
                </Flex>
            </form>
        </Stack>
    );
};