import {createSelector} from "@reduxjs/toolkit";
import type {RootState} from "../../store.ts";
import type {MessageRequestKey} from "./message.types.ts";

const selectMessageState = (state: RootState) => state.message;

export const selectMessages = createSelector(
    [selectMessageState],
    message => message.messages
);

export const selectEditingMessageId = createSelector(
    [selectMessageState],
    message => message.editingMessageId
);

export const selectIsEditMessageLoading = createSelector(
    [selectMessageState],
    message => message.loadingByKey.edit ?? false
);

export const selectIsSendMessageLoading = createSelector(
    [selectMessageState],
    message => message.loadingByKey.send ?? false
);

export const selectMessageError = (key: MessageRequestKey) =>
    createSelector(
        [selectMessageState],
        ({errorByKey}) => errorByKey[key]
    );

export const makeSelectMessageById = () =>
    createSelector(
        [
            selectMessages,
            (_: RootState, messageId: string) => messageId
        ],
        (messages, messageId) =>
            messages.find(message => message.id === messageId)
    );