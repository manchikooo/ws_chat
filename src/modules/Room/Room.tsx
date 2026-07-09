import {Button, CopyButton, Flex, ScrollArea, Stack, Text, Textarea, Title} from "@mantine/core";
import {IconCheck, IconCopy, IconSend} from "@tabler/icons-react";
import type {IMessage} from "./types.ts";
import {messageApi} from "../../api/message.api.ts";
import type {MessageSendDto} from "../../api/types.ts";
import {useSendMessageForm} from "../../forms/message.form.ts";
import {useSocket} from "../../hooks/useSocket.ts";
import {Message} from "../../components/Message/Message.tsx";
import {useAppSelector} from "../../store/store.ts";
import {type KeyboardEvent, useCallback, useEffect} from "react";
import {useActions} from "../../hooks/useActions.ts";

export const Room = () => {
    const {socket} = useSocket();
    const {setNewMessage, setMessageRequestState} = useActions();

    const {messages, loadingByKey} = useAppSelector(state => state.message);
    const isSendMessageLoading = loadingByKey.send ?? false;

    const {currentRoom} = useAppSelector(state => state.room);

    const sendMessageForm = useSendMessageForm();

    const handleSendMessage = useCallback(async (values: MessageSendDto) => {
        if (!currentRoom) return;

        setMessageRequestState({key: "send", isLoading: true});

        try {
            const data = await messageApi.send(socket, {
                content: values.content,
                roomId: currentRoom.id
            });

            if (!data) {
                setMessageRequestState({
                    key: "send",
                    isLoading: false,
                    error: "Не удалось отправить сообщение"
                });
                return;
            }

            sendMessageForm.reset();
        } catch {
            setMessageRequestState({
                key: "send",
                isLoading: false,
                error: "Произошла ошибка при отправке сообщения"
            });
        } finally {
            setMessageRequestState({key: "send", isLoading: false});
        }
    }, [currentRoom, socket, sendMessageForm, setMessageRequestState]);

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            if (e.shiftKey) return;

            e.preventDefault();
            sendMessageForm.onSubmit(handleSendMessage)();
        }
    }, [sendMessageForm, handleSendMessage]);

    useEffect(() => {
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
                <Flex align="flex-end" gap="10px">
                    <Textarea
                        style={{width: "100%"}}
                        autosize
                        label="Message"
                        placeholder="Your message (Enter to send, Shift+Enter for new line)"
                        onKeyDown={handleKeyDown}
                        {...sendMessageForm.getInputProps("content")}
                    />

                    <Button
                        type="submit"
                        variant="filled"
                        color="blue"
                        loading={isSendMessageLoading}
                    >
                        <IconSend/>
                    </Button>
                </Flex>
            </form>
        </Stack>
    );
};