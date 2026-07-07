import {AppShell, Burger, Image} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import viteLogo from './assets/vite.svg'
import {useEffect, useState} from "react";
import {notifications} from "@mantine/notifications";
import {Rooms} from "./modules/Rooms/Rooms.tsx";
import {Login} from "./modules/Login/Login.tsx";
import {Room} from "./modules/Room/Room.tsx";
import {useAppSelector} from "./store/store.ts";

function App() {
    const {currentUserId, isLoggedIn} = useAppSelector(state => state.user)

    const [opened, {toggle}] = useDisclosure();
    const [isErrorMessage, setIsErrorMessage] = useState<string>('');


    // показываю notification, если ошибка при логине. при закрытии notification зачищаю setIsLoginError
    useEffect(() => {
        if (isErrorMessage) {
            notifications.show({
                title: 'Login error',
                message: isErrorMessage,
                color: 'red',
                onClose: () => {
                    setIsErrorMessage('')
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
    }, [isErrorMessage, currentUserId]);

    return (
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
                    ? <Login setIsErrorMessage={setIsErrorMessage}/>
                    : <Room/>
                }
            </AppShell.Main>
        </AppShell>
    )
}

export default App
