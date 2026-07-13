import {Button, Space, Stack, TextInput} from "@mantine/core";
import type {UserJoinDto} from "../../api/types.ts";
import {useUserJoinForm} from "../../forms/login.form.ts";
import {useAppSelector} from "../../store/store.ts";
import {useUserApi} from "../../hooks/api/useUserApi.ts";
import {selectIsUserLoading, selectUserError} from "../../store/slice/user/user.selectors.ts";

export const Login = () => {
    const {join} = useUserApi();
    const loginForm = useUserJoinForm()

    const isLoading = useAppSelector(selectIsUserLoading);
    const userError = useAppSelector(selectUserError);

    const handleLogin = async (values: UserJoinDto) => {
        await join(values);
    };

    return (
        <Stack mt={80} align='center' justify='center'>
            <form onSubmit={loginForm.onSubmit(handleLogin)}>
                <TextInput
                    withAsterisk
                    label="Name"
                    placeholder="Your name"
                    error={userError}
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
