import {Button, Divider, Flex, ScrollArea, Space, Stack, TextInput, Title, UnstyledButton} from "@mantine/core";
import {IconPlus} from "@tabler/icons-react";
import type {RoomsProps} from "./types.ts";
import {roomApi} from "../../api/room.api.ts";
import type {RoomCreateDto} from "../../api/types.ts";
import {useCreateRoomForm, useJoinRoomForm} from "../../forms/room.form.ts";
import {useSocket} from "../../hooks/useSocket.ts";

export const Rooms = ({rooms, handleRequestRooms, setActiveRoom, setMessages}: RoomsProps) => {
    const socket = useSocket()
    const createRoomForm = useCreateRoomForm()
    const joinRoomForm = useJoinRoomForm()

    const handleCreateRoom = async (values: RoomCreateDto) => {
        if (!socket) return

        const data = await roomApi.create(socket, values)

        if (!data) return

        createRoomForm.reset()
        handleRequestRooms()
    }

    const handleJoinRoom = async (inviteCode: string) => {
        setActiveRoom(null)
        setMessages([])

        if (!socket) return

        const data = await roomApi.join(socket, {inviteCode})

        if (!data) return

        setActiveRoom(data.room)

        const messagesHistory = await roomApi.history(socket, {roomId: data.room.id})
        if (!messagesHistory) return

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