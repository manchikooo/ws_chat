import type {IMessage} from "../../../modules/Room/types.ts";
import type {IInitialState, MessageRequestKey} from "./message.types.ts";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

const initialState: IInitialState = {
    messages: [],
    editingMessageId: null,
    loadingByKey: {},
    errorByKey: {}
};

export const messageSlice = createSlice({
    name: "message/slice",
    initialState,
    reducers: {
        setMessages(state, action: PayloadAction<IMessage[]>) {
            state.messages = action.payload;
        },
        setNewMessage(state, action: PayloadAction<IMessage>) {
            state.messages.push(action.payload);
        },
        setEditingMessageId(state, action: PayloadAction<string | null>) {
            state.editingMessageId = action.payload;
        },
        setMessageLoading(
            state,
            action: PayloadAction<{ key: MessageRequestKey; isLoading: boolean }>
        ) {
            state.loadingByKey[action.payload.key] = action.payload.isLoading;
        },
        setMessageError(
            state,
            action: PayloadAction<{ key: MessageRequestKey; error: string }>
        ) {
            state.errorByKey[action.payload.key] = action.payload.error;
        },
        clearMessageError(state, action: PayloadAction<MessageRequestKey>) {
            delete state.errorByKey[action.payload];
        }
    }
});

export const messageActions = messageSlice.actions;
export const messageReducer = messageSlice.reducer;