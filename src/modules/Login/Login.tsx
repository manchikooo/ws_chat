import {Button, Space, Stack, TextInput} from "@mantine/core";
import type {LoginProps} from "./types.ts";
import {userApi} from "../../api/user.api.ts";
import type {UserJoinDto} from "../../api/types.ts";
import {useUserJoinForm} from "../../forms/login.form.ts";
import {useSocket} from "../../hooks/useSocket.ts";
import {useActions} from "../../hooks/useActions.ts";
import {roomApi} from "../../api/room.api.ts";
import {useAppSelector} from "../../store/store.ts";

export const Login = ({setIsErrorMessage}: LoginProps) => {
    const {socket} = useSocket();
    const loginForm = useUserJoinForm()

    const {isLoading} = useAppSelector(state => state.user)

    const {setCurrentUserId, setIsLoggedIn, setRooms, setUserLoading, setUserError, clearUserError} = useActions()

    const handleRequestRooms = async () => {
        const data = await roomApi.list(socket)
        if (!data) return

        setRooms(data);
    }

    const handleLogin = async (values: UserJoinDto) => {
        setUserLoading(true);
        clearUserError();

        try {
            const data = await userApi.join(socket, values)
            if (!data) {
                setUserError("Не удалось авторизоваться");
                setIsErrorMessage('Login failed')
                return;
            }
            setCurrentUserId(data.userId)
            setIsLoggedIn(true)
        } catch {
            setUserError("Произошла ошибка при авторизации");
        } finally {
            setUserLoading(false);
        }
        await handleRequestRooms()
    }

    return (
        <Stack mt={80} align='center' justify='center'>
            <form onSubmit={loginForm.onSubmit(handleLogin)}>
                <TextInput
                    withAsterisk
                    label="Name"
                    placeholder="Your name"
                    {...loginForm.getInputProps('name')}
                />
                <Space h='md'/>
                <Button fullWidth type='submit' loading={isLoading}>
                    Login
                </Button>
            </form>
        </Stack>
    );
};
