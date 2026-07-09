import type {IMessage} from "../../../modules/Room/types.ts";

export interface IInitialState {
    messages: IMessage[];
    loadingByKey: Record<string, boolean>;
    errorByKey: Record<string, string | undefined>;
    editingMessageId: string | null
}

export type MessageRequestKey = "edit" | "send";