import { io, Socket } from 'socket.io-client';

let socket: Socket;

export function initialize({ token }: { token: string }, setData: (data: string) => void): Promise<Boolean> {
    return new Promise(resolve => {
        socket = io('https://realtime.streamelements.com', {
        transports: ['websocket'],
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
            reconnection: true,
        });
    
        socket.on('connect', () => {
            console.log('Connected to streamelements websocket'); 
            socket.emit('authenticate', { method: 'jwt', token: token });
        });
        socket.on('disconnect', () => {
            console.log('Disconnected from streamelements websocket');
        });
        socket.on('authenticated', (data) => {
            const {
              channelId
            } = data;
            console.log('Connected with streamelements account ' + channelId);
            setData(channelId);

            resolve(true);
        });
        socket.on('unauthorized', () => {
            console.log('Given token was is not valid or correct');

            resolve(false);
        })
    })
}

export function getSocket() {
    if (!socket) throw new Error('Socket has not been initialized yet');
    return socket;
}