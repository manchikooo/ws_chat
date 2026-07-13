import {AppShell, Burger, Image} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import viteLogo from './assets/vite.svg'
import {useEffect} from "react";
import {notifications} from "@mantine/notifications";
import {Rooms} from "./modules/Rooms/Rooms.tsx";
import {Login} from "./modules/Login/Login.tsx";
import {Room} from "./modules/Room/Room.tsx";
import {useAppSelector} from "./store/store.ts";
import {ConnectionStatus} from "./components/ConnectionStatus/ConnectionStatus.tsx";
import {selectCurrentUserId, selectIsLoggedIn, selectUserError} from "./store/slice/user/user.selectors.ts";
import {useActions} from "./hooks/useActions.ts";

function App() {
    const {setUserError} = useActions()
    const currentUserId = useAppSelector(selectCurrentUserId)
    const isLoggedIn = useAppSelector(selectIsLoggedIn)
    const userError = useAppSelector(selectUserError);

    const [opened, {toggle}] = useDisclosure();

    // показываю notification, если ошибка при логине. при закрытии notification зачищаю setUserError
    useEffect(() => {
        if (userError) {
            notifications.show({
                title: 'Login error',
                message: userError,
                color: 'red',
                onClose: () => {
                    setUserError('')
                    notifications.clean()
                }
            })
        } else if (currentUserId)
            notifications.show({
                title: 'Login success',
                message: `Your id: '${currentUserId}'`,
                color: 'green',
                onClose: () => {
                    notifications.clean()
                }
            })
    }, [userError, currentUserId, setUserError]);

    return (
        <>
            <AppShell
                padding="md"
                header={{height: 60}}
                navbar={{
                    width: 300,
                    breakpoint: 'sm',
                    collapsed: {mobile: !opened},
                }}
            >

                <AppShell.Header>
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="sm"
                    />
                    <Image src={viteLogo} fit='contain' w={60} h={60} mr='auto'/>
                </AppShell.Header>

                {isLoggedIn && <AppShell.Navbar>
                    <Rooms/>
                </AppShell.Navbar>}

                <AppShell.Main pl={isLoggedIn ? undefined : 'sm'}>
                    {!isLoggedIn
                        ? <Login/>
                        : <Room/>
                    }
                </AppShell.Main>
            </AppShell>
            <ConnectionStatus/>
        </>
    )
}

export default App

