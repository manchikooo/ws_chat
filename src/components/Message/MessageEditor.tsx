import {ActionIcon, Button, Flex, Textarea} from "@mantine/core";
import {IconX} from "@tabler/icons-react";
import {useState, type KeyboardEvent} from "react";
import type {MessageEditorProps} from "./types.ts";

export const MessageEditor = ({
                                  initialContent,
                                  amISender,
                                  onSave,
                                  onCancel
                              }: MessageEditorProps) => {
    const [editedContent, setEditedContent] = useState(initialContent);

    const isContentChanged = editedContent.trim() !== initialContent.trim();
    const isContentEmpty = editedContent.trim().length === 0;

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (isContentChanged && !isContentEmpty) {
                onSave(editedContent);
            }
        }
        if (e.key === 'Escape') onCancel();
    };

    return (
        <Flex py='5px' gap='10px' justify={amISender ? 'flex-end' : 'flex-start'}>
            <Flex gap='8px' direction='column' align='flex-end'>
                <Textarea
                    value={editedContent}
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
                        onClick={() => onSave(editedContent)}
                        disabled={!isContentChanged || isContentEmpty}
                    >
                        Сохранить
                    </Button>
                    <ActionIcon color="red" variant="filled" onClick={onCancel}>
                        <IconX size={16}/>
                    </ActionIcon>
                </Flex>
            </Flex>
        </Flex>
    );
};