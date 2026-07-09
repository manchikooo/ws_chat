import {Button, Divider, Flex, ScrollArea, Space, Stack, TextInput, Title} from "@mantine/core";
import {IconPlus} from "@tabler/icons-react";
import type {RoomCreateDto} from "../../api/types.ts";
import {useCreateRoomForm, useJoinRoomForm} from "../../forms/room.form.ts";
import {useAppSelector} from "../../store/store.ts";
import {useRoomApi} from "../../hooks/api/useRoomApi.ts";
import {
    selectCreateRoomError,
    selectIsCreateRoomLoading,
    selectIsJoinByInviteCodeLoading,
    selectIsRoomsLoading, selectJoinByInviteCodeError,
    selectRooms
} from "../../store/slice/room/room.selectors.ts";
import {RoomButton} from "./components/RoomButton/RoomButton.tsx";


export const Rooms = () => {
    const {create, join} = useRoomApi();

    const rooms = useAppSelector(selectRooms);
    const isRoomsLoading = useAppSelector(selectIsRoomsLoading);
    const isCreateRoomLoading = useAppSelector(selectIsCreateRoomLoading);
    const isJoinByInviteCodeLoading = useAppSelector(selectIsJoinByInviteCodeLoading);
    const joinByInviteCodeError = useAppSelector(selectJoinByInviteCodeError)
    const createRoomError = useAppSelector(selectCreateRoomError)
    const createRoomForm = useCreateRoomForm();
    const joinRoomForm = useJoinRoomForm();

    const handleCreateRoom = async (values: RoomCreateDto) => {
        const room = await create(values);

        if (!room) return;

        createRoomForm.reset();
    };

    const handleJoinRoom = async (
        inviteCode: string,
        requestKey: "joinByInviteCode" | `joinByRoomButton-${string}`
    ) => {
        const response = await join({inviteCode}, requestKey);

        if (!response) return;

        if (requestKey === "joinByInviteCode") {
            joinRoomForm.reset();
        }
    };

    return (
        <>
            <Title style={{color: "var(--mantine-color-blue-filled)"}}>
                Rooms
            </Title>

            <ScrollArea h="calc(100dvh - 100px)">
                <form onSubmit={createRoomForm.onSubmit(handleCreateRoom)}>
                    <Flex align="flex-start" gap="10px" justify="center" px="10px">
                        <TextInput
                            withAsterisk
                            label="Create room"
                            labelProps={{
                                style: {textAlign: "left", width: "100%"}
                            }}
                            w="100%"
                            placeholder="Room name"
                            {...createRoomForm.getInputProps("name")}
                            error={createRoomForm.errors.name || createRoomError}
                        />
                        <Button type="submit" mt="25px" loading={isCreateRoomLoading}>
                            <IconPlus/>
                        </Button>
                    </Flex>
                </form>

                <Space h="md"/>
                <Divider/>
                <Space h="md"/>

                <form
                    onSubmit={joinRoomForm.onSubmit((values) =>
                        handleJoinRoom(values.inviteCode, "joinByInviteCode")
                    )}
                >
                    <Flex align="flex-start" gap="10px" justify="center" px="10px">
                        <TextInput
                            withAsterisk
                            label="Join room"
                            labelProps={{
                                style: {textAlign: "left", width: "100%"}
                            }}
                            placeholder="Invite code"
                            w="100%"
                            {...joinRoomForm.getInputProps("inviteCode")}
                            error={joinRoomForm.errors.inviteCode || joinByInviteCodeError}
                        />
                        <Button type="submit" mt="25px" loading={isJoinByInviteCodeLoading}>
                            <IconPlus/>
                        </Button>
                    </Flex>
                </form>

                <Stack px="10px" pt="10px">
                    {rooms.map((room) => (
                        <RoomButton
                            key={room.id}
                            room={room}
                            isRoomsLoading={isRoomsLoading}
                            onJoinRoom={handleJoinRoom}
                        />
                    ))}
                </Stack>
            </ScrollArea>
        </>
    );
};