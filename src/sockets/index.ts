import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { baseSockets } from './baseSockets';

export const setSocketListeners = (io: Server): void => {
    io.on(SOCKET_EVENTS.NATIVE.CONNECTION, (socket: Socket) => {
        // base sockets
        baseSockets(io, socket);
    });
};
