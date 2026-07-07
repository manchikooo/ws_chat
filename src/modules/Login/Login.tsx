import {Button, Space, Stack, TextInput} from "@mantine/core";
import type {LoginProps} from "./types.ts";
import {userApi} from "../../api/user.api.ts";
import type {UserJoinDto} from "../../api/types.ts";
import {useUserJoinForm} from "../../forms/login.form.ts";
import {useSocket} from "../../hooks/useSocket.ts";
import {useActions} from "../../hooks/useActions.ts";

export const Login = ({setIsErrorMessage, setIsLoggedIn, handleRequestRooms}: LoginProps) => {
    const socket = useSocket();
    const loginForm = useUserJoinForm()

    const {setCurrentUserId} = useActions()

    const handleLogin = async (values: UserJoinDto) => {
        if (!socket) return

        const data = await userApi.join(socket, values)
        if (!data) {
            setIsErrorMessage('Login failed')
            return
        }
        setCurrentUserId(data.userId)
        setIsLoggedIn(true)

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
                <Button fullWidth type='submit'>Login</Button>
            </form>
        </Stack>
    );
};
