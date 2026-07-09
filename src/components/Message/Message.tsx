import type {MessageProps} from "./types.ts";
import {useAppSelector} from "../../store/store.ts";
import {useSocket} from "../../hooks/useSocket.ts";
import {messageApi} from "../../api/message.api.ts";
import {useActions} from "../../hooks/useActions.ts";
import type {IMessage} from "../../modules/Room/types.ts";
import {useEffect, useState, useCallback, memo} from "react";
import {MessageView} from "./MessageView.tsx";
import {MessageEditor} from "./MessageEditor.tsx";

const messageEditEvents = new EventTarget();

const MessageComponent = ({messageId}: MessageProps) => {
    const {socket} = useSocket();
    const {setMessages, setMessageRequestState} = useActions();

    const {currentUserId} = useAppSelector(state => state.user);
    const {messages, loadingByKey} = useAppSelector(state => state.message);

    const message = useAppSelector(state =>
        state.message.messages.find(m => m.id === messageId)
    );

    const isEditMessageLoading = loadingByKey.edit ?? false;

    const senderId = message?.senderId;
    const actualMessageId = message?.id;

    const [editMode, setEditMode] = useState<boolean>(false);

    const amISender = currentUserId === senderId;

    const handleSave = useCallback(async (newContent: string) => {
        if (!actualMessageId) return;

        setMessageRequestState({key: "edit", isLoading: true});

        try {
            const data = await messageApi.edit(socket, {
                messageId: actualMessageId,
                content: newContent
            });

            if (!data) {
                setMessageRequestState({
                    key: "edit",
                    isLoading: false,
                    error: "Не удалось изменить сообщение"
                });
                return;
            }

            setEditMode(false);
        } catch {
            setMessageRequestState({
                key: "edit",
                isLoading: false,
                error: "Произошла ошибка при изменении сообщения"
            });
        } finally {
            setMessageRequestState({key: "edit", isLoading: false});
        }
    }, [socket, actualMessageId, setMessageRequestState]);

    const handleCancel = useCallback(() => {
        setEditMode(false);
    }, []);

    const handleDoubleClick = useCallback(() => {
        if (!amISender || !actualMessageId) return;

        messageEditEvents.dispatchEvent(
            new CustomEvent("message:edit", {
                detail: actualMessageId
            })
        );
    }, [amISender, actualMessageId]);

    useEffect(() => {
        const handleEditMessage = (event: Event) => {
            const customEvent = event as CustomEvent<string>;

            setEditMode(customEvent.detail === actualMessageId);
        };

        messageEditEvents.addEventListener("message:edit", handleEditMessage);

        return () => {
            messageEditEvents.removeEventListener("message:edit", handleEditMessage);
        };
    }, [actualMessageId]);

    useEffect(() => {
        const handleMessageUpdated = (updatedMessage: IMessage) => {
            const updatedMessages = messages.map(msg =>
                msg.id === updatedMessage.id ? updatedMessage : msg
            );

            setMessages(updatedMessages);
        };

        socket.on("message:updated", handleMessageUpdated);

        return () => {
            socket.off("message:updated", handleMessageUpdated);
        };
    }, [messages, setMessages, socket]);

    if (!message) return null;

    if (editMode) {
        return (
            <MessageEditor
                initialContent={message.content}
                amISender={amISender}
                onSave={handleSave}
                onCancel={handleCancel}
                isLoading={isEditMessageLoading}
            />
        );
    }

    return (
        <MessageView
            message={message}
            amISender={amISender}
            onDoubleClick={handleDoubleClick}
        />
    );
};

export const Message = memo(MessageComponent);