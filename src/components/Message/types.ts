import type {IMessage} from "../../modules/Room/types.ts";

export interface MessageProps {
    messageId: string;
}

export interface MessageEditorProps {
    initialContent: string;
    amISender: boolean;
    onSave: (content: string) => void;
    onCancel: () => void;
}

export interface MessageViewProps {
    message: IMessage;
    amISender: boolean;
    onDoubleClick: () => void;
}
