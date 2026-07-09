import {useActions} from "../useActions.ts";
import {useSocket} from "../useSocket.ts";
import {useCallback} from "react";
import type {RoomCreateDto, RoomJoinDto} from "../../api/types.ts";
import {roomApi} from "../../api/room.api.ts";

export const useRoomApi = () => {
    const {socket} = useSocket();

    const {
        setRoomLoading,
        setRoomError,
        clearRoomError,
        setRooms,
        setCurrentRoom,
        setMessages
    } = useActions();

    const list = useCallback(async () => {
        clearRoomError("list");

        setRoomLoading({
            key: "list",
            isLoading: true
        });

        const result = await roomApi.list(socket);

        setRoomLoading({
            key: "list",
            isLoading: false
        });

        if (!result.ok) {
            setRoomError({
                key: "list",
                error: result.error
            });
            return null;
        }

        setRooms(result.data);

        return result.data;
    }, [socket, clearRoomError, setRoomLoading, setRoomError, setRooms]);

    const create = useCallback(async (payload: RoomCreateDto) => {
        clearRoomError("create");

        setRoomLoading({
            key: "create",
            isLoading: true
        });

        const result = await roomApi.create(socket, payload);

        setRoomLoading({
            key: "create",
            isLoading: false
        });

        if (!result.ok) {
            setRoomError({
                key: "create",
                error: result.error
            });
            return null;
        }

        await list();

        return result.data;
    }, [socket, clearRoomError, setRoomLoading, setRoomError, list]);

    const join = useCallback(async (
        payload: RoomJoinDto,
        requestKey: "joinByInviteCode" | `joinByRoomButton-${string}`
    ) => {
        clearRoomError(requestKey);

        setCurrentRoom(null);
        setMessages([]);

        setRoomLoading({
            key: requestKey,
            isLoading: true
        });

        const joinResult = await roomApi.join(socket, payload);

        if (!joinResult.ok) {
            setRoomLoading({
                key: requestKey,
                isLoading: false
            });

            setRoomError({
                key: requestKey,
                error: joinResult.error
            });
            return null;
        }

        setCurrentRoom(joinResult.data.room);

        const historyResult = await roomApi.history(socket, {roomId: joinResult.data.room.id});

        setRoomLoading({
            key: requestKey,
            isLoading: false
        });

        if (!historyResult.ok) {
            setRoomError({
                key: requestKey,
                error: historyResult.error
            });
            return null;
        }

        setMessages(historyResult.data.messages);

        return joinResult.data;
    }, [socket, clearRoomError, setRoomLoading, setRoomError, setCurrentRoom, setMessages]);

    return {
        list,
        create,
        join
    };
};