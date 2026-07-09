import type {MessageProps} from "./types.ts";
import {useAppSelector} from "../../store/store.ts";
import {useActions} from "../../hooks/useActions.ts";
import type {IMessage} from "../../modules/Room/types.ts";
import {useEffect, useCallback, memo, useMemo} from "react";
import {MessageView} from "./MessageView.tsx";
import {MessageEditor} from "./MessageEditor.tsx";
import {useSocket} from "../../hooks/useSocket.ts";
import {useMessageApi} from "../../hooks/api/useMessageApi.ts";
import {
    makeSelectMessageById,
    selectEditingMessageId,
    selectIsEditMessageLoading,
    selectMessages
} from "../../store/slice/message/message.selectors.ts";
import {selectCurrentUserId} from "../../store/slice/user/user.selectors.ts";

const MessageComponent = ({messageId}: MessageProps) => {
    const {edit, updateMessageInStore} = useMessageApi()
    const {socket} = useSocket()
    const {setEditingMessageId} = useActions();

    const selectMessageById = useMemo(() => makeSelectMessageById(), []);

    const currentUserId = useAppSelector(selectCurrentUserId);
    const messages = useAppSelector(selectMessages);
    const editingMessageId = useAppSelector(selectEditingMessageId);
    const isEditMessageLoading = useAppSelector(selectIsEditMessageLoading);
    const message = useAppSelector(state => selectMessageById(state, messageId));

    const senderId = message?.senderId;
    const actualMessageId = message?.id;
    const amISender = currentUserId === senderId;
    const editMode = editingMessageId === actualMessageId;

    const handleSave = useCallback(async (newContent: string) => {
        if (!actualMessageId) return;

        const updatedMessage = await edit(actualMessageId, newContent);

        if (!updatedMessage) return;

        setEditingMessageId(null);
    }, [actualMessageId, edit, setEditingMessageId]);

    const handleCancel = useCallback(() => {
        setEditingMessageId(null);
    }, [setEditingMessageId]);

    const handleDoubleClick = useCallback(() => {
        if (!amISender || !actualMessageId) return;

        setEditingMessageId(actualMessageId);
    }, [amISender, actualMessageId, setEditingMessageId]);

    useEffect(() => {
        if (!socket) return;

        const handleMessageUpdated = (updatedMessage: IMessage) => {
            updateMessageInStore(messages, updatedMessage);
        };

        socket.on("message:updated", handleMessageUpdated);

        return () => {
            socket.off("message:updated", handleMessageUpdated);
        };
    }, [messages, socket, updateMessageInStore]);

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