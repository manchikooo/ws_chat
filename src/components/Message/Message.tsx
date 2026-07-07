import {Avatar, Flex, Indicator} from "@mantine/core";
import type {MessageProps} from "./types.ts";

export const Message = ({message}: MessageProps) => {
    return (
        <Flex py='5px'
              gap='10px'
        >
            <Indicator size={11} withBorder processing>
                <Avatar size='sm'>{message.senderName[0]}</Avatar>
            </Indicator>
            <Flex px='5px'
                  style={{
                      backgroundColor: '#4D9BDF',
                      borderRadius: '5px',
                      maxWidth: '400px'
                  }}>{message.content}</Flex>
        </Flex>
    );
};
