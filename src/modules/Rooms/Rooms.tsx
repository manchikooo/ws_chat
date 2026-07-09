import {Button, Divider, Flex, ScrollArea, Space, Stack, TextInput, Title} from "@mantine/core";
import {IconPlus} from "@tabler/icons-react";
import {roomApi} from "../../api/room.api.ts";
import type {RoomCreateDto} from "../../api/types.ts";
import {useCreateRoomForm, useJoinRoomForm} from "../../forms/room.form.ts";
import {useSocket} from "../../hooks/useSocket.ts";
import {useAppSelector} from "../../store/store.ts";
import {useActions} from "../../hooks/useActions.ts";

export const Rooms = () => {
    const {socket} = useSocket();

    const {setMessages, setCurrentRoom, setRooms, setRoomRequestState} = useActions();

    const {rooms, loadingByKey} = useAppSelector(state => state.room);

    const isRoomsLoading = loadingByKey.list ?? false;
    const isCreateRoomLoading = loadingByKey.create ?? false;
    const isJoinByInviteCodeLoading = loadingByKey.joinByInviteCode ?? false;

    const createRoomForm = useCreateRoomForm();
    const joinRoomForm = useJoinRoomForm();

    const handleRequestRooms = async () => {
        setRoomRequestState({key: "list", isLoading: true});

        try {
            const data = await roomApi.list(socket);

            if (!data) {
                setRoomRequestState({
                    key: "list",
                    isLoading: false,
                    error: "Не удалось загрузить список комнат"
                });
                return;
            }

            setRooms(data);
        } catch {
            setRoomRequestState({
                key: "list",
                isLoading: false,
                error: "Произошла ошибка при загрузке списка комнат"
            });
        } finally {
            setRoomRequestState({key: "list", isLoading: false});
        }
    };

    const handleCreateRoom = async (values: RoomCreateDto) => {
        setRoomRequestState({key: "create", isLoading: true});

        try {
            const data = await roomApi.create(socket, values);

            if (!data) {
                setRoomRequestState({
                    key: "create",
                    isLoading: false,
                    error: "Не удалось создать комнату"
                });
                return;
            }

            createRoomForm.reset();
            await handleRequestRooms();
        } catch {
            setRoomRequestState({
                key: "create",
                isLoading: false,
                error: "Произошла ошибка при создании комнаты"
            });
        } finally {
            setRoomRequestState({key: "create", isLoading: false});
        }
    };

    const handleJoinRoom = async (
        inviteCode: string,
        requestKey: "joinByInviteCode" | `joinByRoomButton-${string}`
    ) => {
        setCurrentRoom(null);
        setMessages([]);
        setRoomRequestState({key: requestKey, isLoading: true});

        try {
            const data = await roomApi.join(socket, {inviteCode});

            if (!data) {
                setRoomRequestState({
                    key: requestKey,
                    isLoading: false,
                    error: "Не удалось подключиться к чату"
                });
                return;
            }

            setCurrentRoom(data.room);

            const messagesHistory = await roomApi.history(socket, {roomId: data.room.id});

            if (!messagesHistory) {
                setRoomRequestState({
                    key: requestKey,
                    isLoading: false,
                    error: "Не удалось загрузить историю сообщений"
                });
                return;
            }

            setMessages(messagesHistory.messages);
        } catch {
            setRoomRequestState({
                key: requestKey,
                isLoading: false,
                error: "Произошла ошибка при подключении к чату"
            });
        } finally {
            setRoomRequestState({key: requestKey, isLoading: false});
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
                    <Flex align="flex-end" gap="10px" justify="center" px="10px">
                        <TextInput
                            withAsterisk
                            label="Join room"
                            labelProps={{
                                style: {textAlign: "left", width: "100%"}
                            }}
                            placeholder="Invite code"
                            w="100%"
                            {...joinRoomForm.getInputProps("inviteCode")}
                        />
                        <Button type="submit" mt="25px" loading={isJoinByInviteCodeLoading}>
                            <IconPlus/>
                        </Button>
                    </Flex>
                </form>

                <Stack px="10px" pt="10px">
                    {rooms.map((room) => (
                        <Button
                            key={room.id}
                            onClick={() => handleJoinRoom(room.inviteCode, `joinByRoomButton-${room.id}`)}
                            loading={loadingByKey[`joinByRoomButton-${room.id}`] ?? false}
                            disabled={isRoomsLoading || isJoinByInviteCodeLoading}
                        >
                            {room.name}
                        </Button>
                    ))}
                </Stack>
            </ScrollArea>
        </>
    );
};