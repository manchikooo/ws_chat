import {
    AppShell,
    Burger,
    Button, CopyButton, Divider,
    Flex,
    Image,
    ScrollArea,
    Space,
    Stack,
    Text,
    TextInput,
    Title,
    UnstyledButton
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import viteLogo from './assets/vite.svg'
import './App.css'
import {useEffect, useState} from "react";
import {useForm} from '@mantine/form'
import {io, Socket} from "socket.io-client";
import {notifications} from "@mantine/notifications";
import {IconCheck, IconCopy, IconPlus, IconSend} from "@tabler/icons-react";

const backendUrl = 'https://ws-chat.dyuzhev.dev';

type RoomType = "DIRECT" | "GROUP"

interface Room {
    id: string    // UUID комнаты
    type: RoomType
    name: string | null // Название
    inviteCode: string    // 10-символьный nanoid
    createdAt: string    // ISO 8601
    memberCount: number    // Число участников
}

type MessageStatus = "SENT" | "DELIVERED" | "READ"

interface Message {
    id: string    // UUID сообщения
    content: string    // Текст (пусто если удалено)
    roomId: string    // Комната
    senderId: string    // UUID отправителя
    senderName: string    // Имя отправителя
    status: MessageStatus
    isDeleted: boolean   // true если мягко удалено
    createdAt: string    // ISO 8601
    updatedAt: string    // ISO 8601 (отличается если редактировано)
}

function App() {
    const [socket, setSocket] = useState<Socket>();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [opened, {toggle}] = useDisclosure();
    const [isErrorMessage, setIsErrorMessage] = useState<string>('');
    const [isUserId, setIsUserId] = useState<string>('');
    const [rooms, setRooms] = useState<Room[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [activeRoom, setActiveRoom] = useState<Room | null>(null);

    const form = useForm({
        initialValues: {
            name: '',
        },
        validate: {
            name: (value: string) => (value.trim().length > 0) ? null : 'Name is requiered',
        },
    });

    const createRoomForm = useForm({
        initialValues: {
            name: '',
            type: 'GROUP' as RoomType
        },
        validate: {
            name: (value: string) =>
                value.trim().length > 0 ? null : 'Name is required'
        }
    })

    const sendMessageForm = useForm({
        initialValues: {
            content: '',
        }
    })

    const joinRoomForm = useForm({
        initialValues: {
            inviteCode: '',
        },
        validate: {
            inviteCode: (value: string) =>
                value.trim().length > 0 ? null : 'Invite code is required',
        }
    })

    const handleSubmitMessage = async (values: { content: string }) => {
        if (!activeRoom) return
        const response: { message: Message } | { error: string } =
            await socket?.emitWithAck("message:send", {content: values.content, roomId: activeRoom.id})
        if ('error' in response) {
            console.warn(response.error)
            return
        }
        sendMessageForm.reset()
    }

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

    const handleRequestRooms = async () => {
        const response = await socket?.emitWithAck('room:list')
        if ('error' in response) {
            console.warn(response.error);
            return
        }
        setRooms(response);
    }

    const handleCreateRoom = async (values: { name: string, type: RoomType }) => {
        const response: Room = await socket?.emitWithAck('room:create', values)
        if ('error' in response) {
            console.warn(response.error);
            return
        }
        handleRequestRooms()
    }

    const handleJoinRoom = async (inviteCode: string) => {
        setActiveRoom(null)
        setMessages([])
        const response: { room: Room } | { error: string } = await socket?.emitWithAck('room:join', {inviteCode})
        if ('error' in response) {
            console.warn(response.error);
            return
        }
        setActiveRoom(response.room)
        // load room history
        const messagesHistory: { messages: Message[] } | {
            error: string
        } = await socket?.emitWithAck('room:history', {roomId: response.room.id})
        if ('error' in messagesHistory) {
            console.warn(messagesHistory.error);
            return
        }
        setMessages(messagesHistory.messages);
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
        if (socket) return;
        const sock = io(backendUrl)

        sock.on('connect', () => {
            console.log('Connected to server')
            setSocket(sock)

            sock.on('message:new', (message: Message) => {
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
                <Title>Rooms</Title>
                <ScrollArea h='calc(100dvh - 100px'>
                    <form onSubmit={createRoomForm.onSubmit(handleCreateRoom)}>
                        <Flex align='flex-end' gap='10px' justify='center' px='10px'>
                            <TextInput
                                withAsterisk
                                label='Create room'
                                labelProps={{
                                    style: {textAlign: 'left', width: '100%'}
                                }}
                                w='100%'
                                placeholder='Room name'
                                {...createRoomForm.getInputProps('name')}/>
                            <Button type='submit'>+</Button>
                        </Flex>
                    </form>
                    <Space h='md'/>
                    <Divider/>
                    <Space h='md'/>
                    <form onSubmit={joinRoomForm.onSubmit((values) => handleJoinRoom(values.inviteCode))}>
                        <Flex align='flex-end' gap='10px' justify='center' px='10px'>
                            <TextInput
                                withAsterisk
                                label="Join room"
                                labelProps={{
                                    style: {textAlign: 'left', width: '100%'}
                                }}
                                placeholder='Invite code'
                                w='100%'
                                {...joinRoomForm.getInputProps('inviteCode')}
                            />
                            <UnstyledButton type='submit'>
                                <IconPlus/>
                            </UnstyledButton>
                        </Flex>
                    </form>
                    <Stack>
                        {rooms.map((room) => (
                            <Button key={room.id} onClick={() => handleJoinRoom(room.inviteCode)}>
                                {room.name}
                            </Button>
                        ))}
                    </Stack>
                </ScrollArea>
            </AppShell.Navbar>}

            <AppShell.Main pl={isLoggedIn ? undefined : 'sm'}>
                {!isLoggedIn ? (
                    <Stack mt={80} align='center' justify='center'>
                        <form onSubmit={form.onSubmit(handleLogin)}>
                            <TextInput
                                withAsterisk
                                label="Name"
                                placeholder="Your name"
                                {...form.getInputProps('name')}
                            />
                            <Space h='md'/>
                            <Button fullWidth type='submit'>Login</Button>
                        </form>
                    </Stack>
                ) : (
                    <Stack>
                        {activeRoom && (
                            <>
                                <Title>
                                    {activeRoom.name || activeRoom.id} - {activeRoom.memberCount}
                                </Title>
                                <Flex>
                                    <Text>Invite code: {activeRoom.inviteCode}</Text>
                                    <CopyButton value={activeRoom.inviteCode}>
                                        {({copied, copy}) => (
                                            <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                                                {copied ? <IconCheck size={16}/> : <IconCopy size={16}/>}
                                            </Button>
                                        )}
                                    </CopyButton>
                                </Flex>
                                <ScrollArea h='70dvh'>
                                    {messages.map((message) => (
                                        <Text key={message.id}>
                                            {message.senderName}:{message.content}
                                        </Text>
                                    ))}
                                </ScrollArea>
                                <form onSubmit={sendMessageForm.onSubmit(handleSubmitMessage)}>
                                    <Flex align='flex-end' gap='10px'>
                                        <TextInput
                                            withAsterisk
                                            label='Message'
                                            placeholder='Your message'
                                            {...sendMessageForm.getInputProps('content')} />
                                        <UnstyledButton type='submit'>
                                            <IconSend/>
                                        </UnstyledButton>
                                    </Flex>
                                </form>
                            </>)}
                    </Stack>
                )}
            </AppShell.Main>
        </AppShell>
    )
}

export default App
