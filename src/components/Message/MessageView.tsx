import {Badge, Flex, Paper} from "@mantine/core";
import type {MessageViewProps} from "./types.ts";

export const MessageView = ({message, amISender, onDoubleClick}: MessageViewProps) => {
    const {content, createdAt, updatedAt} = message;

    return (
        <Flex py='5px' gap='10px' justify={amISender ? 'flex-end' : 'flex-start'}>
            <Paper
                px='10px'
                py='6px'
                shadow="xs"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '5px',
                    backgroundColor: amISender ? '#3A66A2' : '#1E2B3B',
                    maxWidth: '400px',
                    cursor: amISender ? 'pointer' : 'default',
                    color: '#fff',
                    wordWrap: 'break-word',
                    textAlign: 'left'
                }}
                onDoubleClick={onDoubleClick}
            >
                {content}
                {createdAt !== updatedAt && <Badge size='sm'>исправлено</Badge>}
            </Paper>
        </Flex>
    );
};