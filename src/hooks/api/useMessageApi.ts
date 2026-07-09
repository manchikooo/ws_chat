import {useCallback} from "react";
import {useSocket} from "../useSocket.ts";
import {useActions} from "../useActions.ts";
import {messageApi} from "../../api/message.api.ts";
import type {IMessage} from "../../modules/Room/types.ts";

export const useMessageApi = () => {
    const {socket} = useSocket();

    const {
        setMessageLoading,
        setMessageError,
        clearMessageError,
        setMessages
    } = useActions();

    const edit = useCallback(async (messageId: string, content: string) => {
        clearMessageError("edit");

        setMessageLoading({
            key: "edit",
            isLoading: true
        });

        const result = await messageApi.edit(socket, {
            messageId,
            content
        });

        setMessageLoading({
            key: "edit",
            isLoading: false
        });

        if (!result.ok) {
            setMessageError({
                key: "edit",
                error: result.error
            });
            return null;
        }

        return result.data;
    }, [socket, clearMessageError, setMessageLoading, setMessageError]);

    const send = useCallback(async (roomId: string, content: string) => {
        clearMessageError("send");

        setMessageLoading({
            key: "send",
            isLoading: true
        });

        const result = await messageApi.send(socket, {
            roomId,
            content
        });

        setMessageLoading({
            key: "send",
            isLoading: false
        });

        if (!result.ok) {
            setMessageError({
                key: "send",
                error: result.error
            });
            return null;
        }

        return result.data;
    }, [socket, clearMessageError, setMessageLoading, setMessageError]);

    const updateMessageInStore = useCallback((messages: IMessage[], updatedMessage: IMessage) => {
        const updatedMessages = messages.map(message =>
            message.id === updatedMessage.id ? updatedMessage : message
        );

        setMessages(updatedMessages);
    }, [setMessages]);

    return {
        edit,
        send,
        updateMessageInStore
    };
};