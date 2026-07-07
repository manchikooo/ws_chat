import {createRoot} from 'react-dom/client'
import './index.css'
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import App from './App.tsx'
import {MantineProvider} from '@mantine/core';
import {Notifications} from "@mantine/notifications";
import {SocketProvider} from "./providers/SocketProvider.tsx";

createRoot(document.getElementById('root')!).render(
    <MantineProvider>
        <Notifications/>
        <SocketProvider>
            <App/>
        </SocketProvider>
    </MantineProvider>,
)
