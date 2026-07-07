import type {MessageProps} from "./types.ts";
import {useAppSelector} from "../../store/store.ts";
import {useSocket} from "../../hooks/useSocket.ts";
import {messageApi} from "../../api/message.api.ts";
import {ActionIcon, Badge, Button, Flex, Paper, Textarea} from "@mantine/core";
import {IconX} from "@tabler/icons-react";
import {useActions} from "../../hooks/useActions.ts";
import type {IMessage} from "../../modules/Room/types.ts";
import {useEffect, useState, type KeyboardEvent, useCallback} from "react";

export const Message = ({message}: MessageProps) => {
    const socket = useSocket()

    const {setMessages} = useActions()

    const {currentUserId} = useAppSelector(state => state.user);
    const {messages} = useAppSelector(state => state.message);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editedContent, setEditedContent] = useState<string>(message.content);

    const {senderId, id: messageId, content, createdAt, updatedAt} = message;
    const amISender = currentUserId === senderId;

    const handleSave = useCallback(async () => {
        const data = await messageApi.edit(socket, {
            messageId,
            content: editedContent
        })

        if (!data) {
            return
        }

        setEditMode(false);
    }, [messageId, socket, editedContent])

    const handleCancel = useCallback(() => {
        setEditedContent(content);
        setEditMode(false);
    }, [content])

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSave()
        }
        if (e.key === 'Escape') handleCancel()
    }, [handleSave, handleCancel])

    const handleDoubleClick = useCallback(() => {
        if (amISender) setEditMode(true)
    }, [amISender])

    useEffect(() => {
        const handleMessageUpdated = (updatedMessage: IMessage) => {
            const updatedMessages = messages.map(msg =>
                msg.id === updatedMessage.id ? updatedMessage : msg
            );
            setMessages(updatedMessages);
        };
        socket.on('message:updated', handleMessageUpdated)

        return () => {
            socket.off('message:updated', handleMessageUpdated)
        }
    }, [messages, setMessages, socket]);

    if (editMode) {
        return (
            <Flex py='5px' gap='10px' justify={amISender ? 'flex-end' : 'flex-start'}>
                <Flex gap='8px' direction='column' align='flex-end'>
                    <Textarea value={editedContent}
                              onChange={(e) => setEditedContent(e.currentTarget.value)}
                              onKeyDown={handleKeyDown}
                              autoFocus
                              autosize
                              styles={{
                                  input: {
                                      minWidth: '400px',
                                  }
                              }}
                    />
                    <Flex gap='5px'>
                        <Button
                            variant="filled"
                            color="blue"
                            size="xs"
                            onClick={handleSave}
                        >
                            Сохранить
                        </Button>
                        <ActionIcon color="red" variant="filled" onClick={handleCancel}>
                            <IconX size={16}/>
                        </ActionIcon>
                    </Flex>
                </Flex>
            </Flex>
        );
    }

    return (
        <Flex py='5px' gap='10px' justify={amISender ? 'flex-end' : 'flex-start'}>
            <Paper
                px='10px'
                py='6px'
                shadow="xs"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '5px',
                    backgroundColor: amISender ? '#3A66A2' : '#1E2B3B',
                    maxWidth: '400px',
                    cursor: amISender ? 'pointer' : 'default',
                    color: '#fff',
                    wordWrap: 'break-word',
                }}
                onDoubleClick={handleDoubleClick}
            >
                {content}
                {createdAt !== updatedAt && <Badge size='sm'>исправлено</Badge>}
            </Paper>
        </Flex>
    );
};