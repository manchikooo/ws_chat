import {ActionIcon, Button, Flex, Textarea} from "@mantine/core";
import {IconX} from "@tabler/icons-react";
import {useState, type KeyboardEvent} from "react";
import type {MessageEditorProps} from "./types.ts";
import {useAppSelector} from "../../store/store.ts";
import {selectMessageError} from "../../store/slice/message/message.selectors.ts";

export const MessageEditor = ({
                                  initialContent,
                                  amISender,
                                  isLoading,
                                  onSave,
                                  onCancel
                              }: MessageEditorProps) => {
    const editError = useAppSelector(selectMessageError("edit"));

    const [editedContent, setEditedContent] = useState(initialContent);

    const isContentChanged = editedContent.trim() !== initialContent.trim();
    const isContentEmpty = editedContent.trim().length === 0;

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            if (isContentChanged && !isContentEmpty && !isLoading) {
                onSave(editedContent);
            }
        }

        if (e.key === "Escape" && !isLoading) {
            onCancel();
        }
    };

    return (
        <Flex py="5px" gap="10px" justify={amISender ? "flex-end" : "flex-start"}>
            <Flex gap="8px" direction="column" align="flex-end">
                <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.currentTarget.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    autoFocus
                    autosize
                    styles={{
                        input: {
                            minWidth: "400px"
                        }
                    }}
                    error={editError}
                />

                <Flex gap="5px">
                    <Button
                        variant="filled"
                        color="blue"
                        size="xs"
                        onClick={() => onSave(editedContent)}
                        disabled={!isContentChanged || isContentEmpty}
                        loading={isLoading}
                    >
                        Сохранить
                    </Button>

                    <ActionIcon
                        color="red"
                        variant="filled"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        <IconX size={16}/>
                    </ActionIcon>
                </Flex>
            </Flex>
        </Flex>
    );
};