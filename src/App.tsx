import {AppShell, Burger, Image} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import viteLogo from './assets/vite.svg'
import './App.css'
import {useEffect, useState} from "react";
import {notifications} from "@mantine/notifications";
import {Rooms} from "./modules/Rooms/Rooms.tsx";
import {Login} from "./modules/Login/Login.tsx";
import type {IMessage, IRoom} from "./modules/Room/types.ts";
import {Room} from "./modules/Room/Room.tsx";
import {emit} from "./api/socketEmit.ts";
import {useSocket} from "./hooks/useSocket.ts";

function App() {
    const socket = useSocket();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [opened, {toggle}] = useDisclosure();
    const [isErrorMessage, setIsErrorMessage] = useState<string>('');
    const [isUserId, setIsUserId] = useState<string>('');
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [activeRoom, setActiveRoom] = useState<IRoom | null>(null);

    const handleRequestRooms = async () => {
        const data = await emit<IRoom[]>(socket, 'room:list');

        if (data) {
            setRooms(data);
        }
    }

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
        } else if (isUserId)
            notifications.show({
                title: 'Login success',
                message: `Your id: '${isUserId}'`,
                color: 'green',
                onClose: () => {
                    setIsUserId('')
                    notifications.clean()
                }
            })
    }, [isErrorMessage, isUserId]);

    useEffect(() => {

        socket.on('connect', () => {
            console.log('Connected to server')

            socket.on('message:new', (message: IMessage) => {
                console.log('New message', message)
                setMessages((prevMessages) => [...prevMessages, message])
            })
        })
    }, [])

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
                <Rooms rooms={rooms}
                       handleRequestRooms={handleRequestRooms}
                       setActiveRoom={setActiveRoom}
                       setMessages={setMessages}
                />
            </AppShell.Navbar>}

            <AppShell.Main pl={isLoggedIn ? undefined : 'sm'}>
                {!isLoggedIn ? (
                    <Login setIsUserId={setIsUserId}
                           setIsLoggedIn={setIsLoggedIn}
                           handleRequestRooms={handleRequestRooms}
                           setIsErrorMessage={setIsErrorMessage}
                    />
                ) : (
                    <Room activeRoom={activeRoom}
                          messages={messages}
                    />
                )}
            </AppShell.Main>
        </AppShell>
    )
}

export default App
