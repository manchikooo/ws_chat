import {useCallback} from "react";
import {userApi} from "../../api/user.api.ts";
import {useActions} from "../useActions.ts";
import {useSocket} from "../useSocket.ts";
import type {UserJoinDto} from "../../api/types.ts";
import {useRoomApi} from "./useRoomApi.ts";

export const useUserApi = () => {
    const {socket} = useSocket();
    const {list} = useRoomApi()

    const {
        setCurrentUserId,
        setIsLoggedIn,
        setUserLoading,
        setUserError,
        clearUserError
    } = useActions();

    const join = useCallback(async (payload: UserJoinDto) => {
        clearUserError();

        setUserLoading(true);

        const result = await userApi.join(socket, payload);

        setUserLoading(false);

        if (!result.ok) {
            setUserError(result.error);
            return null;
        }
        
        setCurrentUserId(result.data.userId);
        setIsLoggedIn(true);

        await list();

        return result.data;
    }, [clearUserError, setUserLoading, socket, setCurrentUserId, setIsLoggedIn, list, setUserError]);

    return {
        join
    };
};