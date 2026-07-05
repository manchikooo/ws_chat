import {Button, Space, Stack, TextInput} from "@mantine/core";
import type {LoginProps} from "./types.ts";
import {useForm} from "@mantine/form";
import {emit} from "../../api/socketEmit.ts";

export const Login = ({socket, setIsErrorMessage, setIsUserId, setIsLoggedIn, handleRequestRooms}: LoginProps) => {
    const loginForm = useForm({
        initialValues: {
            name: '',
        },
        validate: {
            name: (value: string) => (value.trim().length > 0) ? null : 'Name is required',
        },
    });


    const handleLogin = async (values: { name: string }) => {
        const data = await emit<{ userId: string }>(socket, 'user:join', values)
        if (data) {
            setIsUserId(data.userId)
            setIsLoggedIn(true)
            await handleRequestRooms()
        } else {
            setIsErrorMessage('Login failed')
        }
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
