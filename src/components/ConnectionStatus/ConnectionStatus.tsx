import {Affix, Badge} from '@mantine/core';
import {useSocket} from '../../hooks/useSocket';

export const ConnectionStatus = () => {
    const {isConnected, connectionStatus} = useSocket();

    const getColor = () => {
        if (isConnected) return 'green';
        if (connectionStatus === 'connecting') return 'yellow';
        return 'red';
    };

    const getText = () => {
        if (isConnected) return 'Online';
        if (connectionStatus === 'connecting') return 'Connecting...';
        return 'Offline';
    };

    return (
        <Affix position={{bottom: 20, left: 20}} zIndex={1000}>
            <Badge
                size="sm"
                color={getColor()}
                variant="filled"
                style={{
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                }}
            >
                {getText()}
            </Badge>
        </Affix>
    );
};