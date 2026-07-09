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
        setMessageRequestState(
            state,
            action: PayloadAction<{
                key: MessageRequestKey;
                isLoading: boolean;
                error?: string;
            }>
        ) {
            const {key, isLoading, error} = action.payload;

            state.loadingByKey[key] = isLoading;

            if (error !== undefined) {
                if (error) {
                    state.errorByKey[key] = error;
                } else {
                    delete state.errorByKey[key];
                }
            }
        }
    }
});

export const messageActions = messageSlice.actions;
export const messageReducer = messageSlice.reducer;