import {Button, Divider, Flex, ScrollArea, Space, Stack, TextInput, Title, UnstyledButton} from "@mantine/core";
import {IconPlus} from "@tabler/icons-react";
import type {RoomsProps} from "./types.ts";
import {useForm} from "@mantine/form";
import type {IMessage, IRoom, RoomType} from "../Room/types.ts";

export const Rooms = ({socket, rooms, handleRequestRooms, setActiveRoom, setMessages}: RoomsProps) => {
    const createRoomForm = useForm({
        initialValues: {
            name: '',
            type: 'GROUP' as RoomType
        },
        validate: {
            name: (value: string) =>
                value.trim().length > 0 ? null : 'Name is required'
        }
    })

    const joinRoomForm = useForm({
        initialValues: {
            inviteCode: '',
        },
        validate: {
            inviteCode: (value: string) =>
                value.trim().length > 0 ? null : 'Invite code is required',
        }
    })

    const handleCreateRoom = async (values: { name: string, type: RoomType }) => {
        const response: IRoom = await socket?.emitWithAck('room:create', values)
        if ('error' in response) {
            console.warn(response.error);
            return
        }
        handleRequestRooms()
    }

    const handleJoinRoom = async (inviteCode: string) => {
        setActiveRoom(null)
        setMessages([])
        const response: { room: IRoom } | { error: string } = await socket?.emitWithAck('room:join', {inviteCode})
        if ('error' in response) {
            console.warn(response.error);
            return
        }
        setActiveRoom(response.room)
        // load room history
        const messagesHistory: { messages: IMessage[] } | {
            error: string
        } = await socket?.emitWithAck('room:history', {roomId: response.room.id})
        if ('error' in messagesHistory) {
            console.warn(messagesHistory.error);
            return
        }
        setMessages(messagesHistory.messages);
    }

    return (
        <><Title>Rooms</Title>
            <ScrollArea h='calc(100dvh - 100px'>
                <form onSubmit={createRoomForm.onSubmit(handleCreateRoom)}>
                    <Flex align='flex-end' gap='10px' justify='center' px='10px'>
                        <TextInput
                            withAsterisk
                            label='Create room'
                            labelProps={{
                                style: {textAlign: 'left', width: '100%'}
                            }}
                            w='100%'
                            placeholder='Room name'
                            {...createRoomForm.getInputProps('name')}/>
                        <Button type='submit'>+</Button>
                    </Flex>
                </form>
                <Space h='md'/>
                <Divider/>
                <Space h='md'/>
                <form onSubmit={joinRoomForm.onSubmit((values) => handleJoinRoom(values.inviteCode))}>
                    <Flex align='flex-end' gap='10px' justify='center' px='10px'>
                        <TextInput
                            withAsterisk
                            label="Join room"
                            labelProps={{
                                style: {textAlign: 'left', width: '100%'}
                            }}
                            placeholder='Invite code'
                            w='100%'
                            {...joinRoomForm.getInputProps('inviteCode')}
                        />
                        <UnstyledButton type='submit'>
                            <IconPlus/>
                        </UnstyledButton>
                    </Flex>
                </form>
                <Stack>
                    {rooms.map((room) => (
                        <Button key={room.id} onClick={() => handleJoinRoom(room.inviteCode)}>
                            {room.name}
                        </Button>
                    ))}
                </Stack>
            </ScrollArea>
        </>)
}