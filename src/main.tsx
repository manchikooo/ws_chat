import {createRoot} from 'react-dom/client'
import './index.css'
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import App from './App.tsx'
import {MantineProvider} from '@mantine/core';
import {Notifications} from "@mantine/notifications";
import {SocketProvider} from "./providers/SocketProvider.tsx";
import {store} from './store/store.ts'
import {Provider} from "react-redux";

createRoot(document.getElementById('root')!).render(
    <MantineProvider>
        <Provider store={store}>
            <Notifications/>
            <SocketProvider>
                <App/>
            </SocketProvider>
        </Provider>
    </MantineProvider>,
)
