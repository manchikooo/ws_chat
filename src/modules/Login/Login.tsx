import {Button, Space, Stack, TextInput} from "@mantine/core";
import type {LoginProps} from "./types.ts";
import {useForm} from "@mantine/form";

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
        const response = await socket?.emitWithAck('user:join', values)
        if ('error' in response) {
            console.warn(response.error);
            setIsErrorMessage(response.error);
        }
        setIsUserId(response.userId);
        setIsLoggedIn(true);
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
